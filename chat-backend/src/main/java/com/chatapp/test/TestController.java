package com.chatapp.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/public")

    public Map<String, String> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a PUBLIC test endpoint");
        response.put("status", "open");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }

    @GetMapping("/secured")

    public Map<String, String> securedEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a SECURED test endpoint");
        response.put("status", "protected");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
}