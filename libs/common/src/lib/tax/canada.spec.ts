import {
  calculateCanadianTax,
  calculateCapitalGain,
  monthlySalaryToIncome,
  calculateTax,
  Income,
  Trade
} from '../tax';

describe('Canadian tax calculation', () => {
  it('should apply 50% inclusion for capital gains', () => {
    const incomes: Income[] = [
      { country: 'US', type: 'capitalGains', amount: 10000 }
    ];
    expect(calculateCanadianTax(incomes)).toBeCloseTo(750);
  });

  it('should apply progressive tax brackets for interest income', () => {
    const incomes: Income[] = [
      { country: 'CA', type: 'interest', amount: 60000 }
    ];
    const expected = 55867 * 0.15 + (60000 - 55867) * 0.205;
    expect(calculateCanadianTax(incomes)).toBeCloseTo(expected);
  });

  it('should calculate tax via generic entry point', () => {
    const incomes: Income[] = [
      { country: 'IN', type: 'dividend', amount: 1000 }
    ];
    expect(calculateTax('CA', incomes)).toBeCloseTo(150);
  });

  it('should compute capital gains and losses from trades', () => {
    const trades: Trade[] = [
      { buyPrice: 100, sellPrice: 150, quantity: 10 }, // +500
      { buyPrice: 200, sellPrice: 180, quantity: 5 } // -100
    ];
    const result = calculateCapitalGain(trades);
    expect(result).toEqual({ gains: 500, losses: -100, net: 400 });
  });

  it('should include salary and capital gains in tax calculation', () => {
    const trades: Trade[] = [
      { buyPrice: 100, sellPrice: 150, quantity: 10 }
    ];
    const { net } = calculateCapitalGain(trades); // 500
    const incomes: Income[] = [
      monthlySalaryToIncome(5000),
      { country: 'CA', type: 'capitalGains', amount: net }
    ];
    const taxableIncome = 5000 * 12 + 0.5 * net;
    const expectedTax =
      55867 * 0.15 +
      (taxableIncome - 55867) * 0.205; // taxableIncome < second bracket limit
    expect(calculateCanadianTax(incomes)).toBeCloseTo(expectedTax);
  });
});
