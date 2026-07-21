import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import PrivateRoutes from './routes/PrivateRoutes';
import LoginRoute from './routes/LoginRoute';
import HomePage from './pages/Home';
import ShoppingPage from './pages/Shopping';
import { SearchProvider } from './context/SearchContext';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './context/CartContext';
import ProductPage from './pages/Product';
import CheckoutPage from './pages/Checkout';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './routes/PublicRoute';
import OrdersPage from './pages/Orders';
import OrderPage from './pages/Order';
import TestPage from './pages/TestPage';
import ProductsPage from './pages/Dashboard/Products';
import ProductDetails from './pages/Dashboard/ProductDetails';
import DashboardOrdersPage from './pages/Dashboard/Orders';
import DashboardOrderDetailsPage from './pages/Dashboard/Order';
import DashboardHomePage from './pages/Dashboard/Overview';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  return (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <ToastContainer
            position='top-left'
            autoClose={2000}
          />
          <CartProvider>
            <Routes>
              <Route path='/' element={<PublicRoute withNav />}>
                <Route index element={<HomePage />} />
                <Route path='shop' element={<ShoppingPage />} />
                <Route path='test' element={<TestPage/>}/>
                <Route path='products/:productId' element={<ProductPage />} />
              </Route>
              <Route path='/auth' element={<LoginRoute />}>
                <Route path='login' element={<LoginPage />} />
                <Route path='register' element={<RegisterPage />} />
              </Route>
              <Route path='/' element={<PrivateRoutes withNav />}>
                <Route path='my-orders' element={<OrdersPage />} />
                <Route path='orders/:orderId' element={<OrderPage />} />
              </Route>
              <Route path='dashboard' element={<PrivateRoutes dashboard />}>
                <Route index element={<DashboardHomePage />} />
                <Route path='orders' element={<DashboardOrdersPage />} />
                <Route path='orders/:orderId' element={<DashboardOrderDetailsPage />} />
                <Route path='products' element={<ProductsPage />} />
                <Route path='products/:productId' element={<ProductDetails />} />
              </Route>
              <Route path='/' element={<PrivateRoutes withNav />}>
                <Route path='checkout' element={<CheckoutPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
  )
}

export default App
