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
import SeeProjectModel from "./Projects/Model/See";
import CreateProjectModel from "./Projects/Model/Create";
import UpdateProjectModel from "./Projects/Model/Update";

import CreateDataType from "./DataType/Create";
import DataTypes from "./DataType/Types";
import SeeDataType from "./DataType/See";
import UpdateDataType from "./DataType/Update";

import CreateModel from "./ModelField/Create";
import ModelFields from "./ModelField/Fields";
import SeeModel from "./ModelField/See";
import UpdateModel from "./ModelField/Update";


import CreateApp from "./Apps/Create";
import SeeApps from "./Apps/Apps";
import SeeApp from "./Apps/See";
import UpdateApp from "./Apps/Update";
import ValidatorsModel from "./ModelField/Validators";
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
              <Route path="/projects/model/view/:id" element={<SeeProjectModel />} />
              <Route path="/projects/model/update/:id" element={<UpdateProjectModel />} />

              <Route path="/customers/create" element={<CreateCustomer />} />
              <Route path="/customers/get" element={<Customers />} />
              <Route path="/customers/update/:id" element={<UpdateCustomer />} />
              <Route path="/customers/view/:id" element={<SeeCustomer />} />

              <Route path="/data-type/create" element={<CreateDataType />} />
              <Route path="/data-type/get" element={<DataTypes />} />
              <Route path="/data-type/update/:id" element={<UpdateDataType />} />
              <Route path="/data-type/view/:id" element={<SeeDataType />} />

              <Route path="/model/create/:id" element={<CreateModel />} />
              <Route path="/model/view/:id" element={<SeeModel />} />
              <Route path="/model/update/:id" element={<UpdateModel />} />
              <Route path="/model/get/:id" element={<ModelFields />} />
              <Route path="/model/validators/:id" element={<ValidatorsModel />} />
              
              <Route path="/app/create/:id" element={<CreateApp />} />
              <Route path="/apps/" element={<SeeApps />} />
              <Route path="/app/view/:id" element={<SeeApp />} />
              <Route path="/app/update/:id" element={<UpdateApp />} />
              <Route path="/app/get/:id" element={<ModelFields />} />
              
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
