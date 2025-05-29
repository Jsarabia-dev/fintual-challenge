import { Stock } from "../src/models/stock";

describe("Stock Model", () => {
  it("should return the current price correctly", () => {
    const stock = new Stock("AAPL", 150);

    // The price provided during instantiation should be returned by getCurrentPrice
    expect(stock.getCurrentPrice()).toBe(150);
  });

  it("should store the symbol as a readonly property", () => {
    const stock = new Stock("META", 300);

    // The stock symbol should be correctly set
    expect(stock.symbol).toBe("META");
  });
});
