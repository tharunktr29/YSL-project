package com.example.product_service.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CartEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(CartEventConsumer.class);

    @KafkaListener(
            topics = "${app.kafka.topic.cart-events}",
            groupId = "product-service-group"
    )
    public void consumeCartEvent(String message) {
        logger.info("Received cart event from Kafka: {}", message);
    }
}