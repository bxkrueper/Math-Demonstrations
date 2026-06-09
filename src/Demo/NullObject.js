class NullObject{

	constructor(){
		console.log('null constructed');
		this.isNullObject = true;
	}

	//Override
	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas);
	}

	drawCanvas(ctx){
		ctx.fillStyle = 'black';   ctx.beginPath();   ctx.fillRect(0, 0, 100, 100);   ctx.fill();

		let centerText = 'Select an object from the top-left menu';
		ctx.font = "40px Arial";
		ctx.fillStyle = 'white';
		let camera = this.world.camera;
		let textWidth = ctx.measureText(centerText).width;
		ctx.fillText(centerText,camera.canvasWidth*0.5-textWidth/2,camera.canvasHeight*0.55);
	}

}