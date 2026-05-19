import { Module } from '@nestjs/common';

import { DeliveryCenterService } from './delivery-center.service';
import { DeliveryCenterController } from './delivery-center.controller';

import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryCenterController],
  providers: [DeliveryCenterService],
  exports: [DeliveryCenterService],
})
export class DeliveryCenterModule {}