class MoveZoomCamera{
	constructor(xCenter = 0,yCenter = 0,pixelsPerUnitX = 1,pixelsPerUnitY = 1){
		//world coordinates of center
		this._xCenter = xCenter;
        this._yCenter = yCenter;

        //can be negative to invert axis
        this._pixelsPerUnitX = pixelsPerUnitX;
        this._pixelsPerUnitY = pixelsPerUnitY;

        //how many pixles the canvas is. This is set by the WorldView
        this._canvasWidth = 0;
        this._canvasHeight = 0;
	}

	//getters and setters
	get xCenter(){
		return this._xCenter;
	}
	get yCenter(){
		return this._yCenter;
	}
	get pixelsPerUnitX(){
		return this._pixelsPerUnitX;
	}
	get pixelsPerUnitY(){
		return this._pixelsPerUnitY;
	}
	get canvasWidth(){
		return this._canvasWidth;
	}
	get canvasHeight(){
		return this._canvasHeight;
	}
	set xCenter(xCenter){
		this._xCenter = xCenter;
	}
	set yCenter(yCenter){
		this._yCenter = yCenter;
	}
	set pixelsPerUnitX(pixelsPerUnitX){
		this._pixelsPerUnitX = pixelsPerUnitX;
	}
	set pixelsPerUnitY(pixelsPerUnitY){
		this._pixelsPerUnitY = pixelsPerUnitY;
	}
	set canvasWidth(canvasWidth){
		this._canvasWidth = canvasWidth;
	}
	set canvasHeight(canvasHeight){
		this._canvasHeight = canvasHeight;
	}

	//non-direct getters
	get pixelsPerUnitXPos(){
		return Math.abs(this._pixelsPerUnitX);
	}
	get pixelsPerUnitYPos(){
		return Math.abs(this._pixelsPerUnitY);
	}
	get unitsPerPixelX(){
		return 1/this._pixelsPerUnitX;
	}
	get unitsPerPixelY(){
		return 1/this._pixelsPerUnitY;
	}
	get unitsPerPixelXPos(){
		return 1/Math.abs(this._pixelsPerUnitX);
	}
	get unitsPerPixelYPos(){
		return 1/Math.abs(this._pixelsPerUnitY);
	}

	//world coordinates. Always positive
	get width(){
		return this.canvasWidth/this.pixelsPerUnitXPos;
	}
	get height(){
		return this.canvasHeight/this.pixelsPerUnitYPos;
	}
	//maintains the sign of the old zoom value, no matter what the input is
	set width(newWidth){
		let sign = this._pixelsPerUnitX>0?1:-1;
		this._pixelsPerUnitX = this.canvasWidth/Math.abs(newWidth)*sign;
	}
	set height(newHeight){
		let sign = this._pixelsPerUnitY>0?1:-1;
		this._pixelsPerUnitY = this.canvasHeight/Math.abs(newHeight)*sign;
	}

	//world coordinates
    //the most extreme values for the sides of the camera. may be different than getRight, getTop... if a scale is negative
    get highestX(){
    	return this.xCenter+this.width/2;
    }
    get lowestX(){
    	return this.xCenter-this.width/2;
    }
    get highestY(){
    	return this.yCenter+this.height/2;
    }
    get lowestY(){
    	return this.yCenter-this.height/2;
    }

    //world coordinate of indicated side of the canvas
    get right(){
    	return this.xCenter+this.canvasWidth/this.pixelsPerUnitX/2;
    }
    get left(){
    	return this.xCenter-this.canvasWidth/this.pixelsPerUnitX/2;
    }
    get top(){
    	return this.yCenter-this.canvasHeight/this.pixelsPerUnitY/2;//sign different than for x because pos y is normally down  using formula for width, but not abs of width
    }
    get bottom(){
    	return this.yCenter+this.canvasHeight/this.pixelsPerUnitY/2;//sign different than for x because pos y is normally down
    }

    set highestX(newX){
    	this.xCenter = newX-this.width/2;
    }
    set lowestX(newX){
    	this.xCenter = newX+this.width/2;
    }
    set highestY(newY){
    	this.yCenter = newY-this.height/2;
    }
    set lowestY(newY){
    	this.yCenter = newY+this.height/2;
    }
	
	set right(newX){
    	this._xCenter = newX-(this.canvasWidth/this.pixelsPerUnitX)/2;
    }
    set left(newX){
    	this._xCenter = newX+(this.canvasWidth/this.pixelsPerUnitX)/2;
    }
    set top(newY){
    	this._yCenter = newY+(this.canvasHeight/this.pixelsPerUnitY)/2;//sign different than for x because pos y is normally down
    }
    set bottom(newY){
    	this._yCenter = newY-(this.canvasHeight/this.pixelsPerUnitY)/2;//sign different than for x because pos y is normally down
    }


    //convert between world coordinates and canvas pixel coordinates. Canvas pixel coordinates are measured from the top left
    worldXToCanvasX(worldX){
    	return (worldX-this.xCenter)*this.pixelsPerUnitX + (this.canvasWidth/2);
    }
    worldYToCanvasY(worldY){
    	return ((worldY-this.yCenter)*this.pixelsPerUnitY + (this.canvasHeight/2));
    }
    canvasXToWorldX(canvasX){
    	return (canvasX - (this.canvasWidth/2))/this.pixelsPerUnitX+this.xCenter;
    }
    canvasYToWorldY(canvasY){
    	return (canvasY - (this.canvasHeight/2))/this.pixelsPerUnitY+this.yCenter;
    }

    setTransformContext(ctx){
    	ctx.setTransform(this.pixelsPerUnitX, 0, 0, this.pixelsPerUnitY, this.canvasWidth/2-this.xCenter*this.pixelsPerUnitX, this.canvasHeight/2-this.yCenter*this.pixelsPerUnitY);
    	// ctx.translate(this.canvasWidth/2,this.canvasHeight/2);
        // ctx.scale(this.pixelsPerUnitX,this.pixelsPerUnitY);
        // ctx.translate(-this.xCenter,-this.yCenter);
    }

}