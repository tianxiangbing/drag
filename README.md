# drag
针对网页中出现的拖曳插件，边界判断，fixed定位拖动.基于`jQuery` 或者`zepto`.包括针对父级容器内的拖动处理
# npm 安装 
    npm install --save jq-drag
# Demo
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

