import React from "react";
import { useEffect, useState } from "react";
import api from "../api";

export default function Profile() {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    api.get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  const update = (key, value) => {

    setUser((old) => ({
      ...old,
      [key]: value,
    }));

  };

  const save = async () => {

    try {

      setSaving(true);
      setSaved(false);

      const response =
        await api.put(
          "/profile",
          user
        );

      setUser(
        response.data.user ||
        user
      );

      localStorage.setItem(
        "wild_user",
        JSON.stringify(
          response.data.user ||
          user
        )
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not save profile."
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="center-page">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="center-page">
        <div className="error">
          {error || "Profile not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-header">

        <div className="profile-large-avatar">

          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
            />
          ) : (
            user.name
              ?.charAt(0)
              ?.toUpperCase()
          )}

        </div>

        <div>

          <p className="eyebrow">
            MY PROFILE
          </p>

          <h1>
            {user.name}
          </h1>

          <p>
            {user.email}
          </p>

        </div>

      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <section className="profile-panel">

        <h2>
          About you
        </h2>

        <div className="grid2">

          <label className="full-width">
            Bio
            <textarea
              value={user.bio || ""}
              onChange={(e) =>
                update(
                  "bio",
                  e.target.value
                )
              }
              placeholder="Tell people about yourself..."
            />
          </label>

          <label>
            City
            <input
              value={user.city || ""}
              onChange={(e) =>
                update(
                  "city",
                  e.target.value
                )
              }
              placeholder="Your city"
            />
          </label>

          <label>
            Profile Photo URL
            <input
              value={user.photoUrl || ""}
              onChange={(e) =>
                update(
                  "photoUrl",
                  e.target.value
                )
              }
              placeholder="https://..."
            />
          </label>

          <label>
            Maximum Distance
            <input
              type="number"
              value={
                user.maxDistanceKm ?? 50
              }
              onChange={(e) =>
                update(
                  "maxDistanceKm",
                  Number(e.target.value)
                )
              }
            />
          </label>

        </div>

      </section>

      <section className="profile-panel">

        <h2>
          Your preferences
        </h2>

        <div className="profile-details">

          <div>
            <span>What are you?</span>
            <strong>
              {user.identity || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Interested in</span>
            <strong>
              {(user.interestedIn || [])
                .join(", ") || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Looking for</span>
            <strong>
              {(user.lookingFor || [])
                .join(", ") || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Dating intent</span>
            <strong>
              {(user.datingIntent || [])
                .join(", ") || "Not specified"}
            </strong>
          </div>

        </div>

      </section>

      <button
        className="primary save-profile"
        onClick={save}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : saved
          ? "Profile saved ✓"
          : "Save profile →"}
      </button>

    </main>
  );
}