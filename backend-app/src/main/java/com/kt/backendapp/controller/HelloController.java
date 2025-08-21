package com.kt.backendapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from KT Wiz Backend! 새로운 DB 구조로 업데이트되었습니다.";
    }

    @GetMapping("/health")
    public String health() {
        return "OK - Database Connected";
    }
}

