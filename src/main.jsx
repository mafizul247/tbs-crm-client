import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import "./i18n";
import AuthProvider from './Providers/AuthProvider.jsx'
import router from './Routers/Router.jsx'
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </AuthProvider>
  </StrictMode>,
)
