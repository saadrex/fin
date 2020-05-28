//
var dataJsonMap = [];
var listLink = ["data/73.csv"];
var searchURL;
var map,
  popup,
  datasource,
  iconLayer,
  centerMarker,
  searchURL,
  symbolLayer,
  symbolLayer1;
//The maximum zoom level to cluster data point data on the map.
var maxClusterZoomLevel = 11;
var search = false;

let subscriptionKeyCredential;
let pipeline;
async function initMap(data) {
  //Create an instance of the SearchURL client.
  let { bq1, bq2 } = data;
  let i1 = 0,
    j1 = 0,
    i2 = 0,
    j2 = 0;
  for (let b of bq1) {
    if (b.new == "Nouveau") {
      i1++;
    } else j1++;
  }

  for (let b of bq2) {
    if (b.new == "Nouveau") {
      i2++;
    } else j2++;
  }

  //Initialize a map instance.
  map = new atlas.Map("map", {
    center: [-6.809093, 33.959971],
    zoom: 6,
    view: "MA",
    language: "en-US",

    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
    authOptions: {
      authType: "subscriptionKey",
      subscriptionKey: "romz5FyjqI65m-BeDsphCwhQnmqw4BwxLoISFZoNu_Q",
    },
  });

  //Wait until the map resources are ready.
  map.events.add("ready", function () {
    centerMarker = new atlas.HtmlMarker({
      htmlContent: '<div class="mapCenterIcon"></div>',
      position: map.getCamera().center,
    });

    subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(
      atlas.getSubscriptionKey()
    );
    pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential, {
      retryOptions: { maxTries: 4 }, // Retry options
    });

    //Create a data source and add it to the map.
    searchURL = new atlas.service.SearchURL(pipeline);

    datasource = new atlas.source.DataSource(null, {
      cluster: false,
    });

    let datasource1 = new atlas.source.DataSource(null, {
      cluster: false,
    });

    map.sources.add(datasource);
    map.sources.add(datasource1);

    for ([index, el] of bq1.entries()) {
      let json = {
        title: `${el["Code guichet"]} - ${el["GUICHETS "]}  `,
        localite: el["Code localité"],
        totaleCompteNumber: el[" Total des comptes Nombre"],
        totalCompteMontant: el["Total des comptes Montant"],
        depotATermeNombre: el["Dépôts à terme  Nombre"],
        depotATermeMontant: el["Dépôts à terme  Montant"],
        new: el["new"],
      };

      let point = new atlas.data.Feature(
        new atlas.data.Point([el["Code GPS X"], el["Code GPS Y"]]),
        json
      );
      datasource.add(point);
    }

    for ([index, el] of bq2.entries()) {
      let json = {
        title: `${el["Code guichet"]} - ${el["GUICHETS "]}  `,
        localite: el["Code localité"],
        totaleCompteNumber: el[" Total des comptes Nombre"],
        totalCompteMontant: el["Total des comptes Montant"],
        depotATermeNombre: el["Dépôts à terme  Nombre"],
        depotATermeMontant: el["Dépôts à terme  Montant"],
        new: el["new"],
      };

      let point = new atlas.data.Feature(
        new atlas.data.Point([el["Code GPS X"], el["Code GPS Y"]]),
        json
      );
      datasource1.add(point);
    }

    symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
        image: [
          "match",
          ["get", "new"],
          ["==", "Nouveau"],
          "pin-blue",
          "pin-red",
        ],
      },
    });

    symbolLayer1 = new atlas.layer.SymbolLayer(datasource1, null, {
      iconOptions: {
        image: [
          "match",
          ["get", "new"],
          ["==", "Nouveau"],
          "pin-blue",
          "pin-red",
        ],
      },
    });

    try {
      map.layers.add(symbolLayer);
      map.layers.add(symbolLayer1);
    } catch (e) {}

    //Create a popup but leave it closed so we can update it and display it later.
    popup = new atlas.Popup({
      pixelOffset: [0, -18],
    });
    search = true;
    updateListItems();

    //Add a click event to the symbol layer.
    map.events.add("click", symbolLayer, (e) => {
      symbolClicked(e.shapes[0]);
    });

    map.events.add("click", symbolLayer1, (e) => {
      symbolClicked(e.shapes[0]);
    });

    document.getElementById("searchBtn").onclick = performSearch;

    //If the user presses enter in the search textbox, perform a search.
    document.getElementById("searchTbx").onkeyup = function (e) {
      if (e.keyCode === 13) {
        performSearch();
      }
    };

    map.events.add("render", function () {
      //Give the map a chance to move and render data before updating the list.
      updateListItems();
    });
  });

  function performSearch() {
    var query = document.getElementById("searchTbx").value;

    //Perform a fuzzy search on the users query.
    searchURL
      .searchFuzzy(atlas.service.Aborter.timeout(3000), query, {
        //Pass in the array of country ISO2 for which we want to limit the search to.

        view: "Auto",
      })
      .then((results) => {
        //Parse the response into GeoJSON so that the map can understand.
        var data = results.geojson.getFeatures();

        search = true;

        updateListItems();
        if (data.features.length > 0) {
          //Set the camera to the bounds of the results.
          map.setCamera({
            bounds: data.features[0].bbox,
            padding: 40,
          });
        } else {
          search = false;
          document.getElementById("listPanel").innerHTML =
            '<div class="statusMessage">Unable to find the location you searched for.</div>';
        }
      });
  }
  // methode from event js
}

function symbolClicked(shape) {
  var properties = shape.getProperties();
  var coordinate = shape.getCoordinates();

  var html = ['<div class="storePopup">'];

  html.push(
    '<div class="popupTitle">',
    properties["title"],
    '<div class="popupSubTitle">Localité = ',
    properties["localite"],
    '</div></div><div class="popupContent">',
    "<div class='popoUpRow'><span>Comptes en Nombre  :</span>",
    properties["totaleCompteNumber"],
    "</div>",

    "<div class='popoUpRow'><span>Comptes en Montant  :</span>",
    properties["totalCompteMontant"],
    "</div>",

    "<div class='popoUpRow'><span>Dépôt en Nombre  :</span>",
    properties["depotATermeNombre"],
    "</div>",

    "<div class='popoUpRow'><span>Dépôt en Montant  :</span>",
    properties["depotATermeMontant"],
    "</div>",

    "</a>"
  );

  html.push("</div></div>");

  popup.setOptions({
    //Create a table from the properties in the feature.
    content: html.join(""),
    position: coordinate,
  });

  //Open the popup.
  popup.open(map);
}

async function loadStoreData() {
  for (link of listLink) {
    let responseListGAB = await fetch(`/xlxs/listPins`);
    dataJsonMap = await responseListGAB.json();
  }

  await initMap(dataJsonMap);
  await init();
  document.querySelector(".loader").remove();
}

function updateListItems() {
  //Hide the center marker.
  centerMarker.setOptions({
    visible: false,
  });

  //Get the current camera/view information for the map.
  var camera = map.getCamera();

  var listPanel = document.getElementById("listPanel");

  //Check to see if the user is zoomed out a lot. If they are, tell them to zoom in closer, perform a search or press the My Location button.

  if (camera.zoom < maxClusterZoomLevel && !search) {
    //Close the popup as clusters may be displayed on the map.
    popup.close();

    listPanel.innerHTML = "";
  } else {
    //Update the location of the centerMarker.
    centerMarker.setOptions({
      position: camera.center,
      visible: true,
    });

    //List the ten closest locations in the side panel.
    var html = [],
      properties,
      properties1;

    //Get all the shapes that have been rendered in the bubble layer.

    var data = map.layers.getRenderedShapes(null, [symbolLayer]);
    var data1 = map.layers.getRenderedShapes(null, [symbolLayer1]);

    //Create an index of the distances of each shape.
    var distances = {};

    data.forEach(function (shape) {
      if (shape instanceof atlas.Shape) {
        //Calculate the distance from the center of the map to each shape and store in the index. Round to 2 decimals.
        distances[shape.getId()] =
          Math.round(
            atlas.math.getDistanceTo(
              camera.center,
              shape.getCoordinates(),
              "miles"
            ) * 100
          ) / 100;
      }

      properties = shape.getProperties();

      html.push(
        '<div class="listItem" onclick="itemSelected(\'',
        shape.getId(),
        '\')"><div class="listItem-title">',
        properties["title"],
        "<span class='new'>",
        properties["new"],
        "</span></div>",

        '<div class="listSubTitle">Localité : ',
        properties["localite"],
        "</div>",
        '<div class="listRows">Comptes en Nombre  : ',
        properties["totaleCompteNumber"],
        "</div>",

        '<div class="listRows">Comptes en Montant  : ',
        properties["totalCompteMontant"],
        "</div>",

        '<div class="listRows">Dépôt en Nombre  : ',
        properties["depotATermeNombre"],
        "</div>",
        '<div class="listRows">Dépôt en Montant  : ',
        properties["depotATermeMontant"],
        "</div></div>"
      );
    });

    data1.forEach(function (shape) {
      if (shape instanceof atlas.Shape) {
        //Calculate the distance from the center of the map to each shape and store in the index. Round to 2 decimals.
        distances[shape.getId()] =
          Math.round(
            atlas.math.getDistanceTo(
              camera.center,
              shape.getCoordinates(),
              "miles"
            ) * 100
          ) / 100;
      }

      properties1 = shape.getProperties();

      html.push(
        '<div class="listItem" onclick="itemSelected(\'',
        shape.getId(),
        '\')"><div class="listItem-title">',
        properties1["title"],
        "<span class='new'>",
        properties1["new"],
        "</span></div>",

        '<div class="listSubTitle">Localité : ',
        properties1["localite"],
        "</div>",
        '<div class="listRows">Comptes en Nombre  : ',
        properties1["totaleCompteNumber"],
        "</div>",

        '<div class="listRows">Comptes en Montant  : ',
        properties1["totalCompteMontant"],
        "</div>",

        '<div class="listRows">Dépôt en Nombre  : ',
        properties1["depotATermeNombre"],
        "</div>",
        '<div class="listRows">Dépôt en Montant  : ',
        properties1["depotATermeMontant"],
        "</div></div>"
      );
    });

    listPanel.innerHTML = html.join("");
  }
}

function itemSelected(id) {
  //Get the shape from the data source using it's id.
  var shape = datasource.getShapeById(id);
  symbolClicked(shape);

  //Center the map over the shape on the map.
  var center = shape.getCoordinates();
  var offset;

  //If the map is less than 700 pixels wide, then the layout is set for small screens.
  if (map.getCanvas().width < 700) {
    //When the map is small, offset the center of the map relative to the shape so that there is room for the popup to appear.
    offset = [0, -80];
  }

  map.setCamera({
    center: center,
    centerOffset: offset,
  });
}

loadStoreData();

function chunk(arr, chunkSize) {
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));
  return R;
}
