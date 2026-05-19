import {
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsIn,
} from "class-validator";

import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryRegionDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: "Riyadh" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "uuid-country-id" })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiPropertyOptional({
    enum: ["asc", "desc"],
    example: "asc",
  })
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortByCreatedAt?: "asc" | "desc";
}