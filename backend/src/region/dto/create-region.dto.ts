import { IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRegionDto {
  @ApiProperty({ example: "Riyadh", minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  name!: string;

  @ApiProperty({ example: "uuid-country-id" })
  @IsUUID()
  countryId!: string;
}