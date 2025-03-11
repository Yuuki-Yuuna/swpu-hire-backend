import { Type } from 'class-transformer'
import { IsBoolean, IsString } from 'class-validator'

export class ProToColReviewDto {
  @IsString()
  protocolId: string

  @IsBoolean()
  @Type(() => Boolean)
  isApproved: boolean
}
