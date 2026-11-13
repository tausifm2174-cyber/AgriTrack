package com.agritrack.service.weather;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Deterministic simulation provider for farm weather data.
 * Used when OpenWeatherMap is unconfigured, unreachable, or in offline/test environments.
 */
@Component("simulationFallbackWeatherClient")
public class SimulationFallbackWeatherClient implements WeatherProviderClient {

    public static final String PROVIDER_NAME = "SIMULATION";

    @Override
    public String getProviderName() {
        return PROVIDER_NAME;
    }

    @Override
    public WeatherPayload fetchWeatherData(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location cannot be empty");
        }

        LocalDate today = LocalDate.now();
        int hash = Math.abs((location.trim().toLowerCase() + "_" + today.getDayOfYear()).hashCode());

        // Derive deterministic variations based on hash
        int tempBase = 26 + (hash % 9); // 26 to 34 °C
        int humidityBase = 45 + ((hash / 10) % 35); // 45% to 79%
        double windBase = 8.0 + ((hash % 120) / 10.0); // 8.0 to 19.9 km/h
        double rainBase = (hash % 10 == 0) ? ((hash % 15) / 2.0) : 0.0; // mostly 0, occasional light rain
        double uvBase = 5.0 + ((hash % 40) / 10.0); // 5.0 to 8.9
        int aqiBase = 40 + (hash % 50); // 40 to 89

        String conditionText;
        String conditionCode;
        if (rainBase > 5.0) {
            conditionText = "Moderate Rain";
            conditionCode = "RAIN_MODERATE";
        } else if (rainBase > 0.0) {
            conditionText = "Light Rain Shower";
            conditionCode = "RAIN_LIGHT";
        } else if (humidityBase > 70) {
            conditionText = "Partly Cloudy";
            conditionCode = "CLOUDY_PARTLY";
        } else {
            conditionText = "Sunny";
            conditionCode = "CLEAR_SUNNY";
        }

        BigDecimal temp = BigDecimal.valueOf(tempBase).setScale(2, RoundingMode.HALF_UP);
        BigDecimal feelsLike = temp.add(BigDecimal.valueOf(1.80)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal wind = BigDecimal.valueOf(windBase).setScale(2, RoundingMode.HALF_UP);
        BigDecimal rain = BigDecimal.valueOf(rainBase).setScale(2, RoundingMode.HALF_UP);
        BigDecimal uv = BigDecimal.valueOf(uvBase).setScale(1, RoundingMode.HALF_UP);
        BigDecimal pressure = BigDecimal.valueOf(1012.00).setScale(2, RoundingMode.HALF_UP);

        CurrentWeatherData current = new CurrentWeatherData(
                temp, feelsLike, humidityBase, wind, "NE", rain, pressure,
                conditionText, conditionCode, uv, aqiBase, LocalDateTime.now()
        );

        // 7-day forecast
        List<ForecastDayData> forecast = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate fDate = today.plusDays(i);
            int dayHash = Math.abs((location.trim().toLowerCase() + "_" + fDate.getDayOfYear()).hashCode());

            BigDecimal minT = BigDecimal.valueOf(18 + (dayHash % 6)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal maxT = minT.add(BigDecimal.valueOf(8 + (dayHash % 7))).setScale(2, RoundingMode.HALF_UP);
            int hum = 45 + ((dayHash / 7) % 35);
            int rainChance = (dayHash % 5 == 0) ? (30 + (dayHash % 50)) : 10;
            BigDecimal dayRain = (rainChance > 40) ? BigDecimal.valueOf((dayHash % 12) / 2.0).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            BigDecimal dayWind = BigDecimal.valueOf(7.0 + ((dayHash % 130) / 10.0)).setScale(2, RoundingMode.HALF_UP);

            String dLabel;
            if (i == 0) {
                dLabel = "Today";
            } else if (i == 1) {
                dLabel = "Tomorrow";
            } else {
                dLabel = fDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            }

            String condText = dayRain.compareTo(BigDecimal.ZERO) > 0 ? "Scattered Showers" : "Clear Skies";
            String condCode = dayRain.compareTo(BigDecimal.ZERO) > 0 ? "RAIN_SHOWERS" : "CLEAR";

            forecast.add(new ForecastDayData(
                    fDate, dLabel, minT, maxT, hum, rainChance, dayRain, dayWind, condText, condCode
            ));
        }

        return new WeatherPayload(current, forecast, PROVIDER_NAME);
    }
}

