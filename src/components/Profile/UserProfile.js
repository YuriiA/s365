import { useState, useEffect } from "react";
import { useAuth } from "../../features/Auth/Auth.context";
import { Link } from "react-router-dom";

import styles from "./UserProfile.module.css";

export function UserProfile() {
  const { auth, logout } = useAuth();
  const id = auth?.user.id;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${auth?.user.id}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            logout();
            throw new Error("Token expired!");
          }
          throw new Error(
            "Fetching data failed with status code: ",
            res.status
          );
        }

        return res.json();
      })

      .then((data) => setProfile(data));
  }, [auth?.user.id, auth?.accessToken, logout]);

  return (
    <div className={styles.container}>
      <img
        className={styles.profilePic}
        src={profile?.profileUrl}
        alt={profile?.firstName}
      />
      <div className={styles.profileInfo}>
        <h3>Account details</h3>
        <p>First name : {profile?.firstName}</p>
        <p>Last name : {profile?.lastName}</p>
        <p>Your email : {profile?.email}</p>
        <p>Your website: {profile?.website}</p>
        <Link to={`/users/${id}`}>Edit account</Link>
        <Link to={`/users/delete/${id}`}>Delete account</Link>
      </div>
    </div>
  );
}
