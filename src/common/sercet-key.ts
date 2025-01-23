import { enc } from 'crypto-js'

export const databaseUrl = 'mongodb://localhost:27017/swpu-hire'

export const cryptoKey = enc.Utf8.parse('D.C. ～ダ･カーポ～').toString()

export const jwtKey = enc.Utf8.parse('サクラハッピーイノベーション').toString()
