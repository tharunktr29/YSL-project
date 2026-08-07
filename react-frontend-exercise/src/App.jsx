import { NavLink } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <div>
            <h1>Electronic Store</h1>

            <nav className="navbar">
                <NavLink
                    to="/products"
                    className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
                >
                    Product List
                </NavLink>

                <NavLink
                    to="/add-product"
                    className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
                >
                    Add Product
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
                >
                    Cart
                </NavLink>
            </nav>

            <hr />

            <AppRoutes />
        </div>
    );
}

export default App;