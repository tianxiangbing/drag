# drag
针对网页中出现的拖曳插件，边界判断，fixed定位拖动.基于`jQuery` 或者`zepto`.包括针对父级容器内的拖动处理
# npm 安装 
    npm install --save jq-drag
# Demo
http://tianxiangbing.github.io/drag/index.html
```js
//默认无限制拖动
var drag = new Drag();
drag.init({ target: '#dragdefault' });
//在body内的拖动
var dragbody = new Drag();
dragbody.init({ target: '#dragbody', boundary: true });
//绝对定位相对于window的拖动
var dragfix = new Drag();
dragfix.init({ target: '#dragfix', boundary: true });
//拖动手柄
var dragheader = new Drag();
dragheader.init({ target: '#dragheader',handle:'.handle'});
//在父级容器内的拖动
var dragparent = new Drag();
dragparent.init({ target: '#dragparent', boundary: true,parent:'.parent' });
//在父级容器内的拖动,父级有定位position
var dragparent2 = new Drag();
dragparent2.init({ target: '#dragparent2', boundary: true,parent:'.parent2' });
```
或者使用jQuery插件的方式调用
```js
$('.drag').Drag({boundary:true});//options一致
```
# API
## init:`function()`
    在new 的方法调用时的初始化方法，使用`$.fn`的插件方式不需要
## target:`string|dom`
    需要移动的元素
## boundary:`bool`
    是否有边界的限制，默认以body为边界，可以指定parent
## parent:`string|dom`
    父级容器作为边界，这有两种情况，父级无定位的和有定位的
## startCallack:`(this.target, this.pos, this.position)`
    开始时的回调
## stopCallack:`(this.target, this.pos);`
    结束的回调,第二个参数是当前位置
## moveCallack:`(this.target, x, y);`
    移动时的回调,x、y对应移动到的left和top