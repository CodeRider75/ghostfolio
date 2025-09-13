import { calculateCanadianTax, Income } from './tax/canada';

export {
  calculateCanadianTax,
  calculateCapitalGain,
  monthlySalaryToIncome
} from './tax/canada';
export type { Income, IncomeType, Trade, CapitalGainResult } from './tax/canada';

/**
 * Generic tax calculation entry point. Currently only supports Canada (CA).
 * Throws an error for unsupported countries.
 */
export function calculateTax(country: string, incomes: Income[]): number {
  switch (country.toUpperCase()) {
    case 'CA':
      return calculateCanadianTax(incomes);
    default:
      throw new Error(`Tax calculation for country ${country} not supported`);
  }
}
