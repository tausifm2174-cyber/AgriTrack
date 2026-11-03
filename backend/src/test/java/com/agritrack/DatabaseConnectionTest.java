package com.agritrack;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Live MySQL database integration test.
 *
 * This test connects to the real MySQL database using configured credentials and executes a live probe query.
 * To ensure the standard test suite passes on machines without local MySQL installations, this test
 * is disabled by default and explicitly opt-in.
 *
 * Activation methods:
 *   1. Maven profile:      .\mvnw.cmd test -P live-db
 *   2. System property:    .\mvnw.cmd test -DrunDbTests=true
 *   3. Environment var:    $env:RUN_DB_TESTS="true"; .\mvnw.cmd test
 */
@SpringBootTest
@Tag("integration")
@EnabledIf(value = "isDbTestEnabled", disabledReason = "Live database integration tests are disabled by default. Enable via -DrunDbTests=true, -P live-db, or RUN_DB_TESTS=true")
class DatabaseConnectionTest {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionTest.class);

    @Autowired
    private DataSource dataSource;

    static boolean isDbTestEnabled() {
        return "true".equalsIgnoreCase(System.getProperty("runDbTests"))
                || "true".equalsIgnoreCase(System.getenv("RUN_DB_TESTS"));
    }

    @Test
    @DisplayName("Verify real MySQL database connectivity and selected schema")
    void verifyDatabaseConnectivity() throws Exception {
        assertNotNull(dataSource, "DataSource bean must be configured");

        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT DATABASE(), VERSION()")) {

            assertTrue(connection.isValid(3), "Database connection must be valid");
            assertTrue(resultSet.next(), "SELECT DATABASE() must return a row");

            String activeDatabase = resultSet.getString(1);
            String mysqlVersion = resultSet.getString(2);

            logger.info("Successfully established live MySQL connection: Database='{}', Version='{}'",
                    activeDatabase, mysqlVersion);

            assertEquals("agritrack_db", activeDatabase, "Connected database must be 'agritrack_db'");
        }
    }
}
