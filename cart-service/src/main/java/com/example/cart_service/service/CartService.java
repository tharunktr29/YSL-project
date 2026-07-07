package com.example.cart_service.service;

import com.example.cart_service.dto.ProductResponse;
import com.example.cart_service.entity.Cart;
import com.example.cart_service.entity.CartItem;
import com.example.cart_service.repository.CartItemRepository;
import com.example.cart_service.repository.CartRepository;
import com.example.cart_service.kafka.CartEventProducer;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final WebClient webClient;
    private final CartEventProducer cartEventProducer;
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);


    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       WebClient webClient,
                       CartEventProducer cartEventProducer) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.webClient = webClient;
        this.cartEventProducer = cartEventProducer;
    }

    public Cart createCart(Cart cart) {
        logger.info("Creating cart for userId: {}", cart.getUserId());
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
        logger.info("Adding productId {} to cartId {} with quantity {}",
                cartItem.getProductId(),
                cartItem.getCartId(),
                cartItem.getQuantity());

        getCartById(cartItem.getCartId());

        CompletableFuture<ProductResponse> productFuture = CompletableFuture.supplyAsync(() ->
                fetchProduct(cartItem.getProductId())
        );

        CompletableFuture<Boolean> stockValidationFuture = productFuture.thenApplyAsync(product ->
                validateStock(product, cartItem.getQuantity())
        );

        ProductResponse product = productFuture.join();
        Boolean isStockAvailable = stockValidationFuture.join();

        if (product == null) {
            logger.error("Product not found with id: {}", cartItem.getProductId());
            throw new RuntimeException("Product not found with id: " + cartItem.getProductId());
        }

        if (!isStockAvailable) {
            logger.error("Insufficient stock for product id: {}", cartItem.getProductId());
            throw new RuntimeException("Insufficient stock for product id: " + cartItem.getProductId());
        }

        CartItem savedCartItem = cartItemRepository.save(cartItem);
        logger.info("Cart item saved with id: {}", savedCartItem.getId());

        cartEventProducer.sendCartItemAddedEvent(savedCartItem);
        return savedCartItem;
    }

    private ProductResponse fetchProduct(Integer productId) {
        return webClient.get()
                .uri("/api/products/" + productId)
                .retrieve()
                .bodyToMono(ProductResponse.class)
                .block();
    }

    private boolean validateStock(ProductResponse product, Integer requestedQuantity) {
        return product != null && product.getStock() >= requestedQuantity;
    }

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public void deleteCart(Integer id) {
        Cart existingCart = getCartById(id);
        cartRepository.delete(existingCart);
    }

}