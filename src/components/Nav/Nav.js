import { Link, NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../../features/Auth/Auth.context";
import styles from "./Nav.module.css";

export function Nav() {
  const { auth, logout } = useAuth();

  const history = useHistory();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    history.push("/login");
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src="/images/logo.png" alt="logo" />
        <p> Summer365 </p>
      </Link>
      <ul className={styles["main-menu"]}>
        <li>
          <NavLink exact to="/" activeClassName={styles.active}>
            Home
          </NavLink>
        </li>

        {!auth?.user && (
          <>
            <li className={styles["push-right"]}>
              <NavLink to="/login" activeClassName={styles.active}>
                Login
              </NavLink>
            </li>
          </>
        )}

        {auth?.user && (
          <>
            <li className={styles["push-right"]}>
              <NavLink to="/newad" activeClassName={styles.active}>
                Add new item
              </NavLink>
            </li>
            <li className={styles["push-right"]}>
              Welcome,{" "}
              <NavLink to="/profile" activeClassName={styles.active}>
                {auth.user.firstName}
              </NavLink>
            </li>
            <li>
              <a href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
