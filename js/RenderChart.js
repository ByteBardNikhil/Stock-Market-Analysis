import { chartDataURL } from "../js/main.js";
// import { Chart } from "chart.js";
// const data = await fetch(chartDataURL)
//   .then((res) => res.json())
//   .then((stock) => stock.stocksData[0]);
// console.log(data);
// for (let stock in data) {
//   console.log(stock);
//   console.log(data[stock]);
// }

const stockData = {
  AAPL: {
    "1m": {
      value: [183.96, 187, 186.67, 185.27, 188.06, 189.25],
      timeStamp: [
        1687354200, 1687440600, 1687527000, 1687786200, 1687872600, 1687959000,
      ],
    },
    "3m": {
      value: [164.79, 165.1, 163.54, 163.53],
      timeStamp: [1682083800, 1682343000, 1682429400, 1682515800],
    },
    "1y": {
      value: [156.28, 137.57],
      timeStamp: [1659326400, 1662004800],
    },
    "5y": {
      value: [54.39, 54.12],
      timeStamp: [1533096000, 1535774400],
    },
  },
};

const ctx = document.getElementById("stock-chart").getContext("2d");
let myChart;

function renderChart(range) {
  if (myChart) {
    myChart.destroy();
  }

  const labels = stockData.AAPL[range].timeStamp.map((ts) =>
    new Date(ts * 1000).toLocaleDateString()
  );
  const dataValues = stockData.AAPL[range].value;

  // Calculate peak and low values
  const peakValue = Math.max(...dataValues);
  const lowValue = Math.min(...dataValues);

  // Update peak and low values in the DOM
  document.getElementById("peak-value").textContent = peakValue.toFixed(2);
  document.getElementById("low-value").textContent = lowValue.toFixed(2);

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "AAPL Stock Price",
          data: dataValues,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 3,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Event listeners for buttons
document.querySelectorAll("#chart-controls .range-button").forEach((button) => {
  button.addEventListener("click", () => {
    const range = button.getAttribute("data-range");
    renderChart(range);
  });
});

// Initial render with default range
renderChart("1m");
