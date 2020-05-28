var ctx = document.getElementById("myChart");

var popCtx = document.getElementById("popChart");

var gabCtx = document.getElementById("gabChart");
var myChart;
var popChart;
var gabsChart;
// apex chart
var gaugeChart;
var popAccessChart = 1;
var uniteAccessChart = 2;
var popWithAccessChart = 3;

Chart.defaults.global.defaultFontColor = "black";

const accessPopGaugeJson = {
  block1: {
    label: "Ratio (Accès vs Population)",
    value: "1,2",
  },

  block2: {
    label: "Total accès",
    value: "4500",
  },
  block3: {
    label: "Population",
    value: "4500",
  },
  block4: {
    label: "Ratio A-1",
    value: "4500",
  },
};

const uniteAccessPopGaugeJson = {
  block1: {
    label: "Unité avec accès",
    value: "1,2",
  },

  block2: {
    label: "Unités ",
    value: "4500",
  },
  block3: {
    label: "Unité avec accès A-1",
    value: "4500",
  },
  block4: {
    label: "Taux A-1",
    value: "4500",
  },
};

const popWithAccessGaugeJson = {
  block1: {
    label: "Population avec accès",
    value: "1,2",
  },

  block2: {
    label: "Population ",
    value: "4500",
  },
  block3: {
    label: "Population  A-1",
    value: "35,5",
  },
  block4: {
    label: "Taux A-1",
    value: "80%",
  },
};

const createGaugeChartHtml = (
  targetId,
  jsonCible,
  series,
  label,
  chartGlobal,
  idChart
) => {
  let target = document.getElementById(targetId);

  const { block1, block2, block3, block4 } = jsonCible;

  var html = `  


  <div id="${idChart}" style="    height: max-content; position: absolute;
  top: 35px; right: 0"></div>


<div class="insideP insideP-1" style="top: 15px; left: 15px;">

<p>${block1.label}</p>
<p>${block1.value}</p>
</div>


<div  class="insideP insideP-2 " style="bottom: 15px; left: 15px;">

<p>${block2.label}</p>
<p>${block2.value}</p>
</div>

<div  class="insideP insideP-3 " style="bottom: 15px;
left: 50%;
transform: translateX(-50%);
">

<p>${block3.label}</p>
<p>${block3.value}</p>
</div>


<div  class="insideP insideP-4 " style="bottom: 15px; right: 15px;">
<p>${block4.label}</p>
<p>${block4.value}</p>
</div>


`;
  target.innerHTML = html;

  let ctx = document.getElementById(idChart);
  createGaugeChart(series, label, ctx, chartGlobal, targetId);
};

const createGaugeChart = (series, label, ctx, chartGlobal, targetId) => {
  var options = {
    series,
    chart: {
      height: 160,
      type: "radialBar",
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        track: {
          background: "transparant",
        },
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "9px",
            color: "#3b054c",
            offsetY: -10,
            width: 10,
          },
          value: {
            offsetY: 0,
            fontSize: "12px",
            color: "#3b054c",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          {
            offset: 0,
            color: "rgba(234,84,85,1)",
            opacity: 1,
          },
          {
            offset: 50,
            color: "rgba(115,103,240,1)",

            opacity: 1,
          },
        ],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: [label],
  };

  if (targetId === "accessGauge") {
    popAccessChart = new ApexCharts(ctx, options);
    popAccessChart.render();
  } else {
    chartGlobal = new ApexCharts(ctx, options);
    chartGlobal.render();
  }
};

const createPopulationChart = (keys, data) => {
  var options = {
    grid: {
      show: false,
      padding: {
        bottom: -100,
      },
    },
    series: [
      {
        name: "",
        data,
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      height: "185px",
      width: "100%",
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      colors: ["rgba(115,103,240,1)"],
    },
    xaxis: {
      categories: keys,
      show: true,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
      },
    },
    yaxis: {
      show: false,
    },
  };

  popChart = new ApexCharts(document.querySelector("#popChart"), options);
  popChart.render();
};

const updateGabsChart = (labels, data, length) => {
  let series = [
    {
      name: labels[0],
      data: data[0],
    },
    {
      name: labels[1],
      data: data[1],
    },
  ];

  gabsChart.updateSeries(series);
};

const updatePopGaugeSeries = (series) => {
  try {
    popAccessChart.updateSeries(series);
  } catch (e) {
    console.log(e);
  }
};

const updateGabsAgenceChart = (labels, data, length) => {
  const series = [
    {
      name: labels[0],
      data: data[0],
    },
    {
      name: labels[1],
      data: data[1],
    },
  ];

  if (length < 2) series.pop();

  gabsChart.updateSeries(series);
  gabsChart.updateOptions({
    xaxis: {
      categories: labels,
    },
  });
};

const createGabsAgenceChart = (labels, data) => {
  var options = {
    colors: ["#400047", "#9f9C68"],
    series: [
      {
        name: labels[0],
        data: data[0],
      },
      {
        name: labels[1],
        data: data[1],
      },
    ],
    chart: {
      height: 300,
      type: "bar",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          foreColor: "#fff",
          style: {
            colors: ["#fff"],
          },
          position: "center", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,

      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },

    xaxis: {
      categories: labels,
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: false,
        x: {
          show: false,
        },
      },
    },
    legend: {
      position: "right",
      formatter: function (seriesName, opts) {
        if (seriesName == "Banque1") return "A-1";
        else return "A";
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val;
        },
      },
    },
    title: {
      text: "Points d'accès par banque",
      floating: true,
      offsetY: 0,
      align: "left",
      style: {
        color: "#444",
      },
    },

    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: undefined,
        yAlign: "center",

        title: {
          formatter: (seriesName) => {
            if (seriesName === "Banque1") {
              return "A-1";
            } else return "A";
          },
        },
      },
      items: {
        display: "flex",
        "align-items": "center",
      },

      // marker: {
      //   show: true,
      // },

      // fixed: {
      //   enabled: false,
      //   position: "topRight",
      //   offsetX: 0,
      //   offsetY: 0,
      // },
    },
  };

  gabsChart = new ApexCharts(document.querySelector("#gabsChart"), options);

  gabsChart.render();
};

function updateChartData(chart, data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

// function updateGabChart(data, oneDataSet, dataSetNumber) {
//   let labels = ["Banque 1", "Banque 2"];

//   let datasets = [
//     {
//       label: "Gabs",
//       fill: false,
//       data: data[0],

//       backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(54, 162, 235, 0.8)"],
//       borderColor: ["rgba(54, 162, 235, 1)", "rgba(54, 162, 235, 1)"],

//       borderWidth: 1,
//     },

//     {
//       label: "Agences",
//       fill: false,
//       data: data[1],
//       backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(255, 99, 132, 0.8)"],
//       borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 99, 132, 1)"],

//       borderWidth: 1,
//     },
//   ];

//   if (oneDataSet) {
//     if (dataSetNumber === 1) {
//       labels.pop();
//     }

//     if (dataSetNumber === 2) {
//       labels.shift();
//     }
//   }
//   gabsChart.data.labels = labels;
//   gabsChart.data.datasets = datasets;
//   gabsChart.update();
// }
