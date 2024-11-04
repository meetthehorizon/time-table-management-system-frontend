import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/UserContext.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'

export const token = localStorage.getItem('token')
export const userid = localStorage.getItem('userid')
export const server = "http://localhost:8005"

const AppWrapper = () => {
  return (

    <UserProvider>
      <App />
    </UserProvider>

  )
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
