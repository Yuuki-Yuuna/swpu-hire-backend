import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class ExameineReviewDto {
  @IsString()
  companyId: string

  @IsBoolean()
  isApproved: boolean
}

export class CompanyEditDto {
  @IsString()
  companyName: string // 企业名称

  @IsInt()
  @Type(() => Number)
  companySize: number // 企业规模(value)

  @IsString()
  companySizeName: string // 企业规模

  @IsInt()
  @Type(() => Number)
  companyNature: number // 企业性质(value)

  @IsString()
  companyNatureName: string // 企业性质

  @IsString()
  companyType: string // 企业类型

  @IsString()
  @IsOptional()
  address?: string // 企业地址

  @IsString()
  creditCode: string // 社会信用代码

  @IsString()
  @IsOptional()
  description?: string // 企业简介
}
