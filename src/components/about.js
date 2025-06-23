import React from 'react';
import '../style/about.css'; // ← Import the stylesheet

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <h2>About <span className="highlight">SunTrack</span></h2>
        <p>
          We are a leading provider of solar energy solutions, dedicated to 
          accelerating the world's transition to sustainable energy.
        </p>
        <p>
          Our platform connects businesses with solar providers, making the 
          transition to solar energy simple and cost-effective.
        </p>
      </div>
    </section>
  );
};

export default About;
