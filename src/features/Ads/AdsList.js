import { useEffect, useState } from "react";
import { AdsItem } from "./AdsItem";
import styles from "./AdsList.module.css";

export function AdsList() {
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

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, SetCurrentPage] = useState(1);
  const [adsPerPage] = useState(6);

  const api = `http://localhost:3001/ads?_limit=${adsPerPage}&_page=${currentPage}`;
  const searchApi = `http://localhost:3001/ads?q=${searchTerm}`;

  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, [api]);

  function handleSubmit(e) {
    e.preventDefault();

    fetch(searchApi)
      .then((res) => res.json())
      .then((data) => setAds(data));
    if (searchTerm === "") {
      fetch(api)
        .then((res) => res.json())
        .then((data) => setAds(data));
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="search"
          type="text"
          name="searchTerm"
          placeholder="type a country"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </form>

      <div className="adsContainer">
        {Array.isArray(ads) &&
          ads
            .filter((val) => {
              searchTerm &&
                val.country.toLowerCase().includes(searchTerm.toLowerCase());
              return val;
            })
            .map((val) => <AdsItem key={val.id} ad={val} />)}
      </div>

      <div className={styles.navButton}>
        <button onClick={(e) => SetCurrentPage(currentPage - 1)}> Prev</button>
        {currentPage}
        <button onClick={(e) => SetCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </>
  );
}
