import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import PrivateRoutes from './routes/PrivateRoutes';
import HomePage from './pages/Home/Home';
import ProductsPage from './pages/products/Products';

function App() {

  return (
    <>
      {/* <AuthProvider> */}
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <Routes>
          <Route path='/' element={<PrivateRoutes/>}>
            <Route index path='/' element={<HomePage />}   />
            <Route path='/products' element={<ProductsPage />}   />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </AuthProvider>  */}
    </>
  )
}

export default App
