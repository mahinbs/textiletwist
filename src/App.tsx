import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import ProductsPage from './pages/ProductsPage';
// import ProductDetailsPage from './pages/ProductDetailsPage';
// import ContactPage from './pages/ContactPage';

// Placeholder components for other pages
// const BlogPage = () => <div className="pt-32 pb-20 text-center"><h1 className="text-4xl font-serif text-primary">Blog & Reviews</h1></div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    {/* <Route path="about" element={<AboutPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:id" element={<ProductDetailsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="blog" element={<BlogPage />} /> */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
