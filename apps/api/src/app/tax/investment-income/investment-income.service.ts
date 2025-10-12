import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

@Injectable()
export class InvestmentIncomeService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async calculateFromTransactions(userId: string, year: number) {
    // This will analyze existing Order transactions to calculate:
    // - Dividends (DIVIDEND type)
    // - Interest (INTEREST type) 
    // - Capital gains/losses (BUY/SELL pairs)
    // - Classify Canadian vs Foreign dividends
    
    // Placeholder implementation - will be enhanced in Phase 2
    const dividendOrders = await this.prismaService.order.findMany({
      where: {
        userId,
        type: 'DIVIDEND',
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        }
      },
      include: {
        SymbolProfile: true
      }
    });

    const interestOrders = await this.prismaService.order.findMany({
      where: {
        userId,
        type: 'INTEREST',
        date: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        }
      }
    });

    // Calculate totals
    const dividendIncome = dividendOrders.reduce((sum, order) => 
      sum + (order.quantity * order.unitPrice), 0
    );
    
    const interestIncome = interestOrders.reduce((sum, order) => 
      sum + (order.quantity * order.unitPrice), 0
    );

    return {
      year,
      dividendIncome,
      interestIncome,
      capitalGains: 0, // Will calculate from BUY/SELL pairs later
      totalInvestmentIncome: dividendIncome + interestIncome
    };
  }
}