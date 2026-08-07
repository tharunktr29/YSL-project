import axios from 'axios';

const CART_API_URL = 'http://localhost:8082/api/carts';

export const getCarts = async () => {
    const response = await axios.get(CART_API_URL);
    return response.data;
};

export const createCart = async (cart) => {
    const response = await axios.post(CART_API_URL, cart);
    return response.data;
};

export const getCartItems = async () => {
    const response = await axios.get(`${CART_API_URL}/items`);
    return response.data;
};

export const addCartItem = async (cartItem) => {
    const response = await axios.post(`${CART_API_URL}/items`, cartItem);
    return response.data;
};

export const deleteCartItem = async (id) => {
    const response = await axios.delete(`${CART_API_URL}/items/${id}`);
    return response.data;
};
