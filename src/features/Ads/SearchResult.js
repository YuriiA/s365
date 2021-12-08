import { useEffect, useState } from "react";
import { AdsItem } from "./AdsItem";

export function SearchResult() {
  const [ads, setAds] = useState({
    title: "",
    year: "",
    price: "",
    area: "",
    rooms: "",
    country: "",
    city:"",
    phone: "",
    description: "",
    url: null,
  });

  useEffect(() => {
    fetch(`http://localhost:3001/ads`, {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="type a country"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <div className="adsContainer">
        {searchTerm &&
          ads
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.country.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            .map((val) => <AdsItem key={val.id} ad={val} />)}
      </div>
    </>
  );
}
