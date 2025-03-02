import { IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class JobListDto {
  @IsInt()
  @Type(() => Number)
  page: number

  @IsInt()
  @Type(() => Number)
  limit: number

  @IsString()
  @IsOptional()
  input?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  companySize?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  salaryRequirement?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  enterpriseNature?: number
}

export class RecommendDto {
  @IsInt()
  @Type(() => Number)
  page: number

  @IsInt()
  @Type(() => Number)
  limit: number
}
