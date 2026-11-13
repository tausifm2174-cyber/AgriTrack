package com.agritrack.service.weather;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.*;

/**
 * OpenWeatherMap 2.5 API integration client.
 */
@Component("openWeatherMapClient")
public class OpenWeatherMapClient implements WeatherProviderClient {

    private static final Logger log = LoggerFactory.getLogger(OpenWeatherMapClient.class);
    public static final String PROVIDER_NAME = "OPEN_WEATHER";

    private final String apiKey;
    private final String baseUrl;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @org.springframework.beans.factory.annotation.Autowired
    public OpenWeatherMapClient(
            @Value("${app.weather.openweather.api-key:}") String apiKey,
            @Value("${app.weather.openweather.base-url:https://api.openweathermap.org/data/2.5}") String baseUrl,
            @Value("${app.weather.openweather.timeout-ms:5000}") int timeoutMs,
            @org.springframework.beans.factory.annotation.Autowired(required = false) ObjectMapper objectMapper) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = baseUrl != null ? baseUrl.trim() : "https://api.openweathermap.org/data/2.5";
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(timeoutMs));
        factory.setReadTimeout(Duration.ofMillis(timeoutMs));
        this.restTemplate = new RestTemplate(factory);
    }

    public OpenWeatherMapClient(String apiKey, String baseUrl, int timeoutMs) {
        this(apiKey, baseUrl, timeoutMs, new ObjectMapper());
    }

    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    @Override
    public String getProviderName() {
        return PROVIDER_NAME;
    }

    @Override
    public WeatherPayload fetchWeatherData(String location) {
        if (!isConfigured()) {
            throw new IllegalStateException("OpenWeatherMap API key is not configured");
        }
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location cannot be empty");
        }

        try {
            CurrentWeatherData current = fetchCurrentWeather(location.trim());
            List<ForecastDayData> forecast = fetchForecastWeather(location.trim());
            return new WeatherPayload(current, forecast, PROVIDER_NAME);
        } catch (Exception e) {
            log.warn("Failed to fetch weather from OpenWeatherMap for location '{}': {}", location, e.getMessage());
            throw new RuntimeException("OpenWeatherMap fetch failed: " + e.getMessage(), e);
        }
    }

    private CurrentWeatherData fetchCurrentWeather(String location) throws Exception {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "/weather")
                .queryParam("q", location)
                .queryParam("units", "metric")
                .queryParam("appid", apiKey)
                .toUriString();

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        JsonNode main = root.path("main");
        JsonNode wind = root.path("wind");
        JsonNode weatherArr = root.path("weather");
        JsonNode rain = root.path("rain");

        BigDecimal temp = BigDecimal.valueOf(main.path("temp").asDouble()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal feelsLike = BigDecimal.valueOf(main.path("feels_like").asDouble()).setScale(2, RoundingMode.HALF_UP);
        int humidity = main.path("humidity").asInt(50);
        BigDecimal pressure = main.has("pressure") ?
                BigDecimal.valueOf(main.path("pressure").asDouble()).setScale(2, RoundingMode.HALF_UP) : null;

        // OpenWeather metric wind speed is in m/s; convert to km/h (m/s * 3.6)
        double windMps = wind.path("speed").asDouble(0.0);
        BigDecimal windSpeedKmh = BigDecimal.valueOf(windMps * 3.6).setScale(2, RoundingMode.HALF_UP);
        int deg = wind.path("deg").asInt(0);
        String windDir = degreesToDirection(deg);

        double rain1h = rain.has("1h") ? rain.path("1h").asDouble(0.0) : 0.0;
        BigDecimal rainfallMm = BigDecimal.valueOf(rain1h).setScale(2, RoundingMode.HALF_UP);

        String condText = "Clear";
        String condCode = "CLEAR";
        if (weatherArr.isArray() && weatherArr.size() > 0) {
            JsonNode w0 = weatherArr.get(0);
            condText = w0.path("description").asText("Clear");
            condCode = w0.path("main").asText("CLEAR").toUpperCase();
        }

        LocalDateTime observedAt = LocalDateTime.now();
        if (root.has("dt")) {
            long epochSec = root.path("dt").asLong();
            observedAt = LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSec), ZoneId.systemDefault());
        }

        return new CurrentWeatherData(
                temp, feelsLike, humidity, windSpeedKmh, windDir, rainfallMm, pressure,
                condText, condCode, null, null, observedAt
        );
    }

    private List<ForecastDayData> fetchForecastWeather(String location) throws Exception {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "/forecast")
                .queryParam("q", location)
                .queryParam("units", "metric")
                .queryParam("appid", apiKey)
                .toUriString();

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode listNode = root.path("list");

        Map<LocalDate, List<JsonNode>> daysMap = new TreeMap<>();
        if (listNode.isArray()) {
            for (JsonNode item : listNode) {
                long epochSec = item.path("dt").asLong();
                LocalDate date = Instant.ofEpochSecond(epochSec).atZone(ZoneId.systemDefault()).toLocalDate();
                daysMap.computeIfAbsent(date, k -> new ArrayList<>()).add(item);
            }
        }

        List<ForecastDayData> forecast = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Map.Entry<LocalDate, List<JsonNode>> entry : daysMap.entrySet()) {
            LocalDate fDate = entry.getKey();
            List<JsonNode> intervals = entry.getValue();

            double minT = Double.MAX_VALUE;
            double maxT = -Double.MAX_VALUE;
            double totalHum = 0;
            double maxWindKmh = 0;
            double totalRain = 0;
            String text = "Clear";
            String code = "CLEAR";

            for (JsonNode interval : intervals) {
                JsonNode m = interval.path("main");
                double tMin = m.path("temp_min").asDouble();
                double tMax = m.path("temp_max").asDouble();
                if (tMin < minT) minT = tMin;
                if (tMax > maxT) maxT = tMax;
                totalHum += m.path("humidity").asInt(50);

                double wKmh = interval.path("wind").path("speed").asDouble(0.0) * 3.6;
                if (wKmh > maxWindKmh) maxWindKmh = wKmh;

                if (interval.has("rain") && interval.path("rain").has("3h")) {
                    totalRain += interval.path("rain").path("3h").asDouble(0.0);
                }

                JsonNode wArr = interval.path("weather");
                if (wArr.isArray() && wArr.size() > 0) {
                    text = wArr.get(0).path("description").asText("Clear");
                    code = wArr.get(0).path("main").asText("CLEAR").toUpperCase();
                }
            }

            int avgHum = intervals.isEmpty() ? 50 : (int) Math.round(totalHum / intervals.size());
            int rainChance = totalRain > 0.0 ? Math.min(100, (int) Math.round(totalRain * 20.0)) : 10;

            String label;
            if (fDate.equals(today)) {
                label = "Today";
            } else if (fDate.equals(today.plusDays(1))) {
                label = "Tomorrow";
            } else {
                label = fDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            }

            forecast.add(new ForecastDayData(
                    fDate, label,
                    BigDecimal.valueOf(minT == Double.MAX_VALUE ? 20.0 : minT).setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.valueOf(maxT == -Double.MAX_VALUE ? 30.0 : maxT).setScale(2, RoundingMode.HALF_UP),
                    avgHum, rainChance,
                    BigDecimal.valueOf(totalRain).setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.valueOf(maxWindKmh).setScale(2, RoundingMode.HALF_UP),
                    text, code
            ));
        }

        return forecast;
    }

    private String degreesToDirection(int degrees) {
        String[] directions = {"N", "NE", "E", "SE", "S", "SW", "W", "NW"};
        int index = (int) Math.round(((degrees % 360) / 45.0)) % 8;
        return directions[index];
    }
}

