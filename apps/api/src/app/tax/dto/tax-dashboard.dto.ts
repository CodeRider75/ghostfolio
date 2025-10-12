export interface TaxDashboardDto {
  year: number;
  isCanadianResident: boolean;
  canadaDays?: number;
  totalDays?: number;
  message?: string;
  employmentIncome?: number;
  investmentIncome?: number;
  rsuIncome?: number;
  totalTaxableIncome?: number;
  estimatedTaxOwed?: number;
  optimizationOpportunities?: {
    lossHarvesting: number;
    rrspeContribution: number;
    tfsaContribution: number;
  };
}