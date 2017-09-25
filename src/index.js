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
            this.ss = Object.assign({ parent: 'body', boundary: false }, settings);
            this.target = $(this.ss.target);
            if(this.target.css('position') ==='static'){
                this.target.css('position','absolute');
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
        bindEvent() {
            this.handle.on('mousedown', (e) => {
                this.status = 1;
                this.position = { x: e.clientX, y: e.clientY };
                e.stopPropagation();
                e.preventDefault();
            })
            $(document).on('mousemove', e => {
                if (this.status) {
                    this.setPosition(e.clientX, e.clientY);
                }
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('mouseup', e => {
                if (this.status) {
                    this.status = 0;
                    this.pos = this.target.position();
                }
            })
        }
        setPosition(cx, cy) {
            let position = this.position;
            let pos = { x: cx - position.x, y: cy - position.y };
            let x = this.pos.left + pos.x;
            let y = this.pos.top + pos.y;
            let minx, maxx, miny, maxy;
            if (this.ss.boundary) {
                if (this.isFixed) {
                    minx = 0;
                    maxx = $(window).width() - this.target.width();
                    miny = 0;
                    maxy = $(window).height() - this.target.height();
                }else if (this.isParentPosition) {
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
    }
    return Drag;
});