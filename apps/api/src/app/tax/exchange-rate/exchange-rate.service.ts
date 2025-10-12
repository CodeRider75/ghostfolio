import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

@Injectable()
export class ExchangeRateService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async getExchangeRate(date: Date, fromCurrency: string, toCurrency: string): Promise<number> {
    // Try to get cached rate first
    const cachedRate = await this.prismaService.exchangeRate.findUnique({
      where: {
        date_fromCurrency_toCurrency: {
          date,
          fromCurrency,
          toCurrency
        }
      }
    });

    if (cachedRate) {
      return cachedRate.rate;
    }

    // If not cached, fetch from Bank of Canada API (placeholder)
    // For now, return a default rate
    const defaultRates: Record<string, number> = {
      'USD_CAD': 1.35,
      'EUR_CAD': 1.45,
      'INR_CAD': 0.016
    };

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = defaultRates[rateKey] || 1.0;

    // Cache the rate
    await this.prismaService.exchangeRate.create({
      data: {
        date,
        fromCurrency,
        toCurrency,
        rate,
        source: 'DEFAULT_RATES'
      }
    });

    return rate;
  }

  public async convertToCAD(amount: number, fromCurrency: string, date: Date): Promise<number> {
    if (fromCurrency === 'CAD') {
      return amount;
    }

    const exchangeRate = await this.getExchangeRate(date, fromCurrency, 'CAD');
    return amount * exchangeRate;
  }
}