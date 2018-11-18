function Shirt(config) {
    var that = this
    that.config = config
    that.img = null
    that.positive = null
    that.scale = null
    that.rotate = null
    that.select = null
    that.isMove = false
    that.isScale = false
    that.isRotate = null
    that.isDoubleScale = false
    that.isSingle = false
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

    that.firstAngle = 180
    that.moveAngle = 0
    that.distance = {}
    that.origin = 0
    that.scaleRation = 1
    that.isShow = config.isShow
    that.isMobile = window.navigator.userAgent.toLowerCase().includes('mobile')
}

//初始的angle
// var firstAngle = 180;
// var moveAngle;
// var distance = {}
// var origin
// var scale = 1

Shirt.prototype = {
    init(domList) {
        var that = this,
            distance = that.distance,
            origin = that.origin,
            scaleRation = that.scaleRation

        that.parent = document.getElementById(domList.parentDom)
        that.positive = document.getElementById(domList.boxDom)
        that.scale = document.getElementById(domList.scale)
        that.rotate = document.getElementById(domList.rotate)
        that.img = document.getElementById(domList.imgBox)
        // that.select = document.getElementById(domList.select)

        that.setLocation();

        // 图片圆心
        that.imgCenterPosX = that.img.offsetLeft + (that.img.offsetWidth + 1) / 2
        that.imgCenterPosY = that.img.offsetTop + that.img.offsetHeight / 2

        //移动
        that.img.onmousedown = that.img.ontouchstart = that.positive.ontouchstart = function (e) {
            if (e.touches && e.touches.length >= 2) {
                that.isDoubleScale = true
                distance.start = that.getDistance({
                    x: e.touches[0].screenX,
                    y: e.touches[0].screenY
                }, {
                    x: e.touches[1].screenX,
                    y: e.touches[1].screenY
                })
                //that.isScale = true
                that.positive.ontouchend = function (e) {
                    that.isDoubleScale = false
                    //that.isScale = false
                }
                that.positive.ontouchmove = function (e) {
                    if (e.touches.length >= 2 && that.isDoubleScale) {
                        //var scale = that.getDistance(e.touches[0], e.touches[1])
                        origin = that.getOrigin({
                            x: e.touches[0].pageX,
                            y: e.touches[0].pageY
                        }, {
                            x: e.touches[1].pageX,
                            y: e.touches[1].pageY
                        })

                        distance.stop = that.getDistance({
                            x: e.touches[0].screenX,
                            y: e.touches[0].screenY
                        }, {
                            x: e.touches[1].screenX,
                            y: e.touches[1].screenY
                        })

                        scaleRation = distance.stop / distance.start
                        that.scaleRation = scaleRation

                        that.img.style.transform = 'rotate(' + that.moveAngle + 'deg) scale(' + scaleRation + ')';

                        that.stopDefaultEvent(e)
                    }
                }
            }
            if ((e.clientX && e.clientY) || (e.touches.length < 2)) {
                that.moveEvent(e)
            }
        }

        //放大缩小
        that.scale.onmousedown = that.scale.ontouchstart = function (e) {
            that.stopDefaultEvent(e)
            that.isScale = true
            that.pos = {
                w: that.img.offsetWidth,
                h: that.img.offsetHeight,
                x: that.getClient(e).x,
                y: that.getClient(e).y
            }

            that.showBorder()

            that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave =
                that.img.ontouchend = that.positive.ontouchend = function (e) {
                    that.isScale = false
                    that.hideBorder()
                }

            that.img.onmousemove = that.positive.onmousemove =
                that.img.ontouchmove = that.positive.ontouchmove = function (e) {
                    that.scaleMove(e)
                    that.stopDefaultEvent(e)
                }
        }

        //放大缩小(双指控制)
        // that.positive.ontouchstart = function(e){
        //   if(e.touches.length >= 2){
        //     that.isDoubleScale = true
        //     distance.start = that.getDistance({
        //       x: e.touches[0].screenX,
        //       y: e.touches[0].screenY
        //     },{
        //       x: e.touches[1].screenX,
        //       y: e.touches[1].screenY
        //     })
        //     //that.isScale = true
        //   }
        //   that.positive.ontouchend = function(e){
        //     that.isDoubleScale = false
        //     //that.isScale = false
        //   }
        //   that.positive.ontouchmove = function(e){
        //     if(e.touches.length >= 2 && that.isDoubleScale){
        //       //var scale = that.getDistance(e.touches[0], e.touches[1])
        //       origin = that.getOrigin({
        //         x: e.touches[0].pageX,
        //         y: e.touches[0].pageY
        //       },{
        //         x: e.touches[1].pageX,
        //         y: e.touches[1].pageY
        //       })

        //       distance.stop = that.getDistance({
        //         x: e.touches[0].screenX,
        //         y: e.touches[0].screenY
        //       },{
        //         x: e.touches[1].screenX,
        //         y: e.touches[1].screenY
        //       })

        //       scale = distance.stop / distance.start

        //       that.img.style.transform = 'scale(' + scale +')';

        //       that.stopDefaultEvent(e)
        //     }
        //   }
        // }

        //旋转
        that.rotate.onmousedown = that.rotate.ontouchstart = function (e) {
            that.stopDefaultEvent(e)
            that.rotate = true
            that.showBorder()
            that.pos = {
                w: that.img.offsetWidth,
                h: that.img.offsetHeight,
                x: that.getClient(e).x,
                y: that.getClient(e).y
            }

            that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave =
                that.img.ontouchend = that.positive.ontouchend = function (e) {
                    that.rotate = false;
                    that.hideBorder()
                    //console.log(that.img.style.transform.rotate)
                    that.firstAngle = that.moveAngle + 180;
                    if (that.getClient(e).x - that.positive.offsetLeft > that.imgCenterPosX) {
                        that.firstAngle = that.moveAngle + 180;
                    }

                }

            that.img.onmousemove = that.positive.onmousemove =
                that.img.ontouchmove = that.positive.ontouchmove = function (e) {
                    if (that.rotate) {
                        that.rotationMove(e)
                    }
                    that.stopDefaultEvent(e)
                }
        }


        that.parent.style.display = that.isShow ? 'block' : 'none'
        //移动端隐藏放大缩小按钮
        if (that.isMobile) {
            that.scale.style.display = 'none'
        } else {
            // that.select.style.display = 'none'
        }
    },

    showBorder() {
        this.positive.style.border = '1px dashed'
    },
    hideBorder() {
        this.positive.style.border = 'unset'
    },
    showImgBorder() {
        that.img.style = '1px dashed'
    },
    hideImgBorder() {
        that.img.style = '1px dashed'
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
    getDistance(start, stop) {
        return Math.sqrt(Math.pow((stop.x - start.x), 2) + Math.pow((stop.y - start.y), 2))
    },
    getScale(start, stop) {
        return getDistance(start[0], start[1]) / getDistance(stop[0], stop[1])
    },
    getOrigin(first, second) {
        return {
            x: (first.x + second.x) / 2,
            y: (first.y + second.y) / 2
        };
    },

    mousemove(e) {
        var that = this
        if (that.isMove) {
            var x = that.getClient(e).x - that.status.x
            var y = that.getClient(e).y - that.status.y

            //边界判断
            x = x <= 0 ? 1 : x - 1
            y = y <= 0 ? 1 : y - 1

            x = x >= that.positive.offsetWidth - that.img.offsetWidth ?
                that.positive.offsetWidth - that.img.offsetWidth - 2 :
                x
            y = y >= that.positive.offsetHeight - that.img.offsetHeight ?
                that.positive.offsetHeight - that.img.offseHeight - 2 :
                y

            that.img.style.left = x + 'px'
            that.img.style.top = y + 'px'
        }
    },
    scaleMove(e) {
        var that = this
        if (that.isScale) {
            var w = Math.max(30, that.getClient(e).x - that.pos.x + that.pos.w)
            var h = Math.max(30, that.getClient(e).y - that.pos.y + that.pos.h)

            w = w >= that.positive.offsetWidth - that.img.offsetLeft ?
                that.positive.offsetWidth - that.img.offsetLeft :
                w

            h = h >= that.positive.offsetHeight - that.img.offsetTop ?
                that.positive.offsetHeight - that.img.offsetTop :
                h

            that.img.style.width = w + 'px'
            that.img.style.height = h + 'px'
        }
    },
    setLocation() {
        var that = this
        that.img.style.left = (that.positive.offsetWidth - that.img.offsetWidth) / 2
        that.img.style.top = (that.positive.offsetHeight - that.img.offsetHeight) / 2
    },
    rotationMove(e) {
        var that = this,
            firstAngle = that.firstAngle,
            scaleRation = that.scaleRation
        // 按下的坐标
        var dx = that.pos.x - that.positive.offsetLeft;
        var dy = that.pos.y - that.positive.offsetTop;
        //鼠标移动坐标 px py
        var px = that.getClient(e).x - that.positive.offsetLeft;
        var py = that.getClient(e).y - that.positive.offsetTop;

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

        that.moveAngle = angle;

        that.img.style.transform = 'rotate(' + angle + 'deg) scale(' + scaleRation + ')';
    },

    getClient(e) {
        var pos = {x: null, y: null}
        if (e.clientX && e.clientY) {
            pos.x = e.clientX
            pos.y = e.clientY
        } else if (e.touches[0] && e.touches[0].clientX && e.touches[0].clientY) {
            pos.x = e.touches[0].clientX
            pos.y = e.touches[0].clientY
        } else if (e.changedTouches[0] && e.changedTouches[0].clientX && e.changedTouches[0].clientY) {
            pos.x = e.changedTouches[0].clientX
            pos.y = e.changedTouches[0].clientY
        }
        return pos
    },

    moveEvent(e) {
        var that = this
        that.isMove = true
        that.status.x = that.getClient(e).x - that.img.offsetLeft
        that.status.y = that.getClient(e).y - that.img.offsetTop

        that.showBorder()

        that.img.onmouseup = that.img.onmouseout = that.img.onmouseleave = that.img.ontouchend = function (e) {
            that.isMove = false
            that.hideBorder()

            that.stopDefaultEvent(e)
        }

        that.img.onmousemove = that.img.ontouchmove = function (e) {
            if (that.isMove && !that.isDoubleScale) {
                that.mousemove(e)
            }
            that.stopDefaultEvent(e)
        }
    }
}

Shirt.prototype.constructor = Shirt
