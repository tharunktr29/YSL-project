import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addCartItem,
    createCart,
    deleteCartItem,
    getCartItems,
    getCarts,
} from '../../services/cartService';

const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        error.response?.data?.cartId ||
        error.response?.data?.productId ||
        error.response?.data?.quantity ||
        error.message ||
        'Something went wrong'
    );
};

export const fetchCarts = createAsyncThunk(
    'cart/fetchCarts',
    async (_, { rejectWithValue }) => {
        try {
            return await getCarts();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const createNewCart = createAsyncThunk(
    'cart/createNewCart',
    async (cart, { rejectWithValue }) => {
        try {
            return await createCart(cart);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            return await getCartItems();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const addItemToCart = createAsyncThunk(
    'cart/addItemToCart',
    async (cartItem, { rejectWithValue }) => {
        try {
            return await addCartItem(cartItem);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (id, { rejectWithValue }) => {
        try {
            await deleteCartItem(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const initialState = {
    carts: [],
    items: [],
    selectedCartId: null,
    loading: false,
    error: null,
    message: '',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setSelectedCartId: (state, action) => {
            state.selectedCartId = action.payload;
        },
        clearCartMessage: (state) => {
            state.message = '';
        },
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarts.fulfilled, (state, action) => {
                state.loading = false;
                state.carts = action.payload;
            })
            .addCase(fetchCarts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createNewCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })
            .addCase(createNewCart.fulfilled, (state, action) => {
                state.loading = false;
                state.carts.push(action.payload);
                state.selectedCartId = action.payload.id;
                state.message = 'Cart created successfully';
            })
            .addCase(createNewCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = 'Failed to create cart';
            })

            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.message = 'Product added to cart successfully';
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = 'Failed to add product to cart';
            })

            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = '';
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
                state.message = 'Cart item deleted successfully';
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = 'Failed to delete cart item';
            });
    },
});

export const { setSelectedCartId, clearCartMessage, clearCartError } =
    cartSlice.actions;

export default cartSlice.reducer;
