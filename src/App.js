import React, { useEffect, useState } from "react";

const dateBuilder = (d) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = d.getDate();
  const day = days[d.getDay()];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  var dateString = day + ", " + date + " " + month + " " + year;
  return dateString;
};

const base_url = process.env.REACT_APP_BASE_URL;
const api_key = process.env.REACT_APP_API_KEY;

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [lat, setlat] = useState(0);
  const [lon, setlon] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setlat(position.coords.latitude);
          setlon(position.coords.longitude);
          fetch(
            `${base_url}weather?&units=metric&lat=${lat}&lon=${lon}&appid=${api_key}`
          )
            .then((res) => res.json())
            .then((result) => {
              setWeather(result);
            });
        },
        (error) => {
          console.error(error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      alert("Geolocation API is not supported by your browser.");
    }
  }, [lat, lon]);

  const search = (event) => {
    if (event.key === "Enter") {
      fetch(
        `${base_url}weather?q=${query}&units=metric&lat=${lat}&lon=${lon}&appid=${api_key}`
      )
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          setQuery("");
        });
    }
  };

  return (
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 20
            ? "app warm"
            : "app"
          : "app"
      }
    >
      <main>
        <div className="search-box">
          <input
            className="search-bar"
            type="text"
            placeholder="Search City"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {typeof weather.main != "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)} °C</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
