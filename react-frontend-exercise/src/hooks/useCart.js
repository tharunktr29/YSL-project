import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addItemToCart,
    createNewCart,
    fetchCartItems,
    fetchCarts,
    removeCartItem,
} from '../features/cart/cartSlice';
import { fetchProducts } from '../features/products/productSlice';

export function useCart() {
    const dispatch = useDispatch();

    const {
        carts,
        items,
        selectedCartId,
        loading,
        message,
        error,
    } = useSelector((state) => state.cart);

    const { items: products } = useSelector((state) => state.products);

    const visibleItems = selectedCartId
        ? items.filter((item) => item.cartId === selectedCartId)
        : items;

    useEffect(() => {
        dispatch(fetchCarts());
    }, [dispatch]);

    const loadCartItemsWithProducts = () => {
        dispatch(fetchCartItems());
        dispatch(fetchProducts());
    };

    const handleCreateCart = async () => {
        await dispatch(createNewCart({ userId: 101 }));
    };

    const handleAddToCart = async (productId) => {
        let cartId = selectedCartId;

        if (!cartId) {
            const result = await dispatch(createNewCart({ userId: 101 })).unwrap();
            cartId = result.id;
        }

        await dispatch(
            addItemToCart({
                cartId,
                productId,
                quantity: 1,
            })
        );
    };

    const handleDeleteCartItem = async (cartItemId) => {
        await dispatch(removeCartItem(cartItemId));
    };

    const getProductName = (productId) => {
        const product = products.find((product) => product.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    return {
        carts,
        items,
        visibleItems,
        selectedCartId,
        loading,
        message,
        error,
        products,
        handleCreateCart,
        handleAddToCart,
        handleDeleteCartItem,
        loadCartItemsWithProducts,
        getProductName,
    };
}