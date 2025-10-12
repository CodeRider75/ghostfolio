import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

import { CreateRsuGrantDto, UpdateRsuGrantDto, CreateRsuVestingDto } from '../dto/rsu-grant.dto';

@Injectable()
export class RsuGrantService {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async getByUser(userId: string) {
    return this.prismaService.taxRsuGrant.findMany({
      where: { userId },
      include: { vestingEvents: true },
      orderBy: { grantDate: 'desc' }
    });
  }

  public async getByGrantId(userId: string, grantId: string) {
    return this.prismaService.taxRsuGrant.findUnique({
      where: { userId_grantId: { userId, grantId } },
      include: { vestingEvents: true }
    });
  }

  public async create(userId: string, data: CreateRsuGrantDto) {
    return this.prismaService.taxRsuGrant.create({
      data: {
        userId,
        grantId: data.grantId,
        grantDate: new Date(data.grantDate),
        totalShares: data.totalShares,
        vestingSchedule: data.vestingSchedule,
        currency: data.currency || 'USD',
        strikePrice: data.strikePrice || 0
      }
    });
  }

  public async update(userId: string, grantId: string, data: UpdateRsuGrantDto) {
    return this.prismaService.taxRsuGrant.update({
      where: { userId_grantId: { userId, grantId } },
      data
    });
  }

  public async delete(userId: string, grantId: string) {
    return this.prismaService.taxRsuGrant.delete({
      where: { userId_grantId: { userId, grantId } }
    });
  }

  public async createVesting(userId: string, grantId: string, data: CreateRsuVestingDto) {
    const vestDate = new Date(data.vestDate);
    const totalValueUSD = data.sharesVested * data.fmvPerShare;
    const totalValueCAD = totalValueUSD * data.exchangeRate;
    const taxWithheldCAD = data.taxWithheldUSD ? data.taxWithheldUSD * data.exchangeRate : null;

    return this.prismaService.taxRsuVesting.create({
      data: {
        userId,
        grantId,
        vestDate,
        sharesVested: data.sharesVested,
        fmvPerShare: data.fmvPerShare,
        totalValueUSD,
        exchangeRate: data.exchangeRate,
        totalValueCAD,
        taxWithheldUSD: data.taxWithheldUSD,
        taxWithheldCAD
      }
    });
  }

  public async getVestings(userId: string, grantId: string) {
    return this.prismaService.taxRsuVesting.findMany({
      where: { userId, grantId },
      orderBy: { vestDate: 'desc' }
    });
  }
}