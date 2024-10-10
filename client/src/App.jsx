// import React from 'react';
import { Link, Route, Routes, Outlet } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/contact-us' element={<ContactUs />} />
      </Routes>
    </div>
  )
}

export default App;