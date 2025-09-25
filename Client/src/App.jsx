import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Candy from '/Candy.jpg'
import './App.css'
import Login from './comp/Login'
import Register from './comp/Register'
import AdminPage from './comp/AdminPage'
import BioData from './comp/BioData'
import HomePage from './comp/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router'
import Booking from './comp/Booking'

function App() {

  return (
    <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundImage:`url(${Candy})`,backgroundRepeat:'no-repeat',backgroundSize:'cover',flexDirection:'column'}}>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>}/>
      <Route path='/adminPage' element={<AdminPage/>}/>
      {/* <Route path='/bioData' element={<BioData/>}/> */}
      <Route path='/userpage' element={<HomePage/>}/>
      <Route path='/booking/:productId' element={<Booking/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
