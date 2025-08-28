package com.ross.theovalguide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class TheOvalGuideBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(TheOvalGuideBackApplication.class, args);
    }

}
