import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

import { TaxDashboardDto } from './dto/tax-dashboard.dto';
import { CreateTaxResidencyDto, UpdateTaxResidencyDto } from './dto/tax-residency.dto';

@Injectable()
export class TaxService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async getTaxDashboard(userId: string, year: number): Promise<TaxDashboardDto> {
    // Get tax residency for the year
    const taxResidency = await this.getTaxResidency(userId, year);
    
    // Check if user qualifies for Canadian tax residency
    const canadaDays = taxResidency
      .filter(tr => tr.country === 'CA')
      .reduce((sum, tr) => sum + tr.days, 0);
    
    const isCanadianResident = canadaDays >= 183; // Simplified rule

    if (!isCanadianResident) {
      return {
        year,
        isCanadianResident: false,
        message: 'Tax calculation coming soon for non-Canadian residents',
        canadaDays,
        totalDays: 365
      };
    }

    // Get all income sources
    const employmentIncome = await this.getEmploymentIncomeTotal(userId, year);
    const investmentIncome = await this.getInvestmentIncomeTotal(userId, year);
    const rsuIncome = await this.getRsuIncomeTotal(userId, year);

    // Calculate basic totals (detailed tax calculation will be added later)
    const totalTaxableIncome = employmentIncome + investmentIncome + rsuIncome;
    const estimatedTaxOwed = totalTaxableIncome * 0.30; // Rough 30% estimate for now

    return {
      year,
      isCanadianResident: true,
      canadaDays,
      employmentIncome,
      investmentIncome,
      rsuIncome,
      totalTaxableIncome,
      estimatedTaxOwed,
      optimizationOpportunities: await this.getOptimizationOpportunities(userId, year)
    };
  }

  public async getTaxResidency(userId: string, year: number) {
    return this.prismaService.taxResidency.findMany({
      where: {
        userId,
        year
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  public async createTaxResidency(userId: string, data: CreateTaxResidencyDto) {
    // Calculate days between start and end date
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return this.prismaService.taxResidency.create({
      data: {
        userId,
        year: data.year,
        country: data.country,
        startDate,
        endDate,
        days
      }
    });
  }

  public async updateTaxResidency(userId: string, id: string, data: UpdateTaxResidencyDto) {
    // First verify the record belongs to the user
    const existing = await this.prismaService.taxResidency.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new Error('Tax residency record not found');
    }

    let updateData: any = {};
    
    if (data.country) updateData.country = data.country;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    // Recalculate days if dates changed
    if (data.startDate || data.endDate) {
      const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
      const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
      updateData.days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    return this.prismaService.taxResidency.update({
      where: { id },
      data: updateData
    });
  }

  public async deleteTaxResidency(userId: string, id: string) {
    // First verify the record belongs to the user
    const existing = await this.prismaService.taxResidency.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new Error('Tax residency record not found');
    }

    return this.prismaService.taxResidency.delete({
      where: { id }
    });
  }

  public async calculateTaxForYear(userId: string, year: number) {
    // Placeholder for detailed tax calculation
    // This will integrate with TaxCalculationService
    return {
      message: 'Detailed tax calculation coming soon',
      year,
      userId
    };
  }

  private async getEmploymentIncomeTotal(userId: string, year: number): Promise<number> {
    const employmentIncome = await this.prismaService.taxEmploymentIncome.findUnique({
      where: {
        userId_year: {
          userId,
          year
        }
      }
    });

    if (!employmentIncome) return 0;

    let total = employmentIncome.baseSalary;
    
    // Add bonus
    if (employmentIncome.bonusPercent) {
      total += (employmentIncome.baseSalary * employmentIncome.bonusPercent) / 100;
    } else if (employmentIncome.bonusAmount) {
      total += employmentIncome.bonusAmount;
    }

    return total;
  }

  private async getRsuIncomeTotal(userId: string, year: number): Promise<number> {
    const vestings = await this.prismaService.taxRsuVesting.findMany({
      where: {
        userId,
        vestDate: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        }
      }
    });

    return vestings.reduce((sum, vesting) => sum + vesting.totalValueCAD, 0);
  }

  private async getInvestmentIncomeTotal(userId: string, year: number): Promise<number> {
    // This will be auto-calculated from existing Orders table in future
    // For now, return manual entries only
    const investmentIncome = await this.prismaService.taxInvestmentIncome.findMany({
      where: {
        userId,
        year
      }
    });

    return investmentIncome.reduce((sum, income) => sum + income.amount, 0);
  }

  private async getOptimizationOpportunities(userId: string, year: number) {
    // Placeholder for tax optimization suggestions
    return {
      lossHarvesting: 0,
      rrspeContribution: 0,
      tfsaContribution: 0
    };
  }
}