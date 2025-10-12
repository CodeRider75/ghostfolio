import {
  Controller,
  Get,
  UseGuards,
  Inject
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { permissions } from '@ghostfolio/common/permissions';
import type { RequestWithUser } from '@ghostfolio/common/types';

import { InvestmentIncomeService } from './investment-income.service';

@Controller('tax/investment-income')
@UseGuards(AuthGuard('jwt'))
export class InvestmentIncomeController {
  public constructor(
    private readonly investmentIncomeService: InvestmentIncomeService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get('calculate/:year')
  @HasPermission(permissions.readUserAccount)
  public async calculateInvestmentIncome(
    @Param('year') year: string
  ) {
    const yearInt = parseInt(year, 10);
    return this.investmentIncomeService.calculateFromTransactions(this.request.user.id, yearInt);
  }
}