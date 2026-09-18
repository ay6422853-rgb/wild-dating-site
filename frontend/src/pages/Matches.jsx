import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function getCurrentUserId() {
  try {
    const user = JSON.parse(
      localStorage.getItem("wild_user") || "null"
    );

    return user?._id || user?.id;
  } catch {
    return null;
  }
}

export default function Matches() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    api.get("/matches")
      .then((response) => {
        setMatches(response.data.matches || []);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <main className="center-page">
        <div className="spinner"></div>
        <p>Loading your matches...</p>
      </main>
    );
  }

  const currentUserId =
    getCurrentUserId();

  return (
    <main className="matches-page">

      <div className="section-heading">

        <div>
          <p className="eyebrow">
            YOUR CONNECTIONS
          </p>

          <h1>
            Matches
          </h1>

          <p>
            Mutual likes become conversations.
          </p>
        </div>

        <Link
          to="/discover"
          className="outline-btn"
        >
          Discover
        </Link>

      </div>

      {matches.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            ♥
          </div>

          <h2>
            No matches yet.
          </h2>

          <p>
            Keep discovering people who fit
            what you're looking for.
          </p>

          <Link
            to="/discover"
            className="primary"
          >
            Discover profiles
          </Link>

        </div>

      ) : (

        <div className="matches-grid">

          {matches.map((match) => {

            const other =
              match.users?.find(
                (user) =>
                  String(user._id) !==
                  String(currentUserId)
              );

            return (
              <Link
                key={match._id}
                to={`/chat/${match._id}`}
                className="match-card"
              >

                <div className="match-avatar">

                  {other?.photoUrl ? (
                    <img
                      src={other.photoUrl}
                      alt={other.name}
                    />
                  ) : (
                    other?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "?"
                  )}

                </div>

                <div className="match-info">

                  <h3>
                    {other?.name || "Connection"}
                  </h3>

                  <p>
                    Tap to start chatting →
                  </p>

                </div>

                <span className="match-arrow">
                  →
                </span>

              </Link>
            );
          })}

        </div>

      )}

    </main>
  );
}