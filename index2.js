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
       that.img.onmouseup 
      that.pos = {
        w: that.img.offsetWidth,
        h: that.img.offsetHeight,
        x: e.clientX,
        y: e.clientY
      }

      that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave = function (e) {
        that.isScale = false
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

    //鼠标点击坐标 px py
    // 中心点 that.imgCenterPosX  that.imgCenterPosY
    var px = e.clientX - that.positive.offsetLeft;
    var py = e.clientY - that.positive.offsetTop;
    var mx = that.imgCenterPosX;
    var my = that.imgCenterPosY;

    var x = Math.abs(px - mx);
    var y = Math.abs(py - my);
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var cos = y / z;
    var radina = Math.acos(cos); //用反三角函数求弧度
    var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度
     

    if (mx < px && my < py) { //鼠标在第四象限
      //angle = 180 - angle;
      angle = 34 - angle
     
    }

    if (mx == px && my > py) { //鼠标在y轴负方向上
      //angle = 180;
      angle = 34
    }

    if (mx > px && my < py) { //鼠标在第三象限
      angle = 34 + angle;
    }

    if (mx > px && my == py) { //鼠标在x轴负方向
      angle = 124;
    }

    if (mx > px && my > py) { //鼠标在第二象限
      angle = 37 + angle;
      console.log(angle)
    }
    
    // if(mx == px && my > py){ //鼠标在y轴正方向上
    //   angle = 0
    // }


    // if (mx < px && my == py) { //鼠标在x轴正方向上
    //   angle = 90;
    // }

    

    

   

    that.img.style.transform = 'rotate(' + angle + 'deg)';
  },
}

Shirt.prototype.constructor = Shirt