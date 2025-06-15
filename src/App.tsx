import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home'
// import Login from './pages/Login/Login'
// import Signup from './pages/Signup/Signup'
import PrivateRoutes from './routes/PrivateRoutes'
import LoginRoute from './routes/LoginRoute';
import './App.css'

function App() {

  return (
    <>
      {/* <AuthProvider>
      <FriendsProvider> */}
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <Routes>
          {/* <Route path='/auth' element={<LoginRoute />} >
            <Route index element={<Login/>} path='/auth/login' />
            <Route element={<Signup/>} path='/auth/signup' />
          </Route> */}
          <Route path='/' element={<PrivateRoutes />}>
            <Route index element={<Home />} path='/'  />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* </FriendsProvider>
      </AuthProvider> */}
    </>
  )
}

export default App
