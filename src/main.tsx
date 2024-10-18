import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'


import {
  CustomerPage,
  Dashboard,
  Login,
  NewCustomer,
  NewParty,
  PartyPage,
  UpdateCustomer,
  UpdateParty

} from "./pages/index.ts"


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/customer',
        element: <CustomerPage />,
      },
      {
        path: '/party',
        element: <PartyPage />,
      },
      {
        path: '/new-party',
        element: <NewParty />,
      },
      {
        path: '/update-party/:slug',
        element: <UpdateParty />,
      },
      {
        path: '/new-customer',
        element: <NewCustomer />,
      },
      {
        path: '/update-customer/:slug',
        element: <UpdateCustomer />,
      },
      {
        path: '/login',
        element: <Login />,
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
