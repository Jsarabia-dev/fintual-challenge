import { Stock } from "./models/stock";
import { Portfolio, Allocation, Holding } from "./models/portfolio";

// This is a basic usage example for the Portfolio and Stock classes.
// For more detailed validations and edge cases, please run the full Jest test suite.

const stocks = [new Stock("META", 300), new Stock("AAPL", 150)];

const holdings: Holding[] = [
  { stock: stocks[0], quantity: 1 }, // META: $300
  { stock: stocks[1], quantity: 2 }, // AAPL: $300
];

const targetAllocations: Allocation[] = [
  { symbol: "META", percentage: 40 },
  { symbol: "AAPL", percentage: 60 },
];

const portfolio = new Portfolio(holdings, targetAllocations);
const instructions = portfolio.rebalance();

console.log("Rebalance Instructions:", instructions);
