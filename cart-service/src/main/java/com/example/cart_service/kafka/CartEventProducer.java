package com.example.cart_service.kafka;

import com.example.cart_service.entity.CartItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.KafkaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class CartEventProducer {

    private static final Logger logger = LoggerFactory.getLogger(CartEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${app.kafka.topic.cart-events}")
    private String cartEventsTopic;

    public CartEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendCartItemAddedEvent(CartItem cartItem) {
        String eventMessage = String.format(
                "{\"cartId\":%d,\"productId\":%d,\"quantity\":%d}",
                cartItem.getCartId(),
                cartItem.getProductId(),
                cartItem.getQuantity()
        );

        try {
            kafkaTemplate.send(cartEventsTopic, eventMessage)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            logger.info("Kafka event published to topic {}: {}", cartEventsTopic, eventMessage);
                        } else {
                            logger.warn("Kafka publish failed: {}", ex.getMessage());
                        }
                    });
        } catch (KafkaException ex) {
            logger.warn("Kafka publish skipped: {}", ex.getMessage());
        }
    }
}
