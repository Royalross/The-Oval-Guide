package com.ross.theovalguide.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Handles all security configurations for the application,
 * tailored to the specific controllers.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Use the global CORS configuration from WebConfig
                .cors(withDefaults())

                // Disable CSRF. This is common for stateless APIs or SPAs.
                .csrf(AbstractHttpConfigurer::disable)

                // Define endpoint authorization rules
                .authorizeHttpRequests(auth -> auth
                        // 1. Allow all CORS pre-flight OPTIONS requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Allow all authentication-related endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // 3. Allow public read-only access to specific API endpoints
                        .requestMatchers(HttpMethod.GET,
                                "/api/search",
                                "/api/classes/**",
                                "/api/professors/**"
                        ).permitAll()

                        // 4. Require authentication for all other requests
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}