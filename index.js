function Shirt(config){
	var that = this
	that.bShirtImg = config.bShirtImg
	that.shirtDom = {
		p: document.getElementById('positive'),
		r: document.getElementById('resverse')
	}
	that.logo = {
		p: [],
		r: []
	}

	that.size = config.size
	that.limitSquare = config.limitSquare
	that.initLogoSize = config.initLogoSize

	that.isMove = {
		p: [],
		r: []
	}

	that.status = {
		p:{
			x: 0,
			y: 0,
			x1: 0,
			y1: 0,
			sx: 0,
			sy: 0
		},
		r:{
			x: 0,
			y: 0,
			x1: 0,
			y1: 0,
			sx: 0,
			sy: 0
		}
	}

	that.limit = {
		p: {
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0
		},
		r:{
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0
		}
	}
	that.limitSquareRatio = config.limitSquareRatio

}

Shirt.prototype = {
	init(){
		var that = this
		that.shirtDom.p.style.background = `url(${that.bShirtImg.p}) no-repeat`
		that.shirtDom.r.style.background = `url(${that.bShirtImg.r}) no-repeat`
		that.shirtDom.p.style.position = 'relative'
		that.shirtDom.r.style.position = 'relative'
		that.loadingLogo()
	},

	// logo初始化加载
	loadingLogo(){
		var that = this
		//正面
		that.logo.p[0] = document.createElement('img')
		that.logo.p[0].src = './logo.png'
		that.logo.p[0].style.position = 'absolute'
		
		that.logo.p[0].style.left = (that.size.width - that.initLogoSize.w) / 2 + 'px'
		
		that.logo.p[0].style.top = (that.size.width - that.initLogoSize.w) / 2 + 'px'
		that.shirtDom.p.append(that.logo.p[0])

		that.status.p.sx = that.toPix(that.logo.p[0].style.left)
		that.status.p.sy = that.toPix(that.logo.p[0].style.top)

		that.limitSquarePoint(that.limit.p)
		//反面
		that.logo.r[0] = document.createElement('img')
		that.logo.r[0].src = './logo.png'
		that.logo.r[0].style.position = 'absolute'
		
		that.logo.r[0].style.left = (that.size.width - that.initLogoSize.w) / 2  + 'px'
		
		that.logo.r[0].style.top = (that.size.height - that.initLogoSize.h) / 2	 + 'px'
		that.shirtDom.r.append(that.logo.r[0])

		that.status.r.sx = that.toPix(that.logo.r[0].style.left)
		that.status.r.sy = that.toPix(that.logo.r[0].style.top)

		that.limitSquarePoint(that.limit.r)

		that.bindEventP()
	},

	initLogoLocation(){
		var that = this
		return {
			x: that.size.width / 2,
			y: that.size.height / 2
		}
	},

	bindEventP(){
		var that = this
		that.logo.p[0].onmousedown = function(e){
			that.mousedown(e)
		}
		that.logo.p[0].onmouseup = function(e){
			that.mouseup(e)
		}
		that.logo.p[0].onmousemove = function(e){
			that.mousemove(e)
			that.stopDefaultEvent(e)
		}
	},

	mousedown(e){
		var that = this
		that.isMove.p[0] = true
		that.status.p.x = e.clientX || e.touched[0].pageX
		that.status.p.y = e.clientY || e.touched[0].pageY
	},

	mouseup(e){
		var that = this
		that.isMove.p[0] = false
	},

	mousemove(e){
		var that = this, x, y, moveS
		if(that.isMove.p[0]){
			that.status.p.x1 = e.clientX || e.touched[0].pageX
			that.status.p.y1 = e.clientY || e.touched[0].pageY
			x = that.status.p.x1 - that.status.p.x
			y = that.status.p.y1 - that.status.p.y
			that.status.p.x = that.status.p.x1
			that.status.p.y = that.status.p.y1

			that.status.p.sx += x
			that.status.p.sy += y

			moveS = that.limitMoveP(that.status.p)
			that.status.p.sx = moveS.sx
			that.status.p.sy = moveS.sy

			that.logo.p[0].style.left = that.status.p.sx + 'px'
			that.logo.p[0].style.top = that.status.p.sy + 'px'
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

	toPix(value){
		return parseFloat(value.replace(/px/ig, ''))
	},

	limitSquarePoint(point){
		var that = this
		var width = that.size.width * that.limitSquareRatio.w
		var height = that.size.height * that.limitSquareRatio.h
		point.x1 = (that.size.width - width) / 2
		point.x2 = point.x1 + width - that.initLogoSize.w
		point.y1 = (that.size.height - height) / 2
		point.y2 = point.y1 + height - that.initLogoSize.h
	},

	limitMoveP(point){
		var that = this
		if(point.sx < that.limit.p.x1){
			point.sx = that.limit.p.x1
		}else if(point.sx > that.limit.p.x2){
			point.sx =  that.limit.p.x2
		}

		if(point.sy < that.limit.p.y1){
			point.sy = that.limit.p.y1
		}else if(point.sy > that.limit.p.y2){
			point.sy = that.limit.p.y2
		}

		return {
			sx: point.sx,
			sy: point.sy
		}
	}
}

Shirt.prototype.constructor = Shirt
