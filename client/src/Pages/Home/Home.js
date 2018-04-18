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
          <p className="text-content content--centered">Serialized is a place for you to find serial fiction or post your own. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>
      </div>
    );
  }
}

export default Home;
