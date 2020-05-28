var XLSX = require("xlsx");
var request = require("request");
var fs = require("fs");

async function loadDataEvent(link) {
  return new Promise(function (resolve, reject) {
    fs.readFile(link, (err, data) => {
      if (err) throw err;

      /* data is a node Buffer that can be passed to XLSX.read */
      var workbook = XLSX.read(data, { type: "buffer" });
      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];

      resolve(
        XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          defval: "",
        })
      );
    });
  });
}

async function getPopulationAdulteData(link) {
  let p = new Promise(function (resolve, reject) {
    fs.readFile(link, (err, data) => {
      if (err) throw err;

      /* data is a node Buffer that can be passed to XLSX.read */
      var workbook = XLSX.read(data, { type: "buffer" });
      /* DO SOMETHING WITH workbook HERE */
      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[1];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];

      resolve(
        XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          defval: "",
          range: 2,
        })
      );
    });
  });

  return p;
}

async function getPopulationNumber(link) {
  let popData = await getPopulationAdulteData(link);
  let adulteTotalKeys = [];
  let adulteTotalValues = [];
  let totalPopKeys = [];
  let totalPopValues = [];
  let stop = false;

  for (let pop of popData) {
    //

    //

    if (pop.Age > 14 || pop.Age == "80+") {
      var indexWherePush = 0;
      Object.keys(pop).forEach((key) => {
        if (key.endsWith(" _2")) {
          if (!stop) {
            adulteTotalKeys.push(key.replace(" _2", ""));
          }
          if (!adulteTotalValues[indexWherePush]) {
            adulteTotalValues[indexWherePush] = 0;
          }
          adulteTotalValues[indexWherePush] += pop[key];
          indexWherePush++;
        }
      });
      stop = true;
    }
  }

  return {
    adulteTotalKeys,
    adulteTotalValues,
    length: adulteTotalValues.length,
    length2: adulteTotalKeys.length,
  };
}

async function getReseauBancaireNumber() {
  const bq1Link = ["public/data/Banque1-2018/", "public/data/Banque1-2019/"];
  const bq2Link = ["public/data/Banque2-2018/", "public/data/Banque2-2019/"];

  const reseauBancaireFileName = "72.csv";

  let reseauBancaireData1 = [];
  let reseauBancaireData2 = [];
  let reseauBancaire2018_1_count = 0;
  let reseauBancaire2018_2_count = 0;
  let reseauBancaire2018_1 = 0;

  for (let [index, link] of bq1Link.entries()) {
    let dataAcces = await loadDataEvent(link + reseauBancaireFileName);
    dataAcces = dataAcces.filter(
      (e) =>
        e["Code GPS X"] != null &&
        e["Code GPS X"] != undefined &&
        e["Code GPS Y"] != null &&
        e["Code GPS Y"] != undefined
    );

    if (link === "public/data/Banque1-2018/") {
      reseauBancaire2018_1 = dataAcces;
    } else {
      reseauBancaireData1 = dataAcces;
    }
  }

  reseauBancaire2018_1_count = reseauBancaire2018_1.length;

  for (link of bq2Link) {
    let dataAcces = await loadDataEvent(link + reseauBancaireFileName);
    dataAcces = dataAcces.filter(
      (e) =>
        e["Code GPS X"] != null &&
        e["Code GPS X"] != undefined &&
        e["Code GPS Y"] != null &&
        e["Code GPS Y"] != undefined
    );

    if (link === "public/data/Banque2-2018/") {
      reseauBancaire2018_2 = dataAcces;
    } else {
      reseauBancaireData2 = dataAcces;
    }
  }

  reseauBancaire2018_2_count = reseauBancaire2018_2.length;

  let reseauBancaire_1_diff = (
    ((-reseauBancaire2018_1_count + reseauBancaireData1.length) /
      reseauBancaireData1.length) *
    100
  ).toFixed(2);
  let reseauBancaire_2_diff = (
    ((-reseauBancaire2018_2_count + reseauBancaireData2.length) /
      reseauBancaireData2.length) *
    100
  ).toFixed(2);
  let reseauBancaire_g_diff = (
    ((-reseauBancaire2018_1_count -
      reseauBancaire2018_2_count +
      reseauBancaireData1.length +
      reseauBancaireData2.length) /
      (reseauBancaireData1.length + reseauBancaireData2.length)) *
    100
  ).toFixed(2);

  return [
    reseauBancaireData1,
    reseauBancaireData2,
    reseauBancaire2018_1_count,
    reseauBancaire2018_2_count,
    reseauBancaire_1_diff,
    reseauBancaire_2_diff,
    reseauBancaire_g_diff,
  ];
}

async function getIobNumber() {
  const iobFileName = "77.csv";
  let iobData1 = [];
  let iobData2 = [];
  // const bq1Link = ["public/data/Banque1-2018/", "public/data/Banque1-2019/"];
  // const bq2Link = ["public/data/Banque2-2018/", "public/data/Banque2-2019/"];

  const bq1Link = ["public/data/Banque1-2019/"];
  const bq2Link = ["public/data/Banque2-2019/"];

  for (link of bq1Link) {
    iobData1 = [...iobData1, ...(await loadDataEvent(link + iobFileName))];
  }
  for (link of bq2Link) {
    iobData2 = [...iobData2, ...(await loadDataEvent(link + iobFileName))];
  }

  iobData2 = iobData2.filter(
    (e) =>
      e["Code GPS X"] != null &&
      e["Code GPS X"] != undefined &&
      e["Code GPS Y"] != null &&
      e["Code GPS Y"] != undefined
  );

  iobData1 = iobData1.filter(
    (e) =>
      e["Code GPS X"] != null &&
      e["Code GPS X"] != undefined &&
      e["Code GPS Y"] != null &&
      e["Code GPS Y"] != undefined
  );
  return [iobData1.length, iobData2.length];
}

async function getGabNumber() {
  const bq1Link = ["public/data/Banque1-2018/", "public/data/Banque1-2019/"];
  const bq2Link = ["public/data/Banque2-2018/", "public/data/Banque2-2019/"];

  // const bq1Link = ["public/data/Banque1-2019/"];
  // const bq2Link = ["public/data/Banque2-2019/"];

  const gabFileName = "78.csv";
  let gabData_2018_1_count = 0;
  let gabData_2018_2_count = 0;

  let gabData1 = [];
  let gabData2 = [];
  let gabDataDepot1 = [];
  let gabDataDepot2 = [];

  for ([index, link] of bq1Link.entries()) {
    let data = await loadDataEvent(link + gabFileName);
    data = data.filter(
      (e) =>
        e["gpsx"] != null &&
        e["gpsx"] != undefined &&
        e["gpsy"] != null &&
        e["gpsy"] != undefined
    );

    if (index === 0) {
      console.log(data.length);
      gabData_2018_1_count = data.length;
    } else {
      console.log(data.length);
      gabData1 = data;
    }
  }
  for ([index, link] of bq2Link.entries()) {
    let data = await loadDataEvent(link + gabFileName);
    var caseFKeyName = Object.keys(data[0])[5];
    data = data.filter(
      (e) =>
        e["gpsx"] != null &&
        e["gpsx"] != undefined &&
        e["gpsy"] != null &&
        e["gpsy"] != undefined
    );

    if (index === 0) {
      gabData_2018_2_count = data.length;
    } else {
      gabData2 = data;
    }
  }

  if (gabData1.length) {
    var caseFKeyName = Object.keys(gabData1[0])[5];

    gabDataDepot1 = [...gabData1].filter(
      (e) =>
        e[caseFKeyName] != null &&
        e[caseFKeyName] != undefined &&
        e[caseFKeyName] != ""
    );
  }

  if (gabData2.length) {
    var caseFKeyName = Object.keys(gabData2[0])[5];

    gabDataDepot1 = [...gabData2].filter(
      (e) =>
        e[caseFKeyName] != null &&
        e[caseFKeyName] != undefined &&
        e[caseFKeyName] != ""
    );
  }

  let diff1 = 0;
  let diff2 = 0;
  let diff3 = 0;

  diff1 = ((gabData1.length - gabData_2018_1_count) / gabData1.length) * 100;
  diff2 = ((-gabData_2018_2_count + gabData2.length) / gabData2.length) * 100;
  diff3 =
    ((-gabData_2018_2_count +
      gabData2.length -
      gabData_2018_1_count +
      gabData1.length) /
      (gabData2.length + gabData1.length)) *
    100;

  console.log("fffffffff", diff1, diff2, diff3);
  if (!diff1) diff1 = 0;
  if (!diff2) diff2 = 0;
  if (!diff3) diff3 = 0;
  return [
    [gabData1.length, gabDataDepot1.length],
    [gabData2.length, gabDataDepot2.length],
    [diff1.toFixed(2), diff2.toFixed(2), diff3.toFixed(2)],
    [gabData_2018_1_count, gabData_2018_2_count],
  ];

  console.log();
}

async function loadListPins() {
  const bqLink = [
    "public/data/Banque1-2018/",
    "public/data/Banque1-2019/",
    "public/data/Banque2-2018/",
    "public/data/Banque2-2019/",
  ];

  const fileName = "73.csv";
  let reseauBancaireData1 = [];
  let reseauBancaireData2 = [];
  let reseau_1_temp = [];
  let reseau_2_temp = [];

  for ([index, link] of bqLink.entries()) {
    let data = await loadDataEvent(link + fileName);

    if (index === 0) {
      reseau_1_temp = data;
    }

    if (index === 1) {
      reseauBancaireData1 = data;
    }

    if (index === 2) {
      reseau_2_temp = data;
    }

    if (index === 3) {
      reseauBancaireData2 = data;
    }

    // listPins = await [listPins, ...data];
  }

  for (let rs of reseauBancaireData1) {
    let founded = reseau_1_temp.findIndex(
      (e) =>
        rs["Code GPS X"] == e["Code GPS X"] &&
        rs["Code GPS Y"] == e["Code GPS Y"]
    );

    if (founded < 0) {
      rs.new = "Nouveau";
    } else {
      rs.new = "";
    }
  }
  console.log(reseauBancaireData1[reseauBancaireData1.length - 1]);
  console.log(reseauBancaireData1[0]);

  for (let rs of reseauBancaireData2) {
    let f = reseau_2_temp.findIndex(
      (e) =>
        rs["Code GPS X"] == e["Code GPS X"] &&
        rs["Code GPS Y"] == e["Code GPS Y"]
    );
    if (f < 0) {
      rs.new = "Nouveau";
    } else {
      rs.new = "";
    }
  }

  return { bq1: reseauBancaireData1, bq2: reseauBancaireData2 };
}

module.exports = {
  loadDataEvent,
  getPopulationNumber,
  getReseauBancaireNumber,
  getIobNumber,
  getGabNumber,
  loadListPins,
};
