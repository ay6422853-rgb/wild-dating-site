import React from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const token = localStorage.getItem("wild_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}