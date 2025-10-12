import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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

import { RsuGrantService } from './rsu-grant.service';
import { CreateRsuGrantDto, UpdateRsuGrantDto, CreateRsuVestingDto } from '../dto/rsu-grant.dto';

@Controller('tax/rsu-grants')
@UseGuards(AuthGuard('jwt'))
export class RsuGrantController {
  public constructor(
    private readonly rsuGrantService: RsuGrantService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get()
  @HasPermission(permissions.readUserAccount)
  public async getRsuGrants() {
    return this.rsuGrantService.getByUser(this.request.user.id);
  }

  @Get(':grantId')
  @HasPermission(permissions.readUserAccount)
  public async getRsuGrant(
    @Param('grantId') grantId: string
  ) {
    return this.rsuGrantService.getByGrantId(this.request.user.id, grantId);
  }

  @Post()
  @HasPermission(permissions.updateUserAccount)
  public async createRsuGrant(
    @Body() createRsuGrantDto: CreateRsuGrantDto
  ) {
    return this.rsuGrantService.create(this.request.user.id, createRsuGrantDto);
  }

  @Put(':grantId')
  @HasPermission(permissions.updateUserAccount)
  public async updateRsuGrant(
    @Param('grantId') grantId: string,
    @Body() updateRsuGrantDto: UpdateRsuGrantDto
  ) {
    return this.rsuGrantService.update(this.request.user.id, grantId, updateRsuGrantDto);
  }

  @Delete(':grantId')
  @HasPermission(permissions.updateUserAccount)
  public async deleteRsuGrant(
    @Param('grantId') grantId: string
  ) {
    return this.rsuGrantService.delete(this.request.user.id, grantId);
  }

  @Post(':grantId/vestings')
  @HasPermission(permissions.updateUserAccount)
  public async createRsuVesting(
    @Param('grantId') grantId: string,
    @Body() createRsuVestingDto: CreateRsuVestingDto
  ) {
    return this.rsuGrantService.createVesting(this.request.user.id, grantId, createRsuVestingDto);
  }

  @Get(':grantId/vestings')
  @HasPermission(permissions.readUserAccount)
  public async getRsuVestings(
    @Param('grantId') grantId: string
  ) {
    return this.rsuGrantService.getVestings(this.request.user.id, grantId);
  }
}