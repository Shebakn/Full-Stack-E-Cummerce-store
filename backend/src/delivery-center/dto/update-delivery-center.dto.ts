import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryCenterDto } from './create-delivery-center.dto';

export class UpdateDeliveryCenterDto extends PartialType(
  CreateDeliveryCenterDto,
) {}