package com.agritrack;

import com.agritrack.service.weather.OpenWeatherMapClient;
import com.agritrack.service.weather.SimulationFallbackWeatherClient;
import com.agritrack.service.weather.WeatherPayload;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Weather Provider Client Tests")
class WeatherProviderClientTest {

    @Test
    @DisplayName("SimulationFallbackWeatherClient returns deterministic data for location and day")
    void testSimulationFallbackReturnsDeterministicData() {
        SimulationFallbackWeatherClient client = new SimulationFallbackWeatherClient();
        assertThat(client.getProviderName()).isEqualTo("SIMULATION");

        WeatherPayload payload1 = client.fetchWeatherData("Nashik, Maharashtra");
        WeatherPayload payload2 = client.fetchWeatherData("Nashik, Maharashtra");

        assertThat(payload1.getProvider()).isEqualTo("SIMULATION");
        assertThat(payload1.getCurrent().getTemperature()).isEqualTo(payload2.getCurrent().getTemperature());
        assertThat(payload1.getCurrent().getHumidity()).isEqualTo(payload2.getCurrent().getHumidity());
        assertThat(payload1.getCurrent().getWindSpeedKmh()).isEqualTo(payload2.getCurrent().getWindSpeedKmh());
        assertThat(payload1.getForecast()).hasSize(7);
        assertThat(payload1.getCurrent().getTemperature()).isGreaterThan(BigDecimal.valueOf(20));
        assertThat(payload1.getCurrent().getHumidity()).isBetween(0, 100);
        assertThat(payload1.getCurrent().getWindSpeedKmh()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("SimulationFallbackWeatherClient rejects empty location")
    void testSimulationFallbackRejectsEmptyLocation() {
        SimulationFallbackWeatherClient client = new SimulationFallbackWeatherClient();
        assertThatThrownBy(() -> client.fetchWeatherData("   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Location cannot be empty");
    }

    @Test
    @DisplayName("OpenWeatherMapClient reports unconfigured when api key is blank")
    void testOpenWeatherMapClientUnconfigured() {
        OpenWeatherMapClient client = new OpenWeatherMapClient("", "https://api.openweathermap.org/data/2.5", 5000);
        assertThat(client.isConfigured()).isFalse();
        assertThat(client.getProviderName()).isEqualTo("OPEN_WEATHER");

        assertThatThrownBy(() -> client.fetchWeatherData("Nashik, Maharashtra"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("OpenWeatherMap API key is not configured");
    }
}
