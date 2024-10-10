import { renderChart } from "../js/RenderChart.js";

export const chartDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata`;
export const summaryDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata`;
export const bookNprofit = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export let stock_ID = "AAPL",
  Main_range = "1mo",
  Fullstocks = "",
  BV,
  P;

renderChart(Main_range, stock_ID);

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

  const ele = `
    <li class="stock-item" data-stock-id="${stock}">
      <span class="stock-name" onclick="handleStockClick('${stock}')">${stock}</span>
      <span class="stock-book-value">$${bookValue.toFixed(2)}</span>
      <span class="stock-profit">$${profit.toFixed(2)}</span>
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

  renderChart(range, stockId);
}

fetchData();

window.handleStockClick = handleStockClick;

const buttons = document.querySelectorAll(".range-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    Main_range = button.getAttribute("data-range");
    console.log("Button clicked with ", Main_range, stock_ID);

    renderChart(Main_range, stock_ID);
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
