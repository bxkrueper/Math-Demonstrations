class ASS_Triangle{

    static defaultAngle = 50;
    static defaultSide1 = 200;
    static defaultSide2 = 170;
    static showLables = true;

	constructor(){
		document.getElementById("ASS_angle").value = ASS_Triangle.defaultAngle;
        document.getElementById("ASS_side1").value = ASS_Triangle.defaultSide1;
        document.getElementById("ASS_side2").value = ASS_Triangle.defaultSide2;
        document.getElementById("ASS_showLablesCheckbox").checked = ASS_Triangle.showLables;
        this.angle = ASS_Triangle.defaultAngle;
        this.side1 = ASS_Triangle.defaultSide1;
        this.side2 = ASS_Triangle.defaultSide2;
        this.showLables = ASS_Triangle.showLables;

        console.log('ass constructed');
	}

	//Override
	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this.world.priorities['DemoObjects']);
        this.world.addEventListener(this,'doOnWorldViewSet',this.recalculate);
        this.world.addEventListener(this,'mouseButtonDown',this.mouseButtonDown);
        this.world.addEventListener(this,'mouseMoved',this.mouseMoved);
        this.world.addEventListener(this,'resize_canvas',this.resize_canvas);

        this.recalcStart();
        document.getElementById("ASS_Triangle_options").hidden = false;
	}
    doOnDelete(){
        document.getElementById("ASS_Triangle_options").hidden = true;
    }

    resize_canvas(){
        this.recalcStart();
    }
    recalcStart(){
        let camera = this.world.camera;
        this.startX = camera.canvasWidth*0.2;
        this.startY = camera.canvasHeight*0.7;
        this.mouseX = camera.canvasWidth*0.4;
        this.mouseY = camera.canvasHeight*0.7;
        this.recalculate();
    }

    mouseButtonDown(type){
        this.updatePosition();
    }
    mouseMoved(){
        if(this.world.worldView.currentButtonDown==='none') return;

        this.updatePosition();
    }
    updatePosition(){
        this.mouseX = this.world.worldView.currentXCanvas;
        this.mouseY = this.world.worldView.currentYCanvas;
        this.recalculate();
    }

    //forwarded from DemoSwitcher
    optionUpdated(htmlElement){
        this.angle = Number(document.getElementById("ASS_angle").value);
        this.side1 = Number(document.getElementById("ASS_side1").value);
        this.side2 = Number(document.getElementById("ASS_side2").value);
        this.showLables = document.getElementById("ASS_showLablesCheckbox").checked;
        this.recalculate();
    }

    recalculate(){
        this.topX = this.startX+this.side1*Math.cos(this.angle*Math.PI/180);
        this.topY = this.startY-this.side1*Math.sin(this.angle*Math.PI/180);

        let direction = MyMath.findAngleFromTo(this.topX,this.topY,this.mouseX,this.mouseY);

        this.endX = this.topX + this.side2*Math.cos(direction);
        this.endY = this.topY + this.side2*Math.sin(direction);

        this.connected = Math.abs(this.endY-this.startY)<1 && this.mouseX>this.startX;
        if(this.connected){
            this.rightEndConnection = Math.abs(this.side1-Math.hypot(this.startX-this.topX,this.startY-this.topY))<0.25 && Math.abs(this.mouseX-this.topX)<1;
            // this.rightEndConnection = false;
            if(this.rightEndConnection){
                this.endX = this.topX;
                this.endY = this.startY;
                return;
            }

            let csquaredMinusASquared = Math.abs(Math.pow(this.side2,2)-Math.pow(this.startY-this.topY,2));
            let b = Math.sqrt(csquaredMinusASquared);
            if(this.mouseX>this.topX){
                this.endX = this.topX + b;
            }else{
                this.endX = this.topX - b;
            }
            this.endY = this.startY;
        }
    }

	drawCanvas(ctx){
        let camera = this.world.camera;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';

        //draw point at start
        CtxAlgs.point(this.startX,this.startY,5,ctx);

        //draw point at top
		CtxAlgs.point(this.topX,this.topY,5,ctx);

        //draw line from start to top
        CtxAlgs.drawLine(this.startX,this.startY,this.topX,this.topY,ctx);

        //draw angleArc
        if(this.angle === 90){
            CtxAlgs.drawLine(this.startX+15,this.startY,this.startX+15,this.startY-15,ctx);
            CtxAlgs.drawLine(this.startX+15,this.startY-15,this.startX,this.startY-15,ctx);
        }else{
            CtxAlgs.sectorArc(this.startX,this.startY,15,-this.angle*Math.PI/180,0,ctx);
        }

        //draw moving line
        CtxAlgs.drawLine(this.topX,this.topY,this.endX,this.endY,ctx);

        if(this.showLables) this.drawLabels(ctx);

        ctx.strokeStyle = 'grey';
        //draw dotted line
        CtxAlgs.drawDottedLine(this.startX,this.startY,camera.canvasWidth,this.startY,ctx,[13,15]);

        if(this.connected){
            //draw third point
            CtxAlgs.point(this.endX,this.endY,5,ctx);

            //draw third line
            CtxAlgs.drawLine(this.startX,this.startY,this.endX,this.startY,ctx);

            if(this.rightEndConnection){
                CtxAlgs.drawLine(this.endX-15,this.endY,this.endX-15,this.startY-15,ctx);
                CtxAlgs.drawLine(this.endX-15,this.startY-15,this.endX,this.startY-15,ctx);
            }
        }
	}
    drawLabels(ctx){
        let midPoint1X = (this.startX+this.topX)/2;
        let midPoint1Y = (this.startY+this.topY)/2;
        let midPoint2X = (this.endX+this.topX)/2;
        let midPoint2Y = (this.endY+this.topY)/2;

        let midPoint1YOffset = this.angle>110?30:0;

        ctx.font = "15px Arial";
        let angleX = this.startX+18;
        let angleY = this.startY-10;
        if(this.angle<46){
            angleX+=3;
            angleY+=5;
        }
        if(this.angle<35) angleX+=5;
        if(this.angle<30) angleX+=10;
        if(this.angle<25) angleY+=10;
        if(this.angle<10) angleY+=10;
        ctx.fillText(this.angle.toString()+'\u00B0',angleX,angleY);

        ctx.font = "30px Arial";
        let label1Width = ctx.measureText(this.side1.toString()).width
        ctx.fillText(this.side1,midPoint1X-label1Width-3,midPoint1Y+midPoint1YOffset);
        ctx.fillText(this.side2,midPoint2X,midPoint2Y);
    }

}