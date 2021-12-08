import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Auth/Auth.context";
import styles from "./AdsList.module.css";
import { useHistory } from "react-router";
import { Modal } from "../../components/Modal/Modal";

export function AdsDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const router = useHistory();

  const [confirm, setConfirm] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:3001/ads/${id}`, {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setDetails(data));
  }, [id]);
  if (!details) {
    return <h2>Loading...</h2>;
  }

  function getModalFooter() {
    return (
      <>
        <button className="btn" onClick={() => setShowModal(false)}>
          No
        </button>
        <button className="btn btn-primary" onClick={handleDelete}>
          Yes
        </button>
      </>
    );
  }

  async function handleDelete() {
    // const confirm= window.confirm("Do you really want to delete this ad?")
    //   if (confirm === true){

    setConfirm(true);

    await fetch(`http://localhost:3001/ads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    });
    setShowModal(false);
    setTimeout(() => {
      router.push("/ads");
    }, 1000);
  }

  // }

  return (
    <>
      <h2>Find below more details for : {details?.title}</h2>

      {confirm && <h3 className="confirmation">Ad is now deleted</h3>}

      <div className={styles.adsDetails}>
        <img
          className={styles.detailedPic}
          src={details.url}
          alt={details.title}
        />
        <div>
          <h4>Property description : </h4> {details?.description}
          <h4>
            Location: {details?.country}, {details?.city}
          </h4>
          <h4>Area: {details?.area} m2</h4>
          <h4>Number of rooms: {details?.rooms}</h4>
          <h4>Construction year: {details?.year}</h4>
          <h4>Price: {details?.price} &euro;</h4>
          <h4> Contact: {details?.phone} </h4>
          {auth && auth.user.id === details.userId && (
            <Link to={`/ads/edit/${id}`}>Edit this ad</Link>
          )}
          {auth && auth.user.id === details.userId && (
            <button onClick={() => setShowModal(true)}>Delete</button>
          )}
        </div>
      </div>

      <Modal
        title="Do you really want to delete this ad?"
        footer={getModalFooter()}
        show={showModal}
        onClose={() => setShowModal(false)}
      ></Modal>
    </>
  );
}
