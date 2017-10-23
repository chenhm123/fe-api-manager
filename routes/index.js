const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
let ruleMap = require('../public/json/ruleMap');
const beautify = require('js-beautify').js_beautify;
const logUtil = require('../common/log');

/**
 * 首页路由
 */

router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        routes:ruleMap,
    })
});

/**
 * 新增规则
 */
router.get('/add', async(ctx, next) => {
    let rule = ctx.request.query.query;
    let desc = ctx.request.query.desc;

    if(isEmptyObject(ruleMap)) ruleMap = [];

    ruleMap.push({
        rule: rule,
        data:{},
        schema:{
            child:{

            }
        },
        desc:desc
    });

    //持久化规则
    fs.mkdirSync(path.resolve(__dirname,`../public/json/${rule}`));
    fs.writeFileSync(path.resolve(__dirname,`../public/json/${rule}/data.js`),
        beautify(`module.exports = {}`),'utf8');
    fs.writeFileSync(path.resolve(__dirname,`../public/json/${rule}/schema.js`),
        beautify(`module.exports = {child:{}}`),'utf8');


    let newRuleMap = fs.readFileSync(path.resolve(__dirname,`../public/json/ruleMap.js`),'utf8').replace(']','');
    if(!newRuleMap){

        newRuleMap += `module.exports = [{
            rule:'${rule}',
            data:require('./${rule}/data'),
            schema:require('./${rule}/schema'),
            desc:'${desc}'
        }]`;
    }else{
        newRuleMap += `,{
            rule:'${rule}',
            data:require('./${rule}/data'),
            schema:require('./${rule}/schema'),
            desc:'${desc}'
        }]`;
    }

    fs.writeFileSync(path.resolve(__dirname,`../public/json/ruleMap.js`),
        beautify(newRuleMap),'utf8');
    ctx.body = {
        success:true
    }
});


/**
 * 编辑模型
 */
router.post('/editSchema/modifySchema',async(ctx,next) => {
    let param = ctx.request.body;
    ruleMap.forEach((item) => {
        if(item.rule === param.rule) {
            logUtil.logOperator(ctx,JSON.stringify(item.schema),param.schema);
            item.schema = JSON.parse(param.schema);
            fs.writeFileSync(path.resolve(__dirname,`../public/json/${param.rule}/schema.js`),
                beautify(`module.exports = ${param.schema}`),'utf8');
            if(param.data) {
                logUtil.logOperator(ctx,JSON.stringify(item.data),param.data);
                item.data = JSON.parse(param.data);
                fs.writeFileSync(path.resolve(__dirname,`../public/json/${param.rule}/data.js`),
                    beautify(`module.exports = ${param.data}`),'utf8');
            }
            return ctx.body = {
                success:true
            }
        }
    })
});

/**
 * 获取模型
 */
router.get('/editSchema/:rule',async (ctx, next) => {

    let rule = ctx.request.url.replace(/\/editSchema\//,'');

    let schema,data;

    ruleMap.every((item) => {
        if(item.rule === rule) {
            schema = item.schema;
            data = item.data;
            return false;
        }
        return true
    });

    if(schema && data)
        await ctx.render('editSchema', {
            schema:JSON.stringify(schema),
            data:JSON.stringify(data),
            rule:rule
        })

});


/**
 * 编辑data
 */
router.post('/editData/modifyData',async(ctx,next) => {

    let param = ctx.request.body;
    ruleMap.forEach((item) => {
        if(item.rule === param.rule) {
            logUtil.logOperator(ctx,JSON.stringify(item.data),param.data);
            item.data = JSON.parse(param.data);
            fs.writeFileSync(path.resolve(__dirname,`../public/json/${param.rule}/data.js`),
                beautify(`module.exports = ${param.data}`),'utf8');
            return ctx.body = {
                success:true
            }
        }
    });
});

router.get('/editData/:rule',async (ctx, next) => {

    let rule = ctx.request.url.replace(/\/editData\//,'');
    let schema,data;

    ruleMap.every((item) => {
        if(item.rule === rule) {
            schema = item.schema;
            data = item.data;
            return false;
        }
        return true
    });

    if(schema && data)
        await ctx.render('editData', {
            schema:JSON.stringify(schema),
            data:JSON.stringify(data),
            rule:rule
        })

});


/**
 * 获取数据
 */
router.get('/data', async (ctx, next) => {
    ruleMap.forEach((item) => {
        if(item.rule === ctx.request.query.query) {
            //支持cors跨域
            ctx.set('Access-Control-Allow-Credentials', 'true');
            ctx.set('Access-Control-Allow-Headers', 'x-requested-with');
            ctx.set('Access-Control-Allow-Methods', 'POST, GET');
            ctx.set('Access-Control-Allow-Origin', '*');

            //支持jsonp
            if(ctx.request.query.callback){
                return ctx.body = `${ctx.request.query.callback}(${JSON.stringify(item.data)})`
            }else{
                return ctx.body = item.data;
            }
        }
    })
});

function isEmptyObject(e) {
    let t;
    for (t in e)
        return !1;
    return !0
}

module.exports = router;
