import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop()
  username: string

  @Prop()
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
