import axios from 'axios';

const PRODUCT_API_URL = 'http://localhost:18081/api/products';

export const getProducts = async () => {
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
};

export const getPagedProducts = async (page = 0, size = 5, sortBy = 'id') => {
    const response = await axios.get(`${PRODUCT_API_URL}/paged`, {
        params: {
            page,
            size,
            sortBy,
        },
    });

    return response.data;
};

export const createProduct = async (product) => {
    const response = await axios.post(PRODUCT_API_URL, product);
    return response.data;
};
