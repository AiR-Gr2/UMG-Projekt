console.log("js zaladowany");

const knob1 = document.querySelector(".knob1");
const knob2 = document.querySelector(".knob2");
const multimeterKnob1 = document.querySelector(".multimeterKnob1");
const multimeterKnob2 = document.querySelector(".multimeterKnob2");
const mode = {
  0: "OFF",
  1: "PHOTORESISTOR",
  2: "VARISTOR",
};

const chartTitles = {
  OFF: "Charakterystyka niedostępna",
  PHOTORESISTOR: "Charakterystyka fotorezystora",
  VARISTOR: "Charakterystyka warystora",
};

const chartData = {
  OFF: {
    labels: [0, 1, 2, 3, 4, 5],
    data: [0, 0, 0, 0, 0, 0],
  },
  PHOTORESISTOR: {
    labels: [0, 1, 2, 3, 4, 5],
    data: [0, 0.2, 0.5, 1.2, 2.4, 4.0],
  },
  VARISTOR: {
    labels: [0, 10, 20, 30, 40, 50],
    data: [0, 0.1, 0.3, 0.7, 1.5, 2.8],
  },
};

const multimeterMode = {
  0: { degree: 0, mode: "OFF" },
  1: { degree: 96, mode: "DCV 200m" },
  2: { degree: 108, mode: "DCV 2" },
  3: { degree: 120, mode: "DCV 20" },
  4: { degree: 132, mode: "DCV 200" },
  5: { degree: 144, mode: "DCV 1000" },
  6: { degree: 287, mode: "DCA 20" },
  7: { degree: 298, mode: "DCA 2" },
  8: { degree: 311, mode: "DCA 200m" },
  9: { degree: 324, mode: "DCA 20m" },
  10: { degree: 336, mode: "DCA 2m" },
  11: { degree: 348, mode: "DCA 200u" },
};
let rotationsKnob1 = 1;
let rotationsKnob2 = 1;
let rotationsMultimeterKnob1 = 1;
let currentMode = mode[0];
let currentMultimeterMode = multimeterMode[0].mode;
let rotationsMultimeterKnob2 = 1;
let currentMultimeterMode2 = multimeterMode[0].mode;
let chartInstance;

knob1.addEventListener("mousedown", () => {
  knob1.style.transform = `rotate(${rotationsKnob1 * 45}deg)`;
  if (rotationsKnob1 === 8) rotationsKnob1 = 1;
  else rotationsKnob1++;
});

knob2.addEventListener("mousedown", () => {
  knob2.style.transform = `rotate(${rotationsKnob2 * 60}deg)`;
  if (rotationsKnob2 === 2) {
    currentMode = mode[rotationsKnob2];
    rotationsKnob2 = 0;
  } else {
    currentMode = mode[rotationsKnob2];
    rotationsKnob2++;
  }

  console.log("Current Mode:", currentMode); // sprawdzanko
  updateChartByMode();
});

multimeterKnob1.addEventListener("mousedown", () => {
  multimeterKnob1.style.transform = `rotate(${multimeterMode[rotationsMultimeterKnob1].degree}deg)`;
  if (rotationsMultimeterKnob1 === 11) {
    currentMultimeterMode = multimeterMode[rotationsMultimeterKnob1].mode;
    rotationsMultimeterKnob1 = 0;
  } else {
    currentMultimeterMode = multimeterMode[rotationsMultimeterKnob1].mode;
    rotationsMultimeterKnob1++;
  }
});
multimeterKnob2.addEventListener("mousedown", () => {
  multimeterKnob2.style.transform = `rotate(${multimeterMode[rotationsMultimeterKnob2].degree}deg)`;
  if (rotationsMultimeterKnob2 === 11) {
    currentMultimeterMode2 = multimeterMode[rotationsMultimeterKnob2].mode;
    rotationsMultimeterKnob2 = 0;
  } else {
    currentMultimeterMode2 = multimeterMode[rotationsMultimeterKnob2].mode;
    rotationsMultimeterKnob2++;
  }
});
const ctx = document.getElementById("chart").getContext("2d");
chartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartData.OFF.labels,
    datasets: [
      {
        label: "Charakterystyka I(U)",
        data: chartData.OFF.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: chartTitles.OFF,
        font: {
          size: 25, // Zwiększenie rozmiaru czcionki tytułu
          weight: "bold", // Grubość czcionki
          family: "Arial", // Czcionka (opcjonalnie)
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Napięcie [U]",
        },
      },
      y: {
        title: {
          display: true,
          text: "Natężenie [I]",
        },
      },
    },
  },
});

function updateChartByMode() {
  const title = chartTitles[currentMode] || "Charakterystyka niedostępna";
  const data = chartData[currentMode] || chartData.OFF;
  console.log("Setting chart title:", title); // sprawdzanko
  if (chartInstance) {
    chartInstance.data.labels = data.labels;
    chartInstance.data.datasets[0].data = data.data;
    chartInstance.options.plugins.title.text = title;
  }
  chartInstance.update();
}

//diuoda
const networkSwitch = document.getElementById("networkSwitch");
const networkLed = document.getElementById("networkLed");

function updateLedState() {
  const isNetworkOn = networkSwitch.checked;

  if (isNetworkOn) {
    networkLed.classList.add("on");
    document
      .querySelectorAll('input[type="checkbox"]:not(#networkSwitch)')
      .forEach((checkbox) => {
        checkbox.disabled = false;
      });
  } else {
    networkLed.classList.remove("on");

    currentMode = mode[0];
    currentMultimeterMode = multimeterMode[0].mode;
    currentMultimeterMode2 = multimeterMode[0].mode;

    updateChartByMode();

    document
      .querySelectorAll('input[type="checkbox"]:not(#networkSwitch)')
      .forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.disabled = true;
      });

    rotationsKnob1 = 1;
    rotationsKnob2 = 1;
    rotationsMultimeterKnob1 = 1;
    rotationsMultimeterKnob2 = 1;

    knob1.style.transform = "rotate(0deg)";
    knob2.style.transform = "rotate(0deg)";
    multimeterKnob1.style.transform = "rotate(0deg)";
    multimeterKnob2.style.transform = "rotate(0deg)";
  }

  knob1.style.pointerEvents = isNetworkOn ? "auto" : "none";
  knob2.style.pointerEvents = isNetworkOn ? "auto" : "none";
  multimeterKnob1.style.pointerEvents = isNetworkOn ? "auto" : "none";
  multimeterKnob2.style.pointerEvents = isNetworkOn ? "auto" : "none";

  console.log("Network state:", isNetworkOn ? "ON" : "OFF");
}

networkSwitch.addEventListener("change", updateLedState);
updateLedState();
