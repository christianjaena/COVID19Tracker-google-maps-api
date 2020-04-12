var map;
var markers = [];
var clearMarkers = [];
var casesListenerCountry = []
var deathsListenerCountry = []
var recoveredListenerCountry = []
var criticalListenerCountry = []

function setListener(listenerCountry) {
  var dom = document.querySelectorAll('.data-wrap')
  dom.forEach((i, index) => {
    i.addEventListener('click', function () {
      var a = listenerCountry[index].toUpperCase()
      search(a)
    })
  })

}

function search(a) {
  markers.forEach((i, index) => {
    if (i.country.toUpperCase() == a) {
      google.maps.event.trigger(i.markers, 'click');
    }
  })
}

function clearListeners() {
  casesListenerCountry = [];
  deathsListenerCountry = [];
  recoveredListenerCountry = [];
  criticalListenerCountry = [];
}



document.getElementById('cases-button').addEventListener('click', function () {
  clearListeners();
  markers = [];
  viewCases(map);
})
document.getElementById('deaths-button').addEventListener('click', function () {
  clearListeners();
  markers = [];
  viewDeaths(map);
})
document.getElementById('recovered-button').addEventListener('click', function () {
  clearListeners();
  markers = [];
  viewRecovered(map);
})
document.getElementById('critical-button').addEventListener('click', function () {
  clearListeners();
  markers = [];
  viewCritical(map);
})

var input = document.getElementById('searchBar');
input.addEventListener("keyup", function (event) {

  if (event.keyCode === 13) {

    event.preventDefault();

    document.getElementById("searchCountryButton").click();
  }
});

function searchCountry() {

  var input = document.getElementById('searchBar').value;

  document.getElementById('searchBar').value = "";
  for (let i of markers) {
    var a = input.toUpperCase();
    var b = i.country.toUpperCase();

    if (a == b) {
      google.maps.event.trigger(i.markers, 'click');
      break;
    }

  }

}

function initMap() {
  var latLng = {
    lat: 15.4542,
    lng: 18.7322
  }
  var options = {
    zoom: 3,
    center: latLng,
    styles: [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#242f3e"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#746855"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#242f3e"
        }]
      }, {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      }, {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4b6878"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#38414e"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#212a37"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#17263c"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#515c6d"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#17263c"
        }]
      }
    ]
  };
  map = new google.maps.Map(document.getElementById('map'), options);
  viewCases(map);

}


async function viewCases(map) {
  clearMarkers.forEach(i => i.setMap(null))
  let inputData;
  await fetch('https://corona.lmao.ninja/countries')
    .then(res => res.json())
    .then(data => {
      inputData = data;
      var totalDeaths = 0;
      var totalCases = 0;
      var totalRecoveries = 0;
      var totalCritical = 0;
      data.forEach(i => {
        totalDeaths += i.deaths;
        totalCases += i.cases;
        totalRecoveries += i.recovered;
        totalCritical += i.critical;
      })

      data.forEach(i => {
        var scale = Math.round(i.cases / totalCases * 100) + 5
        var coords = {
          lat: i.countryInfo.lat,
          lng: i.countryInfo.long
        }
        var marker = new google.maps.Marker({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: 0.6,
            scale: scale,
            strokeColor: 'white',
            strokeWeight: 0
          }
        });
        clearMarkers.push(marker)
        marker.setMap(map);

        markers.push({
          country: i.country,
          markers: marker
        });

        var infoWindow = new google.maps.InfoWindow({

          content: `      <div class="countryInfo">
                              <img class="info-flag"src=${i.countryInfo.flag}>
                              <h2>${i.country} (${i.countryInfo.iso3})</h2> 
                          </div>
                          <hr>
                          <h3>Cases: ${i.cases}</h3>
                          <h3>Deaths: ${i.deaths}</h3>
                          <h3>Recovered: ${i.recovered}</h3>
                          <h3>Today's Cases: ${i.todayCases}</h3>
                          <h3>Today's Deaths: ${i.todayDeaths}</h3>
                          <h3>Active: ${i.active}</h3>
                          <h3>Critical: ${i.critical}</h3>
                  `
        });
        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });

        marker.addListener('click', function () {
          map.setZoom(3);
          map.setCenter(marker.getPosition());
        });

      })
      var cases = `<h4>Cases</h4>
                      <h5 style="color:#B91111; font-size: 30px;">${totalCases}</h5>`;
      var deaths = `<h4>Deaths</h4>
                      <h5 style="color:##555555; font-size: 30px;">${totalDeaths}</h5>`;
      var recovered = `<h4>Recovered</h4>
                          <h5 style= "color:#008000; font-size: 30px;">${totalRecoveries}</h5>`
      var critical = `<h4>Critical</h4>
                          <h5 style="color:#D4A010; font-size: 30px;">${totalCritical}</h5>`
      document.getElementById('totalCases').innerHTML = cases;
      document.getElementById('totalDeaths').innerHTML = deaths;
      document.getElementById('totalRecovered').innerHTML = recovered;
      document.getElementById('totalCritical').innerHTML = critical

    });


  var sortedCasesOutput = `<div class ="wrap">`;
  var sortedDeathsOutput = `<div class ="wrap">`;
  var sortedRecoveredOutput = `<div class ="wrap">`;
  var sortedCriticalOutput = `<div class ="wrap">`;
  var button = document.querySelector(".closeButtonContainer");
  var x = document.querySelector(".dataContainer");
  button.addEventListener('click', function () {
    x.style.display = "none";
    button.style.display = "none";
  })
  document.getElementById('cases').addEventListener('click', function () {
    clearListeners();
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.cases - a.cases).forEach((i, index) => {
      casesListenerCountry.push(i.country)
      var html = `
      <div id="dataWrap" class="data-wrap">
          <div class="dataListContainer">
              <div class="data">
              <div class="countryInfoContainer">
              <h4>${i.country}</h4>
            </div>
                  <h5>Cases: ${i.cases}</h5>
              </div>
              <div class="dataNumber">
                      ${index+1}  
              </div>
          </div>
      </div>
      
      `
      sortedCasesOutput += html
    })

    sortedCasesOutput += "</div>"

    x.innerHTML = sortedCasesOutput;
    setListener(casesListenerCountry);

  })

  document.getElementById('deaths').addEventListener('click', function () {
    clearListeners();
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.deaths - a.deaths).forEach((i, index) => {
      deathsListenerCountry.push(i.country)
      sortedDeathsOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Deaths: ${i.deaths}</h5>
                      </div>
                      <div class="dataNumber">    
                          ${index+1}
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedDeathsOutput += "</div>"

    x.innerHTML = sortedDeathsOutput;
    setListener(deathsListenerCountry)
  })

  document.getElementById('recovered').addEventListener('click', function () {
    clearListeners();
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.recovered - a.recovered).forEach((i, index) => {
      recoveredListenerCountry.push(i.country)
      sortedRecoveredOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                          <div class="countryInfoContainer">
                            <h4>${i.country}</h4>
                          </div>
                          <h5>Recovered: ${i.recovered}</h5>
                      </div>
                      <div class="dataNumber">
                          ${index+1}                 
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedRecoveredOutput += "</div>"

    x.innerHTML = sortedRecoveredOutput;
    setListener(recoveredListenerCountry);
  })

  document.getElementById('critical').addEventListener('click', function () {
    clearListeners();
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.critical - a.critical).forEach((i, index) => {
      criticalListenerCountry.push(i.country)
      sortedCriticalOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Critical: ${i.critical}</h5>
                      </div>
                      <div class="dataNumber">                  
                              ${index+1}                           
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedCriticalOutput += "</div>"
    x.innerHTML = sortedCriticalOutput;
    setListener(criticalListenerCountry)
  })

}

async function viewDeaths(map) {
  clearMarkers.forEach(i => i.setMap(null))
  markers.length = 0;
  let inputData;
  await fetch('https://corona.lmao.ninja/countries')
    .then(res => res.json())
    .then(data => {
      inputData = data;
      var totalDeaths = 0;
      var totalCases = 0;
      var totalRecoveries = 0;
      var totalCritical = 0;
      data.forEach(i => {
        totalDeaths += i.deaths;
        totalCases += i.cases;
        totalRecoveries += i.recovered;
        totalCritical += i.critical;
      })

      data.forEach(i => {
        var scale = Math.round(i.deaths / totalDeaths * 100) + 5
        var coords = {
          lat: i.countryInfo.lat,
          lng: i.countryInfo.long
        }
        var marker = new google.maps.Marker({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'grey',
            fillOpacity: 0.6,
            scale: scale,
            strokeColor: 'white',
            strokeWeight: 0
          }
        });
        clearMarkers.push(marker)
        marker.setMap(map);
        markers.push({
          country: i.country,
          markers: marker
        });

        var infoWindow = new google.maps.InfoWindow({
          content: `<div class="countryInfo">
                        <img class="info-flag"src=${i.countryInfo.flag}>
                        <h2>${i.country} (${i.countryInfo.iso3})</h2> 
                    </div>
                    <hr>
                    <h3>Cases: ${i.cases}</h3>
                    <h3>Deaths: ${i.deaths}</h3>
                    <h3>Recovered: ${i.recovered}</h3>
                    <h3>Today's Cases: ${i.todayCases}</h3>
                    <h3>Today's Deaths: ${i.todayDeaths}</h3>
                    <h3>Active: ${i.active}</h3>
                    <h3>Critical: ${i.critical}</h3>
                  `
        });
        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });

        marker.addListener('click', function () {
          map.setZoom(3);
          map.setCenter(marker.getPosition());
        });

      })
      var cases = `<h4>Cases</h4>
                      <h5 style="color:#B91111; font-size: 30px;">${totalCases}</h5>`;
      var deaths = `<h4>Deaths</h4>
                      <h5 style="color:##555555; font-size: 30px;">${totalDeaths}</h5>`;
      var recovered = `<h4>Recovered</h4>
                          <h5 style= "color:#008000; font-size: 30px;">${totalRecoveries}</h5>`
      var critical = `<h4>Critical</h4>
                          <h5 style="color:#D4A010; font-size: 30px;">${totalCritical}</h5>`
      document.getElementById('totalCases').innerHTML = cases;
      document.getElementById('totalDeaths').innerHTML = deaths;
      document.getElementById('totalRecovered').innerHTML = recovered;
      document.getElementById('totalCritical').innerHTML = critical

    });


  var sortedCasesOutput = `<div class ="wrap">`;
  var sortedDeathsOutput = `<div class ="wrap">`;
  var sortedRecoveredOutput = `<div class ="wrap">`;
  var sortedCriticalOutput = `<div class ="wrap">`;
  var button = document.querySelector(".closeButtonContainer");
  var x = document.querySelector(".dataContainer");
  button.addEventListener('click', function () {
    x.style.display = "none";
    button.style.display = "none";
  })
  document.getElementById('cases').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.cases - a.cases).forEach((i, index) => {
      casesListenerCountry.push(i.country)
      sortedCasesOutput +=
        `
              <div id="dataWrap" class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Cases: ${i.cases}</h5>
                      </div>
                      <div class="dataNumber">
                              ${index+1}  
                      </div>
                  </div>
              </div>
              
              `

    })
    sortedCasesOutput += "</div>"
    x.innerHTML = sortedCasesOutput;
    setListener(casesListenerCountry)

  })

  document.getElementById('deaths').addEventListener('click', function () {
    clearListeners();
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.deaths - a.deaths).forEach((i, index) => {
      deathsListenerCountry.push(i.country)
      sortedDeathsOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Deaths: ${i.deaths}</h5>
                      </div>
                      <div class="dataNumber">    
                          ${index+1}
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedDeathsOutput += "</div>"
    x.innerHTML = sortedDeathsOutput;
    setListener(deathsListenerCountry);
  })

  document.getElementById('recovered').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.recovered - a.recovered).forEach((i, index) => {
      recoveredListenerCountry.push(i.country)
      sortedRecoveredOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Recovered: ${i.recovered}</h5>
                      </div>
                      <div class="dataNumber">
                          ${index+1}                 
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedRecoveredOutput += "</div>"
    x.innerHTML = sortedRecoveredOutput;
    setListener(recoveredListenerCountry)
  })

  document.getElementById('critical').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.critical - a.critical).forEach((i, index) => {
      criticalListenerCountry.push(i.country)
      sortedCriticalOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Critical: ${i.critical}</h5>
                      </div>
                      <div class="dataNumber">                  
                              ${index+1}                           
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedCriticalOutput += "</div>"
    x.innerHTML = sortedCriticalOutput;
    setListener(criticalListenerCountry)
  })
}


async function viewRecovered(map) {
  clearMarkers.forEach(i => i.setMap(null))
  markers.length = 0;
  let inputData;
  await fetch('https://corona.lmao.ninja/countries')
    .then(res => res.json())
    .then(data => {
      inputData = data;
      var totalDeaths = 0;
      var totalCases = 0;
      var totalRecoveries = 0;
      var totalCritical = 0;
      data.forEach(i => {
        totalDeaths += i.deaths;
        totalCases += i.cases;
        totalRecoveries += i.recovered;
        totalCritical += i.critical;
      })

      data.forEach(i => {
        var scale = Math.round(i.recovered / totalRecoveries * 100) + 5
        var coords = {
          lat: i.countryInfo.lat,
          lng: i.countryInfo.long
        }
        var marker = new google.maps.Marker({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'green',
            fillOpacity: 0.6,
            scale: scale,
            strokeColor: 'white',
            strokeWeight: 0
          }
        });
        clearMarkers.push(marker);
        marker.setMap(map);
        markers.push({
          country: i.country,
          markers: marker
        });

        var infoWindow = new google.maps.InfoWindow({
          content: `<div class="countryInfo">
                        <img class="info-flag"src=${i.countryInfo.flag}>
                        <h2>${i.country} (${i.countryInfo.iso3})</h2> 
                    </div>
                    <hr>
                    <h3>Cases: ${i.cases}</h3>
                    <h3>Deaths: ${i.deaths}</h3>
                    <h3>Recovered: ${i.recovered}</h3>
                    <h3>Today's Cases: ${i.todayCases}</h3>
                    <h3>Today's Deaths: ${i.todayDeaths}</h3>
                    <h3>Active: ${i.active}</h3>
                    <h3>Critical: ${i.critical}</h3>
                  `
        });
        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });

        marker.addListener('click', function () {
          map.setZoom(3);
          map.setCenter(marker.getPosition());
        });

      })
      var cases = `<h4>Cases</h4>
                      <h5 style="color:#B91111; font-size: 30px;">${totalCases}</h5>`;
      var deaths = `<h4>Deaths</h4>
                      <h5 style="color:##555555; font-size: 30px;">${totalDeaths}</h5>`;
      var recovered = `<h4>Recovered</h4>
                          <h5 style= "color:#008000; font-size: 30px;">${totalRecoveries}</h5>`
      var critical = `<h4>Critical</h4>
                          <h5 style="color:#D4A010; font-size: 30px;">${totalCritical}</h5>`
      document.getElementById('totalCases').innerHTML = cases;
      document.getElementById('totalDeaths').innerHTML = deaths;
      document.getElementById('totalRecovered').innerHTML = recovered;
      document.getElementById('totalCritical').innerHTML = critical

    });


  var sortedCasesOutput = `<div class ="wrap">`;
  var sortedDeathsOutput = `<div class ="wrap">`;
  var sortedRecoveredOutput = `<div class ="wrap">`;
  var sortedCriticalOutput = `<div class ="wrap">`;
  var button = document.querySelector(".closeButtonContainer");
  var x = document.querySelector(".dataContainer");
  button.addEventListener('click', function () {
    x.style.display = "none";
    button.style.display = "none";
  })
  document.getElementById('cases').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.cases - a.cases).forEach((i, index) => {
      casesListenerCountry.push(i.country)
      sortedCasesOutput +=
        `
              <div id="dataWrap" class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Cases: ${i.cases}</h5>
                      </div>
                      <div class="dataNumber">
                              ${index+1}  
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedCasesOutput += "</div>"
    x.innerHTML = sortedCasesOutput;
    setListener(casesListenerCountry)

  })

  document.getElementById('deaths').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.deaths - a.deaths).forEach((i, index) => {
      deathsListenerCountry.push(i.country)
      sortedDeathsOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Deaths: ${i.deaths}</h5>
                      </div>
                      <div class="dataNumber">    
                          ${index+1}
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedDeathsOutput += "</div>"
    x.innerHTML = sortedDeathsOutput;
    setListener(deathsListenerCountry)
  })

  document.getElementById('recovered').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.recovered - a.recovered).forEach((i, index) => {
      recoveredListenerCountry.push(i.country)
      sortedRecoveredOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Recovered: ${i.recovered}</h5>
                      </div>
                      <div class="dataNumber">
                          ${index+1}                 
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedRecoveredOutput += "</div>"
    x.innerHTML = sortedRecoveredOutput;
    setListener(recoveredListenerCountry)
  })

  document.getElementById('critical').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.critical - a.critical).forEach((i, index) => {
      criticalListenerCountry.push(i.country)
      sortedCriticalOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Critical: ${i.critical}</h5>
                      </div>
                      <div class="dataNumber">                  
                              ${index+1}                           
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedCriticalOutput += "</div>"
    x.innerHTML = sortedCriticalOutput;
    setListener(criticalListenerCountry)
  })

}
async function viewCritical(map) {
  clearMarkers.forEach(i => i.setMap(null))
  markers.length = 0;
  let inputData;
  await fetch('https://corona.lmao.ninja/countries')
    .then(res => res.json())
    .then(data => {
      inputData = data;
      var totalDeaths = 0;
      var totalCases = 0;
      var totalRecoveries = 0;
      var totalCritical = 0;
      data.forEach(i => {
        totalDeaths += i.deaths;
        totalCases += i.cases;
        totalRecoveries += i.recovered;
        totalCritical += i.critical;
      })

      data.forEach(i => {
        var scale = Math.round(i.critical / totalCritical * 100) + 5
        var coords = {
          lat: i.countryInfo.lat,
          lng: i.countryInfo.long
        }
        var marker = new google.maps.Marker({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'yellow',
            fillOpacity: 0.3,
            scale: scale,
            strokeColor: 'white',
            strokeWeight: 0
          }
        });
        clearMarkers.push(marker)
        marker.setMap(map)
        markers.push({
          country: i.country,
          markers: marker
        });

        var infoWindow = new google.maps.InfoWindow({
          content: `<div class="countryInfo">
                        <img class="info-flag"src=${i.countryInfo.flag}>
                        <h2>${i.country} (${i.countryInfo.iso3})</h2> 
                    </div>
                    <hr>
                    <h3>Cases: ${i.cases}</h3>
                    <h3>Deaths: ${i.deaths}</h3>
                    <h3>Recovered: ${i.recovered}</h3>
                    <h3>Today's Cases: ${i.todayCases}</h3>
                    <h3>Today's Deaths: ${i.todayDeaths}</h3>
                    <h3>Active: ${i.active}</h3>
                    <h3>Critical: ${i.critical}</h3>
                  `
        });
        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });

        marker.addListener('click', function () {
          map.setZoom(3);
          map.setCenter(marker.getPosition());
        });

      })
     var cases = `<h4>Cases</h4>
                      <h5 style="color:#B91111; font-size: 30px;">${totalCases}</h5>`;
      var deaths = `<h4>Deaths</h4>
                      <h5 style="color:##555555; font-size: 30px;">${totalDeaths}</h5>`;
      var recovered = `<h4>Recovered</h4>
                          <h5 style= "color:#008000; font-size: 30px;">${totalRecoveries}</h5>`
      var critical = `<h4>Critical</h4>
                          <h5 style="color:#D4A010; font-size: 30px;">${totalCritical}</h5>`
      document.getElementById('totalCases').innerHTML = cases;
      document.getElementById('totalDeaths').innerHTML = deaths;
      document.getElementById('totalRecovered').innerHTML = recovered;
      document.getElementById('totalCritical').innerHTML = critical

    });


  var sortedCasesOutput = `<div class ="wrap">`;
  var sortedDeathsOutput = `<div class ="wrap">`;
  var sortedRecoveredOutput = `<div class ="wrap">`;
  var sortedCriticalOutput = `<div class ="wrap">`;
  var button = document.querySelector(".closeButtonContainer");
  var x = document.querySelector(".dataContainer");
  button.addEventListener('click', function () {
    x.style.display = "none";
    button.style.display = "none";
  })
  document.getElementById('cases').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.cases - a.cases).forEach((i, index) => {
      casesListenerCountry.push(i.country)
      sortedCasesOutput +=
        `
              <div id="dataWrap" class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Cases: ${i.cases}</h5>
                      </div>
                      <div class="dataNumber">
                              ${index+1}  
                      </div>
                  </div>
              </div>
              
              `

    })
    sortedCasesOutput += "</div>"
    x.innerHTML = sortedCasesOutput;
    setListener(casesListenerCountry)
  })

  document.getElementById('deaths').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.deaths - a.deaths).forEach((i, index) => {
      deathsListenerCountry.push(i.country)
      sortedDeathsOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Deaths: ${i.deaths}</h5>
                      </div>
                      <div class="dataNumber">    
                          ${index+1}
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedDeathsOutput += "</div>"
    x.innerHTML = sortedDeathsOutput;
    setListener(deathsListenerCountry)
  })

  document.getElementById('recovered').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.recovered - a.recovered).forEach((i, index) => {
      recoveredListenerCountry.push(i.country)
      sortedRecoveredOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Recovered: ${i.recovered}</h5>
                      </div>
                      <div class="dataNumber">
                          ${index+1}                 
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedRecoveredOutput += "</div>"
    x.innerHTML = sortedRecoveredOutput;
    setListener(recoveredListenerCountry)
  })

  document.getElementById('critical').addEventListener('click', function () {
    clearListeners()
    x.style.display = "block";
    button.style.display = "block";
    inputData.sort((a, b) => b.critical - a.critical).forEach((i, index) => {
      criticalListenerCountry.push(i.country)
      sortedCriticalOutput +=
        `
              <div class="data-wrap">
                  <div class="dataListContainer">
                      
                      <div class="data">
                      <div class="countryInfoContainer">
                      <h4>${i.country}</h4>
                    </div>
                          <h5>Critical: ${i.critical}</h5>
                      </div>
                      <div class="dataNumber">                  
                              ${index+1}                           
                      </div>
                  </div>
              </div>
              
              `
    })
    sortedCriticalOutput += "</div>"
    x.innerHTML = sortedCriticalOutput;
    setListener(criticalListenerCountry)
  })

}