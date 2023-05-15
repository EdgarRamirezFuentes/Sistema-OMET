import { useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Clients from './Clients/Clients'
import ResetPassword from "./ResetPassword/ResetPassword";
import Profile from "./Profile/Profile";
import Dashboard from "./Admin/Dashboard";
import Create from "./Clients/Create";
function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen">
        <div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/clients/get" element={<Clients />} />
              <Route path="/clients/create" element={<Create />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
