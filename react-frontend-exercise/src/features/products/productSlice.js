import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createProduct,
    getPagedProducts,
    getProducts,
} from '../../services/productService';

const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        error.response?.data?.name ||
        error.response?.data?.price ||
        error.response?.data?.stock ||
        error.message ||
        'Something went wrong'
    );
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await getProducts();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchPagedProducts = createAsyncThunk(
    'products/fetchPagedProducts',
    async ({ page = 0, size = 5, sortBy = 'id' }, { rejectWithValue }) => {
        try {
            return await getPagedProducts(page, size, sortBy);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (product, { rejectWithValue }) => {
        try {
            return await createProduct(product);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const initialState = {
    items: [],
    pagedItems: [],
    currentPage: 0,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
    sortBy: 'id',
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.currentPage = 0;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
            state.currentPage = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchPagedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPagedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.pagedItems = action.payload.content;
                state.currentPage = action.payload.number;
                state.pageSize = action.payload.size;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchPagedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.pagedItems.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductError, setPageSize, setSortBy } =
    productSlice.actions;

export default productSlice.reducer;