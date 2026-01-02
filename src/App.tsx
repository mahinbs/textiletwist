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
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Shop Layout */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Admin Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="analytics" element={<AdminAnalyticsPage />} />
                    <Route path="enquiries" element={<AdminEnquiriesPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="customers" element={<AdminCustomersPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
