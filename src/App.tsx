import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';

function App() {
  const routesMarkup = (
    <Router>
        <Routes>
          {/* Your routes go here */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
  );

  return (
    <>
      {routesMarkup}
    </>
  )
}

export default App
