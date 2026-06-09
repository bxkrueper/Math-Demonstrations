class UnitCircle{

    static significantAngleInfo = [
        {degreeValue:0, radianValue:0, radianNumerator:0, radianDenominator:1,                sin:'0', cos:'1', tan:'0', csc:'undf', sec:'1', cot:'undf',                                textOffsetX:10, textOffsetY:-10},
        {degreeValue:30, radianValue:Math.PI/6, radianNumerator:1, radianDenominator:6,       sin:'1/2', cos:'\u221A3/2', tan:'\u221A3/3', csc:'2', sec:'2\u221A3/3', cot:'\u221A3',     textOffsetX:20, textOffsetY:-10},
        {degreeValue:45, radianValue:Math.PI/4, radianNumerator:1, radianDenominator:4,       sin:'\u221A2/2', cos:'\u221A2/2', tan:'1', csc:'\u221A2', sec:'\u221A2', cot:'1',          textOffsetX:15, textOffsetY:-10},
        {degreeValue:60, radianValue:Math.PI/3, radianNumerator:1, radianDenominator:3,       sin:'\u221A3/2', cos:'1/2', tan:'\u221A3', csc:'2\u221A3/3', sec:'2', cot:'\u221A3/3',     textOffsetX:0, textOffsetY:-20},
        {degreeValue:90, radianValue:Math.PI/2, radianNumerator:1, radianDenominator:2,       sin:'1', cos:'0', tan:'undf', csc:'1', sec:'undf', cot:'0',                                textOffsetX:-20, textOffsetY:-10},
        {degreeValue:120, radianValue:2*Math.PI/3, radianNumerator:2, radianDenominator:3,    sin:'\u221A3/2', cos:'-1/2', tan:'-\u221A3', csc:'2\u221A3/3', sec:'-2', cot:'-\u221A3/3', textOffsetX:-40, textOffsetY:-10},
        {degreeValue:135, radianValue:3*Math.PI/4, radianNumerator:3, radianDenominator:4,    sin:'\u221A2/2', cos:'-\u221A2/2', tan:'-1', csc:'\u221A2', sec:'-\u221A2', cot:'-1',      textOffsetX:-40, textOffsetY:-10},
        {degreeValue:150, radianValue:5*Math.PI/6, radianNumerator:5, radianDenominator:6,    sin:'1/2', cos:'-\u221A3/2', tan:'-\u221A3/3', csc:'2', sec:'-2\u221A3/3', cot:'-\u221A3', textOffsetX:-40, textOffsetY:-10},
        {degreeValue:180, radianValue:Math.PI, radianNumerator:1, radianDenominator:1,        sin:'0', cos:'-1', tan:'0', csc:'undf', sec:'-1', cot:'undf',                              textOffsetX:-50, textOffsetY:-10},
        {degreeValue:210, radianValue:7*Math.PI/6, radianNumerator:7, radianDenominator:6,    sin:'-1/2', cos:'-\u221A3/2', tan:'\u221A3/3', csc:'-2', sec:'-2\u221A3/3', cot:'\u221A3', textOffsetX:-40, textOffsetY:30},
        {degreeValue:225, radianValue:5*Math.PI/4, radianNumerator:5, radianDenominator:4,    sin:'-\u221A2/2', cos:'-\u221A2/2', tan:'1', csc:'-\u221A2', sec:'-\u221A2', cot:'1',      textOffsetX:-40, textOffsetY:30},
        {degreeValue:240, radianValue:4*Math.PI/3, radianNumerator:4, radianDenominator:3,    sin:'-\u221A3/2', cos:'-1/2', tan:'\u221A3', csc:'-2\u221A3/3', sec:'-2', cot:'\u221A3/3', textOffsetX:-40, textOffsetY:30},
        {degreeValue:270, radianValue:3*Math.PI/2, radianNumerator:3, radianDenominator:2,    sin:'-1', cos:'0', tan:'undf', csc:'-1', sec:'undf', cot:'0',                              textOffsetX:-20, textOffsetY:40},
        {degreeValue:300, radianValue:5*Math.PI/3, radianNumerator:5, radianDenominator:3,    sin:'-\u221A3/2', cos:'1/2', tan:'-\u221A3', csc:'-2\u221A3/3', sec:'2', cot:'-\u221A3/3', textOffsetX:10, textOffsetY:40},
        {degreeValue:315, radianValue:7*Math.PI/4, radianNumerator:7, radianDenominator:4,    sin:'-\u221A2/2', cos:'\u221A2/2', tan:'-1', csc:'-\u221A2', sec:'\u221A2', cot:'-1',      textOffsetX:15, textOffsetY:35},
        {degreeValue:330, radianValue:11*Math.PI/6, radianNumerator:11, radianDenominator:6,  sin:'-1/2', cos:'\u221A3/2', tan:'-\u221A3/3', csc:'-2', sec:'2\u221A3/3', cot:'-\u221A3', textOffsetX:20, textOffsetY:30},
        {degreeValue:360, radianValue:2*Math.PI, radianNumerator:2, radianDenominator:1,      sin:'0', cos:'1', tan:'0', csc:'undf', sec:'1', cot:'undf',                                textOffsetX:0, textOffsetY:0},
    ];

    static trigColorMap = {
        sin:'rgb(49, 62, 245)',
        cos:'rgb(248, 54, 54)',
        tan:'rgb(2, 65, 15)',
        csc:'rgb(15, 216, 243)',
        sec:'rgb(243, 171, 15)',
        cot:'rgb(15, 243, 60)'
    }

    constructor(){
		document.getElementById("unit_circle_degree_radio").checked = true;
        document.getElementById("unit_circle_display_select").value = 'coordinates';
        this.measureType = 'degree';
        this.displayChoice = 'coordinates';

        this.mouseXWorld = Math.cos(Math.PI/6);
        this.mouseYWorld = Math.sin(Math.PI/6);
        this.rawDirection = Math.PI/6;
        this.roundedDirection = Math.PI/6;
        this.pointOnCircleX = Math.cos(Math.PI/6);
        this.pointOnCircleY = Math.sin(Math.PI/6);
        this.significantAngleInfo = UnitCircle.significantAngleInfo;

        console.log('unit circle constructed');
	}

	//Override
	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this.world.priorities['DemoObjects']);
        this.world.addEventListener(this,'mouseMoved',this.mouseMoved);
        this.world.addEventListener(this,'resize_canvas',this.resize_canvas);
        this.world.addEventListener(this,'mouseButtonDown',this.mouseButtonDown);

        this.setCamera();
        document.getElementById("Unit_Circle_options").hidden = false;
	}
    doOnDelete(){
        document.getElementById("Unit_Circle_options").hidden = true;
    }

    resize_canvas(){
        this.setCamera();
    }
    setCamera(){
        let camera = this.world.camera;
        camera.xCenter = 0;
        camera.yCenter = 0;
        let canvasRadius = Math.min(camera.canvasWidth,camera.canvasHeight)*0.6/2;
        camera.pixelsPerUnitX = canvasRadius;
        camera.pixelsPerUnitY = -canvasRadius;
        this.recalculate();
    }

    //forwarded from DemoSwitcher
    optionUpdated(htmlElement){
        switch(htmlElement.id){
            case 'unit_circle_radian_radio': case 'unit_circle_degree_radio':
                this.measureType = htmlElement.value;
                return;
            case 'unit_circle_display_select':
                this.displayChoice = htmlElement.value;
                return;
        }
        this.recalculate();
    }

    mouseMoved(){
        if(this.world.worldView.currentButtonDown==='none') return;

        this.updatePosition();
        this.interactedWith = true;
    }
    mouseButtonDown(type){
        this.updatePosition();
        this.interactedWith = true;
    }
    updatePosition(){
        this.mouseXWorld = this.world.worldView.currentXWorld;
        this.mouseYWorld = this.world.worldView.currentYWorld;
        this.recalculate();
    }

    recalculate(){
        this.rawDirection = MyMath.findAngleTo02PI(this.mouseXWorld,this.mouseYWorld);
        this.roundedDirectionIndex = UnitCircle.roundAngleToSignificant(this.rawDirection,this.significantAngleInfo);
        this.roundedDirection = this.significantAngleInfo[this.roundedDirectionIndex].radianValue;
        this.pointOnCircleX = Math.cos(this.roundedDirection);
        this.pointOnCircleY = Math.sin(this.roundedDirection);

        let camera = this.world.camera;
        this.centerCanvasX = camera.worldXToCanvasX(0);
        this.centerCanvasY = camera.worldYToCanvasY(0);
        this.pointOnCircleXCanvas = camera.worldXToCanvasX(this.pointOnCircleX);
        this.pointOnCircleYCanvas = camera.worldYToCanvasY(this.pointOnCircleY);
    }

    static roundAngleToSignificant(angle,significantAngleInfo){
        for(let i=0;i<significantAngleInfo.length-1;i++){
            let significantAngle = significantAngleInfo[i].radianValue;
            let nextSigAngle = significantAngleInfo[i+1].radianValue;
            if(angle<(significantAngle+nextSigAngle)/2) return i;
        }
        return significantAngleInfo.length-1;
    }

	drawCanvas(ctx){
        if(!this.interactedWith){
            ctx.font = "20px arial";
            ctx.fillStyle = 'white';
            ctx.fillText('click or drag to change angle',5,25);
        }

        let camera = this.world.camera;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';

        
        
        CtxAlgs.point(this.centerCanvasX,this.centerCanvasY,5,ctx);//center
        CtxAlgs.circle(this.centerCanvasX,this.centerCanvasY,camera.pixelsPerUnitX,ctx);//main circle
        CtxAlgs.point(this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,5,ctx);//point on circle

        
        this._drawSignificantLines(ctx,camera);

        //draw dotted lines
        CtxAlgs.drawDottedLine(camera.worldXToCanvasX(1),this.centerCanvasY,camera.canvasWidth,this.centerCanvasY,ctx,[13,13]);
        CtxAlgs.drawDottedLine(camera.worldXToCanvasX(-1),this.centerCanvasY,0,this.centerCanvasY,ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.centerCanvasX,camera.worldYToCanvasY(1)-60,this.centerCanvasX,0,ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.centerCanvasX,camera.worldYToCanvasY(-1)+60,this.centerCanvasX,camera.canvasHeight,ctx,[13,13]);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 4;
        CtxAlgs.drawLine(this.centerCanvasX,this.centerCanvasY,this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,ctx);//line to point

        this._drawGeometricTrigLines(ctx,camera);

        this._drawAngleDisplays(ctx,camera);

        this._drawValues(ctx,camera);
	}
    _drawSignificantLines(ctx,camera){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.4)';
        for(let i=0;i<this.significantAngleInfo.length;i++){
            let significantAngle = this.significantAngleInfo[i].radianValue;
            let pointOnCircleXCanvas = camera.worldXToCanvasX(Math.cos(significantAngle)), pointOnCircleYCanvas = camera.worldYToCanvasY(Math.sin(significantAngle));
            let cutOffX = this.centerCanvasX+(pointOnCircleXCanvas-this.centerCanvasX)*0.5, cutOffY = this.centerCanvasY+(pointOnCircleYCanvas-this.centerCanvasY)*0.5;
            let startUpX = this.centerCanvasX+(pointOnCircleXCanvas-this.centerCanvasX)*0.8, startUpY = this.centerCanvasY+(pointOnCircleYCanvas-this.centerCanvasY)*0.8;
            CtxAlgs.drawLine(this.centerCanvasX,this.centerCanvasY,cutOffX,cutOffY,ctx);//center to angle text
            CtxAlgs.drawLine(startUpX,startUpY,pointOnCircleXCanvas,pointOnCircleYCanvas,ctx);//angle text to edge
        }
    }
    _drawAngleDisplays(ctx,camera){
        for(let i=0;i<this.significantAngleInfo.length-1;i++){
            let significantAngle = this.significantAngleInfo[i].radianValue;
            let significantDegree = this.significantAngleInfo[i].degreeValue;
            ctx.fillStyle = this.roundedDirection===significantAngle?'white':'rgba(128, 128, 128, 0.5)';
            let pointOnCircleXCanvas = camera.worldXToCanvasX(Math.cos(significantAngle)), pointOnCircleYCanvas = camera.worldYToCanvasY(Math.sin(significantAngle));
            let RATIO_TO_EDGE = 0.7;//0 is in center of circle, 0 is starting at the point on the circle
            if(significantDegree<=90 || significantDegree>270) RATIO_TO_EDGE = 0.6;
            let angleTextX = this.centerCanvasX + (pointOnCircleXCanvas-this.centerCanvasX)*RATIO_TO_EDGE;
            let angleTextY = this.centerCanvasY + (pointOnCircleYCanvas-this.centerCanvasY)*RATIO_TO_EDGE;
            if((significantDegree>90 && significantDegree<180) || (significantDegree>270 && significantDegree<360)){
                angleTextX-=15;
                angleTextY+=15;
            }else if([0,180].includes(significantDegree)){
                angleTextY-=5;
            }

            ctx.font = "25px computer modern";
            if(this.measureType==='radian'){
                let numerator = this.significantAngleInfo[i].radianNumerator, denominator = this.significantAngleInfo[i].radianDenominator;
                if(numerator===0){
                    ctx.fillText('0',angleTextX,angleTextY);
                }else if(denominator===1){
                    let numText = numerator===1?'':numerator.toString();
                    ctx.fillText(numText + '\u03C0',angleTextX,angleTextY);
                }else{
                    let numText = numerator===1?'':numerator.toString();
                    CtxAlgs.drawFraction(angleTextX,angleTextY,numText + '\u03C0',denominator,ctx);
                }
            }else{//degrees
                ctx.fillText(this.significantAngleInfo[i].degreeValue + '\u00B0',angleTextX,angleTextY);
            }
            // let label1Width = ctx.measureText(this.side1.toString()).width
            // ctx.fillText('a',angleTextX,angleTextY);
        }
    }
    _drawGeometricTrigLines(ctx,camera){
        ctx.lineWidth = 4;
        let sin = Math.sin(this.roundedDirection);
        let cos = Math.cos(this.roundedDirection);
        let tan = Math.tan(this.roundedDirection);
        let csc = 1/sin;
        let sec = 1/cos;
        let cot = 1/tan;
        let mult;
        let degree = this.significantAngleInfo[this.roundedDirectionIndex].degreeValue;
        let rightOrLeft = [0,180,360].includes(degree);
        let topOrBottom = [90,270].includes(degree);

        if(['coordinates','cos','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.cos;
            CtxAlgs.drawLine(this.centerCanvasX,this.pointOnCircleYCanvas,this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,ctx);
        }
        
        if(['coordinates','sin','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.sin;
            CtxAlgs.drawLine(this.pointOnCircleXCanvas,this.centerCanvasY,this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,ctx);
        }
        
        mult = this.mouseXWorld>0?1:-1;
        let tanInt = cos+Math.sqrt(tan*tan-sin*sin)*mult;
        if(['tan','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.tan;
            if(topOrBottom){
                CtxAlgs.drawLine(0,this.pointOnCircleYCanvas,camera.canvasWidth,this.pointOnCircleYCanvas,ctx);
            }else{
                
                CtxAlgs.drawLine(this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,camera.worldXToCanvasX(tanInt),this.centerCanvasY,ctx);
            }
        }
        
        mult = this.mouseYWorld>0?1:-1;
        let cotInt = sin+Math.sqrt(cot*cot-cos*cos)*mult;
        if(['cot','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.cot;
            if(rightOrLeft){
                CtxAlgs.drawLine(this.pointOnCircleXCanvas,0,this.pointOnCircleXCanvas,camera.canvasHeight,ctx);
            }else{
                CtxAlgs.drawLine(this.pointOnCircleXCanvas,this.pointOnCircleYCanvas,this.centerCanvasX,camera.worldYToCanvasY(cotInt),ctx);
            }
        }
        
        if(['sec','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.sec;
            if(topOrBottom){
                CtxAlgs.drawLine(0,this.centerCanvasY,camera.canvasWidth,this.centerCanvasY,ctx);
            }else{
                CtxAlgs.drawLine(this.centerCanvasX,this.centerCanvasY,camera.worldXToCanvasX(tanInt),this.centerCanvasY,ctx);
            }
        }
        
        if(['csc','all_lines'].includes(this.displayChoice)){
            ctx.strokeStyle = UnitCircle.trigColorMap.csc;
            if(rightOrLeft){
                CtxAlgs.drawLine(this.centerCanvasX,0,this.centerCanvasX,camera.canvasHeight,ctx);
            }else{
                CtxAlgs.drawLine(this.centerCanvasX,this.centerCanvasY,this.centerCanvasX,camera.worldYToCanvasY(cotInt),ctx);
            }
        }
        
    }

    _drawValues(ctx,camera){
        ctx.font = "40px computer modern";
        ctx.textBaseline = 'alphabetic';

        for(let i=0;i<this.significantAngleInfo.length-1;i++){
            let significantAngle = this.significantAngleInfo[i].radianValue;
            let pointOnCircleXCanvas = camera.worldXToCanvasX(Math.cos(significantAngle)), pointOnCircleYCanvas = camera.worldYToCanvasY(Math.sin(significantAngle));
            let degree = this.significantAngleInfo[i].degreeValue;
            let normalColor = this.roundedDirectionIndex===i?'white':'rgba(128, 128, 128, 0.5)';
            ctx.fillStyle = normalColor;

            let xOffset = this.significantAngleInfo[i].textOffsetX, yOffset = this.significantAngleInfo[i].textOffsetY;
            
            // yOffset = [210,225,240,270,300,315,330].includes(degree)?40:-10;

            if(this.displayChoice==='coordinates'){
                if(degree>90 && degree<270){
                    xOffset -= 80;
                    if(this.displayChoice==='coordinates') xOffset=-130;
                }else if(degree===90 || degree===270){
                    xOffset -= 50;
                }else{
                    
                }
                ctx.fillText('(',pointOnCircleXCanvas+xOffset,pointOnCircleYCanvas+yOffset);
                if(this.roundedDirectionIndex===i) ctx.fillStyle = UnitCircle.trigColorMap.cos;
                this._displayTrigValue(this.significantAngleInfo[i].cos,pointOnCircleXCanvas+xOffset+23,pointOnCircleYCanvas+yOffset,ctx);
                ctx.fillStyle = normalColor;
                ctx.fillText(',',pointOnCircleXCanvas+xOffset+55,pointOnCircleYCanvas+yOffset);
                if(this.roundedDirectionIndex===i) ctx.fillStyle = UnitCircle.trigColorMap.sin;
                this._displayTrigValue(this.significantAngleInfo[i].sin,pointOnCircleXCanvas+xOffset+80,pointOnCircleYCanvas+yOffset,ctx);
                ctx.fillStyle = normalColor;
                ctx.fillText(')',pointOnCircleXCanvas+xOffset+110,pointOnCircleYCanvas+yOffset);
            }else if(this.displayChoice!=='all_lines'){
                let trigValueText = this.significantAngleInfo[i][this.displayChoice];
                if(trigValueText==='undf' && degree===180) xOffset-=40;
                if(this.displayChoice==='csc' && degree===225) xOffset-=20;
                if(this.displayChoice==='sec' && (degree===135 || degree===225)) xOffset-=20;
                if(this.displayChoice==='cot' && degree===150) xOffset-=20;
                this._displayTrigValue(trigValueText,pointOnCircleXCanvas+xOffset,pointOnCircleYCanvas+yOffset,ctx);
            }
            
        }
    }
    _displayTrigValue(displayText,canvasX,canvasY,ctx){
        if(displayText.includes('/')){
            ctx.font = "20px computer modern";
            let array = displayText.split('/');
            CtxAlgs.drawFraction(canvasX,canvasY+10,array[0],array[1],ctx);
        }else{
            ctx.fillText(displayText,canvasX,canvasY);
        }
        ctx.font = "40px computer modern";
    }


}