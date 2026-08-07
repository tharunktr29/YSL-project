import { useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCart } from '../hooks/useCart';

function CartPage() {
    const {
        visibleItems,
        loading,
        error,
        loadCartItemsWithProducts,
        getProductName,
        handleDeleteCartItem,
    } = useCart();

    useEffect(() => {
        loadCartItemsWithProducts();
    }, []);

    return (
        <div>
            <h2>Cart Items</h2>

            <button onClick={loadCartItemsWithProducts} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Cart'}
            </button>

            {loading && <LoadingSpinner message="Loading cart items..." />}
            <ErrorMessage message={error} />

            <table border="1" cellPadding="10">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Cart ID</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                {visibleItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.cartId}</td>
                        <td>{item.productId}</td>
                        <td>{getProductName(item.productId)}</td>
                        <td>{item.quantity}</td>
                        <td>
                            <button
                                type="button"
                                onClick={() => handleDeleteCartItem(item.id)}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {visibleItems.length === 0 && !loading && <p>No cart items found.</p>}
        </div>
    );
}

export default CartPage;