class DisplayUpdaterObject{

	constructor(){
		this.x=5;
		this.y=55;
		this.fontSize=20;
	}

	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this.world.priorities['DisplayUpdaterObject']);
	}

	drawCanvas(ctx){
		if(!this.world.debugMode) return;

		ctx.font = this.fontSize + 'px Arial';
		ctx.fillStyle = 'white'; //Options.textColor;//for testing demo
		this._yOffset=0;

		this.writeLine("debug display",ctx);
		this.writeLine("Button Down: " + this.world.worldView.currentButtonDown,ctx);
		this.writeLine("Keys pressed: " + Array.from(this.world.worldView.currentKeys).join(','),ctx);
		this.writeLine("previous canvas coords: (" + this.world.worldView.previousXCanvas + ',' + this.world.worldView.previousYCanvas + ')',ctx);
		this.writeLine("last canvas coords: (" + this.world.worldView.lastXCanvas + ',' + this.world.worldView.lastYCanvas + ')',ctx);
		this.writeLine("current canvas coords: (" + this.world.worldView.currentXCanvas + ',' + this.world.worldView.currentYCanvas + ')',ctx);
		// this.writeLine("previous X click World: " + this.world.worldView.previousXWorld,ctx);
		// this.writeLine("previous Y click World: " + this.world.worldView.previousYWorld,ctx);
		// this.writeLine("current X World: " + this.world.worldView.currentXWorld,ctx);
		// this.writeLine("current Y World: " + this.world.worldView.currentYWorld,ctx);
		this.writeLine("previous World coords: (" + this.world.worldView.previousXCanvas + ',' + this.world.worldView.previousYCanvas + ')',ctx);
		this.writeLine("last world coords: (" + this.world.worldView.lastXWorld + ',' + this.world.worldView.lastYWorld + ')',ctx);
		this.writeLine("current World coords: (" + this.world.worldView.currentXWorld + ',' + this.world.worldView.currentYWorld + ')',ctx);
		this.writeLine("currentTarget: " + this.world.currentTarget,ctx);
		this.writeLine("selected objects: " + this.world.selector.selectedObjects.toString(),ctx);
		this.writeLine("currentFocus: " + ObjectManipulator.focusedObject,ctx);
		this.writeLine("pixelsPerUnitX: " + this.world.camera.pixelsPerUnitX,ctx);
		this.writeLine("pixelsPerUnitY: " + this.world.camera.pixelsPerUnitY,ctx);
		// this.writeLine("hasBeenDrawnOn: " + DrawLayer.hasBeenDrawnOn,ctx);
		this.writeLine("page world left: " + this.world.pageScroller.worldLeft,ctx);
		this.writeLine("page world top: " + this.world.pageScroller.worldTop,ctx);
		this.writeLine("page world right: " + this.world.pageScroller.worldRight,ctx);
		this.writeLine("page world bottom: " + this.world.pageScroller.worldBottom,ctx);
		this.writeLine("expression nulls: " + _Expression.nulls,ctx);
		// this.writeLine("page down x: " + this.world.pageScroller._canvasContainerMouseDownX,ctx);
		// this.writeLine("page down y: " + this.world.pageScroller._canvasContainerMouseDownY,ctx);
		// this.writeLine("page x: " + this.world.pageScroller.canvasXToCanvasContainerX(this.world.worldView.currentXCanvas),ctx);
		// this.writeLine("page y: " + this.world.pageScroller.canvasYToCanvasContainerY(this.world.worldView.currentYCanvas),ctx);
		if(this.world.currentTarget?.isMathTextObject){
			let mathObject = this.world.currentTarget;
			let xRel = this.world.worldView.currentXCanvas-mathObject.xCanvas;
			let yRel = this.world.worldView.currentYCanvas-mathObject.yCanvas;
			this.writeLine("xRel:" + xRel,ctx);
			this.writeLine("yRel:" + yRel,ctx);
		}
		

	}

	writeLine(string,ctx){
		ctx.fillText(string,this.x,this.y+this._yOffset);
		this._yOffset+=this.fontSize;
	}

	toString(){
		return "DisplayUpdaterObject";
	}

}