import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthLayout from "./components/AuthLayout.tsx"
import { Provider } from 'react-redux'
import store from './store/store.ts'


import {
  CustomerPage,
  Dashboard,
  InventoryPage,
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
        path: '/',
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        )
      },
      {
        path: '/dashboard',
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        )
      },
      {
        path: '/customer',
        element: (
          <AuthLayout authentication>
            <CustomerPage />
          </AuthLayout>
        )
      },
      {
        path: '/party',
        element: (
          <AuthLayout authentication>
            <PartyPage />
          </AuthLayout>
        )
      },
      {
        path: '/new-party',
        element: (
          <AuthLayout authentication>
            <NewParty />
          </AuthLayout>
        )
      },
      {
        path: '/update-party/:slug',
        element: (
          <AuthLayout authentication>
            <UpdateParty />
          </AuthLayout>
        )
      },
      {
        path: '/new-customer',
        element: (
          <AuthLayout authentication>
            <NewCustomer />
          </AuthLayout>
        )
      },
      {
        path: '/update-customer/:slug',
        element: (
          <AuthLayout authentication>
            <UpdateCustomer />
          </AuthLayout>
        )
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: '/inventory',
        element: (
          <AuthLayout authentication>
            <InventoryPage />
          </AuthLayout>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
