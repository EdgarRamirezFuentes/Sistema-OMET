import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Clients from './Clients/Clients'
import ResetPassword from "./ResetPassword/ResetPassword";
import Profile from "./Profile/Profile";
import Dashboard from "./Admin/Dashboard";

import ChangePassword from "./Profile/ChangePassword";

import Customers from "./Customers/Customers";

import Projects from "./Projects/Projects";

import ModelFields from "./Projects/ModelFields/ModelFields";

import Models from "./Models/Models";

import Apps from "./Apps/Apps";

import Validators from "./Models/Validators";
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

              <Route path="/clients/change-password" element={<ChangePassword />} />

              <Route path="/projects/get" element={<Projects />} />

              <Route path="/projects/field/:id" element={<ModelFields />} />

              <Route path="/customers/get" element={<Customers />} />
              
              <Route path="/model/get/:id" element={<Models />} />

              <Route path="/model/validators/:id" element={<Validators />} />

              <Route path="/apps/" element={<Apps />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
