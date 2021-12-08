import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth/Auth.context";
import { useHistory } from "react-router";
import clsx from "clsx";

import styles from "./AdsList.module.css";

export function EditAd() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const { auth } = useAuth();
  const router = useHistory();

  const [errors, setErrors] = useState({
    title: "",
    year: "",
    price: "",
    area: "",
    rooms: "",
    country: "",
    city: "",
  });

  const [apiError, setApiError] = useState("");

  const [url, setUrl] = useState(data?.url);
  const [image, setImage] = useState("");

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/ads/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [id]);

  function isFormValid() {
    let isValid = true;
    let newErrors = { ...errors };

    if (!data.title) {
      isValid = false;
      newErrors.title = "Title of the add is required";
    }

    if (!data.year) {
      isValid = false;
      newErrors.year = "Built year is required";
    }

    if (!data.price) {
      isValid = false;
      newErrors.price = "Please enter the price";
    }

    if (!data.area) {
      isValid = false;
      newErrors.area = "Area is required";
    }

    if (!data.rooms) {
      isValid = false;
      newErrors.rooms = "Number of rooms is required";
    }
    if (!data.country) {
      isValid = false;
      newErrors.country = "Country is required";
    }
    if (!data.city) {
      isValid = false;
      newErrors.city = "City is required";
    }

    if (!data.phone) {
      isValid = false;
      newErrors.phone = "Phone number is required";
    }

    if (!data.description) {
      isValid = false;
      newErrors.description = "a short description is required";
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    const updated = { ...data, url };
    delete updated.id;

    setConfirm(true);

    await fetch("http://localhost:3001/ads/" + id, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + auth.accessToken,
      },
      body: JSON.stringify(updated),
    });
    setTimeout(() => {
      router.push("/ads/" + id);
    }, 1000);
  }

  function uploadImage(e) {
    e.preventDefault();
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
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      {confirm && (
        <h3 className="confirmation"> You successfully edited this ad</h3>
      )}

      <h2>Edit: {data?.title}</h2>
      <form className={styles.adPropertyForm} onSubmit={handleSubmit}>
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={data?.title}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.title })}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}

        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          name="country"
          value={data?.country}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.country })}
        />
        {errors.country && (
          <div className="invalid-feedback">{errors.country}</div>
        )}

        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={data?.city}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.city })}
        />
        {errors.country && (
          <div className="invalid-feedback">{errors.city}</div>
        )}

        <label htmlFor="area">Area (m2):</label>
        <input
          type="number"
          id="area"
          name="area"
          value={data?.area}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.area })}
        />
        {errors.area && <div className="invalid-feedback">{errors.area}</div>}

        <label htmlFor="rooms">Number of rooms:</label>
        <input
          type="number"
          id="rooms"
          name="rooms"
          value={data?.rooms}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.rooms })}
        />
        {errors.rooms && <div className="invalid-feedback">{errors.rooms}</div>}

        <label htmlFor="year">Construction year:</label>
        <input
          type="number"
          id="year"
          name="year"
          value={data?.year}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.year })}
        />
        {errors.year && <div className="invalid-feedback">{errors.year}</div>}

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={data?.price}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.price })}
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}

        <label htmlFor="phone">Contact number:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          maxLength={9}
          pattern="[+-]?\d+(?:[.,]\d+)?"
          value={data?.phone}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.phone })}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

        <label htmlFor="description"> Please add a description </label>
        <textarea
          name="description"
          rows={8}
          cols={30}
          value={data?.description}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.description })}
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}

        <label htmlFor="photos"> Change photos </label>
        <input
          type="file"
          name="photos"
          onChange={(e) => setImage(e.target.files[0])}
          className={clsx("form-control", { "is-invalid": errors.url })}
        />
        <button onClick={uploadImage}>Upload</button>

        {url ? (
          <h3 style={{ color: "green" }}>New photo uploaded successfully</h3>
        ) : (
          <h3> Photo not updated </h3>
        )}

        <div className={styles.editButtons}>
          <button>Save changes</button>
          <button onClick={(e) => router.push("/ads/" + id)}>
            Cancel update
          </button>
        </div>
      </form>
    </div>
  );
}
