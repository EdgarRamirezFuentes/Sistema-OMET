import '../App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../Admin/Dashboard'

function Home() {

  return (
        <div className="w-full h-full flex">
            <div className='bg-light-gray w-full min-h-screen'>
              <div className='w-full'>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
              </div>
            </div>
        </div>
  )
}

export default Home
