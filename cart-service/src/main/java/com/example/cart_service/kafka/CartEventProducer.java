package com.example.cart_service.kafka;

import com.example.cart_service.entity.CartItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class CartEventProducer {

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

        kafkaTemplate.send(cartEventsTopic, eventMessage);
    }
}