import { Allocation, Holding, Portfolio } from "../src/models/portfolio";
import { Stock } from "../src/models/stock";

describe("Portfolio Rebalancing", () => {
  const meta = new Stock("META", 300);
  const aapl = new Stock("AAPL", 150);

  it("should return empty instructions when already balanced", () => {
    const holdings: Holding[] = [
      { stock: meta, quantity: 1 }, // $300
      { stock: aapl, quantity: 2 }, // $300
    ];

    const allocations: Allocation[] = [
      { symbol: "META", percentage: 50 },
      { symbol: "AAPL", percentage: 50 },
    ];

    const portfolio = new Portfolio(holdings, allocations);
    const result = portfolio.rebalance();

    // Expect no action since it's already at target allocation
    expect(result).toEqual([]);
  });

  it("should recommend selling and buying to match target allocation", () => {
    const holdings: Holding[] = [
      { stock: meta, quantity: 1 }, // $300
      { stock: aapl, quantity: 2 }, // $300
    ];

    const allocations: Allocation[] = [
      { symbol: "META", percentage: 40 },
      { symbol: "AAPL", percentage: 60 },
    ];

    const portfolio = new Portfolio(holdings, allocations);
    const result = portfolio.rebalance();

    // Portfolio total = $600
    // META target = $240 → quantity = 0.8 → sell 0.2
    // AAPL target = $360 → quantity = 2.4 → buy 0.4
    expect(result).toEqual([
      { symbol: "META", action: "sell", quantity: 0.2 },
      { symbol: "AAPL", action: "buy", quantity: 0.4 },
    ]);
  });

  it("should handle missing holdings by suggesting buys", () => {
    const holdings: Holding[] = [
      { stock: meta, quantity: 0 }, // Explicitly include META with 0 quantity
      { stock: aapl, quantity: 2 }, // AAPL worth $300
    ];

    const allocations: Allocation[] = [
      { symbol: "META", percentage: 50 },
      { symbol: "AAPL", percentage: 50 },
    ];

    const portfolio = new Portfolio(holdings, allocations);
    const result = portfolio.rebalance();

    // Portfolio value = $300
    // META is missing → should suggest buying $150 worth = 0.5 META
    expect(result).toEqual([
      { symbol: "META", action: "buy", quantity: 0.5 },
      { symbol: "AAPL", action: "sell", quantity: 1 }, // AAPL is $300, needs to be $150 → sell 1 share
    ]);
  });

  it("should throw if allocations do not sum to 100%", () => {
    const holdings: Holding[] = [{ stock: meta, quantity: 1 }];

    const allocations: Allocation[] = [
      { symbol: "META", percentage: 80 },
      { symbol: "AAPL", percentage: 30 },
    ];

    expect(() => new Portfolio(holdings, allocations)).toThrow(
      "Allocations must sum to 100%",
    );
  });
});
