import React from "react";
import "./Home.css";
class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <header>
          <div className="hero-image"></div>
        </header>
        <section className="container container--centered">
          <p className="text-content content--centered">Serialized is a place for you to find serial fiction or post your own. At the moment, it&apos;s a work in progress, but feel free to sign up, play around, and leave feedback.</p>
        </section>
      </div>
    );
  }
}

export default Home;
