let bq1 = document.getElementById("bq1");
let bq2 = document.getElementById("bq2");
// target of popAccess
let target = 3;

// cards
let kpiAgenceCard = document.getElementById("kpiAgence");
let kpiIobCard = document.getElementById("kpiIob");
let kpiGabCard = document.getElementById("kpiGab");
let kpiAccesCard = document.getElementById("kpiAcces");
let chiffreAgenceCard = document.getElementById("chiffreAgence");
let chiffreIobCard = document.getElementById("chiffreIob");
let chiffreGabCard = document.getElementById("chiffreGab");
let chiffreAccesCard = document.getElementById("chiffreAcces");
let adulteNumber = 0;
let selectedPointAcces_1 = 0;
let reseau1_2018_2_diff = 0;
let reseau1_2018_1_diff = 0;

let reseau1_2018_g_diff = 0;
let reseauBancaire_1_2018 = 0;
let reseauBancaire_2_2018 = 0;

let uniteAcces = 1695;

function renderFaText(type, value) {
  let c = "";
  let faC = "";

  if (type === "up") {
    c = "text-success";
    faC = "fa fa-angle-up";
  } else if (type === "down") {
    c = "text-danger";
    faC = "fa fa-angle-down";
  } else if (type === "fix") {
    c = "text-neutre";
    faC = "fa fa-angle-up";
  }

  let str = `<i class="fa ${faC}"></i>
<span class="pl-1">${value}%</span>`;

  return [c, str];
}
const changeCardsValue = (
  chiffreAgence,
  chiffreIob,
  chiffreGab,
  chiffreAcces,
  gabDataDiff,
  reseauDiff,
  accessDiff,
  pointAcces_1
) => {
  chiffreGab = chiffreGab[0];
  accessDiff = accessDiff.toFixed(2);
  chiffreAcces = parseFloat(chiffreAcces);

  let kpiAgence = ((chiffreAgence / adulteNumber_2019) * 10000).toFixed(2);
  let kpiIob = ((chiffreIob / adulteNumber_2019) * 10000).toFixed(2);
  let kpiGab = ((chiffreGab / adulteNumber_2019) * 10000).toFixed(2);
  let kpiAcces = ((chiffreAcces / adulteNumber_2019) * 10000).toFixed(2);

  kpiIobCard.getElementsByClassName("widjet-number")[0].innerText = kpiIob;
  kpiIobCard.getElementsByClassName("pl-1")[0];

  // kpiAccesCard.getElementsByClassName("widjet-number")[0].innerText = kpiAcces;
  // kpiAccesCard.getElementsByClassName("pl-1")[0];

  chiffreIobCard.getElementsByClassName(
    "widjet-number"
  )[0].innerText = nFormatter(chiffreIob, 2);
  chiffreIobCard.getElementsByClassName("pl-1")[0];

  // __________________________________
  let accesStyle = [];

  chiffreAccesCard.getElementsByClassName(
    "widjet-number"
  )[0].innerText = nFormatter(chiffreAcces, 2);

  kpiAccesCard.getElementsByClassName("widjet-number")[0].innerText = kpiAcces;

  if (accessDiff >= 0) {
    accesStyle = renderFaText("up", accessDiff);
  } else {
    accesStyle = renderFaText("down", accessDiff);
  }

  chiffreAccesCard
    .getElementsByClassName("pl-1")[0]
    .classList.add(accesStyle[0]);

  chiffreAccesCard.getElementsByClassName("pl-1")[0].innerHTML = accesStyle[1];
  kpiAccesCard.getElementsByClassName("pl-1")[0].classList.add(accesStyle[0]);

  kpiAccesCard.getElementsByClassName("pl-1")[0].innerHTML = accesStyle[1];

  // _______________________________
  let agenceStyle = [];

  chiffreAgenceCard.getElementsByClassName(
    "widjet-number"
  )[0].innerText = nFormatter(chiffreAgence, 2);
  chiffreAgenceCard.getElementsByClassName("pl-1")[0];

  kpiAgenceCard.getElementsByClassName(
    "widjet-number"
  )[0].innerText = kpiAgence;
  kpiAgenceCard.getElementsByClassName("pl-1")[0];

  if (reseauDiff >= 0) {
    agenceStyle = renderFaText("up", reseauDiff);
  } else {
    agenceStyle = renderFaText("down", reseauDiff);
  }

  chiffreAgenceCard
    .getElementsByClassName("pl-1")[0]
    .classList.add(agenceStyle[0]);

  chiffreAgenceCard.getElementsByClassName("pl-1")[0].innerHTML =
    agenceStyle[1];
  kpiAgenceCard.getElementsByClassName("pl-1")[0].classList.add(agenceStyle[0]);

  kpiAgenceCard.getElementsByClassName("pl-1")[0].innerHTML = agenceStyle[1];

  // ______________________________________________
  let gabStyle = [];

  chiffreGabCard.getElementsByClassName(
    "widjet-number"
  )[0].innerText = nFormatter(chiffreGab, 2);

  if (gabDataDiff >= 0) {
    gabStyle = renderFaText("up", gabDataDiff);
  } else {
    gabStyle = renderFaText("down", gabDataDiff);
  }
  kpiGabCard.getElementsByClassName("widjet-number")[0].innerText = nFormatter(
    kpiGab,
    2
  );

  chiffreGabCard.getElementsByClassName("pl-1")[0].classList.add(gabStyle[0]);

  chiffreGabCard.getElementsByClassName("pl-1")[0].innerHTML = gabStyle[1];
  kpiGabCard.getElementsByClassName("pl-1")[0].classList.add(gabStyle[0]);

  kpiGabCard.getElementsByClassName("pl-1")[0].innerHTML = gabStyle[1];
  // ______________________________________________

  document
    .getElementById("accessGauge")
    .querySelectorAll(".insideP-2 p")[1].innerText = nFormatter(
    chiffreAcces,
    2
  );

  document
    .getElementById("accessGauge")
    .querySelectorAll(".insideP-1 p")[1].innerText = kpiAcces;

  let kpiAcces_1 = ((pointAcces_1 / adulteNumber_2018) * 10000).toFixed(2);
  document
    .getElementById("accessGauge")
    .querySelectorAll(".insideP-4 p")[1].innerText = kpiAcces_1;

  let popTargetVsReel = (((target - kpiAcces) / target) * 100).toFixed(2);
  updatePopGaugeSeries([popTargetVsReel]);
};

// cards end

let bqSelect = document.getElementById("bqSelect");
let year2018Button = document.getElementById("year2018");
let year2019Button = document.getElementById("year2019");
let nbrTotalAgencesP = document.getElementById("totalAgence");
let iobTotalAgencesP = document.getElementById("totalIob");
let totalGabP = document.getElementById("totalGabs");
let totalGabInputDepot = document.getElementById("gabTotalDepot");
let pointAccesTotalP = document.getElementById("totalpointAcces");
let nbrAdulteTotalInput = document.getElementById("nbrAdulteTotal");
let pointAccesNationalTotalP = document.getElementById("totalpointAcces");
let pointAccesNational2019TotalInput = document.getElementById(
  "pointAccesNational2019Total"
);
let pointAccesCashToCashTotalP = document.getElementById("totalCashInOut");
let diffAgenceP = document.getElementById("diffAgence");

var etablissementPaiementNumber = 0;
let pointAccess1Total = 0;
let pointAccess2Total = 0;
let selectedPoinAccessTotal = pointAccess1Total;
let pointAccessCashToCash1Total = 0;
let selectedPointAccessCashToCashTotal = pointAccessCashToCash1Total;

let pointAccessCashToCash2Total = 0;

let reseau1Data_2019 = [];
let reseau2Data_2019 = [];

let reseau1Data_2018_count = 0;
let reseau2Data_2018_count = 0;

let reseau2Data = [];
let reseauBancaire_1_diff = 0;
let reseauBancaire_2_diff = 0;
let reseauBancaire_g_diff = 0;

// variables(optimize code )
let reseau1Number = 0;
let reseau2Number = 0;
let iob1Number = 0;
let iob2Number = 0;
let gab1Number = 0;
let gab2Number = 0;

let selectedReseauNumber = reseau1Number;
let selectIobNumber = iob1Number;
let selectedGabNumber = gab1Number;
let chartData = [];
let gab1Diff = 0;
let gab2Diff = 0;
let gabDiffG = 0;
let selectedGabDiff = 0;
let adulteNumber_2018 = 0;
let adulteNumber_2019 = 0;
let selectedAdulteNumber = adulteNumber_2019;

let pointAccesNational2018Total = 0;
let pointAccesNational2019Total = 0;
let selectedPointAccesNationalTotal = pointAccesNational2018Total;
let selectedResauDiff = 0;
bqSelect.addEventListener("change", function () {
  let selectedValue = Array.from(
    bqSelect.querySelectorAll("option:checked"),
    (e) => e.value
  );

  if (selectedValue.length === 1) {
    if (selectedValue[0] === "bq1") {
      selectedReseauNumber = reseau1Number;
      selectIobNumber = iob1Number;
      selectedGabNumber = gab1Number;

      selectedPoinAccessTotal = pointAccess1Total;

      selectedPointAccessCashToCashTotal = pointAccessCashToCash1Total;

      symbolLayer.setOptions({
        visible: true,
      });
      symbolLayer1.setOptions({
        visible: false,
      });

      selectedGabDiff = gab1Diff;
      selectedResauDiff = reseau1_2018_1_diff;
      selectedAccessTotal_diff = pointAccess1Total_diff;
      selectedPointAcces_1 = pointAccess1Total_2018;

      // here
    } else if (selectedValue[0] === "bq2") {
      selectedReseauNumber = reseau2Number;
      selectIobNumber = iob2Number;
      selectedGabNumber = gab2Number;

      selectedPoinAccessTotal = pointAccess2Total;

      selectedPointAccessCashToCashTotal = pointAccessCashToCash2Total;
      symbolLayer.setOptions({
        visible: false,
      });
      symbolLayer1.setOptions({
        visible: true,
      });
      selectedGabDiff = gab2Diff;

      selectedResauDiff = reseau1_2018_2_diff;
      selectedAccessTotal_diff = pointAccess2Total_diff;
      selectedPointAcces_1 = pointAccess2Total_2018;
    }
  } else {
    selectedReseauNumber = reseau2Number + reseau1Number;
    selectIobNumber = iob2Number + iob1Number;

    selectedGabNumber = [
      gab2Number[0] + gab1Number[0],
      [gab2Number[1] + gab1Number[1]],
    ];

    selectedPoinAccessTotal = pointAccess2Total + pointAccess1Total;

    selectedPointAccessCashToCashTotal =
      pointAccessCashToCash2Total + pointAccessCashToCash1Total;

    symbolLayer.setOptions({
      visible: true,
    });
    symbolLayer1.setOptions({
      visible: true,
    });

    selectedGabDiff = gabDiffG;
    selectedResauDiff = reseau1_2018_g_diff;

    selectedAccessTotal_diff = pointAccessGTotal_diff;
    selectedPointAcces_1 = pointAccess1Total_2018 + pointAccess2Total_2018;
    // updateGabsAgenceChart(
    //   ["Banque1", "Banque2"],
    //   [
    //     [pointAccess1Total_2018, pointAccess1Total],
    //     [pointAccess2Total_2018, pointAccess2Total],
    //   ],
    //   2
    // );
  }

  changeCardsValue(
    selectedReseauNumber,
    selectIobNumber,
    selectedGabNumber,
    selectedPoinAccessTotal,
    selectedGabDiff,
    selectedResauDiff,
    selectedAccessTotal_diff,
    selectedPointAcces_1
  );
});

function updateChartEvent() {
  chartData = [
    selectedReseauNumber,
    selectIobNumber,
    selectedGabNumber[0],
    selectedGabNumber[1],
    selectedPoinAccessTotal,
    selectedPointAccessCashToCashTotal,
  ];
  updateChartData(myChart, chartData);
}

let pointAccess1Total_2018 = 0;
let pointAccess2Total_2018 = 0;
let pointAccess2Total_diff = 0;
let pointAccess1Total_diff = 0;
let pointAccessGTotal_diff = 0;
let selectedAccessTotal_diff = 0;

async function init() {
  let responseReseau = await fetch("/xlxs/resBancaire");
  let reseauData = await responseReseau.json();

  reseau1Data_2019 = reseauData.data[0];
  reseau2Data_2019 = reseauData.data[1];

  reseau1Number = reseau1Data_2019.length;
  reseau2Number = reseau2Data_2019.length;

  reseau1_2018_1_diff = reseauData.data[4];
  reseau1_2018_2_diff = reseauData.data[5];
  reseau1_2018_g_diff = reseauData.data[6];

  reseau1Data_2018_count = reseauData.data[2];
  reseau2Data_2018_count = reseauData.data[3];
  reseauBancaire_1_diff = reseauData.data[4];
  reseauBancaire_2_diff = reseauData.data[5];
  reseauBancaire_g_diff = reseauData.data[6];

  // diffAgenceP.innerText = reseauBancaire_1_diff + "%";

  let responseIob = await fetch("/xlxs/iob");
  let iobData = await responseIob.json();
  // let iobData = { data: [100, 300] };
  iob1Number = iobData.data[0];
  iob2Number = iobData.data[1];

  let responseGab = await fetch("/xlxs/gab");
  let gabData = await responseGab.json();
  gab1Number = gabData.data[0];

  gab2Number = gabData.data[1];

  let gabData_2018_1_count = gabData.data[3][0];
  let gabData_2018_2_count = gabData.data[3][1];

  gab1Diff = gabData.data[2][0];
  gab2Diff = gabData.data[2][1];
  gabDiffG = gabData.data[2][2];

  let responseAdulte = await fetch("/xlxs/popAdulte");
  let adulteData = await responseAdulte.json();

  pointAccess1Total =
    reseau1Number + iob1Number + etablissementPaiementNumber + gab1Number[0];

  pointAccess2Total =
    reseau2Number + iob2Number + etablissementPaiementNumber + gab2Number[0];

  pointAccess1Total_2018 =
    reseau1Data_2018_count +
    iob1Number +
    etablissementPaiementNumber +
    gabData_2018_1_count;

  pointAccess2Total_2018 =
    reseau2Data_2018_count +
    iob2Number +
    etablissementPaiementNumber +
    gabData_2018_2_count;

  pointAccess1Total_diff =
    ((pointAccess1Total - pointAccess1Total_2018) / pointAccess1Total) * 100;

  pointAccess2Total_diff =
    ((pointAccess2Total - pointAccess2Total_2018) / pointAccess2Total) * 100;

  pointAccessGTotal_diff =
    ((pointAccess1Total +
      pointAccess2Total -
      (pointAccess2Total_2018 + pointAccess1Total_2018)) /
      (pointAccess1Total + pointAccess2Total)) *
    100;

  pointAccessCashToCash1Total =
    reseau2Number +
    reseau1Number +
    iob1Number +
    iob2Number +
    etablissementPaiementNumber +
    gab1Number[1];

  pointAccessCashToCash2Total =
    reseau2Number +
    reseau1Number +
    iob1Number +
    iob2Number +
    etablissementPaiementNumber +
    gab2Number[1];

  selectedReseauNumber = reseau1Number + reseau2Number;

  selectIobNumber = iob1Number + iob2Number;

  selectedGabDiff = gabDiffG;
  selectedPoinAccessTotal = pointAccess1Total + pointAccess2Total;

  // gere
  selectedPointAccessCashToCashTotal = pointAccessCashToCash1Total;

  pointAccesNational2018Total = (
    (selectedPointAccessCashToCashTotal * 10000) /
    adulteData.data.adulteTotalValues[6]
  ).toFixed(3);

  pointAccesNational2019Total = (
    (selectedPointAccessCashToCashTotal * 10000) /
    adulteData.data.adulteTotalValues[5]
  ).toFixed(3);

  document.getElementById("popDiff").innerText = nFormatter(
    adulteData.data.adulteTotalValues[6],
    2
  );

  selectedPointAccesNationalTotal = pointAccesNational2018Total;

  chartData = [
    reseau1Number,
    iob1Number,
    gab1Number[0],
    gab1Number[1],
    pointAccess1Total,
    pointAccessCashToCash1Total,
  ];

  createGaugeChartHtml(
    "accessGauge",
    accessPopGaugeJson,
    [83],
    "Réel vs Target",
    popAccessChart,
    "popAccessGauge"
  );

  adulteNumber_2019 = adulteData.data.adulteTotalValues[5];
  adulteNumber_2018 = adulteData.data.adulteTotalValues[4];

  createPopulationChart(
    adulteData.data.adulteTotalKeys,
    adulteData.data.adulteTotalValues
  );

  createGabsAgenceChart(
    ["Banque1", "Banque2"],
    [
      [pointAccess1Total_2018, pointAccess2Total_2018],
      [pointAccess1Total, pointAccess2Total],
    ]
  );

  selectedGabNumber = [
    gab2Number[0] + gab1Number[0],
    [gab2Number[1] + gab1Number[1]],
  ];

  createGaugeChartHtml(
    "popWithAccessGauge",
    popWithAccessGaugeJson,
    [(((adulteNumber_2019 - 850000) / adulteNumber_2019) * 100).toFixed(2)],
    "Taux",
    popWithAccessChart,
    "withAccessGauge"
  );

  createGaugeChartHtml(
    "uniteAccessGauge",
    uniteAccessPopGaugeJson,
    [(((1695 - 242) / 1695) * 100).toFixed(2)],
    "Taux",
    uniteAccessChart,
    "uniteGauge"
  );

  document
    .getElementById("accessGauge")
    .querySelectorAll(".insideP-3 p")[1].innerText = nFormatter(
    adulteNumber_2019,
    2
  );

  document
    .getElementById("popWithAccessGauge")
    .querySelectorAll(".insideP-2 p")[1].innerText = nFormatter(
    adulteNumber_2019,
    2
  );

  document
    .getElementById("popWithAccessGauge")
    .querySelectorAll(".insideP-3 p")[1].innerText = nFormatter(
    adulteNumber_2018,
    2
  );

  document
    .getElementById("popWithAccessGauge")
    .querySelectorAll(".insideP-1 p")[1].innerText = nFormatter(
    adulteNumber_2019 - 850000,
    2
  );

  document
    .getElementById("popWithAccessGauge")
    .querySelectorAll(".insideP-4 p")[1].innerText =
    nFormatter(((adulteNumber_2018 - 850000) / adulteNumber_2018) * 100, 2) +
    "%";

  document
    .getElementById("popWithAccessGauge")
    .querySelectorAll(".insideP-3 p")[1].innerText = nFormatter(
    adulteNumber_2018,
    2
  );

  document
    .getElementById("uniteAccessGauge")
    .querySelectorAll(".insideP-2 p")[1].innerText = nFormatter(
    uniteAcces - 5,
    2
  );

  document
    .getElementById("uniteAccessGauge")
    .querySelectorAll(".insideP-1 p")[1].innerText = nFormatter(
    uniteAcces - 333,
    2
  );

  document
    .getElementById("uniteAccessGauge")
    .querySelectorAll(".insideP-1 p")[1].innerText = nFormatter(
    uniteAcces - 242,
    2
  );

  document
    .getElementById("uniteAccessGauge")
    .querySelectorAll(".insideP-3 p")[1].innerText = nFormatter(
    uniteAcces - 242 - 140,
    2
  );

  document
    .getElementById("uniteAccessGauge")
    .querySelectorAll(".insideP-4 p")[1].innerText =
    nFormatter(((uniteAcces - 242 - 140) / uniteAcces) * 100, 2) + "%";

  changeCardsValue(
    selectedReseauNumber,
    selectIobNumber,
    selectedGabNumber,
    selectedPoinAccessTotal,
    selectedGabDiff,
    reseau1_2018_g_diff,
    pointAccessGTotal_diff,
    pointAccess1Total_2018 + pointAccess2Total_2018
  );
}

$(function () {
  $("select").selectpicker();
});

function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (Math.abs(num) >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
