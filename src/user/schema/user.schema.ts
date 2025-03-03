import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UserType } from '@/common/enum'

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

  @Prop()
  studentName: string // 学生姓名

  @Prop()
  graduationYear: number

  @Prop()
  adminName: string // 管理员姓名
}

export const UserSchema = SchemaFactory.createForClass(User)
