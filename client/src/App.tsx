import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import PrivateRoutes from './routes/PrivateRoutes';
import HomePage from './pages/Home/Home';
import ProductsPage from './pages/Products/Products';
import { SearchProvider } from './context/SearchContext';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './context/CartContext';
import ProductPage from './pages/Product';

function App() {

  return (
    <>
      {/* <AuthProvider> */}
      <BrowserRouter>
      <SearchProvider>
      <ToastContainer 
        position='top-left' 
        // theme='light'
        autoClose={2000}
      />
      <CartProvider>
        <Routes>
          <Route index path='/' element={<HomePage />}   />
          <Route path='/' element={<PrivateRoutes withNav/>}>
            <Route path='/shop' element={<ProductsPage />}/>
            <Route path='/products/:productId' element={<ProductPage />}/>
          </Route>
        </Routes>
      </CartProvider>
      </SearchProvider>
      </BrowserRouter>
      {/* </AuthProvider>  */}
    </>
  )
}

export default App
