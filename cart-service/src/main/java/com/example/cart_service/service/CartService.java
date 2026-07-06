package com.example.cart_service.service;

import com.example.cart_service.dto.ProductResponse;
import com.example.cart_service.entity.Cart;
import com.example.cart_service.entity.CartItem;
import com.example.cart_service.repository.CartItemRepository;
import com.example.cart_service.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final WebClient webClient;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       WebClient webClient) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.webClient = webClient;
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart getCartById(Integer id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + id));
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public CartItem addCartItem(CartItem cartItem) {
        getCartById(cartItem.getCartId());

        ProductResponse product = webClient.get()
                .uri("/api/products/" + cartItem.getProductId())
                .retrieve()
                .bodyToMono(ProductResponse.class)
                .block();

        if (product == null) {
            throw new RuntimeException("Product not found with id: " + cartItem.getProductId());
        }

        if (product.getStock() < cartItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product id: " + cartItem.getProductId());
        }

        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public void deleteCart(Integer id) {
        Cart existingCart = getCartById(id);
        cartRepository.delete(existingCart);
    }
}