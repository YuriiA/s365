import { useState, useEffect } from "react";

export function GetWeather({ city }) {
  const [weather, setWeather] = useState("");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5ce00d5af23318547cbe6eff82761659`
    )
      .then((res) => res.json())
      .then((res) => setWeather(res));
  }, [city]);

  const temp = Math.round(weather.main?.temp - 273.15) + "°C";

  return (
    <div>
      <h5>
        {weather.name}, {weather.sys?.country}
      </h5>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather?.[0].icon}@2x.png`}
        alt={weather.weather?.[0].description}
      />
      <p>{temp}</p>
      <p>{weather.weather?.[0].description}</p>
    </div>
  );
}
