/**
 * Created by chenhm on 13/10/2017.
 */
var path = require('path');

//错误日志输出完整路径
var errorLogPath = path.resolve(__dirname, "../log/error/error.log");

//响应日志输出完整路径
var responseLogPath = path.resolve(__dirname, "../log/response/response.log");

//操作日志输出完整路径
var operateLogPath = path.resolve(__dirname, "../log/operate/operate.log");

module.exports = {
    appenders: {
        errorLog: {
            type: 'dateFile',
            filename: errorLogPath,
            pattern:'.yyyy-MM-dd',
            alwaysIncludePattern:true
        },
        responseLog: {
            type: 'dateFile',
            filename: responseLogPath,
            pattern:'.yyyy-MM-dd',
            alwaysIncludePattern:true
        },
        operatorLog:{
            type: 'dateFile',
            filename: operateLogPath,
            pattern:'.yyyy-MM-dd',
            alwaysIncludePattern:true
        }
    },
    categories: {
        default: {
            appenders: ['operatorLog'],
            level: 'info'
        },
        errorLog: {
            appenders: ['errorLog'],
            level: 'error'
        },
        responseLog: {
            appenders: ['responseLog'],
            level: 'info'
        }
    }
}
