import React from 'react';

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundImage:'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
      <div className="overlay">
        <div className="hero-content">
          <h1>Clean Energy for a Brighter Future</h1>
          <p>Efficient, reliable solar panel solutions for all scales.</p>
          <div className="hero-buttons">
            <button className="cta-button primary">Explore Solutions</button>
            <button className="cta-button secondary">Monitor Solar</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;