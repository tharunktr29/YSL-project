package com.example.product_service.service;

import com.example.product_service.entity.Product;
import com.example.product_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct_shouldSaveProduct() {
        Product product = new Product();
        product.setId(1);
        product.setName("Laptop");
        product.setPrice(1000.0);
        product.setStock(5);

        when(productRepository.save(product)).thenReturn(product);

        Product savedProduct = productService.createProduct(product);

        assertEquals(1, savedProduct.getId());
        assertEquals("Laptop", savedProduct.getName());
        assertEquals(1000.0, savedProduct.getPrice());
        assertEquals(5, savedProduct.getStock());

        verify(productRepository, times(1)).save(product);
    }

    @Test
    void getProductById_shouldReturnProduct_whenProductExists() {
        Product product = new Product();
        product.setId(1);
        product.setName("Phone");
        product.setPrice(500.0);
        product.setStock(10);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1);

        assertEquals(1, result.getId());
        assertEquals("Phone", result.getName());

        verify(productRepository, times(1)).findById(1);
    }

    @Test
    void getProductById_shouldThrowException_whenProductDoesNotExist() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                productService.getProductById(99)
        );

        assertEquals("Product not found with id: 99", exception.getMessage());

        verify(productRepository, times(1)).findById(99);
    }
}