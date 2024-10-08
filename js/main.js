export const chartDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata`;
export const summaryDataURL = `https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata`;
export const bookNprofit = `https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata`;

const data = await fetch(bookNprofit).then((res) => res.json());
console.log(data.stocksStatsData);
data.stocksStatsData.forEach((stocks) => {
  for (let stock in stocks) {
    console.log(stocks[stock]);

    const bv = stocks[stock].bookValue;
    const p = stocks[stock].profit;

    if (bv) {
      print(stock, bv, p);
    }
  }
});
function print(stock, bookValue, profit) {
  const ul = document.getElementById("stock-list");

  const ele = `
        <li class="stock-item" data-stock-id="${stock}">
            <span class="stock-name">${stock}</span>
            <span class="stock-book-value">$${bookValue}</span>
            <span class="stock-profit">$${profit}</span>
        </li>
    `;

  ul.insertAdjacentHTML("beforeend", ele);
}
