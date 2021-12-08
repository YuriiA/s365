import { NavLink } from "react-router-dom";
import Videobg from "../../components/video/videobg.mp4";
import { GetWeather } from "../../components/weather/GetWeather";

export function Home() {
  return (
    <div className="home">
      <video className="bgVideo" autoPlay loop>
        <source src={Videobg} type="video/mp4" />
      </video>
      <h1> Checkout where it's still warm and sunny </h1>
      <div className="cityWeather">
        <GetWeather city={"Santa Cruz de Tenerife"} />
        <GetWeather city={"Monaco"} />
        <GetWeather city={"Menton"} />
        <GetWeather city={"Sanremo"} />
        <GetWeather city={"Olbia"} />
        <GetWeather city={"Valleta"} />
        <GetWeather city={"Chania"} />
        <GetWeather city={"Larnaca"} />
        <GetWeather city={"Dubai"} />
      </div>

      <div className="homeNav">
        <h1> and find your 365-Summer-House: </h1>
        <NavLink className="allAdsList" to="/ads">
          {" "}
          Properties for sale
        </NavLink>

        <h1>or </h1>

        <NavLink className="allAdsList" to="/searchresult">
          {" "}
          Search by country
        </NavLink>
      </div>
    </div>
  );
}
