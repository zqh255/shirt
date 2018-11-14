function Shirt(config){
	var that = this
	that.config = config
	that.img = null
	that.positive = null
	that.scale = null
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
}

Shirt.prototype = {
	init(){
		var that = this

		that.positive = document.getElementById('positiveBox')
		that.scale = document.getElementById('scale')
		// positive.style.background =  `url(${that.config.bShirtImg.p}) no-repeat`
		that.img = document.getElementById('imgBox')

		that.setLocation()

		that.img.onmousedown = function(e){
			that.isMove = true
			that.status.x = e.clientX - that.img.offsetLeft
			that.status.y = e.clientY - that.img.offsetTop

			that.positive.style.border = '1px dashed'

			that.img.onmouseup = that.img.onmouseout = that.img.onmouseleave  = function(e){
				that.isMove = false
				that.positive.style.border = 'unset'
				that.stopDefaultEvent(e)
			}
			
			that.img.onmousemove = function(e){
				that.mousemove(e)
				that.stopDefaultEvent(e)
			}
		}

		 
		

		//放大缩小
		that.scale.onmousedown = function(e){
			that.stopDefaultEvent(e)
			that.isScale = true
			that.pos = {
				w: that.img.offsetWidth,
				h: that.img.offsetHeight,
				x: e.clientX,
				y: e.clientY
			}

			that.img.onmouseup = that.positive.onmouseup = that.positive.onmouseleave  = function(e){
				that.isScale = false
			}

			that.img.onmousemove = that.positive.onmousemove = function(e){
				that.scaleMove(e)
				that.rotationMove(e)
				that.stopDefaultEvent(e)
			}
		}

		
	},
	stopDefaultEvent(e){
		if(e.preventDefault){
			e.preventDefault()
		}
		if(e.returnValue){
			e.returnValue = false
		}
		e.stopPropagation()
	},
	mousemove(e){
		var that = this
		if(that.isMove){
			var x = e.clientX - that.status.x
			var y = e.clientY - that.status.y

			//边界判断
			x = x <= 0 ? 1 : x - 1
			y = y <= 0 ? 1 : y - 1

			x = x >=  that.positive.offsetWidth - that.img.offsetWidth ? 
					  that.positive.offsetWidth - that.img.offsetWidth - 2:
					  x
			y = y >= that.positive.offsetHeight - that.img.offsetHeight ? 
					 that.positive.offsetHeight - that.img.offseHeight - 2:
					 y

			that.img.style.left = x + 'px'
			that.img.style.top = y + 'px'
		}
		
	},
	scaleMove(e){
		var that = this
		if(that.isScale){
			var w = Math.max(30, e.clientX - that.pos.x + that.pos.w)
			var h = Math.max(30, e.clientY - that.pos.y + that.pos.h)

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
	setLocation(){
		var that = this
		that.img.style.left = (that.positive.offsetWidth - that.img.offsetWidth) / 2
		that.img.style.top = (that.positive.offsetHeight - that.img.offsetHeight) / 2
	},

	rotationMove(e){
		var that = this
		//图片圆心坐标
		var imgCenterPosX = that.img.offsetLeft + (that.img.offsetWidth + 1) / 2
		var imgCenterPosY = that.img.offsetTop + that.img.offsetHeight / 2

		//鼠标点击坐标
		var mouseClickX = e.clientX - that.positive.offsetLeft
		var mouseClickY = e.clientY - that.positive.offsetTop

		var x = Math.abs(imgCenterPosX - mouseClickX)
		var y = Math.abs(imgCenterPosY - mouseClickY)
		var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
		var cos = y / z
		var radina = Math.acos(cos) //反三角函数求弧度
		that.angle =  Math.floor(180 / (Math.PI/radina))

		// if(mouseClickX > imgCenterPosX && mouseClickY > imgCenterPosY){
		// 	that.angle = 180 - that.angle
		// }
		 if(mouseClickX == imgCenterPosX && mouseClickY > imgCenterPosY){
			that.angle = 180
		}
		// else if(mouseClickX > imgCenterPosX && mouseClickY == imgCenterPosY){
		// 	that.angle = 90
		// }
		// else if(mouseClickX < imgCenterPosX && mouseClickY > imgCenterPosY){
		// 	that.angle = 180 + that.angle
		// }
		else if(mouseClickX < imgCenterPosX && mouseClickY == imgCenterPosY){
			that.angle = 270
		}else if(mouseClickX < imgCenterPosX && mouseClickY < imgCenterPosY){
			that.angle = 360 - that.angle
		}
		console.log(that.angle)
		// var dx = e.clientX - that.img.offsetLeft
		// var dy = e.clientY - that.img.offsetTop
		// var dz = Math.sqrt(dx * dx + dy * dy)
		// if(dx > 0 && dy > 0){
		// 	that.rotation = Math.asin(dy / dz) + 90 * Math.PI / 180
		// }else if(dx > 0){
		// 	that.rotation = Math.asin(dx / dz)
		// }else if(dx < 0 && dy > 0){
		// 	that.rotation = -(Math.asin(dy / dz) + 90 * Math.Pi / 180)
		// }else if(dx < 0){
		// 	that.rotation = Math.asin(dx / dz)
		// }
		that.img.style.transform = `rotate(${that.angle}deg)`
	},
	
}

Shirt.prototype.constructor = Shirt