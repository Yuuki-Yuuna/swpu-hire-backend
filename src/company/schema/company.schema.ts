import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'company' })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string // 企业名称

  @Prop()
  companyLogo: string // 企业logo

  @Prop()
  compoanySize: number // 企业规模(value)

  @Prop()
  companySizeName: string // 企业规模

  @Prop()
  companyType: number // 企业类型(value)

  @Prop()
  companyTypeName: string // 企业类型
}

export const CompanySchema = SchemaFactory.createForClass(Company)
