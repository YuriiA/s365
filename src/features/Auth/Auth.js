import clsx from "clsx";
import { useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useAuth } from "./Auth.context";

export function Auth() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    website: "",
    email: "",
    password: "",
    "retype-password": "",
    profileUrl: null,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    "retype-password": "",
  });

  const [apiError, setApiError] = useState("");

  const { login } = useAuth();

  const [profilePic, setProfilePic] = useState("");
  const [image, setImage] = useState("");

  const history = useHistory();
  const location = useLocation();

  const [confirm, setConfirm] = useState(false);

  let isLogin = false;
  if (location.pathname.includes("login")) {
    isLogin = true;
  }

  function handleChange(e) {
    setApiError("");
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setConfirm(true);

    const data = await fetch(
      `http://localhost:3001/${isLogin ? "login" : "signup"}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          website: values.website,
          profileUrl: profilePic,
        }),
      }
    ).then((res) => res.json());

    if (data.accessToken) {
      login(data);
      let to = "/";
      if (location.state?.from) {
        to = location.state.from.pathname + location.state.from.search;
      }
      setTimeout(() => {
        history.push(to);
      }, 1000);

      return null;
    } else {
      setApiError(data);
    }
  }

  function isFormValid() {
    let isValid = true;
    let newErrors = { ...errors };

    if (!values.firstName && !isLogin) {
      isValid = false;
      newErrors.firstName = "First name is required";
    }

    if (!values.lastName && !isLogin) {
      isValid = false;
      newErrors.lastName = "Last name is required";
    }

    if (!values.email) {
      isValid = false;
      newErrors.email = "Please enter your email";
    }

    if (!values.password) {
      isValid = false;
      newErrors.password = "Please choose a password";
    }

    if (!isLogin && values.password !== values["retype-password"]) {
      isValid = false;
      newErrors["retype-password"] = "Your passwords did not match!";
    }
    if (!image && !isLogin) {
      isValid = false;
      newErrors.profilePic = "Please add profile photo";
    }

    setErrors(newErrors);
    return isValid;
  }

  function uploadImage(e) {
    e.preventDefault();
    errors.profilePic = "";
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "dynamics");
    data.append("cloud_name", "dynamics");

    fetch("https://api.cloudinary.com/v1_1/dynamics/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePic(data.url);
      })
      .catch((err) => console.log(err));
  }
  return (
    <form className="form" onSubmit={handleSubmit} noValidate={true}>
      {confirm && (
        <h3 className="confirmation">
          {isLogin ? "Login successful " : "You successfully signed up"}
        </h3>
      )}

      {apiError && (
        <div className="alert alert-danger" role="alert">
          {apiError}
        </div>
      )}
      <div className="mb-3">
        <h3>
          {isLogin
            ? "Welcome back! Please login below"
            : "Get started with us today! Create your account by filling out the information below"}
        </h3>
        {!isLogin && (
          <>
            <label htmlFor="firstName" className="form-label">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className={clsx("form-control", {
                "is-invalid": errors.firstName,
              })}
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}

            <label htmlFor="lastName" className="form-label">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className={clsx("form-control", {
                "is-invalid": errors.lastName,
              })}
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}

            <label htmlFor="website" className="form-label">
              Add your website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="http://example.com"
              value={values.website}
              onChange={handleChange}
              className={clsx("form-control", { "is-invalid": errors.website })}
            />
            {errors.website && (
              <div className="invalid-feedback">{errors.website}</div>
            )}
          </>
        )}

        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          aria-describedby="emailHelp"
          value={values.email}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.email })}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}

        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.password })}
        />
        <div className="invalid-feedback">{errors.password}</div>
        {!isLogin && (
          <>
            <label htmlFor="retype-password" className="form-label">
              Retype Password
            </label>
            <input
              type="password"
              id="retype-password"
              name="retype-password"
              value={values["retype-password"]}
              onChange={handleChange}
              className={clsx("form-control", {
                "is-invalid": errors["retype-password"],
              })}
            />
            <div className="invalid-feedback">{errors["retype-password"]}</div>

            <label htmlFor="profilePic"> Add profile photo </label>
            <div className="upload">
              <input
                type="file"
                name="profilePic"
                onChange={(e) => setImage(e.target.files[0])}
                className={clsx("form-control", {
                  "is-invalid": errors.profilePic,
                })}
              />

              <button onClick={uploadImage}>Upload</button>
            </div>
            <div className="invalid-feedback">
              {errors.profilePic}
              {profilePic ? (
                <h4 style={{ color: "green" }}>Photo uploaded successfully</h4>
              ) : (
                <h4> Photo not uploaded </h4>
              )}
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Sign up"}
        </button>
        <span>
          {" "}
          {isLogin ? (
            <p>
              {" "}
              Don't have an account yet? Sign up{" "}
              <Link to="/signup"> here </Link>{" "}
            </p>
          ) : (
            <p>
              {" "}
              Already have an account? Sign in <Link to="/login">
                {" "}
                here{" "}
              </Link>{" "}
            </p>
          )}
        </span>
      </div>
    </form>
  );
}
