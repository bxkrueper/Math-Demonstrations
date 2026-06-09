class DraggablePoint{

    constructor(x,y,radiusCanvas,boss,doOnMove,worldOrCanvas,priority=0){
		this._x = x;
		this._y = y;
		this._radiusCanvas = radiusCanvas;
		this._boss = boss;
		this._doOnMove = doOnMove;
		this._worldOrCanvas = worldOrCanvas;
		this._priority = priority;

		this._mouseButton = 'left';
		this.clickLeway = 3;

		this._xOnTarget;
		this._yOnTarget;
		this._dragging = false;
	}

	doOnAdd(){
		this.world.addEventListener(this,'mouseButtonDown',this._mouseButtonDown);
		this.world.addEventListener(this,'acceptMouseTarget',this._acceptMouseTarget,this._priority);
		this.world.addEventListener(this,'mouseMoved',this._mouseMoved);
		this.world.addEventListener(this,'mouseButtonUp',this._mouseButtonUp);

		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this._priority);
	}

	get x(){
		return this._x;
	}
	get y(){
		return this._y;
	}
	get radiusCanvas(){
		return this._radiusCanvas;
	}

	set x(newX){
		this._x = newX;
		this._doOnMove.call(this._boss,this);
	}
	set y(newY){
		this._y = newY;
		this._doOnMove.call(this._boss,this);
	}
	setXY(newX,newY){
		this._x = newX;
		this._y = newY;
		this._doOnMove.call(this._boss,this);
	}
	set radiusCanvas(newRadius){
		this._radiusCanvas = newRadius;
	}
	set doOnMove(newFunc){
		/////////
	}

	get radiusWorld(){
		return this.radiusCanvas*this.world.camera.unitsPerPixelXPos;
	}

	



	_mouseButtonDown(buttonType){
		if(this.world.currentTarget === this && buttonType==this._mouseButton){
			this._xOnTarget = this.x;
			this._yOnTarget = this.y;
			this._dragging = true;
		}
	}
	_acceptMouseTarget(){
		if(this._worldOrCanvas==='world'){
			return this.containsPoint(this.world.worldView.currentXWorld,this.world.worldView.currentYWorld);
		}else{
			return this.containsPoint(this.world.worldView.currentXCanvas,this.world.worldView.currentYCanvas);
		}
	}
	_mouseMoved(){
		if(this._dragging){
			//drag
			if(this._worldOrCanvas==='world'){
				this.setXY(this._xOnTarget+(this.world.worldView.currentXWorld-this.world.worldView.previousXWorld),
						this._yOnTarget+(this.world.worldView.currentYWorld-this.world.worldView.previousYWorld));
			}else{
				this.setXY(this._xOnTarget+(this.world.worldView.currentXCanvas-this.world.worldView.previousXCanvas),
						this._yOnTarget+(this.world.worldView.currentYCanvas-this.world.worldView.previousYCanvas));
			}
			
		}
	}
	_mouseButtonUp(buttonType){
		this._dragging = false;
	}




	drawCanvas(ctx){
		ctx.fillStyle = "grey";
		ctx.beginPath();

		let radius = this.radiusCanvas;
		if(this.world.currentTarget === this || this._dragging){
			radius += 2;
		}
		if(this._worldOrCanvas==='world'){
			ctx.arc(this.world.camera.worldXToCanvasX(this.x),this.world.camera.worldYToCanvasY(this.y), radius, 0, 2 * Math.PI);
		}else{
			ctx.arc(this.x,this.y, radius, 0, 2 * Math.PI);
		}
		
		ctx.fill();
	}

	containsPoint(xMouse,yMouse){
		if(this._worldOrCanvas==='world'){
			return Math.hypot(this.x-xMouse,this.y-yMouse)<this.radiusWorld+this.clickLeway*this.world.camera.unitsPerPixelXPos;//////not tested
		}else{
			return Math.hypot(this.x-xMouse,this.y-yMouse)<this.radiusCanvas+this.clickLeway;
		}
		
	}

}