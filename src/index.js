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
            let $ = require("jquery");
            return factory($);
        });
    } else if (typeof exports === 'object') { //umd
        let $ = require("jquery");
        module.exports = factory($);
    } else {
        root.Drag = factory($);
    }
})(window, function ($) {
    "use strict";
    class Drag {
        constructor() {
            this.status = 0;//0,初始,1移动
            this.pos = { left: 0, top: 0 }
            this.isFixed = false;
            this.position = { x: 0, y: 0 };
        }
        init(settings) {
            this.ss = Object.assign({ parent: 'body', boundary: false, startCallback: () => { }, stopCallback: () => { }, moveCallback: () => { } }, settings);
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
        bindEvent() {
            this.handle.on('mousedown', (e) => {
                this.start(e.clientX, e.clientY);
                // e.stopPropagation();
                e.preventDefault();
            })
            $(document).on('mousemove', e => {
                if (this.status) {
                    let position = this.position;
                    let pos = { x: e.clientX - position.x, y: e.clientY - position.y };
                    this.setPosition(pos);
                }
                e.stopPropagation();
                // e.preventDefault();
            });
            $(document).on('mouseup', () => {
                if (this.status) {
                    this.stop();
                }
            });
            $(window).on('resize', () => {
                this.reset();
            });
        }
        reset() {
            this.setPosition({ x: 0, y: 0 });
        }
        start(x, y) {
            this.docBox = { height: $(document).height(), width: $(document).width() };
            this.status = 1;
            this.position = { x: x, y: y };
            this.ss.startCallback.call(this, this.target, this.pos, this.position);
        }
        stop() {
            this.status = 0;
            this.pos = this.target.position();
            this.ss.stopCallback.call(this, this.target, this.pos);
        }
        setPosition(pos) {
            let x = this.pos.left + pos.x;
            let y = this.pos.top + pos.y;
            let minx = 0, maxx = 0, miny = 0, maxy = 0;
            if (this.ss.boundary) {
                let parentHeight = this.parent.height();
                let parentWidth = this.parent.width();
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
    }

    $.fn.Drag = function (settings) {
        var arr = [];
        $(this).each(function () {
            var options = Object.assign({
                target: $(this)
            }, settings);
            var drag = new Drag();
            drag.init(options);
            arr.push(drag);
        });
        return arr;
    };
    return Drag;
});
