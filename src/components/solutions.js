import React from 'react';

const Solutions = () => {
  const solutions = [
    {
      title: "Detection",
      description: "Detect solar panel issues accurately."
    },
    {
      title: "Utility-Scale Solar",
      description: "Deploy Robots to keep your solar panels dirt-free and efficient."
    },
    {
      title: "Solar + Storage",
      description: "Combine solar with battery storage for uninterrupted power supply."
    }
  ];

  return (
    <section id="solutions" className="solutions">
      <h2>Our Solar Solutions</h2>
      <div className="solutions-grid">
        {solutions.map((solution, index) => (
          <div key={index} className="solution-card">
            <h3>{solution.title}</h3>
            <p>{solution.description}</p>
            <button>Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Solutions;