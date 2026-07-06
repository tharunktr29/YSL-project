package com.example.cart_service.controller;

import com.example.cart_service.entity.Cart;
import com.example.cart_service.entity.CartItem;
import com.example.cart_service.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createCart(cart);
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Integer id) {
        return cartService.getCartById(id);
    }

    @PostMapping("/items")
    public CartItem addCartItem(@RequestBody CartItem cartItem) {
        return cartService.addCartItem(cartItem);
    }

    @GetMapping("/items")
    public List<CartItem> getAllCartItems() {
        return cartService.getAllCartItems();
    }

    @DeleteMapping("/{id}")
    public String deleteCart(@PathVariable Integer id) {
        cartService.deleteCart(id);
        return "Cart deleted successfully with id: " + id;
    }
}