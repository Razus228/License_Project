import React from "react";
import "./About.css";
import carImage from "../assets/about-car.jpg"; 

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-text">
          <h1>About the Intelligent Vehicle Search System</h1>
          <p>
            In today’s fast-paced world, finding the right car can be
            overwhelming—especially in Moldova where reliable,
            centralized, and intelligent information about vehicles is still
            scarce. Many users struggle with traditional platforms that either
            provide incomplete car specifications or require manual filtering
            through hundreds of listings. This results in frustration, wasted
            time, and in some cases, poor purchasing decisions.
          </p>
          <p>
            That’s where the <strong>Intelligent Vehicle Search System</strong>{" "}
            comes in. My platform is designed to change the way people search
            for vehicles in the Moldovan market by introducing something truly
            innovative and user-centric. By leveraging Natural Language
            Processing (NLP) and intelligent filtering mechanisms, our search
            engine understands your needs even if you type them naturally—like
            “Toyota Corolla 2010” or “BMW with more than 450 horsepower.” The
            system responds quickly with precise matches, eliminating the need
            to navigate through cluttered listings or interpret confusing
            technical specs.
          </p>
          <p>
            I’ve built this platform with simplicity and power in mind.
            Whether you're a first-time buyer, a car enthusiast, or a dealership
            looking for fast and relevant insights, this tool adapts to your
            needs. It’s not just a search engine—it’s your smart assistant in
            the car-buying process.
          </p>
          <p>
            This approach is new to the Moldovan market. There
            hasn't been a local solution that combines smart filtering, full
            vehicle specifications, and a user-friendly interface. We believe
            it's time for a change—one that saves time, reduces uncertainty, and
            empowers users with data-driven results.
          </p>
          <p>
            <strong>
              Welcome to the future of vehicle search in Moldova.
            </strong>{" "}
            Try it out—and experience how intelligent car discovery should feel.
          </p>
        </div>

        <div className="about-image">
          <img src={carImage} alt="Car representation" />
        </div>
      </div>
    </div>
  );
};

export default About;
