import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from './router';

function App() {

  return (
    <div className="App w-[100vw] h-[100vh] overflow-x-hidden overflow-y-scroll no-scrollbar">
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
