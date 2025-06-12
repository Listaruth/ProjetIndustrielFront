import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import Solutions from './components/solutions';
import About from './components/about';
import Contact from './components/contact';
import Footer from './components/footer';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SolarView from './components/solarview';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <Hero />
              <Solutions />
              <About />
              <Contact />         
            </div>
          }
        />
        <Route path="/solarview" element={<SolarView />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
