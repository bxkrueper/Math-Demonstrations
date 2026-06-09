class CtxAlgs{
	//color example: ctx.fillStyle = 'white';    "rgb(40,255,40)"     "rgba(240,0,0,0.5)"   "hsl(120,100%,50%)"  "hsla(120,100%,50%,0.3)"

	//font example: ctx.font = '12px Arial'
	//ctx.fillStyle = 'white';
	//text example: ctx.fillText(text,x,y);
	//ctx.textBaseline = '';    options: 'bottom': draw from the lowest part of g

	//draw line:   ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.beginPath();   ctx.moveTo(xStart,yStart);   ctx.lineTo(xTip,yTip);   ctx.stroke();
	//draw rect: ctx.lineWidth = 2; ctx.strokeStyle = 'grey'; ctx.strokeRect(left,top,width,height);
	//fill shape: ctx.fillStyle = color;   ctx.beginPath();   ctx.fillRect(x, y, width, h);    ctx.arc(x,y,r, 0, 2 * Math.PI);   ctx.fill();
	//draw picture: ctx.drawImage(image, x, y, width, height);

	static drawLine(x1,y1,x2,y2,ctx){
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}

	//arrowHeadAngle: 0 would be continuing the line. Pi will be heading straight back to the source  recomend 2.5 or so
	static drawArrowHead(xTip,yTip,arrowDirection,arrowHeadAngle,arrowHeadLength,ctx){
		ctx.beginPath();
		ctx.moveTo(xTip,yTip);
		ctx.lineTo(xTip+arrowHeadLength*Math.cos(arrowDirection+arrowHeadAngle),yTip+arrowHeadLength*Math.sin(arrowDirection+arrowHeadAngle));
		ctx.moveTo(xTip,yTip);
		ctx.lineTo(xTip+arrowHeadLength*Math.cos(arrowDirection-arrowHeadAngle),yTip+arrowHeadLength*Math.sin(arrowDirection-arrowHeadAngle));
		ctx.stroke();
	}

	static drawArrow(xStart,yStart,xTip,yTip,arrowHeadAngle,arrowHeadLength,ctx){
		ctx.beginPath();
		ctx.moveTo(xStart,yStart);
		ctx.lineTo(xTip,yTip);
		ctx.stroke();
		let arrowDirection = MyMath.findAngleFromTo(xStart,yStart,xTip,yTip);
		CtxAlgs.drawArrowHead(xTip,yTip,arrowDirection,arrowHeadAngle,arrowHeadLength,ctx);
	}

	//assumes font and color is already set for text. Buffers make it bigger on all sides
	static drawTextWithBackground(ctx,x,y,text,backgroundColor,bufferX=0,bufferY=0){
		let textWidth = ctx.measureText(text).width;

		let textColor = ctx.fillStyle;

		//draw message background
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(x-bufferX,y+bufferY,textWidth+2*bufferX,-CtxAlgs.getTextSizeFromCtxFont(ctx.font)-2*bufferY);

		//draw message
		ctx.textBaseline = 'bottom';//draw from the lowest part of g
		ctx.fillStyle = textColor;
		ctx.fillText(text,x,y);
	}

	//ctx Font example: 'bold italic 80px Arial'

	static getTextSizeFromCtxFont(ctxFont){
		let regex = MyMath.getPositiveDecimalRegex();
		let match = regex.exec(ctxFont);
		let numText = match[0];
		return Number(numText);
	}

	static changeSizeCtxFont(ctxFont,newNum){
		let regex = MyMath.getPositiveDecimalRegex();
		let match = regex.exec(ctxFont);
		let lowIndex = match.index;
		let oneAfterHighIndex = regex.lastIndex;
		let newCtxFont = ctxFont.slice(0,lowIndex) + newNum.toString() + ctxFont.slice(oneAfterHighIndex);
		return newCtxFont;
	}

	//not tested    changing bold/italic status. '' or 'normal' for none???
	static changeTypeCtxFont(ctxFont,newType){
		let regex = MyMath.getPositiveDecimalRegex();
		let match = regex.exec(ctxFont);
		let numberLowIndex = match.index;
		let newCtxFont = newType + ' ' + ctxFont.slice(numberLowIndex);
		return newCtxFont;
	}

	////untested
	static getTextLength(text,textSize,fontName,ctx){
	  ctx.font = textSize + 'px ' + fontName;
	  return ctx.measureText(text).width;
	}

	static point(x,y,radius,ctx){
		ctx.beginPath();
		ctx.arc(x,y,radius, 0, 2 * Math.PI);
		ctx.fill();
	}
	static circle(x,y,radius,ctx){
		ctx.beginPath();
		ctx.arc(x,y,radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
	static sector(x,y,radius,thetaStart,thetaEnd,ctx){
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.arc(x,y,radius, thetaStart, thetaEnd);
		ctx.fill();
	}
	static sectorArc(x,y,radius,thetaStart,thetaEnd,ctx){
		ctx.beginPath();
		// ctx.moveTo(x,y);
		ctx.arc(x,y,radius, thetaStart, thetaEnd);
		ctx.stroke();
	}
	//lineDashArray example: [13, 15]
	static drawDottedLine(x1,y1,x2,y2,ctx,lineDashArray){
		ctx.setLineDash(lineDashArray);
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
		ctx.setLineDash([]);//put back to solid line
	}

	//pointArray: [x:#,y:#]
	// static drawPath(pointArray,ctx){
	// 	if(pointArray.length<2) return;
	// 	ctx.beginPath();
	// 	ctx.moveTo(pointArray[0].x,pointArray[0].y);
	// 	for(let i=1;i<pointArray.length;i++){
	// 		ctx.lineTo(pointArray[i].x,pointArray[i].y);
	// 	}
	// 	ctx.stroke();
	// }

	//lineArray: [{x1:#,y1:#,x2:#,y2:#},...]
	// static drawLines(lineArray,ctx){
	// 	if(lineArray.length<2) return;
	// 	ctx.beginPath();
	// 	for(let i=0;i<lineArray.length;i++){
	// 		let line = lineArray[i];
	// 		ctx.moveTo(line.x1,line.y1);
	// 		ctx.lineTo(line.x2,line.y2);
	// 	}
	// 	ctx.stroke();
	// }

	//pointArray: [x:#,y:#] (world coordinates) use to make sure stroke size is constant, no matter what the zoom is
	static drawPathConvertToCanvas(pointArray,camera,ctx){
		if(pointArray.length<2) return;
		ctx.beginPath();
		ctx.moveTo(camera.worldXToCanvasX(pointArray[0].x),camera.worldYToCanvasY(pointArray[0].y));
		for(let i=1;i<pointArray.length;i++){
			ctx.lineTo(camera.worldXToCanvasX(pointArray[i].x),camera.worldYToCanvasY(pointArray[i].y));
		}
		ctx.stroke();
	}

	//lineArray: [{x1:#,y1:#,x2:#,y2:#},...] (world coordinates) use to make sure stroke size is constant, no matter what the zoom is
	// static drawLinesConvertToCanvas(lineArray,camera,ctx){
	// 	if(lineArray.length<2) return;
	// 	ctx.beginPath();
	// 	for(let i=0;i<lineArray.length;i++){
	// 		let line = lineArray[i];
	// 		ctx.moveTo(camera.worldXToCanvasX(line.x1),camera.worldYToCanvasY(line.y1));
	// 		ctx.lineTo(camera.worldXToCanvasX(line.x2),camera.worldYToCanvasY(line.y2));
	// 	}
	// 	ctx.stroke();
	// }

	static drawFraction(xStart,yStart,numeratorText,denominatorText,ctx){
		ctx.textBaseline = 'alphabetic';//lowest part of g is below
		let textSize = CtxAlgs.getTextSizeFromCtxFont(ctx.font);
        let widthOfNumberator = ctx.measureText(numeratorText).width;
        let widthOfDenominator = ctx.measureText(denominatorText).width;
        let widthOfBar = Math.max(widthOfNumberator,widthOfDenominator);
        let middleOfBar = xStart+widthOfBar/2;

        ctx.fillText(numeratorText,middleOfBar-widthOfNumberator/2, yStart-textSize*1.15);
        ctx.fillText(denominatorText,middleOfBar-widthOfDenominator/2, yStart);

        //draw fraction line
        ctx.beginPath();
        ctx.rect(xStart, yStart-textSize+2, widthOfBar, textSize/10);
        ctx.fill();

        return widthOfBar;
    }
}

//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//const myImageData = ctx.getImageData(left, top, width, height);[r,g,b,a,r,g,b,a,r,g,b,a...] 1d array for whole image
//let imgdatalen = imgdata.data.length;
//ctx.putImageData(myImageData, dx, dy);
//canvas.toDataURL('image/png')
//canvas.toDataURL('image/jpeg', quality)   quality in the range from 0(bad) to 1(good)



//save to storedImage
// let self = this;
// var imageData = tempCtx.getImageData(0, 0, this.world.worldView.canvasWidth, this.world.worldView.canvasHeight);
// let image = new Image();
// image.addEventListener('load', function() {
//   self.world.redraw();
//   console.log('redrew from loading src');
// }, false);
// image.src = _GraphObject.hiddenCanvas.toDataURL();
// this.storedImage = image;