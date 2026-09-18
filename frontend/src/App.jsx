import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Protected from "./components/Protected";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

import Admin from "./admin/Admin";

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User */}
        <Route
          path="/discover"
          element={
            <Protected>
              <Discover />
            </Protected>
          }
        />

        <Route
          path="/matches"
          element={
            <Protected>
              <Matches />
            </Protected>
          }
        />

        <Route
          path="/chat/:matchId"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />

      </Routes>
    </Layout>
  );
}