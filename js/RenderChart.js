import { chartDataURL } from "../js/main.js";

async function getStockData(stockSymbol) {
  try {
    const response = await fetch(chartDataURL);
    const data = await response.json();

    const stocks = data.stocksData[0];
    return stocks[stockSymbol];
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}

export async function renderChart(range, stockSymbol) {
  const stockData = await getStockData(stockSymbol); // Await stock data

  if (!stockData || !stockData[range]) {
    console.error(
      `No data available for ${stockSymbol} in the selected range: ${range}`
    );
    return;
  }

  const labels = stockData[range].timeStamp.map((ts) =>
    new Date(ts * 1000).toLocaleDateString()
  );
  const dataValues = stockData[range].value;

  const peakValue = Math.max(...dataValues);
  const lowValue = Math.min(...dataValues);

  document.getElementById("peak-value").textContent = peakValue.toFixed(2);
  document.getElementById("low-value").textContent = lowValue.toFixed(2);

  const ctx = document.getElementById("stock-chart").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${stockSymbol} Stock Price`,
          data: dataValues,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 3,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            display: false,
            ticks: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              display: false,
            },
          },
        ],
      },
      tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].index;
            return `Date: ${labels[index]}`;
          },
          label: function (tooltipItem) {
            const price = tooltipItem.yLabel.toFixed(2);
            return [`${stockSymbol}: $${price}`];
          },
        },
      },
      legend: {
        display: false,
      },
    },
  });
}
