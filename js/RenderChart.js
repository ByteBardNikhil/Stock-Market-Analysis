// Export and import statements
export let st = "AAPL";
import { getStocks, getStats, chartDataURL } from "../js/main.js";

export default async function fetchAndCreateChart(
  range = "5y",
  symbol = "AMRN"
) {
  st = symbol;
  try {
    const result = await fetch(chartDataURL).then((res) => res.json());

    let chartData = result.stocksData[0][st][range].value;
    let labels = result.stocksData[0][st][range].timeStamp;

    labels = labels.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleDateString()
    );

    drawChart(chartData, labels, st);
    getStocks(st);
    getStats(st);
  } catch (error) {
    console.error(error);
  }
}

// Button event listeners
const onedaybtn = document.getElementById("btn1d");
const onemonbtn = document.getElementById("btn1mo");
const oneyrbtn = document.getElementById("btn1y");
const fiveyrbtn = document.getElementById("btn5y");

onedaybtn.addEventListener("click", () => {
  fetchAndCreateChart("1mo", st);
});
onemonbtn.addEventListener("click", () => {
  fetchAndCreateChart("3mo", st);
});
oneyrbtn.addEventListener("click", () => {
  fetchAndCreateChart("1y", st);
});
fiveyrbtn.addEventListener("click", () => {
  fetchAndCreateChart("5y", st);
});

// Function to draw the chart on the canvas
function drawChart(data, labels, stockName) {
  const peakValue = Math.max(...data);
  const lowValue = Math.min(...data);

  document.getElementById("peak-value").textContent = peakValue.toFixed(2);
  document.getElementById("low-value").textContent = lowValue.toFixed(2);
  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");
  const chartHeight = canvas.height - 40;
  const chartWidth = canvas.width - 60;
  const dataMax = Math.max(...data);
  const dataMin = Math.min(...data);
  const dataRange = dataMax - dataMin;
  const dataStep = dataRange > 0 ? chartHeight / dataRange : 0;
  const stepX = chartWidth / (data.length - 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, chartHeight - (data[0] - dataMin) * dataStep);
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(i * stepX, chartHeight - (data[i] - dataMin) * dataStep);
  }
  ctx.strokeStyle = "#39FF14";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  const zeroY = chartHeight - (0 - dataMin) * dataStep;
  ctx.moveTo(0, zeroY);
  ctx.lineTo(canvas.width, zeroY);
  ctx.strokeStyle = "#ccc";
  ctx.stroke();
  ctx.setLineDash([]);

  const tooltip = document.getElementById("tooltip");
  const xAxisLabel = document.getElementById("xAxisLabel");

  canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const dataIndex = Math.min(Math.floor(x / stepX), data.length - 1);
    const stockValue = data[dataIndex].toFixed(2);
    const xAxisValue = labels[dataIndex];

    tooltip.style.display = "block";
    // tooltip.style.left = `${x + 10}px`;
    // tooltip.style.top = `${y - 40}px`;
    tooltip.textContent = `${stockName}: $${stockValue}`;
    tooltip.style.color = "black";
    tooltip.style.fontSize = "2rem";

    xAxisLabel.style.display = "block";
    xAxisLabel.style.left = `${x}px`;
    xAxisLabel.style.top = `${chartHeight + 5}px`;
    xAxisLabel.textContent = xAxisValue;
    xAxisLabel.style.color = "black";
    xAxisLabel.style.fontSize = "2rem";

    ctx.clearRect(0, 0, canvas.width, chartHeight);
    ctx.clearRect(
      0,
      chartHeight + 20,
      canvas.width,
      canvas.height - chartHeight - 20
    );

    ctx.beginPath();
    ctx.moveTo(0, chartHeight - (data[0] - dataMin) * dataStep);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(i * stepX, chartHeight - (data[i] - dataMin) * dataStep);
    }
    ctx.strokeStyle = "#39FF14";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(0, zeroY);
    ctx.lineTo(canvas.width, zeroY);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartHeight);
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      x,
      chartHeight - (data[dataIndex] - dataMin) * dataStep,
      6,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "#39FF14";
    ctx.fill();
  });

  canvas.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
    xAxisLabel.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawChart(data, labels, stockName);
  });
}
