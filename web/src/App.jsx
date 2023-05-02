import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Home from './Home/Home';
import Projects from './Projects/Projects'
import Clients from './Clients/Clients'
import SideBar from './Components/Sidebar/Sidebar'
function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen">
        <div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
