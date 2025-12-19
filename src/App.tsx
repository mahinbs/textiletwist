import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="auth" element={<AuthPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
