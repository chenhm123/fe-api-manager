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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = "{{#equal isRoot ''}}\n<tr data-role-parent=\"{{parentKey}}\">\n    <td colspan=\"5\">\n        <div class=\"form-wrapper\">\n{{/equal}}\n            <button class=\"btn btn-primary\" type=\"button\" data-toggle>添加数据类型</button>\n            <table class=\"table table-bordered\">\n                <thead>\n                <tr>\n                    <th>字段</th>\n                    <th>描述</th>\n                    <th>详情</th>\n                    <th>类型</th>\n                    <th>编辑数据</th>\n                </tr>\n                </thead>\n                <tbody>\n                {{#each schema}}\n                <tr data-role-datakey=\"{{#if @root.parentKey}}{{@root.parentKey}}-{{/if}}{{dataKey}}\">\n                    <td>{{dataKey}}</td>\n                    <td>{{describe}}</td>\n                    <td>{{details}}</td>\n                    <td>{{dataType}}</td>\n                    <td>\n                        {{#equal dataType 'object'}}\n                            <button class=\"btn btn-default\" data-role-fold>展开数据结构</button>\n                        {{/equal}}\n                        {{#equal dataType 'array'}}\n                            <button class=\"btn btn-default\" data-role-fold>展开数据结构</button>\n                        {{/equal}}\n                        <button class=\"btn btn-default\" data-role-modify>编辑字段</button>\n                        <button class=\"btn btn-default\" data-role-delete>删除字段</button>\n                    </td>\n                </tr>\n                {{/each}}\n                </tbody>\n            </table>\n            {{#equal isRoot ''}}\n        </div>\n    </td>\n</tr>\n{{/equal}}";

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by chenhm on 30/09/2017.
 */

var childNodeTpl = __webpack_require__(0);
var currentNode;
var clickNode;
var isModify;
var dataIsChange = false;
var originSchema = JSON.stringify(tpschema);

Handlebars.registerHelper('equal', function(v1, v2, opts) {
    if(v1 === v2)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

/**
 * 添加数据字段
 */
$('.container').on('click','button[data-toggle]',function () {
    clickNode = $(this);
    currentNode = $(this);
    isModify = false;
    $('#define-data-dialog input').val('')
    $('#define-data-dialog select').val('')
    $('#define-data-dialog input[name=data-key]').removeAttr('disabled');
    $('#define-data-dialog select').removeAttr('disabled');
    $('#define-data-dialog').modal('toggle')
})

/**
 * 添加属性
 */
$('#define-data').on('click',function() {
    var dataKey = $('#define-data-dialog input[name=data-key]').val();
    var desc = $('#define-data-dialog input[name=data-describe]').val();
    var detail = $('#define-data-dialog input[name=data-details]').val();
    var type = $('#define-data-dialog select').val();


    if(!dataKey || !type ) return $('#define-data-dialog').modal('toggle');

    var currentTr = currentNode.closest('tr');
    var isRoot = currentTr.length === 0 ? true :'';


    var currentSchema = tpschema;

    if(!isRoot){
        var attr = currentTr.data('role-parent').split('-');
        while(attr.length > 0){
            currentSchema = currentSchema.child[attr.shift()];
        }
    }

    currentSchema.child = currentSchema.child ? currentSchema.child : {};

    currentSchema.child[dataKey] ={
        dataType:type,
        dataKey:dataKey,
        describe:desc,
        details:detail
    };

    var template = Handlebars.compile(childNodeTpl)({schema:currentSchema.child,parentKey:isRoot?'':currentTr.data('role-parent'),isRoot:isRoot});

    if(currentNode.closest('tr').length === 0){
        $('div.container').html(template);
    }else{
        $('[data-role-datakey='+currentTr.data('role-parent')+']').after($(template));
        currentTr.remove();
    }
    $('#define-data-dialog').modal('toggle');
});

/**
 * 删除字段
 */
$('div.container').on('click','button[data-role-delete]',function(){
    dataIsChange = true;
    var currentTr = $(this).closest('tr');
    var datakey = currentTr.data('role-datakey');
    var attr = currentTr.data('role-datakey').split('-');
    var isRoot = attr.length === 1 ? true :'';
    var currentSchema = tpschema;
    var loopSchema = tpschema;
    var evalStr = 'delete tpschema';
    var deleteDataStr = 'if(tpdata)';
    var ctAt = 'tpdata';
    var isArray = false;
    var unNormal = false;
    while(attr.length > 0){
        var crAttr = attr.shift();
        if(attr.length !== 0) currentSchema = currentSchema.child[crAttr];
        loopSchema = loopSchema.child[crAttr];
        evalStr += `['child']['${crAttr}']`
        ctAt += `['${crAttr}']`;

        if(!unNormal){
            deleteDataStr = `${deleteDataStr} if(${ctAt})`;
        }else{
            if(attr.length > 0){
                deleteDataStr = `${deleteDataStr} if(${ctAt})`;
            }else{
                deleteDataStr = `${deleteDataStr} delete ${ctAt} })`;
            }
        }
        if(loopSchema && loopSchema.dataType === 'array'){
            if(attr.length !==0 ) isArray = true;
            if(attr.length === 1){
                crAttr = attr.shift();
                evalStr += `['child']['${crAttr}']`
                deleteDataStr = `${ctAt} = ${ctAt}.splice(0,0)`;
            }else if(attr.length >1){
                unNormal = true;
                crAttr = attr.shift();
                evalStr += `['child']['${crAttr}']`;
                deleteDataStr += `
                    ${ctAt}.forEach(function(item){`
                ctAt = 'item'
            }
        }
    }

    if(!isArray) deleteDataStr += ` delete ${ctAt}`;

    eval(deleteDataStr);
    eval(evalStr);

    var template = Handlebars.compile(childNodeTpl)({schema:currentSchema.child,parentKey:isRoot?'':currentTr.data('role-datakey'),isRoot:isRoot});

    if(isRoot){
        $('div.container').html(template);
    }else{
        $('[data-role-datakey='+currentTr.data('role-parent')+']').after($(template));
        currentTr.remove();

        //删除关联的节点
        if($(`[data-role-parent = ${datakey}]`).length > 0) $(`[data-role-parent = ${datakey}]`).remove();
    }
});

`if(tpdata[list])if(tpdata[list][a]) delete[tpdata[list][a]]`

/**
 * 打开数据折叠项
 */
$('div.container').on('click','button[data-role-fold]',function(){
    var self =this;
    var currentTr = $(this).closest('tr')
    var currentKey = currentTr.data('role-datakey');
    var attr = currentKey.split('-')

    if($('tr[data-role-parent="'+currentKey+'"]').length > 0){
        $(self).toggleClass('active');
        return $('tr[data-role-parent="'+currentKey+'"]').toggleClass('hide');
    }
    $(self).toggleClass('active');
    var currentSchema = tpschema;
    while(attr.length > 0){
        currentSchema = currentSchema.child[attr.shift()];
    }

    var template = Handlebars.compile(childNodeTpl)({schema:currentSchema.child,parentKey:currentKey,isRoot:''});

    currentTr.after($(template))

});

/**
 * 保存配置
 */
$('button[data-role-save]').on('click',function () {
    if(originSchema === JSON.stringify(tpschema)) return alert('内容没有修改,不需要提交');
    $.ajax({
        url:'modifySchema',
        method:'POST',
        data:{
            schema:JSON.stringify(tpschema),
            rule:currentRule,
            data:dataIsChange ? JSON.stringify(tpdata):''
        },
        success:function (data) {
            if(data.success) alert('修改成功');
        }
    })
});

/**
 * 编辑数据结构
 */
$('div.container').on('click','button[data-role-modify]',function(){
    var datakey = $(this).closest('tr').data('role-datakey');
    var attr = datakey.split('-');
    var currentSchema = tpschema;
    while(attr.length > 0){
        currentSchema = currentSchema.child[attr.shift()];
    }
    clickNode = $(this).closest('table');
    currentNode = $(this).closest('table');
    $('#define-data-dialog').modal('toggle');
    $('#define-data-dialog input[name=data-key]').val(currentSchema.dataKey).attr('disabled','true');
    $('#define-data-dialog input[name=data-describe]').val(currentSchema.describe);
    $('#define-data-dialog input[name=data-details]').val(currentSchema.details);
    $('#define-data-dialog select').val(currentSchema.dataType).attr('disabled','true');
});





/***/ })
/******/ ]);