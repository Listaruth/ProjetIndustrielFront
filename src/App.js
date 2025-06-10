import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import Solutions from './components/solutions';
import About from './components/about';
import Contact from './components/contact';
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Solutions />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
