class DemoBack{

	constructor(){
		
	}

	//Override
	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this.world.priorities['DemoBack']);
	}

	drawCanvas(ctx){
        ctx.fillStyle = 'black';
        let camera = this.world.camera;
        ctx.fillRect(0,0,camera.canvasWidth,camera.canvasHeight);
	}

}