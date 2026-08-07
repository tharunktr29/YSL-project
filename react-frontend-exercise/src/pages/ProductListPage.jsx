import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

function ProductListPage() {
    const {
        products,
        filteredProducts,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        sortBy,
        searchText,
        maxPrice,
        setSearchText,
        setMaxPrice,
        handleClearFilters,
        handlePreviousPage,
        handleNextPage,
        handlePageClick,
        handlePageSizeChange,
        handleSortChange,
    } = useProducts();

    const {
        carts,
        selectedCartId,
        loading: cartLoading,
        message: cartMessage,
        error: cartError,
        handleCreateCart,
        handleAddToCart,
    } = useCart();

    return (
        <div>
            <h2>Product List</h2>

            <button onClick={handleCreateCart} disabled={cartLoading}>
                {cartLoading ? 'Creating Cart...' : 'Create Cart'}
            </button>

            {selectedCartId ? (
                <p>Selected Cart ID: {selectedCartId}</p>
            ) : (
                <p>No cart selected yet.</p>
            )}

            {cartMessage && <p className="success-message">{cartMessage}</p>}

            <ErrorMessage message={cartError} />
            <ErrorMessage message={error} />

            {loading && <LoadingSpinner message="Loading products..." />}
            {cartLoading && <LoadingSpinner message="Processing cart request..." />}

            <div className="filter-container">
                <div>
                    <label>Search by Name: </label>
                    <input
                        type="text"
                        placeholder="Search product name"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </div>

                <div>
                    <label>Max Price: </label>
                    <input
                        type="number"
                        placeholder="Example: 300"
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(event.target.value)}
                    />
                </div>

                <button onClick={handleClearFilters}>Clear Filters</button>
            </div>

            <div className="pagination-settings">
                <div>
                    <label>Page Size: </label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>

                <div>
                    <label>Sort By: </label>
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="stock">Stock</option>
                    </select>
                </div>
            </div>

            <p>
                Showing {filteredProducts.length} products on this page. Total products:{' '}
                {totalElements}
            </p>

            <table border="1" cellPadding="10">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Cart Action</th>
                </tr>
                </thead>

                <tbody>
                {filteredProducts.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={cartLoading}
                            >
                                {cartLoading ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filteredProducts.length === 0 && !loading && (
                <p>No products match your search or filter.</p>
            )}

            <div className="pagination-container">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index)}
                        className={currentPage === index ? 'active-page' : ''}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                >
                    Next
                </button>
            </div>

            <p>
                Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
            </p>

            {carts.length === 0 && !cartLoading && (
                <p>No cart found. Click Create Cart or Add to Cart to create one.</p>
            )}
        </div>
    );
}

export default ProductListPage;