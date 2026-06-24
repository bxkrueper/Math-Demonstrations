class TriangleCenters{

    static showLabels = true;

    static incenterColor = 'rgb(90, 21, 201)';
    static circumcenterColor = 'yellow';
    static centroidColor = 'green';
    static orthocenterColor = 'orange';
    
//ideas: show distances, coordinates
	constructor(){
        document.getElementById("Triangle_Centers_showLablesCheckbox").checked = TriangleCenters.showLabels;
        this.showLabels = TriangleCenters.showLabels;

        document.getElementById("triangle_centers_type_select").value = 'incenter';
        this.displayChoice = 'incenter';

        this.madeAlready = false;
        console.log('triangle centers constructed');

        this.isT = true;
	}

	//Override
	doOnAdd(){
		this.world.addEventListener(this,'drawCanvas',this.drawCanvas,this.world.priorities['DemoObjects']);
        this.world.addEventListener(this,'doOnWorldViewSet',this.doOnWorldViewSet);

        document.getElementById("Triangle_Centers_options").hidden = false;

        this.constructPoints();
        if(this.madeAlready){
            this.world.add(this.pointA);this.world.add(this.pointB);this.world.add(this.pointC);
        }
	}
    doOnWorldViewSet(){
        if(!this.madeAlready){
            this.constructPoints();
            this.world.add(this.pointA);this.world.add(this.pointB);this.world.add(this.pointC);
        }
    }
    doOnDelete(){
        document.getElementById("Triangle_Centers_options").hidden = true;
         this.world.delete(this.pointA);this.world.delete(this.pointB);this.world.delete(this.pointC);
    }

    constructPoints(){
        if(this.madeAlready) return;

        let camera = this.world.camera;
        if(camera.canvasHeight===0) return;

        this.pointA = new DraggablePoint(camera.canvasWidth*0.35,camera.canvasHeight*0.2,7,this,this.pointMoved,'screen');
        this.pointB = new DraggablePoint(camera.canvasWidth*0.20,camera.canvasHeight*0.5,7,this,this.pointMoved,'screen');
        this.pointC = new DraggablePoint(camera.canvasWidth*0.6,camera.canvasHeight*0.5,7,this,this.pointMoved,'screen');
        
        this.recalculate();
        this.madeAlready = true;
    }

    pointMoved(point){
        this.recalculate();
        this.interactedWith = true;
    }

    //forwarded from DemoSwitcher
    optionUpdated(htmlElement){
        switch(htmlElement.id){
            case 'triangle_centers_type_select':
                this.displayChoice = htmlElement.value;
                break;
            case 'Triangle_Centers_showLablesCheckbox':
                this.showLabels = htmlElement.checked;
                break;
        }
        this.recalculate();
    }

    _getLableLocation(vertex,vectorNorm1,vectorNorm2){
        let angleBisect = LA.addVectors(vectorNorm1,vectorNorm2);
        LA.setMagnitude(angleBisect,-50);
        return LA.addVectors(vertex,angleBisect);
    }
    recalculate(){
        this.A = [this.pointA.x,this.pointA.y];this.B = [this.pointB.x,this.pointB.y];this.C = [this.pointC.x,this.pointC.y];
        let x1=this.pointA.x, x2=this.pointB.x, x3=this.pointC.x,  y1=this.pointA.y, y2=this.pointB.y, y3=this.pointC.y;

        this.AB = [this.pointB.x-this.pointA.x,this.pointB.y-this.pointA.y];this.BA = LA.scaleVector(-1,this.AB);
        this.BC = [this.pointC.x-this.pointB.x,this.pointC.y-this.pointB.y];this.CB = LA.scaleVector(-1,this.BC);
        this.CA = [this.pointA.x-this.pointC.x,this.pointA.y-this.pointC.y];this.AC = LA.scaleVector(-1,this.CA);

        this.ABnorm = LA.getNormalized(this.AB);this.BAnorm = LA.scaleVector(-1,this.ABnorm);
        this.BCnorm = LA.getNormalized(this.BC);this.CBnorm = LA.scaleVector(-1,this.BCnorm);
        this.CAnorm = LA.getNormalized(this.CA);this.ACnorm = LA.scaleVector(-1,this.CAnorm);

        if(this.showLabels){
            this.angleA = Math.acos(LA.dotProduct(this.ABnorm,this.ACnorm))*180/Math.PI;
            this.angleB = Math.acos(LA.dotProduct(this.BAnorm,this.BCnorm))*180/Math.PI;
            this.angleC = Math.acos(LA.dotProduct(this.CAnorm,this.CBnorm))*180/Math.PI;

            this.labelALocation = this._getLableLocation(this.A,this.ABnorm,this.ACnorm);
            this.labelBLocation = this._getLableLocation(this.B,this.BAnorm,this.BCnorm);
            this.labelCLocation = this._getLableLocation(this.C,this.CAnorm,this.CBnorm);
        }
        
        
        if(this.displayChoice==='incenter'){
            this.incenter = TriangleCenters.incenter(x1,y1,x2,y2,x3,y3);
            this.vectAbisect = LA.subtractVectors(this.incenter,this.A);
            this.vectBbisect = LA.subtractVectors(this.incenter,this.B);
            this.vectCbisect = LA.subtractVectors(this.incenter,this.C);
            this.incenterRadiusEndOnBC = LA.findClosestPointOnLineToPoint(this.incenter,this.B,this.BCnorm);
            this.incenterRadiusEndOnAC = LA.findClosestPointOnLineToPoint(this.incenter,this.A,this.ACnorm);
            this.incenterRadiusEndOnAB = LA.findClosestPointOnLineToPoint(this.incenter,this.A,this.ABnorm);
            this.incenterRadius = Math.hypot(this.incenter[0]-this.incenterRadiusEndOnBC[0],this.incenter[1]-this.incenterRadiusEndOnBC[1]);
        }

        if(['circumcenter','centroid'].includes(this.displayChoice)){
            this.midAB = LA.midpoint(this.B,this.A);
            this.midBC = LA.midpoint(this.C,this.B);
            this.midCA = LA.midpoint(this.A,this.C);
            //where to place congruent tick marks
            this.midAB1 = LA.midpoint(this.midAB,this.A);
            this.midAB2 = LA.midpoint(this.midAB,this.B);
            this.midBC1 = LA.midpoint(this.midBC,this.B);
            this.midBC2 = LA.midpoint(this.midBC,this.C);
            this.midCA1 = LA.midpoint(this.midCA,this.A);
            this.midCA2 = LA.midpoint(this.midCA,this.C);
        }

        if(this.displayChoice==='circumcenter'){
            this.circumcenter = TriangleCenters.circumcenter(x1,y1,x2,y2,x3,y3);
            this.circumcenterRadius = Math.hypot(this.circumcenter[0]-this.A[0],this.circumcenter[1]-this.A[1]);
        }

        if(this.displayChoice==='centroid'){
            this.centroid = TriangleCenters.centroid(x1,y1,x2,y2,x3,y3);
        }

        if(this.displayChoice==='orthocenter'){
            this.orthocenterEndOnBC = LA.findClosestPointOnLineToPoint(this.A,this.B,this.BCnorm);
            this.orthocenterEndOnAC = LA.findClosestPointOnLineToPoint(this.B,this.A,this.ACnorm);
            this.orthocenterEndOnAB = LA.findClosestPointOnLineToPoint(this.C,this.A,this.ABnorm);

            this.orthocenter = TriangleCenters.orthocenter(x1,y1,x2,y2,x3,y3);
        }
        
        if(this.displayChoice==='all_centers'){
            this.incenter = TriangleCenters.incenter(x1,y1,x2,y2,x3,y3);
            this.circumcenter = TriangleCenters.circumcenter(x1,y1,x2,y2,x3,y3);
            this.centroid = TriangleCenters.centroid(x1,y1,x2,y2,x3,y3);
            this.orthocenter = TriangleCenters.orthocenter(x1,y1,x2,y2,x3,y3);
        }
    }

    static incenter(x1,y1,x2,y2,x3,y3){
        let a = Math.hypot(x2-x3,y2-y3);
        let b = Math.hypot(x1-x3,y1-y3);
        let c = Math.hypot(x1-x2,y1-y2);
        let peremeter = a+b+c;
        return [(a*x1+b*x2+c*x3)/peremeter,(a*y1+b*y2+c*y3)/peremeter];//formula from https://www.mathopenref.com/coordincenter.html
    }
    static circumcenter(x1,y1,x2,y2,x3,y3){
        //https://www.quora.com/If-you-know-the-coordinates-of-the-3-vertices-of-a-triangle-can-you-use-a-general-formula-to-find-the-circumcenter-immediately
        let D = 2*((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2)));
        let S1 = x1*x1 + y1*y1;
        let S2 = x2*x2 + y2*y2;
        let S3 = x3*x3 + y3*y3;
        return [((S1*(y2 - y3) + S2*(y3 - y1) + S3*(y1 - y2))) / D   ,   ((S1*(x3 - x2) + S2*(x1 - x3) + S3*(x2 - x1))) / D];
    }
    static centroid(x1,y1,x2,y2,x3,y3){
        return [(x1+x2+x3)/3,(y1+y2+y3)/3];
    }
    static orthocenter(x1,y1,x2,y2,x3,y3){
        //  https://math.stackexchange.com/questions/4943834/is-there-is-a-formula-to-calculate-the-coordinates-of-the-orthocenter-of-a-trian
        return [
            -(x1*x2*y1 - x1*x3*y1 - x1*x2*y2 + x2*x3*y2 + y1*y1*y2 - y1*y2*y2 + x1*x3*y3 - x2*x3*y3 - y1*y1*y3 + y2*y2*y3 + y1*y3*y3 - y2*y3*y3)/(-x2*y1 + x3*y1 + x1*y2 - x3*y2 - x1*y3 + x2*y3)
            ,
            (x1*x1*x2 - x1*x2*x2 - x1*x1*x3 + x2*x2*x3 + x1*x3*x3 - x2*x3*x3 + x1*y1*y2 - x2*y1*y2 - x1*y1*y3 + x3*y1*y3 + x2*y2*y3 - x3*y2*y3)/(-x2*y1 + x3*y1 + x1*y2 - x3*y2 - x1*y3 + x2*y3)
        ];
    }

	drawCanvas(ctx){
        if(!this.interactedWith){
            ctx.font = "20px arial";
            ctx.fillStyle = 'white';
            ctx.fillText('drag points to change the triangle',5,25);
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        CtxAlgs.drawLine(this.pointA.x,this.pointA.y,this.pointB.x,this.pointB.y,ctx);
        CtxAlgs.drawLine(this.pointB.x,this.pointB.y,this.pointC.x,this.pointC.y,ctx);
        CtxAlgs.drawLine(this.pointC.x,this.pointC.y,this.pointA.x,this.pointA.y,ctx);

         if(this.showLabels){
            ctx.font = "20px arial";
            ctx.fillStyle = 'white';
            ctx.fillText('\u2220A= ' + this.angleA.toFixed(1) + '\u00B0',this.labelALocation[0],this.labelALocation[1]);
            ctx.fillText('\u2220B= ' + this.angleB.toFixed(1) + '\u00B0',this.labelBLocation[0],this.labelBLocation[1]);
            ctx.fillText('\u2220C= ' + this.angleC.toFixed(1) + '\u00B0',this.labelCLocation[0],this.labelCLocation[1]);
         }
        

        switch(this.displayChoice){
            case 'incenter':
                this.drawIncenter(ctx);
                return;
            case 'circumcenter':
                this.drawCircumcenter(ctx);
                return;
            case 'centroid':
                this.drawCentroid(ctx);
                return;
            case 'orthocenter':
                this.drawOrthocenter(ctx);
                return;
            case 'all_centers':
                this.drawAllCenters(ctx);
                return;
        }
        
	}
    drawIncenter(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        CtxAlgs.drawDottedLine(this.pointA.x,this.pointA.y,this.incenter[0],this.incenter[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.pointB.x,this.pointB.y,this.incenter[0],this.incenter[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.pointC.x,this.pointC.y,this.incenter[0],this.incenter[1],ctx,[13,13]);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'grey';
        //A: single arcs
        TriangleCenters.drawAngleTickMark(this.A,this.ABnorm,this.vectAbisect,25,ctx);
        TriangleCenters.drawAngleTickMark(this.A,this.vectAbisect,this.ACnorm,29,ctx);
        //B: double arcs
        TriangleCenters.drawAngleTickMark(this.B,this.BAnorm,this.vectBbisect,23,ctx);
        TriangleCenters.drawAngleTickMark(this.B,this.BAnorm,this.vectBbisect,28,ctx);
        TriangleCenters.drawAngleTickMark(this.B,this.vectBbisect,this.BCnorm,27,ctx);
        TriangleCenters.drawAngleTickMark(this.B,this.vectBbisect,this.BCnorm,32,ctx);
        //C: triple arcs
        TriangleCenters.drawAngleTickMark(this.C,this.CAnorm,this.vectCbisect,18,ctx);
        TriangleCenters.drawAngleTickMark(this.C,this.CAnorm,this.vectCbisect,23,ctx);
        TriangleCenters.drawAngleTickMark(this.C,this.CAnorm,this.vectCbisect,28,ctx);
        TriangleCenters.drawAngleTickMark(this.C,this.vectCbisect,this.CBnorm,22,ctx);
        TriangleCenters.drawAngleTickMark(this.C,this.vectCbisect,this.CBnorm,27,ctx);
        TriangleCenters.drawAngleTickMark(this.C,this.vectCbisect,this.CBnorm,32,ctx);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'blue';
        CtxAlgs.circle(this.incenter[0],this.incenter[1],this.incenterRadius,ctx);
        CtxAlgs.drawLine(this.incenter[0],this.incenter[1],this.incenterRadiusEndOnBC[0],this.incenterRadiusEndOnBC[1],ctx);
        CtxAlgs.drawLine(this.incenter[0],this.incenter[1],this.incenterRadiusEndOnAC[0],this.incenterRadiusEndOnAC[1],ctx);
        CtxAlgs.drawLine(this.incenter[0],this.incenter[1],this.incenterRadiusEndOnAB[0],this.incenterRadiusEndOnAB[1],ctx);
        //right angles
        TriangleCenters.drawRightAngle(this.incenterRadiusEndOnBC,this.BC,LA.subtractVectors(this.incenter,this.incenterRadiusEndOnBC),15,ctx);
        TriangleCenters.drawRightAngle(this.incenterRadiusEndOnAC,this.AC,LA.subtractVectors(this.incenter,this.incenterRadiusEndOnAC),15,ctx);
        TriangleCenters.drawRightAngle(this.incenterRadiusEndOnAB,this.AB,LA.subtractVectors(this.incenter,this.incenterRadiusEndOnAB),15,ctx);

        ctx.fillStyle = TriangleCenters.incenterColor;
        CtxAlgs.point(this.incenter[0],this.incenter[1],5,ctx);
    }

    drawCircumcenter(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        CtxAlgs.drawDottedLine(this.midAB[0],this.midAB[1],this.circumcenter[0],this.circumcenter[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.midBC[0],this.midBC[1],this.circumcenter[0],this.circumcenter[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.midCA[0],this.midCA[1],this.circumcenter[0],this.circumcenter[1],ctx,[13,13]);

        TriangleCenters.drawRightAngle(this.midAB,this.AB,LA.subtractVectors(this.circumcenter,this.midAB),15,ctx);
        TriangleCenters.drawRightAngle(this.midBC,this.BC,LA.subtractVectors(this.circumcenter,this.midBC),15,ctx);
        TriangleCenters.drawRightAngle(this.midCA,this.CA,LA.subtractVectors(this.circumcenter,this.midCA),15,ctx);

        ctx.strokeStyle = 'blue';
        CtxAlgs.drawLine(this.pointA.x,this.pointA.y,this.circumcenter[0],this.circumcenter[1],ctx);
        CtxAlgs.drawLine(this.pointB.x,this.pointB.y,this.circumcenter[0],this.circumcenter[1],ctx);
        CtxAlgs.drawLine(this.pointC.x,this.pointC.y,this.circumcenter[0],this.circumcenter[1],ctx);

        CtxAlgs.circle(this.circumcenter[0],this.circumcenter[1],this.circumcenterRadius,ctx);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.fillStyle = TriangleCenters.circumcenterColor;
        CtxAlgs.point(this.circumcenter[0],this.circumcenter[1],5,ctx);
        

        this._drawSideBisectTickMarks(ctx);
    }

    _drawSideBisectTickMarks(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'grey';
        TriangleCenters.drawConguenceTick(this.midAB1,this.AB,20,ctx);
        TriangleCenters.drawConguenceTick(this.midAB2,this.AB,20,ctx);
        TriangleCenters.drawConguenceTicks(this.midBC1,this.BC,20,2,6,ctx);
        TriangleCenters.drawConguenceTicks(this.midBC2,this.BC,20,2,6,ctx);
        TriangleCenters.drawConguenceTicks(this.midCA1,this.CA,20,3,6,ctx);
        TriangleCenters.drawConguenceTicks(this.midCA2,this.CA,20,3,6,ctx);
    }

    drawCentroid(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        CtxAlgs.drawDottedLine(this.pointA.x,this.pointA.y,this.midBC[0],this.midBC[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.pointB.x,this.pointB.y,this.midCA[0],this.midCA[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(this.pointC.x,this.pointC.y,this.midAB[0],this.midAB[1],ctx,[13,13]);

        ctx.fillStyle = TriangleCenters.centroidColor;
        CtxAlgs.point(this.centroid[0],this.centroid[1],5,ctx);

        this._drawSideBisectTickMarks(ctx);
    }

    drawOrthocenter(ctx){
        ctx.lineWidth = 2;
        
        this._drawAltidudeInfo(this.A,this.B,this.C,this.orthocenterEndOnBC,ctx);
        this._drawAltidudeInfo(this.B,this.A,this.C,this.orthocenterEndOnAC,ctx);
        this._drawAltidudeInfo(this.C,this.A,this.B,this.orthocenterEndOnAB,ctx);

        ctx.fillStyle = TriangleCenters.orthocenterColor;
        CtxAlgs.point(this.orthocenter[0],this.orthocenter[1],5,ctx);
    }
    _drawAltidudeInfo(vertex,otherVertex1,otherVertex2,perpAltidudePoint,ctx){
        ctx.strokeStyle = 'white';
        let distanceBetween1and2 = LA.distance(otherVertex1,otherVertex2);
        let distanceBetween1andPerp = LA.distance(otherVertex1,perpAltidudePoint);
        let distanceBetween2andPerp = LA.distance(perpAltidudePoint,otherVertex2);
        if(distanceBetween1andPerp>distanceBetween1and2){//perp is past 2
            CtxAlgs.drawDottedLine(otherVertex2[0],otherVertex2[1],perpAltidudePoint[0],perpAltidudePoint[1],ctx,[13,13]);
        }else if(distanceBetween2andPerp>distanceBetween1and2){//perp is past 1
            CtxAlgs.drawDottedLine(otherVertex1[0],otherVertex1[1],perpAltidudePoint[0],perpAltidudePoint[1],ctx,[13,13]);
        }

        ctx.strokeStyle = 'red';
        CtxAlgs.drawDottedLine(vertex[0],vertex[1],perpAltidudePoint[0],perpAltidudePoint[1],ctx,[13,13]);
        CtxAlgs.drawDottedLine(vertex[0],vertex[1],this.orthocenter[0],this.orthocenter[1],ctx,[13,13]);

        TriangleCenters.drawRightAngle(perpAltidudePoint,LA.subtractVectors(otherVertex1,perpAltidudePoint),LA.subtractVectors(this.orthocenter,perpAltidudePoint),15,ctx);
    }

    
    drawAllCenters(ctx){
        ctx.fillStyle = TriangleCenters.incenterColor;
        CtxAlgs.point(this.incenter[0],this.incenter[1],5,ctx);
        ctx.fillStyle = TriangleCenters.circumcenterColor;
        CtxAlgs.point(this.circumcenter[0],this.circumcenter[1],5,ctx);
        ctx.fillStyle = TriangleCenters.centroidColor;
        CtxAlgs.point(this.centroid[0],this.centroid[1],5,ctx);
        ctx.fillStyle = TriangleCenters.orthocenterColor;
        CtxAlgs.point(this.orthocenter[0],this.orthocenter[1],5,ctx);

        if(this.showLabels){
            ctx.font = "15px arial";
            let offsetX = 6;//pixels
            let offsetY = 4;
            ctx.fillStyle = TriangleCenters.incenterColor;
            ctx.fillText('incenter',this.incenter[0]+offsetX,this.incenter[1]+offsetY);
            ctx.fillStyle = TriangleCenters.circumcenterColor;
            ctx.fillText('circumcenter',this.circumcenter[0]+offsetX,this.circumcenter[1]+offsetY);
            ctx.fillStyle = TriangleCenters.centroidColor;
            ctx.fillText('centroid',this.centroid[0]+offsetX,this.centroid[1]+offsetY);
            ctx.fillStyle = TriangleCenters.orthocenterColor;
            ctx.fillText('orthocenter',this.orthocenter[0]+offsetX,this.orthocenter[1]+offsetY);
        }
        
    }


    drawVectorFromPoint(point,vector,ctx,dotted=false){
        if(dotted){
            CtxAlgs.drawDottedLine(point[0],point[1],point[0]+vector[0],point[1]+vector[1],ctx,[13,13]);
        }else{
            CtxAlgs.drawLine(point[0],point[1],point[0]+vector[0],point[1]+vector[1],ctx);
        }
        
    }
    //always draws on the inside of the angle
    static drawAngleTickMark(point,vector1,vector2,radius,ctx){
        let direction1 = MyMath.findAngleTo02PI(vector1[0],vector1[1]);
        let direction2 = MyMath.findAngleTo02PI(vector2[0],vector2[1]);

        let diff = direction2-direction1;
        if(diff>Math.PI || (diff<0 && diff>-Math.PI)){
            CtxAlgs.sectorArc(point[0],point[1],radius,direction2,direction1,ctx);
        }else{
            CtxAlgs.sectorArc(point[0],point[1],radius,direction1,direction2,ctx);
        }
        
    }
    //vectors are pointing away from point
    static drawRightAngle(point,vector1,vector2,squareSideLength,ctx){
        let vector1resize = LA.getNormalized(vector1);
        let vector2resize = LA.getNormalized(vector2);
        LA.scaleThisVector(squareSideLength,vector1resize);
        LA.scaleThisVector(squareSideLength,vector2resize);

        let squareStart1 = LA.addVectors(point,vector1resize);
        let squareStart2 = LA.addVectors(point,vector2resize);
        let squareOppCorner = LA.addVectors(squareStart1,vector2resize);

        CtxAlgs.drawLine(squareStart1[0],squareStart1[1],squareOppCorner[0],squareOppCorner[1],ctx);
        CtxAlgs.drawLine(squareStart2[0],squareStart2[1],squareOppCorner[0],squareOppCorner[1],ctx);
    }
    static drawConguenceTick(point,lineVector,tickLength,ctx){
        let perpVect = LA.getNormalized(lineVector);
        perpVect = [-perpVect[1],perpVect[0]];
        LA.scaleThisVector(tickLength/2,perpVect);
        CtxAlgs.drawLine(point[0],point[1],point[0]+perpVect[0],point[1]+perpVect[1],ctx);
        CtxAlgs.drawLine(point[0],point[1],point[0]-perpVect[0],point[1]-perpVect[1],ctx);
    }
    static drawConguenceTicks(point,lineVector,tickLength,numTicks,spaceBetween,ctx){
        if(numTicks<=1){
            TriangleCenters.drawConguenceTick(currentLocation,lineVector,tickLength,ctx);
            return;
        }
        let totalDistance = spaceBetween*(numTicks-1);
        let spacingVector = LA.getVectorWithNewMagnitude(lineVector,spaceBetween);
        let currentLocation = LA.addVectors(point, LA.getVectorWithNewMagnitude(lineVector,-totalDistance/2));
        TriangleCenters.drawConguenceTick(currentLocation,lineVector,tickLength,ctx);
        for(let i=0;i<numTicks-1;i++){
            currentLocation = LA.addVectors(currentLocation, spacingVector);
            TriangleCenters.drawConguenceTick(currentLocation,lineVector,tickLength,ctx);
        }
    }


}