import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Inject
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { permissions } from '@ghostfolio/common/permissions';
import type { RequestWithUser } from '@ghostfolio/common/types';

import { EmploymentIncomeService } from './employment-income.service';
import { CreateEmploymentIncomeDto, UpdateEmploymentIncomeDto } from '../dto/employment-income.dto';

@Controller('tax/employment-income')
@UseGuards(AuthGuard('jwt'))
export class EmploymentIncomeController {
  public constructor(
    private readonly employmentIncomeService: EmploymentIncomeService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get(':year')
  @HasPermission(permissions.readUserAccount)
  public async getEmploymentIncome(
    @Param('year') year: string
  ) {
    const yearInt = parseInt(year, 10);
    return this.employmentIncomeService.getByUserAndYear(this.request.user.id, yearInt);
  }

  @Post()
  @HasPermission(permissions.updateUserAccount)
  public async createEmploymentIncome(
    @Body() createEmploymentIncomeDto: CreateEmploymentIncomeDto
  ) {
    return this.employmentIncomeService.create(this.request.user.id, createEmploymentIncomeDto);
  }

  @Put(':year')
  @HasPermission(permissions.updateUserAccount)
  public async updateEmploymentIncome(
    @Param('year') year: string,
    @Body() updateEmploymentIncomeDto: UpdateEmploymentIncomeDto
  ) {
    const yearInt = parseInt(year, 10);
    return this.employmentIncomeService.update(this.request.user.id, yearInt, updateEmploymentIncomeDto);
  }
}