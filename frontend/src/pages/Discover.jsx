import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProfileCard from "../components/ProfileCard";

export default function Discover() {

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/discover");

      setUsers(response.data.users || []);
      setIndex(0);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const interact = async (type) => {

    const user = users[index];

    if (!user || actionLoading) return;

    try {

      setActionLoading(true);

      const response = await api.post(
        "/interactions",
        {
          targetId: user._id,
          type,
        }
      );

      if (response.data.matched) {
        setMatch(user);
      }

      setIndex((old) => old + 1);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not process this action."
      );

    } finally {
      setActionLoading(false);
    }
  };

  const currentUser = users[index];

  if (loading) {
    return (
      <main className="center-page">
        <div className="spinner"></div>
        <p>Finding your next connection...</p>
      </main>
    );
  }

  return (
    <main className="discover-page">

      <div className="section-heading">

        <div>
          <p className="eyebrow">
            DISCOVER
          </p>

          <h1>
            Find your WILD.
          </h1>

          <p>
            Profiles based on your preferences.
          </p>
        </div>

        <Link
          to="/profile"
          className="outline-btn"
        >
          Edit profile
        </Link>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {match && (
        <div className="match-modal">

          <div className="match-content">

            <span className="match-heart">
              ♥
            </span>

            <p className="eyebrow">
              IT'S A MATCH
            </p>

            <h2>
              You and {match.name}
              <br />
              liked each other.
            </h2>

            <div className="match-buttons">
              <Link
                to="/matches"
                className="primary"
              >
                See your matches
              </Link>

              <button
                className="secondary"
                onClick={() => setMatch(null)}
              >
                Keep discovering
              </button>
            </div>

          </div>

        </div>
      )}

      {currentUser ? (
        <div className="discover-stage">

          <ProfileCard
            user={currentUser}
            loading={actionLoading}
            onPass={() =>
              interact("PASS")
            }
            onLike={() =>
              interact("LIKE")
            }
          />

          <p className="swipe-hint">
            Pass <b>×</b>
            <span>or</span>
            Like <b>♥</b>
          </p>

        </div>
      ) : (
        <div className="empty-state">

          <div className="empty-icon">
            W
          </div>

          <h2>
            You're all caught up.
          </h2>

          <p>
            There are no more profiles to
            show right now.
          </p>

          <button
            className="primary"
            onClick={load}
          >
            Refresh profiles
          </button>

        </div>
      )}

    </main>
  );
}