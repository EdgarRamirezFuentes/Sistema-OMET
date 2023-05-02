import '../App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SideBar from '../Components/Sidebar/Sidebar'
import Clients from '../Clients/Clients'

function Home() {

  return (
        <div className="w-full h-full flex">
            <SideBar/>
            <div className='bg-light-gray w-full min-h-screen'>
              <div className='w-full'>
              <Routes>
                <Route path="/" element={<Clients />} />
                <Route path="/clients/create" element={<Clients />} />
              </Routes>

              </div>
            </div>
        </div>
  )
}

export default Home
