import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { addProduct } from '../features/products/productSlice';

function AddProductPage() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.products);

    const [product, setProduct] = useState({
        name: '',
        price: '',
        stock: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const productRequest = {
            name: product.name,
            price: Number(product.price),
            stock: Number(product.stock),
        };

        try {
            await dispatch(addProduct(productRequest)).unwrap();

            setMessage('Product created successfully');

            setProduct({
                name: '',
                price: '',
                stock: '',
            });
        } catch (error) {
            setMessage('');
            console.error('Failed to create product:', error);
        }
    };

    return (
        <div>
            <h2>Add Product</h2>

            {message && <p className="success-message">{message}</p>}
            <ErrorMessage message={error} />

            {loading && <LoadingSpinner message="Creating product..." />}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Price: </label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Stock: </label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}

export default AddProductPage;