import { useAuth } from "../../features/Auth/Auth.context";
import { useHistory } from "react-router";
import { useState } from "react";

import styles from "./UserProfile.module.css";

export function UserDelete() {
  const { auth, logout } = useAuth();
  const id = auth?.user.id;
  const router = useHistory();
  const [confirm, setConfirm] = useState(false);

  function handleLogout() {
    logout();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  async function handleDelete() {
    setConfirm(true);

    await fetch("http://localhost:3001/users/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    }).then(handleLogout());
  }
  return (
    <div className={styles.deleteConfirmation}>
      {confirm && (
        <h3 className="confirmation">
          {" "}
          Your profile was successfully deleted, redirecting...
        </h3>
      )}
      <h1>Do you really want to delete your account?</h1>

      <div className={styles.confirmationButtons}>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={(e) => router.push("/profile/" + id)}>
          No, go back to profile
        </button>
      </div>
    </div>
  );
}
