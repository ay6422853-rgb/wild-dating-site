import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css";

/* ================================
   OPTIONS
================================ */

const identityOptions = [
  { label: "Man", value: "MAN" },
  { label: "Woman", value: "WOMAN" },
  { label: "Non-binary", value: "NON_BINARY" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

const interestOptions = [
  { label: "Men", value: "MEN" },
  { label: "Women", value: "WOMEN" },
  { label: "Everyone", value: "EVERYONE" },
  { label: "Non-binary", value: "NON_BINARY" },
  { label: "Other", value: "OTHER" },
];

const lookingOptions = [
  { label: "Boyfriend", value: "BOYFRIEND" },
  { label: "Girlfriend", value: "GIRLFRIEND" },
  { label: "Sugar Daddy", value: "SUGAR_DADDY" },
  { label: "Sugar Mommy", value: "SUGAR_MOMMY" },
  { label: "Sugar Baby", value: "SUGAR_BABY" },
  { label: "Long-Term Relationship", value: "LONG_TERM" },
  { label: "Short-Term Dating", value: "SHORT_TERM" },
  { label: "Casual Dating", value: "CASUAL" },
  { label: "Friendship", value: "FRIENDSHIP" },
  { label: "Marriage", value: "MARRIAGE" },
  { label: "Companionship", value: "COMPANIONSHIP" },
  { label: "Open to Explore", value: "OPEN_TO_EXPLORE" },
  { label: "Not Sure Yet", value: "NOT_SURE" },
];

const intentOptions = [
  {
    label: "Serious Relationship",
    value: "SERIOUS_RELATIONSHIP",
  },
  {
    label: "Long-Term Partner",
    value: "LONG_TERM_PARTNER",
  },
  {
    label: "Someone to Date",
    value: "SOMEONE_TO_DATE",
  },
  {
    label: "Casual Connection",
    value: "CASUAL_CONNECTION",
  },
  {
    label: "Companionship",
    value: "COMPANIONSHIP",
  },
  {
    label: "Marriage",
    value: "MARRIAGE",
  },
  {
    label: "Just Exploring",
    value: "JUST_EXPLORING",
  },
];

/* ================================
   MULTI SELECT
================================ */

function MultiSelect({
  title,
  options,
  value,
  onChange,
}) {
  return (
    <div className="choice-section">
      <label>{title}</label>

      <div className="choice-grid">
        {options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <button
              type="button"
              key={option.value}
              className={`choice ${
                selected ? "selected" : ""
              }`}
              onClick={() => {
                if (selected) {
                  onChange(
                    value.filter(
                      (item) => item !== option.value
                    )
                  );
                } else {
                  onChange([
                    ...value,
                    option.value,
                  ]);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================
   SINGLE SELECT
================================ */

function SingleSelect({
  title,
  options,
  value,
  onChange,
}) {
  return (
    <div className="choice-section">
      <label>{title}</label>

      <div className="choice-grid">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              type="button"
              key={option.value}
              className={`choice ${
                selected ? "selected" : ""
              }`}
              onClick={() =>
                onChange(option.value)
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================
   REGISTER
================================ */

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",

    // Backend expects String
    identity: "",

    // Backend expects arrays
    interestedIn: [],
    lookingFor: [],
    datingIntent: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================================
     INPUT CHANGE
  ================================ */

  function updateField(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* ================================
     SUBMIT
  ================================ */

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    /* ---------- FRONTEND VALIDATION ---------- */

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please create a password.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!form.dob) {
      setError(
        "Please enter your date of birth."
      );
      return;
    }

    if (!form.identity) {
      setError("Please select what you are.");
      return;
    }

    if (!form.interestedIn.length) {
      setError(
        "Please select who you are interested in."
      );
      return;
    }

    if (!form.lookingFor.length) {
      setError(
        "Please select what you are looking for."
      );
      return;
    }

    if (!form.datingIntent.length) {
      setError(
        "Please select your dating intent."
      );
      return;
    }

    /* ---------- AGE CHECK ---------- */

    const birthDate = new Date(form.dob);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setError(
        "You must be at least 18 years old to join WILD."
      );
      return;
    }

    /* ---------- API REQUEST ---------- */

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        dob: form.dob,
        phone: form.phone.trim(),

        identity: form.identity,

        interestedIn: form.interestedIn,

        lookingFor: form.lookingFor,

        datingIntent: form.datingIntent,
      };

      console.log(
        "WILD registration payload:",
        payload
      );

      const res = await api.post(
        "/auth/register",
        payload
      );

      /* ---------- SAVE TOKEN ---------- */

      if (res.data?.token) {
        localStorage.setItem(
          "wild_token",
          res.data.token
        );
      }

      /* ---------- REDIRECT ---------- */

      navigate("/profile");

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================================
     UI
  ================================ */

  return (
    <main className="form-page">

      <div className="panel wide">

        {/* HEADER */}

        <div className="form-header">

          <span className="eyebrow">
            JOIN WILD
          </span>

          <h1>
            Create your WILD profile.
          </h1>

          <p>
            Be yourself. Meet people who are
            looking for the same kind of
            connection.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* BASIC INFORMATION */}

          <div className="grid2">

            {/* NAME */}

            <div className="field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
              />

            </div>

            {/* EMAIL */}

            <div className="field">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}

            <div className="field">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={updateField}
                autoComplete="new-password"
              />

            </div>

            {/* DOB */}

            <div className="field">

              <label>
                Date of Birth
              </label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={updateField}
              />

            </div>

            {/* PHONE */}

            <div className="field">

              <label>
                Mobile Number{" "}
                <span>
                  (Optional)
                </span>
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={updateField}
                autoComplete="tel"
              />

            </div>

          </div>

          {/* IDENTITY */}

          <SingleSelect
            title="What are you?"
            options={identityOptions}
            value={form.identity}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                identity: value,
              }))
            }
          />

          {/* INTEREST */}

          <MultiSelect
            title="Who are you interested in?"
            options={interestOptions}
            value={form.interestedIn}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                interestedIn: value,
              }))
            }
          />

          {/* LOOKING FOR */}

          <MultiSelect
            title="What are you looking for?"
            options={lookingOptions}
            value={form.lookingFor}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                lookingFor: value,
              }))
            }
          />

          {/* DATING INTENT */}

          <MultiSelect
            title="Dating Intent"
            options={intentOptions}
            value={form.datingIntent}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                datingIntent: value,
              }))
            }
          />

          {/* AGE NOTICE */}

          <div className="age-notice">

            <strong>
              18+ only.
            </strong>

            <span>
              WILD is an adults-only dating
              platform. By creating an account,
              you confirm that you are at least
              18 years old.
            </span>

          </div>

          {/* SUBMIT */}

          <button
            className="primary submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create My WILD Profile"}
          </button>

        </form>

        {/* LOGIN LINK */}

        <div className="form-footer">

          Already have an account?

          <Link to="/login">
            {" "}Log in
          </Link>

        </div>

      </div>

    </main>
  );
}