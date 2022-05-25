const loader = document.querySelector("#loading");
let mymap = null;

function displayLoading() {
  loader.classList.add("display");

  setTimeout(() => {
    loader.classList.remove("display");
  }, 20000);
}

function hideLoading() {
  loader.classList.remove("display");
}

let ipTracker = {
  key: "at_TKswDsz8SoKd1IfAWYZm4wdLg43Kq",

  domain: "",

  fetchIp: function (ipAddress) {
    displayLoading();

   fetch(
      `https://geo.ipify.org/api/v1?apiKey=${this.key}&ipAddress=${ipAddress}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayData(data);
        console.log(data);
      })
      .catch((error) => this.handleErrors(error));
  },

  displayData: function (data) {
    hideLoading();

    let { lat } = data.location;
    let { lng } = data.location;

    mymap = L.map("mapid").setView([lat, lng], 12);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiaXRzbWlsYWQiLCJhIjoiY2twdHg4YTJ2MDc1bzJvbnpkMzM1NTNnZCJ9.ES0tgt90-43JoRJEPO9RHg",
      }
    ).addTo(mymap);

    L.marker([lat, lng]).addTo(mymap);

    let { ip, isp } = data;
    let { city, country, region, timezone } = data.location;

    document.querySelector("#ipaddress").innerHTML = ip;
    document.querySelector("#location").innerHTML = `${city}, ${country}, ${region}`;
    document.querySelector("#timezone").innerHTML = `UTC ${timezone}`;
    document.querySelector("#isp").innerHTML = isp;
  },

  handleErrors: function (error) {
    console.log(error);
  },

  search: function () {
    mymap.remove();
    this.fetchIp(document.querySelector("#ip-input").value);
  },
};

document.querySelector("#search-btn").addEventListener("click", () => {
  ipTracker.search();
});

// default ip
ipTracker.fetchIp("8.8.8.8");
