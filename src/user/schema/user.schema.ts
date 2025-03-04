import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'
import { UserType } from '@/common/enum'
import { Company } from '@/company/schema/company.schema'

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop({ required: true })
  userType: UserType

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  avatar: string

  /** 学生用户数据 */

  @Prop()
  studentName?: string // 学生姓名

  @Prop()
  graduationYear?: number // 毕业年份

  /** 企业用户数据 */

  @Prop({ type: Types.ObjectId, ref: Company.name })
  company?: ObjectId // 企业id
}

export const UserSchema = SchemaFactory.createForClass(User)
