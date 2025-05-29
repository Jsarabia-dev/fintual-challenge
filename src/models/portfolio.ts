import { Stock } from "./stock";

export interface Allocation {
  symbol: string;
  percentage: number; // Expected to be between 0 and 100
}

export interface Holding {
  stock: Stock;
  quantity: number;
}

export interface RebalanceInstruction {
  symbol: string;
  action: "buy" | "sell";
  quantity: number;
}

export class Portfolio {
  private holdings: Map<string, Holding> = new Map();
  private targetAllocations: Map<string, number> = new Map();

  constructor(initialHoldings: Holding[], allocations: Allocation[]) {
    for (const holding of initialHoldings) {
      this.holdings.set(holding.stock.symbol, holding);
    }

    const totalAllocation = allocations.reduce(
      (sum, a) => sum + a.percentage,
      0,
    );
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error("Allocations must sum to 100%");
    }

    for (const alloc of allocations) {
      this.targetAllocations.set(alloc.symbol, alloc.percentage);
    }
  }

  /**
   * Computes rebalance instructions to match the target allocation.
   */
  rebalance(): RebalanceInstruction[] {
    // Step 1: Calculate current total value
    let totalValue = 0;
    const currentValues: Map<string, number> = new Map();

    for (const [symbol, { stock, quantity }] of this.holdings.entries()) {
      const value = stock.getCurrentPrice() * quantity;
      currentValues.set(symbol, value);
      totalValue += value;
    }

    if (totalValue === 0) return [];

    // Step 2: Determine target value per stock
    const targetValues: Map<string, number> = new Map();
    for (const [symbol, percentage] of this.targetAllocations.entries()) {
      targetValues.set(symbol, (percentage / 100) * totalValue);
    }

    // Step 3: Generate buy/sell instructions
    const instructions: RebalanceInstruction[] = [];

    for (const [symbol, targetValue] of targetValues.entries()) {
      const holding = this.holdings.get(symbol);
      const currentPrice = holding?.stock.getCurrentPrice() ?? 0;
      const currentValue = currentValues.get(symbol) ?? 0;

      const valueDifference = targetValue - currentValue;
      const quantityDiff = valueDifference / currentPrice;

      if (Math.abs(quantityDiff) < 1e-6) continue;

      instructions.push({
        symbol,
        action: quantityDiff > 0 ? "buy" : "sell",
        quantity: Math.abs(quantityDiff),
      });
    }

    return instructions;
  }
}
