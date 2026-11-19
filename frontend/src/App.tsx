import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import CartDrawer from './components/CartDrawer/CartDrawer'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import RequireAuth from './components/RequireAuth/RequireAuth'
import Toast from './components/Toast/Toast'
import Account from './pages/Account/Account'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Checkout from './pages/Checkout/Checkout'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import ProductDetail from './pages/ProductDetail/ProductDetail'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Rutas que exigen sesión iniciada */}
          <Route element={<RequireAuth />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:id" element={<OrderConfirmation />} />
            <Route path="/cuenta" element={<Account />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <Toast />
    </>
  )
}
