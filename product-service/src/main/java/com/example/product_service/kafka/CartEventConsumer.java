package com.example.product_service.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CartEventConsumer {

    @Value("${app.kafka.topic.cart-events}")
    private String cartEventsTopic;

    @KafkaListener(
            topics = "${app.kafka.topic.cart-events}",
            groupId = "product-service-group"
    )
    public void consumeCartEvent(String message) {
        System.out.println("Received cart event: " + message);
    }
}