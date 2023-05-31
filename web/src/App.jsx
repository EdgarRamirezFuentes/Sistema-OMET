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
import See from "./Clients/See";
import Update from "./Clients/Update";
import ChangePassword from "./Profile/ChangePassword";
import CreateProject from "./Projects/Create";
import CreateCustomer from "./Customers/Create";
import Customers from "./Customers/Customers";
import UpdateCustomer from "./Customers/Update";
import SeeCustomer from "./Customers/See";

import Projects from "./Projects/Projects";
import UpdateProject from "./Projects/Update";
import UpdateMaintainersProject from "./Projects/Maintainers";
import SeeProject from "./Projects/See";

import Models from "./Projects/Model/Models";
import CreateProjectModel from "./Projects/Model/Create";
import UpdateProjectModel from "./Projects/Model/Update";
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
              <Route path="/clients/view/:id" element={<See />} />
              <Route path="/clients/update/:id" element={<Update />} />
              <Route path="/clients/create" element={<Create />} />
              <Route path="/clients/change-password" element={<ChangePassword />} />

              <Route path="/projects/create" element={<CreateProject />} />
              <Route path="/projects/get" element={<Projects />} />
              <Route path="/projects/update/:id" element={<UpdateProject />} />
              <Route path="/projects/view/:id" element={<SeeProject />} />
              <Route path="/projects/update/maintainer/:id" element={<UpdateMaintainersProject />} />

              <Route path="/projects/model/:id" element={<Models />} />
              <Route path="/projects/model/create/:id" element={<CreateProjectModel />} />
              <Route path="/projects/model/update/:id" element={<UpdateProjectModel />} />

              <Route path="/customers/create" element={<CreateCustomer />} />
              <Route path="/customers/get" element={<Customers />} />
              <Route path="/customers/update/:id" element={<UpdateCustomer />} />
              <Route path="/customers/view/:id" element={<SeeCustomer />} />

            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
