package com.example.product_service.controller;

import com.example.product_service.entity.Product;
import com.example.product_service.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id,@Valid @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return "Product deleted successfully with id: " + id;
    }
    @GetMapping("/paged")
    public Page<Product> getProductsWithPaginationAndSorting(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return productService.getProductsWithPaginationAndSorting(page, size, sortBy);
    }

    @GetMapping("/filter/price/{price}")
    public List<Product> getProductsAbovePrice(@PathVariable Double price) {
        return productService.getProductsAbovePrice(price);
    }

    @GetMapping("/native/price/{price}")
    public List<Product> getProductsAbovePriceNative(@PathVariable Double price) {
        return productService.getProductsAbovePriceNative(price);
    }

    @GetMapping("/names")
    public List<String> getProductNames() {
        return productService.getProductNames();
    }
}
