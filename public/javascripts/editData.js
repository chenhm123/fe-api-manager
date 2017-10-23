/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by chenhm on 09/10/2017.
 */

let tpNodeTpl  = {};
let originData = JSON.stringify(tpdata);

Handlebars.registerHelper('equal', function(v1, v2, opts) {
    if(v1 === v2)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

function build(obj, parent, type){

    //遍历子集模型
    for(let key in obj.child){

        //当前的子节点
        let currentObj = obj.child[key];

        if(parent){
            //当上级为对象模型时
            if(parent && type && type === 'object'){
                //找到table来存放信息
                if(currentObj.dataType === 'string' || currentObj.dataType === 'number' || currentObj.dataType === 'boolean'){
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).find('table tbody').append(`
                            <tr data-role-datakey="${parent}-${currentObj.dataKey}" data-role-type="${currentObj.dataType}">
                                <td>${currentObj.describe}(${currentObj.dataKey})</td>
                                <td><input class='form-control' placeholder="填写数据" value="${getData(parent + '-' + currentObj.dataKey,this)}"></td>
                            </tr>
                        `);
                    })
                }else if(currentObj.dataType === 'object'){
                    //当前节点为对象模型时,创建一个table,来存放子节点的相关信息
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).find('table tbody').append(`
                            <tr data-role-datakey="${parent}-${currentObj.dataKey}">
                                <td>${currentObj.describe}(${currentObj.dataKey})</td>
                                <td>
                                    <table class="table table-bordered">
                                        <tbody>
        
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `)
                    })

                    if(currentObj.child) build(currentObj,parent+'-'+currentObj.dataKey,'object');
                }else if(currentObj.dataType === 'array'){
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        let datakey = parent.split('-');
                        let crdata = tpdata[datakey[0]] ? tpdata[datakey[0]][index] : '';

                        let tableStr = '';
                        if(!crdata[currentObj.dataKey] || crdata[currentObj.dataKey].length === 0){
                            tableStr += `
                                <table class="table table-bordered" data-role-array>
                                    <tbody>
                                        
                                    </tbody>
                                </table>
                            `
                        }else{
                            for(let i = 0; i<crdata[currentObj.dataKey].length; i++){
                                tableStr += `
                                    <table class="table table-bordered" data-role-array>
                                        <tbody>
                                            
                                        </tbody>
                                    </table>
                                `
                            }
                        }
                        $(this).find('td').eq(1).find('>table>tbody').append(`
                            <tr data-role-datakey="${parent}-${currentObj.dataKey}"">
                                <td>${currentObj.describe}(${currentObj.dataKey})</td>
                                <td>
                                    ${tableStr}
                                </td>
                            </tr>
                        `)
                    })
                    if(currentObj.child) build(currentObj,parent+'-'+currentObj.dataKey,'array');
                }
            }else if(parent && type && type === 'array'){
                if(currentObj.dataType === 'string' || currentObj.dataType === 'number' || currentObj.dataType === 'boolean'){
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).append(`
                            <button class="btn btn-default" data-role-add>增加数据</button>
                        `)
                    })
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).find('table tbody').each(function (index) {
                            $(this).append(`
                            <tr data-role-datakey="${parent}-${currentObj.dataKey}" data-role-type="${currentObj.dataType}">
                                <td>${currentObj.describe}(${currentObj.dataKey})<button class="btn btn-default" data-role-delete>删除</button></td>
                                <td><input class='form-control' placeholder="填写数据" value="${getData(parent + '-' + currentObj.dataKey,this)}"></td>
                            </tr>
                        `);
                        })
                    })
                }else if(currentObj.dataType === 'object'){
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).append(`
                            <button class="btn btn-default" data-role-add>增加数据</button>
                        `);
                    })
                    $(`[data-role-datakey=${parent}]`).each(function (index) {
                        $(this).find('td').eq(1).find('table tbody').append(`
                            <tr data-role-datakey="${parent}-${currentObj.dataKey}">
                                <td>${currentObj.describe}(${currentObj.dataKey})<button class="btn btn-default" data-role-delete>删除</button></td>
                                <td>
                                    <table class="table table-bordered">
                                        <tbody>
                                        
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `);
                    })
                    if(currentObj.child) build(currentObj,parent+'-'+currentObj.dataKey,'object');
                }else if(currentObj.dataType === 'array'){

                }
            }
        }else{
            //根级
            if(currentObj.dataType === 'string' || currentObj.dataType === 'number' || currentObj.dataType === 'boolean'){
                //当前节点为基本类型时,可直接编辑
                $('#data-container>tbody').append(`
                    <tr data-role-datakey="${currentObj.dataKey}" data-role-type="${currentObj.dataType}">
                        <td>${currentObj.describe}(${currentObj.dataKey})</td>
                        <td><input class='form-control' placeholder="填写数据" value="${tpdata[currentObj.dataKey]?tpdata[currentObj.dataKey]:''}"></td>
                    </tr>
                `)
            }else if(currentObj.dataType === 'object'){
                //当前节点为对象模型时,创建一个table,来存放子节点的相关信息
                $('#data-container>tbody').append(`
                    <tr data-role-datakey="${currentObj.dataKey}">
                        <td>${currentObj.describe}(${currentObj.dataKey})</td>
                        <td>
                            <table class="table table-bordered">
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `)
                if(currentObj.child) build(currentObj,currentObj.dataKey,'object')
            }else if(currentObj.dataType === 'array'){
                //当当前节点为数组模型时,创建一个空td,由子节点来控制存放相关信息
                let tableStr = '';
                if(!tpdata[currentObj.dataKey] || tpdata[currentObj.dataKey].length === 0){
                    tableStr += `
                        <table class="table table-bordered" data-role-array>
                            <tbody>
                                
                            </tbody>
                        </table>
                    `
                }else{
                    for(let i = 0; i<tpdata[currentObj.dataKey].length; i++){
                        tableStr += `
                        <table class="table table-bordered" data-role-array>
                            <tbody>
                                
                            </tbody>
                        </table>
                    `
                    }
                }
                $('#data-container>tbody').append(`
                        <tr data-role-datakey="${currentObj.dataKey}"">
                            <td>${currentObj.describe}(${currentObj.dataKey})</td>
                            <td>
                                ${tableStr}
                            </td>
                        </tr>
                    `)
                if(currentObj.child) build(currentObj,key,'array')
            }
        }
    }
}

build(tpschema)

function getData(linked,index) {
    let indexArr = index instanceof Array ? index : [];
    while($(index).closest('[data-role-array]').length > 0){
        indexArr.unshift($(index).closest('[data-role-array]').index());
        index = $(index).closest('[data-role-array]').parent();
    }
    let attr = linked.split('-')
    let result = tpdata;
    let currentSchema = tpschema;
    let defineAttr = 'tpdata';
    let superIsArray = false;
    while(attr.length > 0){
        let at = attr.shift();
        currentSchema = currentSchema.child[at];
        if(superIsArray){
            let idx = indexArr.length > 0 ? indexArr.shift() : 0;
            if(result.length === 0 || result.length < (idx + 1)){
                if(currentSchema.dataType === 'object'){
                    result.push({});
                }else{
                    result.push('');
                }
            }
            defineAttr += `[${idx}]`;
            result = result[idx];
        }else{
            defineAttr += `["${at}"]`;
            if(result[at]){
                result = result[at];
            }else{
                if(currentSchema.dataType === 'string'){
                    eval(`${defineAttr} = ''`);
                }else if(currentSchema.dataType === 'number'){
                    eval(`${defineAttr} = 0`);
                }else if(currentSchema.dataType === 'boolean'){
                    eval(`${defineAttr} = false`);
                }else if(currentSchema.dataType === 'array'){
                    eval(`${defineAttr} = []`);
                }else if(currentSchema.dataType === 'object'){
                    eval(`${defineAttr} = {}`);
                }
                result = result[at];
            }
        }
        superIsArray = currentSchema.dataType === 'array';

    }
    return result?result : ''
}

//数组添加按钮
$('#data-container').on('click','button[data-role-add]',function () {
    let indexArr = [];
    let crNode = this;
    while($(crNode).closest('[data-role-array]').length > 0){
        indexArr.unshift($(crNode).closest('[data-role-array]').index());
        crNode = $(crNode).closest('[data-role-array]').parent();
    }
    let total = $(this).parent().find('>[data-role-array]').length;
    indexArr.push(total);
    let cloneNode;
    if($(this).prev().length > 0){
        cloneNode = $(this).prev().clone();
    }else{
        let datakey = $(this).data('store-key')
        cloneNode = tpNodeTpl[datakey];
    }

    cloneNode.find('input').each(function () {
        let key = $(this).closest('[data-role-datakey]').data('role-datakey');
        $(this).val(getData(key,indexArr.slice()))
    });
    $(this).before(cloneNode);
});

//数组删除按钮
$('#data-container').on('click','button[data-role-delete]',function () {
    let indexArr = [];
    let crNode = this;
    let cr = $(this).closest('table[data-role-array]');
    let key = $(this).closest('tr').data('role-datakey');
    let attr = key.split('-');
    let index = cr.parent().find('>table').index(cr);
    let result = tpdata;
    let currentSchema = tpschema;
    let superIsArray = false;
    while($(crNode).closest('[data-role-array]').length > 0){
        indexArr.unshift($(crNode).closest('[data-role-array]').index());
        crNode = $(crNode).closest('[data-role-array]').parent();
    }
    while(attr.length > 0){
        let at = attr.shift();
        currentSchema = currentSchema.child[at];
        if(superIsArray){
            let idx = indexArr.shift();
            attr.length === 0 ? result = result.splice(idx,1) : result = result[idx];
        }else{
            result = result[at];
        }
        superIsArray = currentSchema.dataType === 'array';
    }

    if(index === 0){
        cr.parent().find('button[data-role-add]').attr('data-store-key',key);
        tpNodeTpl[key] = cr;
    }
    cr.remove();
});

$('#data-container').on('change','input',function () {
    let runStr = 'tpdata';
    let indexArr = [];
    let crNode = this;
    let key = $(this).closest('tr').data('role-datakey');
    let type = $(this).closest('tr').data('role-type');
    let attr = key.split('-');
    let currentSchema = tpschema;
    let superIsArray = false;
    while($(crNode).closest('[data-role-array]').length > 0){
        indexArr.unshift($(crNode).closest('[data-role-array]').index());
        crNode = $(crNode).closest('[data-role-array]').parent();
    }
    while(attr.length > 0){
        let at = attr.shift();
        currentSchema = currentSchema.child[at];
        if(superIsArray){
            let idx = indexArr.shift();
            runStr += `[${idx}]`;
        }else{
            runStr += `["${at}"]`;
        }
        superIsArray = currentSchema.dataType === 'array';
    }

    if(type === 'number'){
        runStr = `${runStr} = ${parseInt($(this).val())}`
    }else if(type === 'string'){
        runStr = `${runStr} = "${$(this).val()}"`
    }else if(type === 'boolean'){
        runStr = `${runStr} = ${$(this).val()}`
    }

    eval(runStr);


});



$('button[data-role-save]').on('click',function () {
    if(originData === JSON.stringify(tpdata)) return alert('内容没有修改,不需要提交');
    $.ajax({
        url:'modifyData',
        method:'POST',
        data:{
            rule:currentRule,
            data:JSON.stringify(tpdata)
        },
        success:function (data) {
            if(data.success) alert('保存成功');
        }
    })
});




/***/ })
/******/ ]);