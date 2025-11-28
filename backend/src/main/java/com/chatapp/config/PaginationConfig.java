package com.chatapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@Configuration
public class PaginationConfig {

    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer paginationCustomizer() {
        return pageableResolver -> {
            pageableResolver.setMaxPageSize(100); // Máximo 100 elementos por página
            pageableResolver.setOneIndexedParameters(true); // Páginas empiezan en 1 (opcional)
        };
    }
}