console.log("js zaladowany");

const knob1 = document.querySelector(".knob1");
const knob2 = document.querySelector(".knob2");
const multimeterKnob1 = document.querySelector(".multimeterKnob1");
const multimeterKnob2 = document.querySelector(".multimeterKnob2");

//przyciski
const btnBoxA = document.getElementById("btnBoxA");
const btnBoxCOM1 = document.getElementById("btnBoxCOM1");
const btnBoxV = document.getElementById("btnBoxV");
const btnBoxCOM2 = document.getElementById("btnBoxCOM2");
const btnMultimeter1A = document.getElementById("btnMultimeter1A");
const btnMultimeter1COM = document.getElementById("btnMultimeter1COM");
const btnMultimeter1V = document.getElementById("btnMultimeter1V");
const btnMultimeter2A = document.getElementById("btnMultimeter2A");
const btnMultimeter2COM = document.getElementById("btnMultimeter2COM");
const btnMultimeter2V = document.getElementById("btnMultimeter2V");
const btnPhotoresistorIllumination = document.getElementById("photoresistor_illumination");

const mode = {
  0: "OFF",
  1: "PHOTORESISTOR",
  2: "VARISTOR",
  3: "ILLUMINATED_PHOTORESISTOR"
};

const chartTitles = {
  OFF: "Charakterystyka niedostępna",
  PHOTORESISTOR: "Charakterystyka fotorezystora",
  VARISTOR: "Charakterystyka warystora",
  ILLUMINATED_PHOTORESISTOR: "Charakterystyka oświetlonego fotorezystora"
};

btnPhotoresistorIllumination.addEventListener("click", () => {
    if (btnPhotoresistorIllumination.checked) {
        currentMode = mode[3];
        updateChartByMode();
        updateChartData();
        updateMultimetersDisplay();
    } else {
      currentMode = mode[1];
      updateChartByMode();
      updateChartData();
      updateMultimetersDisplay();
    }
    console.log("Oswietlenie rezystora button:", currentMode);
});

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
  ILLUMINATED_PHOTORESISTOR: {
    labels: [0, 1, 2, 3, 4, 5],
    data: [0, 0.2, 0.5, 1.2, 2.4, 4.0],
  }
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

const knob1Voltage = {
  0: { varistor: 0, photoresistor: 0, varistorA: 0, photoresistorA: 0, illuminatedPhotoresistor: 0, illuminatedPhotoresistorA: 0},
  1: { varistor: 5, photoresistor: 5, varistorA: 0.05, photoresistorA: 0.01, illuminatedPhotoresistor: 5, illuminatedPhotoresistorA: 0.02},
  2: { varistor: 10, photoresistor: 10, varistorA: 0.1, photoresistorA: 0.01, illuminatedPhotoresistor: 10, illuminatedPhotoresistorA: 0.04},
  3: { varistor: 20, photoresistor: 15, varistorA: 0.3, photoresistorA: 0.01, illuminatedPhotoresistor: 15, illuminatedPhotoresistorA: 0.06},
  4: { varistor: 25, photoresistor: 20, varistorA: 1, photoresistorA: 0.01, illuminatedPhotoresistor: 20, illuminatedPhotoresistorA: 0.08},
  5: { varistor: 27, photoresistor: 25, varistorA: 5, photoresistorA: 0.01, illuminatedPhotoresistor: 25, illuminatedPhotoresistorA: 0.1},
  6: { varistor: 30, photoresistor: 30, varistorA: 15, photoresistorA: 0.01, illuminatedPhotoresistor: 30, illuminatedPhotoresistorA: 0.12},
  7: { varistor: 32, photoresistor: 35, varistorA: 30, photoresistorA: 0.01, illuminatedPhotoresistor: 35, illuminatedPhotoresistorA: 0.14},
  8: { varistor: 35, photoresistor: 40, varistorA: 50, photoresistorA: 0.01, illuminatedPhotoresistor: 40, illuminatedPhotoresistorA: 0.16},
};

let rotationsKnob1 = 0;
let rotationsKnob2 = 1;
let rotationsMultimeterKnob1 = 1;
let currentMode = mode[0];
let currentMultimeterMode = multimeterMode[0].mode;
let rotationsMultimeterKnob2 = 1;
let currentMultimeterMode2 = multimeterMode[0].mode;
let chartInstance;
let multimeterDisplay1 = document.getElementById("multimeter1-value");
let multimeterDisplay2 = document.getElementById("multimeter2-value");
let multimeter1Active = false;
let multimeter2Active = false;
let resistance = 1000;

function getDisplayValue(currentMultimeterMode, multimeterNumber) {
  let cableStatus = "OFF";
  if (multimeterNumber === 1) {
    cableStatus = checkMultimeter1Status();
  } else if (multimeterNumber === 2) {
    cableStatus = checkMultimeter2Status();
  } else return cableStatus;

  if (cableStatus === "A") {
    switch (currentMultimeterMode) {
      case "OFF":
        return "OFF";
      case "DCV 200m":
        return "0L";
      case "DCV 2":
        return "0L";
      case "DCV 20":
        return "0L";
      case "DCV 200":
        return "0L";
      case "DCV 1000":
        return "0L";
      case "DCA 20":
        return calculateDisplayValue(getAmp(), 20, 1);
      case "DCA 2":
        return calculateDisplayValue(getAmp(), 2, 2);
      case "DCA 200m":
        return calculateDisplayValue(getAmp(), 0.2, 3);
      case "DCA 20m":
        return calculateDisplayValue(getAmp(), 0.02, 3);
      case "DCA 2m":
        return calculateDisplayValue(getAmp(), 0.002, 3);
      case "DCA 200u":
        return calculateDisplayValue(getAmp(), 0.0002, 3);
      default:
        return "OFF";
    }
  }
  if (cableStatus === "V") {
    switch (currentMultimeterMode) {
      case "OFF":
        return "OFF";
      case "DCV 200m":
        return calculateDisplayValue(getVoltage(), 0.2, 3);
      case "DCV 2":
        return calculateDisplayValue(getVoltage(), 2, 3);
      case "DCV 20":
        return calculateDisplayValue(getVoltage(), 20, 2);
      case "DCV 200":
        return calculateDisplayValue(getVoltage(), 200, 1);
      case "DCV 1000":
        return calculateDisplayValue(getVoltage(), 1000, 0);
      case "DCA 20":
        return "0L";
      case "DCA 2":
        return "0L";
      case "DCA 200m":
        return "0L";
      case "DCA 20m":
        return "0L";
      case "DCA 2m":
        return "0L";
      case "DCA 200u":
        return "0L";
      default:
        return "OFF";
    }
  }
}

function calculateDisplayValue(value, range, fix) {
  console.log("Calculated display value:", value);
  if (value > range) return "0L";
  if (Number.isNaN(value) || typeof value === "string") return "OFF";
  return valueToFixed(value, fix);
}

function valueToFixed(value, fix) {
  if (typeof value === "number") return value.toFixed(fix);
}

function getVoltage() {
  let voltage = "OFF";
  if (currentMode === "PHOTORESISTOR") {
    voltage = knob1Voltage[rotationsKnob1].photoresistor;
  } else if (currentMode === "VARISTOR") {
    voltage = knob1Voltage[rotationsKnob1].varistor;
  } else if (currentMode === "ILLUMINATED_PHOTORESISTOR") {
    voltage = knob1Voltage[rotationsKnob1].illuminatedPhotoresistor;
  }
  console.log("Voltage:", voltage); // sprawdzanko
  return voltage;
}

function getAmp() {
  let amp = "OFF";
  if (currentMode === "PHOTORESISTOR") {
    amp = knob1Voltage[rotationsKnob1].photoresistorA;
  } else if (currentMode === "VARISTOR") {
    amp = knob1Voltage[rotationsKnob1].varistorA;
  } else if (currentMode === "ILLUMINATED_PHOTORESISTOR") {
    amp = knob1Voltage[rotationsKnob1].illuminatedPhotoresistorA;
  }
  console.log("Voltage:", amp); // sprawdzanko
  return amp;
}


function updateMultimetersDisplay() {
  if (multimeter1Active) {
    multimeterDisplay1.textContent = getDisplayValue(currentMultimeterMode, 1);
  } else {
    multimeterDisplay1.textContent = "OFF";
  }
  if (multimeter2Active) {
    multimeterDisplay2.textContent = getDisplayValue(currentMultimeterMode2, 2);
  } else {
    multimeterDisplay2.textContent = "OFF";
  }
}

knob1.addEventListener("mousedown", () => {
  if (rotationsKnob1 === 8) rotationsKnob1 = 0;
  else rotationsKnob1++;
  knob1.style.transform = `rotate(${270 + rotationsKnob1 * 22.5}deg)`;
  console.log("Rotations knob1:", rotationsKnob1); // sprawdzanko
  updateMultimetersDisplay();
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
  if (currentMode === "PHOTORESISTOR") {
    btnPhotoresistorIllumination.disabled = false;
  } else {
    btnPhotoresistorIllumination.disabled = true;
    btnPhotoresistorIllumination.checked = false;
  }
  updateChartByMode();
  updateMultimetersDisplay();
  updateChartData();
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
  updateMultimetersDisplay();
  console.log("Current Multimeter1 Mode:", currentMultimeterMode);
  updateChartData();
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
  updateMultimetersDisplay();
  updateChartData();
  console.log("Current Multimeter2 Mode:", currentMultimeterMode2);
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
          size: 25,
          weight: "bold",
          family: "Arial",
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
  if (chartInstance) {
    chartInstance.options.plugins.title.text = title;
  }
  chartInstance.update();
}

function updateChartData() {
  const current1 = getDisplayValue(currentMultimeterMode, 1); // Pobranie wartości prądu z multimetru 1
  const current2 = getDisplayValue(currentMultimeterMode2, 2); // Pobranie wartości prądu z multimetru 2

  const current1Value = current1 === "0L" ? 0 : parseFloat(current1);
  const current2Value = current2 === "0L" ? 0 : parseFloat(current2);

  const fakeData1 = generateFakeData(currentMode, 1);
  const fakeData2 = generateFakeData(currentMode, 2);

  console.log("d1", fakeData1);
  console.log("d2", fakeData2);

  const data = {
    labels: fakeData2,
    datasets: [
      {
        label: "Natężenie prądu 1 (I)",
        data: fakeData1,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  // Zaktualizowanie wykresu z nowymi danymi
  chartInstance.data = data;
  chartInstance.update();
}

function generateFakeData(currentMode, multimeterNumber) {
  let fakeData = [];
  
  switch (currentMode) {
    case "VARISTOR":
      if (multimeterNumber === 1) {
        fakeData = [0,0.05,0.1,0.3,1,5,15];
      } else if (multimeterNumber === 2) {
        fakeData = [0,5,10,20,25,27,30];
      }
      break;
    case "PHOTORESISTOR":
      if (multimeterNumber === 1) {
        fakeData = [0,0,0,0,0,0,0];
        } else if (multimeterNumber === 2) {
        fakeData = [0,5,10,15,20,25,30];
        }
      break;
    case "ILLUMINATED_PHOTORESISTOR":
      if (multimeterNumber === 1) {
          fakeData = [0,0.02,0.04,0.06,0.08,0.1,0.12];
        } else if (multimeterNumber === 2) {
          fakeData = [0,5,10,15,20,25,30];
        }
      break;
    case "OFF":
      fakeData = [];
      break;    
    default:
      fakeData = [];
  }
  return fakeData;
}

// dioda sieci
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

    document
      .querySelectorAll('input[type="checkbox"]:not(#networkSwitch)')
      .forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.disabled = true;
      });

    rotationsKnob1 = 0;
    rotationsKnob2 = 1;
    rotationsMultimeterKnob1 = 1;
    rotationsMultimeterKnob2 = 1;

    knob1.style.transform = "rotate(270deg)";
    knob2.style.transform = "rotate(0deg)";
    multimeterKnob1.style.transform = "rotate(0deg)";
    multimeterKnob2.style.transform = "rotate(0deg)";
    updateMultimetersDisplay();
  }

  knob1.style.pointerEvents = isNetworkOn ? "auto" : "none";
  knob2.style.pointerEvents = isNetworkOn ? "auto" : "none";

  console.log("Network state:", isNetworkOn ? "ON" : "OFF");
  btnPhotoresistorIllumination.disabled = true;
}

networkSwitch.addEventListener("change", updateLedState);
updateLedState();

// kabelki
const CABLE_SEGMENTS = 5; // bugged
let cable = null; // aktualnie tworzony kabel
let startButton = null;
let connections = [];

// warstwa svg
const svg = d3
  .select("body")
  .append("svg")
  .attr("class", "cable-layer")
  .attr("width", window.innerWidth)
  .attr("height", document.documentElement.scrollHeight);

// rysowanie prostej
const simulationNodeDrawer = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveLinear);

// dane dla przyciskow
d3.selectAll(".roundButton").each(function () {
  const btn = d3.select(this);
  btn.datum({
    type: btn.attr("data-type"),
    connected: false,
    connectionCable: null,
  });
});

// bsługa zdarzen
d3.selectAll(".roundButton")
  .on("mousedown", function (event, d) {
    event.stopPropagation();
    if (d.connected) return;

    startButton = this;
    const rect = this.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 + window.scrollX;
    const startY = rect.top + rect.height / 2 + window.scrollY;

    const cableColor = d.type === "black" ? "black" : "#c43617";
    let c = svg
      .append("path")
      .attr("stroke", cableColor)
      .attr("fill", "none")
      .attr("stroke-width", 10);

    cable = c;

    const nodes = d3.range(CABLE_SEGMENTS).map(() => ({}));
    const links = d3
      .pairs(nodes)
      .map(([source, target]) => ({ source, target }));

    nodes[0].fx = startX;
    nodes[0].fy = startY;
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].fx = startX;
      nodes[i].fy = startY;
    }

    const sim = d3
      .forceSimulation(nodes)
      .force("links", d3.forceLink(links).strength(0.5))
      .force("collide", d3.forceCollide(20))
      .on("tick", () => {
        c.attr("d", simulationNodeDrawer(nodes));
      });

    cable.datum({ nodes, sim, endpoints: [] });
  })
  .on("click", function (event, d) {
    if (d.connected && d.connectionCable) {
      removeConnection(this);
      console.log(connections);
      console.log("Multimeter1 mode: " + checkMultimeter1Status());
      console.log("Multimeter2 mode: " + checkMultimeter2Status());
    }
  });

d3.select(document).on("mousemove", (event) => {
  if (cable) {
    const { nodes, sim } = cable.datum();
    const end = nodes[nodes.length - 1];

    end.fx = event.clientX + window.scrollX;
    end.fy = event.clientY + window.scrollY;

    const start = nodes[0];
    const distance = Math.sqrt(
      (end.fx - start.fx) ** 2 + (end.fy - start.fy) ** 2
    );
    sim.force("links").distance(distance / CABLE_SEGMENTS);
    sim.alpha(1).restart();
  }
});

d3.select(document).on("mouseup", (event) => {
  if (cable) {
    if (event.target.tagName === "BUTTON" && event.target !== startButton) {
      const targetData = d3.select(event.target).datum();
      const startData = d3.select(startButton).datum();

      if (targetData.connected || startData.type !== targetData.type) {
        cable.remove();
      } else {
        const rect = event.target.getBoundingClientRect();
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;

        const { nodes, sim } = cable.datum();
        const end = nodes[nodes.length - 1];
        end.fx = endX;
        end.fy = endY;
        sim.alpha(1).restart();
        sim.stop();

        cable.datum().endpoints = [startButton, event.target];

        startData.connected = true;
        targetData.connected = true;
        startData.connectionCable = cable;
        targetData.connectionCable = cable;
        d3.select(startButton).classed("connected", true);
        d3.select(event.target).classed("connected", true);

        connections.push({ start: startButton, end: event.target, cable });
        let check1 = checkMultimeter1Status();
        let check2 = checkMultimeter2Status();
        console.log("Multimeter1 mode: " + check1);
        console.log("Multimeter2 mode: " + check2);
        console.log(connections);
        console.log(turnMultimeters(check1, check2));
        updateMultimetersDisplay();
      }
    } else {
      cable.remove();
    }
    cable = null;
    startButton = null;
  }
});

// sprawdza tryb prawego multimetra
function checkMultimeter2Status() {
  const isConnectedToCOM = isConnected(btnMultimeter2COM, btnBoxCOM1);
  const isConnectedToCOM2 = isConnected(btnMultimeter2COM, btnBoxCOM2);

  if (!isConnectedToCOM && !isConnectedToCOM2) return "OFF";

  const isConnectedToA = isConnected(btnMultimeter2A, btnBoxA);
  const isConnectedToV = isConnected(btnMultimeter2V, btnBoxV);

  if (isConnectedToA && isConnectedToV) {
    return "ERROR";
  } else if (isConnectedToA) {
    return "A";
  } else if (isConnectedToV) {
    return "V";
  } else {
    return "OFF";
  }
}

function turnMultimeters(check1, check2) {
  if (check1 === "A" || check1 === "V") {
    multimeter1Active = true;
  } else {
    multimeter1Active = false;
  }
  if (check2 === "A" || check2 === "V") {
    multimeter2Active = true;
  } else {
    multimeter2Active = false;
  }

  return multimeter1Active;
}

// prawdza tryb lewego multimetra
function checkMultimeter1Status() {
  const isConnectedToCOM = isConnected(btnMultimeter1COM, btnBoxCOM1);
  const isConnectedToCOM2 = isConnected(btnMultimeter1COM, btnBoxCOM2);

  if (!isConnectedToCOM && !isConnectedToCOM2) return "OFF";

  const isConnectedToA = isConnected(btnMultimeter1A, btnBoxA);
  const isConnectedToV = isConnected(btnMultimeter1V, btnBoxV);

  if (isConnectedToA && isConnectedToV) {
    return "ERROR";
  } else if (isConnectedToA) {
    return "A";
  } else if (isConnectedToV) {
    return "V";
  } else {
    return "OFF";
  }
}
// sprawdzanie czy przyciski sa polaczone
function isConnected(buttonA, buttonB) {
  return connections.some(
    (conn) =>
      (conn.start === buttonA && conn.end === buttonB) ||
      (conn.start === buttonB && conn.end === buttonA)
  );
}

// usuwa polaczenie z przycisku
function removeConnection(button) {
  const toRemove = connections.filter(
    (conn) => conn.start === button || conn.end === button
  );

  toRemove.forEach((conn) => {
    conn.cable.remove();
    d3.select(conn.start).datum().connected = false;
    d3.select(conn.end).datum().connected = false;
    d3.select(conn.start).datum().connectionCable = null;
    d3.select(conn.end).datum().connectionCable = null;
    d3.select(conn.start).classed("connected", false);
    d3.select(conn.end).classed("connected", false);
  });
  connections = connections.filter((conn) => !toRemove.includes(conn));
  turnMultimeters(checkMultimeter1Status(), checkMultimeter2Status());
  updateMultimetersDisplay();
}
