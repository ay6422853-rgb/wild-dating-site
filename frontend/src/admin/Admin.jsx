import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api";
import "./admin.css";

const identityLabels = {
  MAN: "Men",
  WOMAN: "Women",
  NON_BINARY: "Non-binary",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const statusLabels = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  DELETED: "Deleted",
};

export default function Admin() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");
  const [identity, setIdentity] = useState("ALL");
  const [verified, setVerified] = useState("ALL");
  const [sort, setSort] = useState("newest");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [error, setError] = useState("");


  /* =========================
     LOAD USERS
  ========================= */

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("q", search.trim());
      }

      if (status !== "ALL") {
        params.set("status", status);
      }

      if (identity !== "ALL") {
        params.set("identity", identity);
      }

      if (verified !== "ALL") {
        params.set("verified", verified);
      }

      params.set("sort", sort);


      const response = await api.get(
        `/admin/users?${params.toString()}`
      );

      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    status,
    identity,
    verified,
    sort,
  ]);


  /* =========================
     CHANGE STATUS
  ========================= */

  async function changeStatus(user, newStatus) {
    if (!user?._id || !newStatus) return;

    const confirmText =
      newStatus === "DELETED"
        ? `Are you sure you want to mark ${user.name} as deleted?`
        : `Change ${user.name}'s status to ${statusLabels[newStatus]}?`;

    if (!window.confirm(confirmText)) {
      return;
    }


    try {
      setUpdating(user._id);

      await api.patch(
        `/admin/users/${user._id}/status`,
        {
          status: newStatus,
        }
      );


      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      setSelectedUser(null);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to update status."
      );
    } finally {
      setUpdating("");
    }
  }


  /* =========================
     RESET FILTERS
  ========================= */

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setIdentity("ALL");
    setVerified("ALL");
    setSort("newest");
  }


  /* =========================
     COUNTS
  ========================= */

  const counts = useMemo(() => {
    return {
      all: users.length,

      active: users.filter(
        (user) => user.status === "ACTIVE"
      ).length,

      suspended: users.filter(
        (user) => user.status === "SUSPENDED"
      ).length,

      deleted: users.filter(
        (user) => user.status === "DELETED"
      ).length,

      men: users.filter(
        (user) => user.identity === "MAN"
      ).length,

      women: users.filter(
        (user) => user.identity === "WOMAN"
      ).length,

      pending: users.filter(
        (user) => !user.emailVerified
      ).length,
    };
  }, [users]);


  return (
    <main className="admin-page">

      {/* HEADER */}

      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">
            WILD ADMIN
          </span>

          <h1>User Management</h1>

          <p>
            Manage users, verification and account
            status.
          </p>
        </div>
      </section>


      {/* STATS */}

      <section className="admin-stats">

        <div className="admin-stat">
          <span>Total</span>
          <strong>{counts.all}</strong>
        </div>

        <div className="admin-stat">
          <span>Active</span>
          <strong>{counts.active}</strong>
        </div>

        <div className="admin-stat">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </div>

        <div className="admin-stat">
          <span>Men</span>
          <strong>{counts.men}</strong>
        </div>

        <div className="admin-stat">
          <span>Women</span>
          <strong>{counts.women}</strong>
        </div>

        <div className="admin-stat">
          <span>Suspended</span>
          <strong>{counts.suspended}</strong>
        </div>

      </section>


      {/* FILTERS */}

      <section className="admin-filters">

        <div className="admin-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>


        <div className="filter-row">

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>

            <option value="DELETED">
              Deleted
            </option>
          </select>


          <select
            value={identity}
            onChange={(e) =>
              setIdentity(e.target.value)
            }
          >
            <option value="ALL">
              All Genders
            </option>

            <option value="MAN">
              Men
            </option>

            <option value="WOMAN">
              Women
            </option>

            <option value="NON_BINARY">
              Non-binary
            </option>

            <option value="OTHER">
              Other
            </option>

            <option value="PREFER_NOT_TO_SAY">
              Prefer not to say
            </option>
          </select>


          <select
            value={verified}
            onChange={(e) =>
              setVerified(e.target.value)
            }
          >
            <option value="ALL">
              All Verification
            </option>

            <option value="VERIFIED">
              Verified
            </option>

            <option value="UNVERIFIED">
              Pending / Unverified
            </option>
          </select>


          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="name_asc">
              Name A-Z
            </option>

            <option value="name_desc">
              Name Z-A
            </option>

            <option value="active_recent">
              Recently Active
            </option>

            <option value="active_old">
              Least Recently Active
            </option>
          </select>


          <button
            type="button"
            className="reset-btn"
            onClick={resetFilters}
          >
            Reset
          </button>

        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* USERS */}

      <section className="users-section">

        <div className="users-section-head">

          <div>
            <span className="admin-eyebrow">
              USERS
            </span>

            <h2>
              {loading
                ? "Loading..."
                : `${users.length} Users`}
            </h2>
          </div>

        </div>


        {loading ? (
          <div className="admin-loading">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <div className="empty-icon">
              ♡
            </div>

            <h3>
              No users found
            </h3>

            <p>
              Try changing your filters or search.
            </p>
          </div>
        ) : (

          <div className="users-table-wrap">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Identity</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    {/* USER */}

                    <td>

                      <div className="user-cell">

                        <div className="user-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {user.email}
                          </span>

                          {user.phone && (
                            <small>
                              {user.phone}
                            </small>
                          )}
                        </div>

                      </div>

                    </td>


                    {/* IDENTITY */}

                    <td>
                      <span className="identity-text">
                        {identityLabels[
                          user.identity
                        ] ||
                          user.identity ||
                          "—"}
                      </span>
                    </td>


                    {/* VERIFICATION */}

                    <td>

                      {user.emailVerified ? (
                        <span className="verification verified">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="verification pending">
                          Pending
                        </span>
                      )}

                    </td>


                    {/* JOINED */}

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>


                    {/* LAST ACTIVE */}

                    <td>
                      {user.lastActiveAt
                        ? new Date(
                            user.lastActiveAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${user.status?.toLowerCase()}`}
                      >
                        {statusLabels[
                          user.status
                        ] ||
                          user.status}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        className="status-btn"
                        onClick={() =>
                          setSelectedUser(user)
                        }
                        disabled={
                          updating === user._id
                        }
                      >
                        {updating === user._id
                          ? "Updating..."
                          : "Change Status"}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* STATUS MODAL */}

      {selectedUser && (

        <div
          className="status-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="status-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              ×
            </button>


            <div className="modal-avatar">
              {selectedUser.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>


            <span className="admin-eyebrow">
              ACCOUNT STATUS
            </span>

            <h2>
              {selectedUser.name}
            </h2>

            <p>
              Choose a new status for this
              account.
            </p>


            <div className="status-options">

              <button
                className={
                  selectedUser.status ===
                  "ACTIVE"
                    ? "status-option selected"
                    : "status-option"
                }
                onClick={() =>
                  changeStatus(
                    selectedUser,
                    "ACTIVE"
                  )
                }
              >
                <span className="option-dot active-dot" />

                <div>
                  <strong>Active</strong>
                  <small>
                    User can use WILD normally.
                  </small>
                </div>

                {selectedUser.status ===
                  "ACTIVE" && (
                  <b>✓</b>
                )}
              </button>


              <button
                className={
                  selectedUser.status ===
                  "SUSPENDED"
                    ? "status-option selected"
                    : "status-option"
                }
                onClick={() =>
                  changeStatus(
                    selectedUser,
                    "SUSPENDED"
                  )
                }
              >
                <span className="option-dot suspended-dot" />

                <div>
                  <strong>
                    Suspended
                  </strong>
                  <small>
                    Temporarily restrict this
                    account.
                  </small>
                </div>

                {selectedUser.status ===
                  "SUSPENDED" && (
                  <b>✓</b>
                )}
              </button>


              <button
                className={
                  selectedUser.status ===
                  "DELETED"
                    ? "status-option selected danger"
                    : "status-option danger"
                }
                onClick={() =>
                  changeStatus(
                    selectedUser,
                    "DELETED"
                  )
                }
              >
                <span className="option-dot deleted-dot" />

                <div>
                  <strong>
                    Deleted
                  </strong>
                  <small>
                    Mark this account as deleted.
                  </small>
                </div>

                {selectedUser.status ===
                  "DELETED" && (
                  <b>✓</b>
                )}
              </button>

            </div>


            <button
              className="modal-cancel"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </main>
  );
}