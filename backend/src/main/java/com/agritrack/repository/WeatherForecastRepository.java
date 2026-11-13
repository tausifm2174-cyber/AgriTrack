package com.agritrack.repository;

import com.agritrack.entity.WeatherForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherForecastRepository extends JpaRepository<WeatherForecast, Long> {

    List<WeatherForecast> findByFarmIdAndFarmUserIdOrderByForecastDateAsc(Long farmId, Long userId);

    List<WeatherForecast> findByFarmIdOrderByForecastDateAsc(Long farmId);

    Optional<WeatherForecast> findByFarmIdAndForecastDate(Long farmId, LocalDate forecastDate);

    void deleteByFarmId(Long farmId);
}

