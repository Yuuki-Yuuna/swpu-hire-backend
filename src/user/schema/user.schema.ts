import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  studentName: string

  @Prop({ required: true })
  graduationYear: number

  @Prop()
  avatar: string
}

export const UserSchema = SchemaFactory.createForClass(User)
