import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-page">

      <section className="hero-section">

        <div className="hero-content">

          <p className="eyebrow">
            18+ • REAL CONNECTIONS • WILD ENERGY
          </p>

          <h1>
            Meet.
            <br />
            <em>Match.</em>
            <br />
            Go WILD.
          </h1>

          <p className="hero-description">
            A bold dating space for adults looking
            for meaningful connections, exciting dates,
            friendship and more.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary"
            >
              Create your profile
              <span>→</span>
            </Link>

            <Link
              to="/login"
              className="secondary"
            >
              I already have an account
            </Link>

          </div>

          <div className="hero-points">
            <span>✓ 18+ only</span>
            <span>✓ Privacy focused</span>
            <span>✓ Report & block</span>
          </div>

        </div>

        <div className="hero-visual">

          <div className="glow"></div>

          <div className="floating-label">
            CONNECTION
          </div>

          <div className="hero-profile-card">

            <div className="hero-avatar">
              W
            </div>

            <div>
              <h3>
                Your story
                <br />
                starts here.
              </h3>

              <p>
                Discover people who match
                your interests and intentions.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="features-section">

        <div>
          <span>01</span>
          <h3>Be yourself.</h3>
          <p>
            Tell people who you are and
            what you actually want.
          </p>
        </div>

        <div>
          <span>02</span>
          <h3>Discover.</h3>
          <p>
            Explore profiles based on your
            interests and dating intent.
          </p>
        </div>

        <div>
          <span>03</span>
          <h3>Connect.</h3>
          <p>
            Like each other, match and
            start the conversation.
          </p>
        </div>

      </section>

    </main>
  );
}