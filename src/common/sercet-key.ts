import { enc } from 'crypto-js'
import * as path from 'path'

export const rootDir = path.resolve(__dirname, '..', '..')

export const publicUrl = path.resolve(rootDir, 'public')

export const publicImageUrl = path.resolve(publicUrl, 'image')

export const publicFileUrl = path.resolve(publicUrl, 'file')

export const databaseUrl = 'mongodb://localhost:27017/swpu-hire'

export const cryptoKey = enc.Utf8.parse('D.C. ～ダ･カーポ～').toString()

export const jwtKey = enc.Utf8.parse('サクラハッピーイノベーション').toString()
