import { Module } from '@nestjs/common';
import { PrismaModule } from '@ghostfolio/api/services/prisma/prisma.module';
import { RedisCacheModule } from '@ghostfolio/api/app/redis-cache/redis-cache.module';

import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { EmploymentIncomeController } from './employment-income/employment-income.controller';
import { EmploymentIncomeService } from './employment-income/employment-income.service';
import { RsuGrantController } from './rsu-grant/rsu-grant.controller';
import { RsuGrantService } from './rsu-grant/rsu-grant.service';
import { InvestmentIncomeController } from './investment-income/investment-income.controller';
import { InvestmentIncomeService } from './investment-income/investment-income.service';
import { ExchangeRateService } from './exchange-rate/exchange-rate.service';
import { TaxCalculationService } from './calculation/tax-calculation.service';

@Module({
  imports: [PrismaModule, RedisCacheModule],
  controllers: [
    TaxController,
    EmploymentIncomeController,
    RsuGrantController,
    InvestmentIncomeController
  ],
  providers: [
    TaxService,
    EmploymentIncomeService,
    RsuGrantService,
    InvestmentIncomeService,
    ExchangeRateService,
    TaxCalculationService
  ],
  exports: [TaxService, TaxCalculationService]
})
export class TaxModule {}