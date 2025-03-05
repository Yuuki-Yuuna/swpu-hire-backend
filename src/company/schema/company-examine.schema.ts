import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'company-examine', timestamps: true })
export class CompanyExamine extends Document {
  @Prop({ required: true })
  companyName: string // 企业名称

  @Prop()
  companyLogo: string // 企业logo

  @Prop({ required: true })
  companySize: number // 企业规模(value)

  @Prop({ required: true })
  companySizeName: string // 企业规模

  @Prop({ required: true })
  companyNature: number // 企业性质(value)

  @Prop({ required: true })
  companyNatureName: string // 企业性质

  @Prop({ required: true })
  companyType: string // 企业类型

  @Prop({ required: true })
  creditCode: string // 社会信用代码

  @Prop()
  description?: string // 企业简介

  @Prop()
  address?: string // 企业地址
}

export const CompanyExamineSchema = SchemaFactory.createForClass(CompanyExamine)
