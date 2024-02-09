async function getWeather(location = "Sevilla") {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=65704d5121124e30b38144030240102&q=${location}`
  );
  const data = await response.json();
  return data.current;
}

async function filterData() {
  const currentWeather = await getWeather();
  console.log(currentWeather);
  console.log(currentWeather.gust_kph);
}

filterData();
