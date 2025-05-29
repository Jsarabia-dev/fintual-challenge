export class Stock {
  constructor(
    public readonly symbol: string,
    private readonly currentPrice: number, // assumed as static input for simplicity
  ) {}

  getCurrentPrice(): number {
    return this.currentPrice;
  }
}
