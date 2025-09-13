import { Big } from 'big.js';

export type IncomeType = 'capitalGains' | 'dividend' | 'interest' | 'salary';

export interface Income {
  country: string; // Country of origin for the income; currently unused
  type: IncomeType;
  amount: number; // Amount in CAD
}

export interface Trade {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
}

export interface CapitalGainResult {
  gains: number; // Sum of positive gains
  losses: number; // Sum of negative losses
  net: number; // gains + losses
}

/**
 * Calculates realized capital gains and losses from a list of trades.
 */
export function calculateCapitalGain(trades: Trade[]): CapitalGainResult {
  return trades.reduce<CapitalGainResult>(
    (acc, trade) => {
      const diff = (trade.sellPrice - trade.buyPrice) * trade.quantity;
      if (diff >= 0) {
        acc.gains += diff;
      } else {
        acc.losses += diff;
      }
      acc.net += diff;
      return acc;
    },
    { gains: 0, losses: 0, net: 0 }
  );
}

/**
 * Helper to convert a monthly salary into an annual income record.
 */
export function monthlySalaryToIncome(
  monthlySalary: number,
  months = 12
): Income {
  return {
    country: 'CA',
    type: 'salary',
    amount: monthlySalary * months
  };
}

/**
 * Calculates federal Canadian tax for a resident based on a list of incomes.
 * This is a simplified implementation and does not include provincial taxes
 * or deductions.
 */
export function calculateCanadianTax(incomes: Income[]): number {
  const taxableIncome = incomes.reduce((acc, income) => {
    switch (income.type) {
      case 'capitalGains':
        return acc.plus(Math.max(income.amount, 0) * 0.5); // 50% inclusion rate on net gains
      default:
        return acc.plus(income.amount);
    }
  }, new Big(0));

  return getCanadianFederalTax(taxableIncome.toNumber());
}

function getCanadianFederalTax(income: number): number {
  const brackets = [
    { limit: 55867, rate: 0.15 },
    { limit: 111733, rate: 0.205 },
    { limit: 173205, rate: 0.26 },
    { limit: 246752, rate: 0.29 },
    { limit: Infinity, rate: 0.33 }
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(income, bracket.limit) - previousLimit;
    if (taxable > 0) {
      tax += taxable * bracket.rate;
    }
    previousLimit = bracket.limit;
    if (income <= bracket.limit) {
      break;
    }
  }

  return tax;
}
