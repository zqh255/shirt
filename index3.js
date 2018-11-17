function Shirt(config) {
  var that = this
  that.config = config
  that.img = null
  that.positive = null
  that.scale = null
  that.rotate = null
  that.isMove = false
  that.isScale = false
  that.status = {
    x: 0,
    y: 0,
    x1: 0,
    y1: 0
  }
  that.pos = {
    w: 0,
    h: 0,
    x: 0,
    y: 0
  }
  that.angle = 0
  this.imgCenterPosX = null; // 图片圆心坐标 - x
  this.imgCenterPosY = null; // 图片圆心坐标 - y
}

//初始的angle
var firstAngle = 180;
var moveAngle;

Shirt.prototype = {
  init() {
    var that = this

    that.positive = document.getElementById('positiveBox')
    that.scale = document.getElementById('scale')
    that.rotate = document.getElementById('rotate')
    that.img = document.getElementById('imgBox')

    that.setLocation();

    // 图片圆心
    that.imgCenterPosX = that.img.offsetLeft + (that.img.offsetWidth + 1) / 2
    that.imgCenterPosY = that.img.offsetTop + that.img.offsetHeight / 2

    //放大缩小
    that.scale.onmousedown = function (e) {
      that.stopDefaultEvent(e)
      that.isScale = true
       //that.img.onmouseup
      that.pos = {
        w: that.img.offsetWidth,
        h: that.img.offsetHeight,
        x: e.clientX,
        y: e.clientY
      }

      that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave = function (e) {
        that.isScale = false;
        //console.log(that.img.style.transform.rotate)
        firstAngle = moveAngle + 180;
        if (e.clientX - that.positive.offsetLeft > that.imgCenterPosX) {
          firstAngle = moveAngle + 180;
        }

      }

      that.img.onmousemove = that.positive.onmousemove = function (e) {
        if (that.isScale) {
          that.rotationMove(e)
        }
        that.stopDefaultEvent(e)
      }
    }

    // that.rotate.onmousedown = function(e){
    //   that.isScale = true
    //    that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave = function (e) {
    //     that.isScale = false
    //   }

    //   that.img.onmousemove = that.positive.onmousemove = function (e) {
    //     if (that.isScale) {
    //       that.rotationMove(e)
    //     }
    //     that.stopDefaultEvent(e)
    //   }
    // }
  },
  stopDefaultEvent(e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    if (e.returnValue) {
      e.returnValue = false
    }
    e.stopPropagation()
  },
  setLocation() {
    var that = this
    that.img.style.left = (that.positive.offsetWidth - that.img.offsetWidth) / 2
    that.img.style.top = (that.positive.offsetHeight - that.img.offsetHeight) / 2
  },
  rotationMove(e) {
    var that = this

    // 按下的坐标
    var dx = that.pos.x - that.positive.offsetLeft;
    var dy = that.pos.y - that.positive.offsetTop;
    //鼠标移动坐标 px py
    var px = e.clientX - that.positive.offsetLeft;
    var py = e.clientY - that.positive.offsetTop;
    // 中心点 that.imgCenterPosX  that.imgCenterPosY
    var mx = that.imgCenterPosX;
    var my = that.imgCenterPosY;

    //三个点就是一个三角形，求夹角就好
    //A(dx, dy), B(mx, my), C(px, py)
    //AB(mx - dx, my - dy) BC(px - mx, py - my)
    //参考链接：https://www.zybang.com/question/a867f3f31331c41ec123fdb26299665c.html
    var x2 = Math.pow(mx - dx, 2);
    var y2 = Math.pow(my - dy, 2);
    var x1 = Math.pow(px - mx, 2);
    var y1 = Math.pow(py - my, 2);

    var cos = ((mx - dx) * (px - mx) + (my - dy) * (py - my)) / (Math.sqrt(x1 + y1) * Math.sqrt(x2 + y2));

    var angle;

    //AB连成直线，判断C点在线的哪一侧来区分方向。
    //AB线方程: y = kx + b

    var k = (my - dy) / (mx - dx);
    var b = dy - k * dx;
    //y = k * x + (dy - k * dx)
    var val = k * px + dy - k * dx

    if (dx < mx) {
      if (val >= py) {
          angle = firstAngle - Math.abs(Math.acos(cos) / Math.PI * 180);
      } else {
          angle = firstAngle + Math.abs(Math.acos(cos) / Math.PI * 180);
      }
    } else {
      if (val >= py) {
          angle = firstAngle + Math.abs(Math.acos(cos) / Math.PI * 180);
      } else {
          angle = firstAngle - Math.abs(Math.acos(cos) / Math.PI * 180);
      }
    }

    moveAngle = angle;

    that.img.style.transform = 'rotate(' + angle + 'deg)';
  },
}

Shirt.prototype.constructor = Shirt
