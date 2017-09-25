var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Created with Visual Studio Code.
 * github: https://github.com/tianxiangbing/data-merge
 * User: 田想兵
 * Date: 2017-07-21
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 * desc: 主旨是对某一时间段里的数据进行合并，重复的记录进行去重，只取最新的记录。比如一秒钟来了1000条数据，其中有500条是重复的，那这一秒钟应该只返回500条结果。
 * 请使用https://github.com/tianxiangbing/data-merge 上的代码
 */
(function (root, factory) {
    // 
    //amd
    if (typeof define === 'function' && define.amd) {
        define(["jquery"], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function (require, exports, module) {
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
                this.ss = _extends({ parent: 'body', boundary: false }, settings);
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
                this.bindEvent();
                this.setPosition(0, 0, this.position);
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this = this;

                this.handle.on('mousedown', function (e) {
                    _this.status = 1;
                    _this.position = { x: e.clientX, y: e.clientY };
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on('mousemove', function (e) {
                    if (_this.status) {
                        _this.setPosition(e.clientX, e.clientY);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on('mouseup', function (e) {
                    if (_this.status) {
                        _this.status = 0;
                        _this.pos = _this.target.position();
                    }
                });
            }
        }, {
            key: 'setPosition',
            value: function setPosition(cx, cy) {
                var position = this.position;
                var pos = { x: cx - position.x, y: cy - position.y };
                var x = this.pos.left + pos.x;
                var y = this.pos.top + pos.y;
                var minx = void 0,
                    maxx = void 0,
                    miny = void 0,
                    maxy = void 0;
                if (this.ss.boundary) {
                    if (this.isFixed) {
                        minx = 0;
                        maxx = $(window).width() - this.target.width();
                        miny = 0;
                        maxy = $(window).height() - this.target.height();
                    } else if (this.isParentPosition) {
                        minx = 0;
                        maxx = this.parent.width() - this.target.width();
                        miny = 0;
                        maxy = this.parent.height() - this.target.height();
                    } else {
                        this.parentPos = this.parent.position();
                        minx = this.parentPos.left;
                        maxx = this.parentPos.left + this.parent.width() - this.target.width();
                        miny = this.parentPos.top;
                        maxy = this.parentPos.top + this.parent.height() - this.target.height();
                    }
                    x = Math.max(Math.min(x, maxx), minx);
                    y = Math.max(Math.min(y, maxy), miny);
                }
                this.target.css({ left: x, top: y });
            }
        }]);

        return Drag;
    }();

    return Drag;
});