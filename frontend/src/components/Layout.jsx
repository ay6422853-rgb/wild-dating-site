import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("wild_token");

  const logout = () => {
    localStorage.removeItem("wild_token");
    localStorage.removeItem("wild_user");
    navigate("/");
  };

  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" className="brand">
          WILD<span>♥</span>
        </Link>

        <nav className="desktop-nav">
          {token ? (
            <>
              <NavLink to="/discover">Discover</NavLink>
              <NavLink to="/matches">Matches</NavLink>
              <NavLink to="/profile">Profile</NavLink>

              {(() => {
                try {
                  const user = JSON.parse(
                    localStorage.getItem("wild_user") || "null"
                  );

                  return user?.role === "ADMIN" ? (
                    <NavLink to="/admin">Admin</NavLink>
                  ) : null;
                } catch {
                  return null;
                }
              })()}

              <button className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="nav-cta">
                Join WILD
              </Link>
            </>
          )}
        </nav>
      </header>

      {children}

      {token && (
        <nav className="mobile-bottom-nav">
          <NavLink to="/discover">
            <span>⌂</span>
            <small>Discover</small>
          </NavLink>

          <NavLink to="/matches">
            <span>♥</span>
            <small>Matches</small>
          </NavLink>

          <NavLink to="/profile">
            <span>●</span>
            <small>Profile</small>
          </NavLink>
        </nav>
      )}
    </div>
  );
}