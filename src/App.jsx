import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import GetUser from './utils/GetUser';

function App() {

  GetUser();
  return (
    <div className="App w-[100vw] h-[100vh] overflow-x-hidden overflow-y-scroll no-scrollbar">
      <Toaster />
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
