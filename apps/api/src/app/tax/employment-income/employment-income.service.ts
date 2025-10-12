import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

import { CreateEmploymentIncomeDto, UpdateEmploymentIncomeDto } from '../dto/employment-income.dto';

@Injectable()
export class EmploymentIncomeService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async getByUserAndYear(userId: string, year: number) {
    const employmentIncome = await this.prismaService.taxEmploymentIncome.findUnique({
      where: {
        userId_year: {
          userId,
          year
        }
      }
    });

    if (!employmentIncome) {
      // Return default structure if no data exists
      return {
        year,
        baseSalary: 0,
        bonusPercent: null,
        bonusAmount: null,
        currency: 'CAD',
        province: 'ON',
        totalEmploymentIncome: 0
      };
    }

    // Calculate total employment income
    let totalEmploymentIncome = employmentIncome.baseSalary;
    
    if (employmentIncome.bonusPercent) {
      totalEmploymentIncome += (employmentIncome.baseSalary * employmentIncome.bonusPercent) / 100;
    } else if (employmentIncome.bonusAmount) {
      totalEmploymentIncome += employmentIncome.bonusAmount;
    }

    return {
      ...employmentIncome,
      totalEmploymentIncome
    };
  }

  public async create(userId: string, data: CreateEmploymentIncomeDto) {
    return this.prismaService.taxEmploymentIncome.create({
      data: {
        userId,
        year: data.year,
        baseSalary: data.baseSalary,
        bonusPercent: data.bonusPercent,
        bonusAmount: data.bonusAmount,
        currency: data.currency || 'CAD',
        province: data.province || 'ON'
      }
    });
  }

  public async update(userId: string, year: number, data: UpdateEmploymentIncomeDto) {
    // First verify the record exists and belongs to the user
    const existing = await this.prismaService.taxEmploymentIncome.findUnique({
      where: {
        userId_year: {
          userId,
          year
        }
      }
    });

    if (!existing) {
      throw new Error('Employment income record not found for this year');
    }

    return this.prismaService.taxEmploymentIncome.update({
      where: {
        userId_year: {
          userId,
          year
        }
      },
      data: {
        ...data
      }
    });
  }

  public async getTotalForYear(userId: string, year: number): Promise<number> {
    const employmentIncome = await this.getByUserAndYear(userId, year);
    return employmentIncome.totalEmploymentIncome || 0;
  }
}