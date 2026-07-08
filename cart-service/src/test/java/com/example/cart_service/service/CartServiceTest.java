package com.example.cart_service.service;

import com.example.cart_service.entity.Cart;
import com.example.cart_service.kafka.CartEventProducer;
import com.example.cart_service.repository.CartItemRepository;
import com.example.cart_service.repository.CartRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private WebClient webClient;

    @Mock
    private CartEventProducer cartEventProducer;

    @InjectMocks
    private CartService cartService;

    @Test
    void createCart_shouldSaveCart() {
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(101);

        when(cartRepository.save(cart)).thenReturn(cart);

        Cart savedCart = cartService.createCart(cart);

        assertEquals(1, savedCart.getId());
        assertEquals(101, savedCart.getUserId());

        verify(cartRepository, times(1)).save(cart);
    }

    @Test
    void getCartById_shouldReturnCart_whenCartExists() {
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(101);

        when(cartRepository.findById(1)).thenReturn(Optional.of(cart));

        Cart result = cartService.getCartById(1);

        assertEquals(1, result.getId());
        assertEquals(101, result.getUserId());

        verify(cartRepository, times(1)).findById(1);
    }

    @Test
    void getCartById_shouldThrowException_whenCartDoesNotExist() {
        when(cartRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                cartService.getCartById(99)
        );

        assertEquals("Cart not found with id: 99", exception.getMessage());

        verify(cartRepository, times(1)).findById(99);
    }
}