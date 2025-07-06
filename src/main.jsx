import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

// Elements And Css

import './index.css'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Bills from './pages/Bills.jsx'

// 

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Bills/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={routes}/>
  // </StrictMode>,
)
 