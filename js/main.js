import fetchAndCreateChart from "../js/RenderChart.js";

export const chartDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata`;
export const summaryDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata`;
export const bookNprofit = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export let stock_ID = "AAPL",
  Main_range = "1mo",
  Fullstocks = "",
  BV,
  P;

fetchAndCreateChart(Main_range, stock_ID);

async function fetchData() {
  try {
    const response = await fetch(bookNprofit);
    const data = await response.json();
    console.log(data.stocksStatsData);

    const stocks = data.stocksStatsData[0];
    Fullstocks = stocks;
    BV = Fullstocks[stock_ID].bookValue;
    P = Fullstocks[stock_ID].profit;
    setBnP(BV, P);

    console.log(stocks);

    for (let stock in stocks) {
      const { bookValue, profit } = stocks[stock];

      if (bookValue && profit) {
        await delay(300);
        print(stock, bookValue, profit);
      }
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
}

function print(stock, bookValue, profit) {
  const ul = document.getElementById("stock-list");
  const profitColor = profit > 0 ? "green" : "red"; // Set color based on profit

  const ele = `
    <li class="stock-item" data-stock-id="${stock}">
      <span class="stock-name" onclick="handleStockClick('${stock}')">${stock}</span>
      <span class="stock-book-value">$${bookValue.toFixed(2)}</span>
      <span class="stock-profit" style="color:${profitColor}">$${profit.toFixed(
    2
  )}</span>
    </li>
  `;

  ul.insertAdjacentHTML("beforeend", ele);
}

function handleStockClick(stockId) {
  console.log(stockId);
  stock_ID = stockId;
  BV = Fullstocks[stock_ID].bookValue;
  P = Fullstocks[stock_ID].profit;
  setBnP(BV, P);
  setSummaryDetails(stock_ID);

  let range = "1mo";

  fetchAndCreateChart(range, stockId);
}

fetchData();

window.handleStockClick = handleStockClick;

const buttons = document.querySelectorAll(".range-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    Main_range = button.getAttribute("data-range");
    console.log("Button clicked with ", Main_range, stock_ID);

    fetchAndCreateChart(Main_range, stock_ID);
  });
});

function setBnP(BV, P) {
  const bookvalue = document.getElementById("detail-book-value");
  const profit = document.getElementById("detail-profit-value");
  bookvalue.textContent = BV;
  profit.textContent = P;
}

// set summary details
const summaryData = await fetch(summaryDataURL).then((res) => res.json());

const stocks = summaryData.stocksProfileData[0];
console.log(stocks[stock_ID]);

export function setSummaryDetails(stock_id) {
  const stockName = document.getElementById("detail-stock-name");

  const summary = document.getElementById("detail-summary");
  stockName.textContent = stock_id;
  summary.textContent = stocks[stock_ID].summary;
}
setSummaryDetails(stock_ID);

export async function getStocks(symbol) {
  const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log();
    const stocksummary = document.querySelector("#detail-summary");
    stocksummary.textContent = result.stocksProfileData[0][symbol].summary;
  } catch (error) {
    console.error(error);
  }
}

export async function getStats(symbol) {
  const url = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    const bookValue = result.stocksStatsData[0][symbol].bookValue;
    const profit = result.stocksStatsData[0][symbol].profit;
    const stocksummary = document.querySelector("#detail-summary");
    document.querySelector("#detail-stock-name").textContent = symbol;
    const Profit = document.getElementById("detail-profit-value");
    Profit.textContent = `${profit}%`;
    if (profit > 0) {
      Profit.setAttribute("style", "color: green");
    } else {
      Profit.setAttribute("style", "color: red");
    }
    document.getElementById("detail-book-value").textContent = `$${bookValue}`;
  } catch (error) {
    console.error(error);
  }
}
