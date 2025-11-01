import React from "react";
import Hero from "../components/homeModule/Hero";
import About from "../components/homeModule/About";
import Features from "../components/homeModule/Features";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="grow">
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="features">
          <Features />
        </section>
      </main>

      
    </div>
  );
};

export default HomePage;
