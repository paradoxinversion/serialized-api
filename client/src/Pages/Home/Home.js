import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
class Home extends React.Component {
  render() {
    return (
      <main className="home">
        <header>
          <div className="hero-image" />
        </header>
        <section className="container container--centered">
          <p className="lead content--centered">
            Serialized is a place for you to find serial fiction or post your
            own. At the moment, it&apos;s a work in progress, but feel free to
            sign up, play around, and leave feedback. If you&apos;re having
            trouble accessing the site, make sure you are browsing via http and{" "}
            <strong>not</strong> https.{" "}
            <a href="http://serialized.herokuapp.com">
              If you&apos;re not sure, click here to be redirected.
            </a>
          </p>
          <Link className="button" to="/auth/register">
            Sign up Now
          </Link>
        </section>
      </main>
    );
  }
}

export default Home;
