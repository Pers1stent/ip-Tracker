const button = document.querySelector(".black_arrow");

const svgUrl = "images/icon-location.svg";

const customIcon = L.icon({
  iconUrl: svgUrl,
  iconSize: [50, 60],
  iconAnchor: [20, 20],
});

const map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const fetchData = async function (apiKey, ipAddress) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ipAddress}`
    );
    if (response.ok) {
      const data = await response.json();
      const { lat, lng } = data.location;
      map.setView([lat, lng], 13);
      generateMarkup(data);
    } else {
      throw new Error("failed to fetch data");
    }
  } catch (error) {
    console.log(error);
  }
};

let markers = [];

map.addEventListener("click", function (e) {
  const marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);

  console.log(marker);

  marker.on("click", function () {
    map.removeLayer(marker);
    markers = markers.filter(function (item) {
      return item !== marker;
    });
  });

  markers.push(marker);
});

const generateMarkup = function (data) {
  const markup = `
                <div class="location">
                    <p>IP ADRESS</p>
                    <h2>${data.ip}</h2>
                </div>
                <div class="location">
                    <p>LOCATION</p>
                    <h2>${data.location.city}, ${data.location.country} ${data.location.postalCode}</h2>
                </div>
                <div class="location">
                    <p>TIMEZONE</p>
                    <h2>UTC ${data.location.timezone}</h2>
                </div>
                <div class="location1">
                    <p>ISP</p>
                    <h2>${data.isp}</h2>
                </div>
      `;

  const data1 = document.querySelector(".data");

  if (data) {
    data1.innerHTML = "";
    data1.insertAdjacentHTML("beforeend", markup);
  }
};

const updateMap = function () {
  const apiKey = "at_oFlt8OjDeRYI8sGBpvAooqsekP7Yt";
  const ipAddress = document.getElementById("coordinates").value;

  fetchData(apiKey, ipAddress);
};

updateMap();

button.addEventListener("click", updateMap);
