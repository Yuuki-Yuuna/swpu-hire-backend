import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, PopulatedDoc, Types } from 'mongoose'
import { User } from '@/user/schema/user.schema'
import { Company } from '@/company/schema/company.schema'
import { SignStatus } from '@/common/enum'

@Schema({ collection: 'protocol', timestamps: true })
export class Protocol extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: PopulatedDoc<User>

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  company: PopulatedDoc<Company>

  @Prop({ required: true })
  status: SignStatus

  @Prop({ required: true })
  file: string // 文件链接

  @Prop({ required: true })
  filename: string
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol)
