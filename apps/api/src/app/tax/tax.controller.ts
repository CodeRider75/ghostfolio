import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { permissions } from '@ghostfolio/common/permissions';
import type { RequestWithUser } from '@ghostfolio/common/types';

import { TaxService } from './tax.service';
import { CreateTaxResidencyDto, UpdateTaxResidencyDto } from './dto/tax-residency.dto';
import { TaxDashboardDto } from './dto/tax-dashboard.dto';

@Controller('tax')
@UseGuards(AuthGuard('jwt'))
export class TaxController {
  public constructor(
    private readonly taxService: TaxService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get('dashboard/:year')
  @HasPermission(permissions.readUserAccount)
  public async getTaxDashboard(
    @Param('year') year: string
  ): Promise<TaxDashboardDto> {
    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt) || yearInt < 2020 || yearInt > 2030) {
      throw new HttpException('Invalid year', HttpStatus.BAD_REQUEST);
    }

    return this.taxService.getTaxDashboard(this.request.user.id, yearInt);
  }

  @Get('residency/:year')
  @HasPermission(permissions.readUserAccount)
  public async getTaxResidency(
    @Param('year') year: string
  ) {
    const yearInt = parseInt(year, 10);
    return this.taxService.getTaxResidency(this.request.user.id, yearInt);
  }

  @Post('residency')
  @HasPermission(permissions.updateUserAccount)
  public async createTaxResidency(
    @Body() createTaxResidencyDto: CreateTaxResidencyDto
  ) {
    return this.taxService.createTaxResidency(this.request.user.id, createTaxResidencyDto);
  }

  @Put('residency/:id')
  @HasPermission(permissions.updateUserAccount)
  public async updateTaxResidency(
    @Param('id') id: string,
    @Body() updateTaxResidencyDto: UpdateTaxResidencyDto
  ) {
    return this.taxService.updateTaxResidency(this.request.user.id, id, updateTaxResidencyDto);
  }

  @Delete('residency/:id')
  @HasPermission(permissions.updateUserAccount)
  public async deleteTaxResidency(
    @Param('id') id: string
  ) {
    return this.taxService.deleteTaxResidency(this.request.user.id, id);
  }

  @Post('calculate/:year')
  @HasPermission(permissions.readUserAccount)
  public async calculateTax(
    @Param('year') year: string
  ) {
    const yearInt = parseInt(year, 10);
    return this.taxService.calculateTaxForYear(this.request.user.id, yearInt);
  }
}