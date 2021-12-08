import { useHistory } from "react-router";
import { useEffect, useState } from "react";

import { useAuth } from "../Auth/Auth.context";

import styles from "./AdsList.module.css";
import clsx from "clsx";

export function NewAd() {
  const [ads, setAds] = useState({
    title: "",
    year: "",
    price: "",
    area: "",
    rooms: "",
    country: "",
    phone: "",
    description: "",
    url: null,
  });

  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    year: "",
    price: "",
    area: "",
    rooms: "",
    country: "",
  });

  const [apiError, setApiError] = useState("");

  const { auth } = useAuth();
  const router = useHistory();

  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/ads", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, []);

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
  function isFormValid() {
    let isValid = true;
    let newErrors = { ...errors };

    if (!ads.title) {
      isValid = false;
      newErrors.title = "Title of the add is required";
    }

    if (!ads.year) {
      isValid = false;
      newErrors.year = "Built year is required";
    }

    if (!ads.price) {
      isValid = false;
      newErrors.price = "Please enter the price";
    }

    if (!ads.area) {
      isValid = false;
      newErrors.area = "Area is required";
    }

    if (!ads.rooms) {
      isValid = false;
      newErrors.rooms = "Number of rooms is required";
    }

    if (!ads.country) {
      isValid = false;
      newErrors.country = "country is required";
    }

    if (!ads.city) {
      isValid = false;
      newErrors.city = "City is required";
    }

    if (!ads.phone) {
      isValid = false;
      newErrors.phone = "phone is required";
    }

    if (!ads.description) {
      isValid = false;
      newErrors.description = "a short description is required";
    }

    if (!image) {
      isValid = false;
      newErrors.url = "Please upload photo";
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleChange(e) {
    setApiError("");
    setAds({ ...ads, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }

    setConfirm(true);

    const ad = await fetch(
      `http://localhost:3001/ads?userId=${auth?.user.id}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${auth?.accessToken}`,
        },
        body: JSON.stringify({
          userId: auth?.user.id,
          title: ads.title,
          year: ads.year,
          price: ads.price,
          area: ads.area,
          rooms: ads.rooms,
          phone: ads.phone,
          country: ads.country,
          city: ads.city,
          description: ads.description,
          url: url,
        }),
      }
    ).then((res) => res.json());

    setAds({ ...ads, ad });

    setTimeout(() => {
      router.push("/ads");
    }, 2000);
  }

  return (
    <>
      <h2>Please complete the below to list a new property</h2>

      {confirm && (
        <h3 className="confirmation">
          {" "}
          You successfully listed a new property
        </h3>
      )}

      <form
        id="addPropertyForm"
        className={styles.adPropertyForm}
        onSubmit={handleSubmit}
      >
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        <label htmlFor="title"> Title </label>
        <input
          type="text"
          name="title"
          value={ads.title}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.title })}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}

        <label htmlFor="year">Build year </label>
        <input
          type="number"
          name="year"
          value={ads.year}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.year })}
        />
        {errors.year && <div className="invalid-feedback">{errors.year}</div>}

        <label htmlFor="price">Price </label>
        <input
          type="number"
          name="price"
          value={ads.price}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.price })}
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}

        <label htmlFor="area"> Area (m2)</label>
        <input
          type="number"
          name="area"
          value={ads.area}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.area })}
        />
        {errors.area && <div className="invalid-feedback">{errors.area}</div>}

        <label htmlFor="rooms"> Rooms </label>
        <input
          type="number"
          name="rooms"
          value={ads.rooms}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.rooms })}
        />
        {errors.rooms && <div className="invalid-feedback">{errors.rooms}</div>}

        <label htmlFor="country"> Country </label>
        <input
          type="text"
          name="country"
          onChange={handleChange}
          value={ads.country}
          className={clsx("form-control", { "is-invalid": errors.country })}
        />
        {errors.country && (
          <div className="invalid-feedback">{errors.country}</div>
        )}

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={ads?.city}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.city })}
        />
        {errors.country && (
          <div className="invalid-feedback">{errors.city}</div>
        )}

        <label htmlFor="phone"> Contact number </label>
        <input
          type="text"
          name="phone"
          maxLength={9}
          pattern="[+-]?\d+(?:[.,]\d+)?"
          value={ads.phone}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.phone })}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

        <label htmlFor="description"> Please add a description </label>
        <textarea
          name="description"
          rows={8}
          cols={30}
          value={ads.description}
          onChange={handleChange}
          className={clsx("form-control", { "is-invalid": errors.description })}
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}

        <label htmlFor="photos"> Add photos </label>
        <input
          type="file"
          name="photos"
          onChange={(e) => setImage(e.target.files[0])}
          className={clsx("form-control", { "is-invalid": errors.url })}
        />
        <button onClick={uploadImage}>Upload</button>
        <div className="invalid-feedback">
          {errors.url}
          {url ? (
            <h4 style={{ color: "green" }}>Photo uploaded successfully</h4>
          ) : (
            <h4> Photo not uploaded </h4>
          )}
        </div>

        <button className="btn" onClick={() => router.push("/ads")}>
          Cancel
        </button>
        <button className="btn btn-primary" form="addPropertyForm">
          Save
        </button>
      </form>
    </>
  );
}
