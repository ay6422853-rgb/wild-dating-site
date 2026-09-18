import React from "react";
export default function ProfileCard({
  user,
  onLike,
  onPass,
  loading,
}) {
  if (!user) return null;

  const getAge = () => {
    if (!user.dob) return "";

    const birth = new Date(user.dob);
    const today = new Date();

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const month =
      today.getMonth() -
      birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const photo =
    user.photoUrl ||
    user.profilePhoto ||
    "";

  return (
    <article className="dating-card">

      <div className="dating-photo">

        {photo ? (
          <img
            src={photo}
            alt={user.name}
          />
        ) : (
          <div className="photo-placeholder">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div className="dating-overlay"></div>

        <div className="dating-info">

          <h2>
            {user.name}
            {getAge() && (
              <span>, {getAge()}</span>
            )}
          </h2>

          {user.city && (
            <p>📍 {user.city}</p>
          )}

          {user.bio && (
            <p className="dating-bio">
              {user.bio}
            </p>
          )}

          {user.lookingFor?.length > 0 && (
            <div className="mini-tags">
              {user.lookingFor.slice(0, 3).map(
                (item) => (
                  <span key={item}>
                    {item.replaceAll("_", " ")}
                  </span>
                )
              )}
            </div>
          )}

        </div>
      </div>

      <div className="dating-actions">

        <button
          className="action-pass"
          disabled={loading}
          onClick={onPass}
        >
          ×
        </button>

        <button
          className="action-like"
          disabled={loading}
          onClick={onLike}
        >
          ♥
        </button>

      </div>

    </article>
  );
}