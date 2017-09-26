var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Created with Visual Studio Code.
 * github: https://github.com/tianxiangbing/drag
 * User: 田想兵
 * Date: 2017-09-25
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 * desc: 针对网页中出现的拖曳插件，边界判断，fixed定位拖动.基于`jQuery` 或者`zepto`.包括针对父级容器内的拖动处理
 * 请使用https://github.com/tianxiangbing/drag 上的代码
 */
(function (root, factory) {
    // 
    //amd
    if (typeof define === 'function' && define.amd) {
        define(["jquery"], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function (require) {
            var $ = require("jquery");
            return factory($);
        });
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        //umd
        var _$ = require("jquery");
        module.exports = factory(_$);
    } else {
        root.Drag = factory($);
    }
})(window, function ($) {
    "use strict";

    var Drag = function () {
        function Drag() {
            _classCallCheck(this, Drag);

            this.status = 0; //0,初始,1移动
            this.pos = { left: 0, top: 0 };
            this.isFixed = false;
            this.position = { x: 0, y: 0 };
        }

        _createClass(Drag, [{
            key: 'init',
            value: function init(settings) {
                this.ss = _extends({ parent: 'body', boundary: false, startCallback: function startCallback() {}, stopCallback: function stopCallback() {}, moveCallback: function moveCallback() {} }, settings);
                this.target = $(this.ss.target);
                if (this.target.css('position') === 'static') {
                    this.target.css('position', 'absolute');
                }
                this.handle = this.target.find(this.ss.handle);
                this.handle.size() === 0 ? this.handle = this.target : undefined;
                this.handle.css({ 'user-select': 'none', 'cursor': 'move' });
                this.parent = $(this.ss.parent);
                this.isFixed = this.target.css('position') === 'fixed';
                this.isParentPosition = this.parent.css('position') !== 'static';
                this.pos = this.target.position();
                this.docBox = { height: $(document).height(), width: $(document).width() };
                this.bindEvent();
                this.reset();
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this = this;

                this.handle.on('mousedown', function (e) {
                    _this.start(e.clientX, e.clientY);
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on('mousemove', function (e) {
                    if (_this.status) {
                        var position = _this.position;
                        var pos = { x: e.clientX - position.x, y: e.clientY - position.y };
                        _this.setPosition(pos);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on('mouseup', function () {
                    if (_this.status) {
                        _this.stop();
                    }
                });
                $(window).on('resize', function () {
                    _this.reset();
                });
            }
        }, {
            key: 'reset',
            value: function reset() {
                this.setPosition({ x: 0, y: 0 });
            }
        }, {
            key: 'start',
            value: function start(x, y) {
                this.docBox = { height: $(document).height(), width: $(document).width() };
                this.status = 1;
                this.position = { x: x, y: y };
                this.ss.startCallback.call(this, this.target, this.pos, this.position);
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.status = 0;
                this.pos = this.target.position();
                this.ss.stopCallback.call(this, this.target, this.pos);
            }
        }, {
            key: 'setPosition',
            value: function setPosition(pos) {
                var x = this.pos.left + pos.x;
                var y = this.pos.top + pos.y;
                var minx = 0,
                    maxx = 0,
                    miny = 0,
                    maxy = 0;
                if (this.ss.boundary) {
                    var parentHeight = this.parent.height();
                    var parentWidth = this.parent.width();
                    if (this.ss.parent == 'body') {
                        parentWidth = Math.max(parentWidth, this.docBox.width);
                        parentHeight = Math.max(parentHeight, this.docBox.height);
                    }
                    if (this.isFixed) {
                        minx = 0;
                        maxx = $(window).width() - this.target.outerWidth();
                        miny = 0;
                        maxy = $(window).height() - this.target.outerHeight();
                    } else if (this.isParentPosition) {
                        minx = 0;
                        maxx = parentWidth - this.target.outerWidth();
                        miny = 0;
                        maxy = parentHeight - this.target.outerHeight();
                    } else {
                        this.parentPos = this.parent.position();
                        minx = this.parentPos.left;
                        maxx = this.parentPos.left + parentWidth - this.target.outerWidth();
                        miny = this.parentPos.top;
                        maxy = this.parentPos.top + parentHeight - this.target.outerHeight();
                    }
                    x = Math.max(Math.min(x, maxx), minx);
                    y = Math.max(Math.min(y, maxy), miny);
                }
                this.target.css({ left: x, top: y });
                this.ss.moveCallback.call(this, this.target, x, y);
            }
        }]);

        return Drag;
    }();

    $.fn.Drag = function (settings) {
        var arr = [];
        $(this).each(function () {
            var options = _extends({
                target: $(this)
            }, settings);
            var drag = new Drag();
            drag.init(options);
            arr.push(lz);
        });
        return arr;
    };
    return Drag;
});