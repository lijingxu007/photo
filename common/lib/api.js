/**
 * api.js 接口文件
 * http 加密数据
 * https apple  域名和小程序ghid，appid
 */
import { httpGet} from 'http.js'
import { https, apple } from '../../config/config.js'


// api 

export const getBookList = (body) => httpGet(`${https.javaHttps}/profit/noEncrypt/appList`,body)

export const getConfig = (body) => httpGet(`${https.javaHttps}/profit/config/noEncrypt/freedom`, body)
