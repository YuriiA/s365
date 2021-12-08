import { Link } from "react-router-dom";

import styles from "./AdsList.module.css";

export function AdsItem({ ad }) {
  return (
    <Link className={styles.linkDecoration} to={`/ads/${ad.id}`}>
      <div className={styles.container}>
        <img className={styles.adPic} src={ad?.url} alt={ad?.title}></img>

        <div className={styles.description}>
          <p>{ad.title}</p>
          <p>Price: {ad.price} &euro; </p>
          <p>Location: {ad.country}, {ad.city} </p>
        </div>
      </div>
    </Link>
  );
}
