import { useEffect, useState } from "react";
import { useAuth } from "../../features/Auth/Auth.context";
import { useHistory } from "react-router";
import clsx from "clsx";

export function EditProfile() {
  const { auth } = useAuth();

  const [values, setValues] = useState(null);

  const router = useHistory();

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const [profileUrl, setProfileUrl] = useState(values?.profileUrl);
  const [image, setImage] = useState("");

  const id = auth?.user.id;

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${id}`, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setValues(data) );
      
  }, [id, auth?.accessToken]);

  
  

  function handleChange(e) {
    setApiError("");
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function isFormValid() {
    let isValid = true;
    let newErrors = { ...errors };

    if (!values.firstName) {
      isValid = false;
      newErrors.firstName = "First name is required";
    }

    if (!values.lastName) {
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

    if (values.password !== values.passwordRepeat) {
      isValid = false;
      newErrors.passwordRepeat = "Your passwords did not match!";
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
        setProfileUrl(data.url);
      })
      .catch((err) => console.log(err));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    const updated = { ...values, profileUrl };
    delete updated.id;
    delete updated.passwordRepeat;

    setConfirm(true);

    await fetch("http://localhost:3001/users/" + id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + auth.accessToken,
      },
      body: JSON.stringify(updated),
    });
    setTimeout(() => {
      router.push("/profile/" + id);
    }, 2000);
  }

  return (
    <div>
      <form className="form" onSubmit={handleSubmit} noValidate={true}>
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}
        {confirm && (
          <h3 className="confirmation">
            Your profile was modified successfully
          </h3>
        )}

        <div className="mb-3">
          <h3>Please update below details and save the changes</h3>

          <label htmlFor="firstName" className="form-label">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={values?.firstName}
            onChange={handleChange}
            className={clsx("form-control", { "is-invalid": errors.firstName })}
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
            value={values?.lastName}
            onChange={handleChange}
            className={clsx("form-control", { "is-invalid": errors.lastName })}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName}</div>
          )}

          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={values?.email}
            onChange={handleChange}
            className={clsx("form-control", { "is-invalid": errors.email })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}

          <label htmlFor="website" className="form-label">
            Add your website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="http://example.com"
            value={values?.website}
            onChange={handleChange}
            className={clsx("form-control", { "is-invalid": errors.website })}
          />
          {errors.website && (
            <div className="invalid-feedback">{errors.website}</div>
          )}

          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={values?.password}
            onChange={handleChange}
            className={clsx("form-control", { "is-invalid": errors.password })}
          />
          <div className="invalid-feedback">{errors.password}</div>

          <label htmlFor="passwordRepeat" className="form-label">
            Retype Password
          </label>
          <input
            type="password"
            id="passwordRepeat"
            name="passwordRepeat"
            value={values?.passwordRepeat}
            onChange={handleChange}
            className={clsx("form-control", {
              "is-invalid": errors.passwordRepeat,
            })}
          />

          <div className="invalid-feedback">{errors.passwordRepeat}</div>

          <label htmlFor="profileUrl"> Change profile photo </label>
          <div className="upload">
            <input
              type="file"
              name="profileUrl"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button onClick={uploadImage}>Upload</button>
          </div>
          <div>
            {profileUrl ? (
              <h4 style={{ color: "green" }}>Photo uploaded successfully</h4>
            ) : (
              <h4> Photo not uploaded </h4>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Update profile
          </button>
          <button onClick={(e) => router.push("/profile/" + id)}>
            Cancel edit
          </button>
        </div>
      </form>
    </div>
  );
}
