import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "wild_token",
        response.data.token
      );

      if (response.data.user) {
        localStorage.setItem(
          "wild_user",
          JSON.stringify(response.data.user)
        );
      }

      navigate(
        response.data.user?.role === "ADMIN"
          ? "/admin"
          : "/discover"
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">

      <div className="form-panel small">

        <p className="eyebrow">
          WELCOME BACK
        </p>

        <h1>
          Log in to WILD.
        </h1>

        <p className="panel-description">
          Your next conversation could be
          one login away.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              placeholder="Your password"
            />
          </label>

          <button
            className="primary full"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in →"}
          </button>

        </form>

        <p className="form-bottom">
          New here?
          {" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>

    </main>
  );
}