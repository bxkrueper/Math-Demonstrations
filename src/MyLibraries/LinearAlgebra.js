class LA{
	//returns an array of arrays with ones going down the diagonal
	static makeIdentityMatrix(size){
		let matrix = [];
		for(let i=0;i<size;i++){
			let row = [];
			matrix.push(row);
			for(let j=0;j<size;j++){
				row.push(j===i?1:0);
			}
		}

		return matrix;
	}

	//matrix is on the left and vector is on the right
	//doesn't check for correct number of rows/columns
	//returns an array representing the answer vector
	static matrixTimesVector(matrix,vector){
		let answerVector = [];
		for(let row=0;row<matrix.length;row++){
			let answerEntry = 0;
			for(let column=0;column<matrix.length;column++){//column is referencing the column in the matrix
				answerEntry += matrix[row][column]*vector[column];
			}
			answerVector.push(answerEntry);
		}
		return answerVector;
	}
	//returns null. changes vector
	static applyTransformationToVector(matrix,vector){
		let answerVector = LA.matrixTimesVector(matrix,vector);
		for(let i=0;i<vector.length;i++){
			vector[i] = answerVector[i];
		}
	}

	//doesn't check for correct number of rows/columns
	//returns an array of arrays representing a matrix
	static matrixTimesMatrix(matrixLeft,matrixRight){
		let answerMatrix = [];

		for(let row=0;row<matrixLeft.length;row++){//row is current row of answerMatrix being worked on
			answerMatrix.push([]);
			for(let column=0;column<matrixRight[0].length;column++){//column is current column of answerMatrix being worked on. assume all rows in inputs are the same length
				let answerEntry = 0;
				for(let entry=0;entry<matrixRight.length;entry++){
					answerEntry += matrixLeft[row][entry]*matrixRight[entry][column];
				}
				answerMatrix[row].push(answerEntry);
			}
		}

		return answerMatrix;
	}

	// static copyVector(vector){
	// 	return vector.slice();
	// }

	//assumes the vectors are the same length
	//returns a number
	static dotProduct(vector1,vector2){
		let result = 0;
		for(let i=0;i<vector1.length;i++){
			result+=vector1[i]*vector2[i];
		}
		return result;
	}

	//assumes the vectors are the same length
	//returns another vector
	static addVectors(vector1,vector2){
		let result = [];
		for(let i=0;i<vector1.length;i++){
			result.push(vector1[i]+vector2[i]);
		}
		return result;
	}
	//assumes the vectors are the same length
	//returns null. Vector2 becomes vector1+vector2
	static addVectorToVector(vector1,vector2){
		for(let i=0;i<vector1.length;i++){
			vector2[i]+=vector1[i];
		}
	}
	//assumes the vectors are the same length
	//returns another vector
	static subtractVectors(vector1,vector2){
		let result = [];
		for(let i=0;i<vector1.length;i++){
			result.push(vector1[i]-vector2[i]);
		}
		return result;
	}
	//assumes the vectors are the same length
	//returns null. Vector2 becomes vector1-vector2
	static subtractVectorToVector(vector1,vector2){
		for(let i=0;i<vector1.length;i++){
			vector2[i]-=vector1[i];
		}
	}
	//returns another vector
	static scaleVector(scaler,vector){
		let result = [];
		for(let i=0;i<vector.length;i++){
			result.push(scaler*vector[i]);
		}
		return result;
	}
	//returns null. changes vector
	static scaleThisVector(scaler,vector){
		for(let i=0;i<vector.length;i++){
			vector[i]*=scaler;
		}
	}

	static magnitude(vector){
		return Math.sqrt(LA.dotProduct(vector,vector));
	}
	
	static distance(point1,point2){
		let sum=0;
		for(let i=0;i<point1.length;i++){
			let diff = point2[i]-point1[i];
			sum+=diff*diff;
		}
		return Math.sqrt(sum);
	}

	//scales the vector so its magnitude is 1
	//returns null
	static normalize(vector){
		let magnitude = LA.magnitude(vector);
		LA.scaleThisVector(1/magnitude,vector);
	}
	// returns new vector
	static getNormalized(vector){
		let magnitude = LA.magnitude(vector);
		return LA.scaleVector(1/magnitude,vector);
	}

	static setMagnitude(vector,newMagnitude){
		let magnitude = LA.magnitude(vector);
		LA.scaleThisVector(newMagnitude/magnitude,vector);
	}
	static getVectorWithNewMagnitude(vector,newMagnitude){
		let magnitude = LA.magnitude(vector);
		return LA.scaleVector(newMagnitude/magnitude,vector);
	}

	static midpoint(point1,point2){
		let result = [];
		for(let i=0;i<point1.length;i++){
			result.push((point1[i]+point2[i])/2);
		}
		return result;
	}

	//a,b,c,d: d3 points    tolerance: >0
	//AD dot (AB X AC) = 0
	static pointsAreCoPlanar(a,b,c,d,tolerance=0){
		//unoptimized
		// let ad = LA.subtractVectors(d,a);
		// let ab = LA.subtractVectors(b,a);
		// let ac = LA.subtractVectors(c,a);
		// let cross = LA.crossProduct(ab,ac);
		// let dot = LA.dotProduct(ad,cross);
		// return Math.abs(dot)<=tolerance;

		//optimized:
		let ad = [d[0]-a[0],d[1]-a[1],d[2]-a[2]];
		let ab = [b[0]-a[0],b[1]-a[1],b[2]-a[2]];
		let ac = [c[0]-a[0],c[1]-a[1],c[2]-a[2]];
		let cross = LA.crossProduct(ab,ac);
		let dot = ad[0]*cross[0]+ad[1]*cross[1]+ad[2]*cross[2];
		return Math.abs(dot)<=tolerance;
	}


	static findClosestPointOnLineToPoint(point,pointOnLine,lineVector){
		let pontOnLineToPoint = LA.subtractVectors(point,pointOnLine);
		let lineVectorNormalized = LA.getNormalized(lineVector);
		let distanceFromPointOnLineToGoal = LA.dotProduct(pontOnLineToPoint,lineVectorNormalized);
		let pointOnLineToGoal = LA.scaleVector(distanceFromPointOnLineToGoal,lineVectorNormalized);
		let goal = LA.addVectors(pointOnLine,pointOnLineToGoal);
		return goal;
	}


	/////////////these are for specifically 3d vectors and are more effecient

	//assumes the vectors are the same length
	//returns a vector
	static crossProduct(vector13D,vector23D){
		return [ vector13D[1]*vector23D[2]-vector13D[2]*vector23D[1],
			     -(vector13D[0]*vector23D[2]-vector13D[2]*vector23D[0]),
			     vector13D[0]*vector23D[1]-vector13D[1]*vector23D[0]   ];
	}

	
	static getADirectionPerpTo(lineDirection3D){
		let randomOtherDirection = lineDirection3D.slice();
		randomOtherDirection[0]+=0.123456789;///
		randomOtherDirection[1]+=0.987654321;///
		randomOtherDirection[2]+=0.192837465;///
		let toReturn = LA.crossProduct(lineDirection3D,randomOtherDirection);
		LA.normalize(toReturn);
		return toReturn;
	}

	
	//direction= must be normalized
	static rotatePointAboutLine3D(point,linePoint,lineDirection,angle){
		point[0]-=linePoint[0]; point[1]-=linePoint[1]; point[2]-=linePoint[2];
		LA.rotatePointAboutDirection3D(point,lineDirection,angle);
		point[0]+=linePoint[0]; point[1]+=linePoint[1]; point[2]+=linePoint[2];
	}
	//direction is sorced at the origin and normalized
	//Rodrigues formula: v_rot=vcos(t)+(kXv)sin(t)+k(k dot v)(1-cos(theta))    v is point, k is direction (normalized) t is angle
	//spread out form: \matrixSquare{\row{x\cos\left(\theta\right)+\left(bz-cy\right)\sin\left(\theta\right)+\left(aax+aby+acz\right)\left(1-\cos\left(\theta\right)\right)}}{\row{y\cos\left(\theta\right)+\left(cx-az\right)\sin\left(\theta\right)+\left(bax+bby+bcz\right)\left(1-\cos\left(\theta\right)\right)}}{\row{z\cos\left(\theta\right)+\left(ay-bx\right)\sin\left(\theta\right)+\left(cax+cby+ccz\right)\left(1-\cos\left(\theta\right)\right)}}
	//a,b,c: normalized direction     x,y,z: point
	static rotatePointAboutDirection3D(point,lineDirection,angle){
		let x=point[0],y=point[1],z=point[2];
		let a=lineDirection[0],b=lineDirection[1],c=lineDirection[2];
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let oneMinusCos = 1-cos;
		let ax=a*x,by=b*y,cz=c*z;
		point[0] = x*cos+(b*z-c*y)*sin+(a*ax+a*by+a*cz)*oneMinusCos;
		point[1] = y*cos+(c*x-a*z)*sin+(b*ax+b*by+b*cz)*oneMinusCos;
		point[2] = z*cos+(a*y-b*x)*sin+(c*ax+c*by+c*cz)*oneMinusCos;

		//unoptimized
		// [x*cos+(b*z-c*y)*sin+(a*a*x+a*b*y+a*c*z)*(1-cos),
		// 	y*cos+(c*x-a*z)*sin+(b*a*x+b*b*y+b*c*z)*(1-cos),
		// 	z*cos+(a*y-b*x)*sin+(c*a*x+c*b*y+c*c*z)*(1-cos)];
	}
	static getRotatePointAboutLine3D(point,linePoint,lineDirection,angle){
		let pointCopy = point.slice();
		LA.rotatePointAboutLine3D(pointCopy,linePoint,lineDirection,angle);
		return pointCopy;
	}
	static getRotatePointAboutDirection3D(point,lineDirection,angle){
		let pointCopy = point.slice();
		LA.rotatePointAboutDirection3D(pointCopy,linePoint,lineDirection,angle);
		return pointCopy;
	}

	//inputs are all 3d: returns negative if behind plane (under normal)   plane normal is normalized
	//(point-planePoint)dotN
	static distanceOfPointToPlane(point,planePoint,planeNormal){
		return planeNormal[0]*(point[0]-planePoint[0])+planeNormal[1]*(point[1]-planePoint[1])+planeNormal[2]*(point[2]-planePoint[2]);
	}

	//returns boolean
    static pointInFrontOfPlane(point,planePoint,planeNormal){////calculating POnPlane dot N repeateldy?
        // return LA.distanceOfPointToPlane(point,planePoint,planeNormal)>0;
        
        //optimized version: (save a function call)
    	return (planeNormal[0]*(point[0]-planePoint[0])+planeNormal[1]*(point[1]-planePoint[1])+planeNormal[2]*(point[2]-planePoint[2]))>0;
    }

	//line inputs can be 3d or 4d  plane inputs are 3d. Normal should be normalized
	//line: linePoint1+t*lineDirection = P
	//plane: N dot P = N dot planePoint
	//substitute line equation into plane equation
	//N dot (linePoint1+t*lineDirection) = N dot planePoint
	//solve for t: t= (N dot (planePoint-linePoint1))/(N dot lineDirection)
	//plug t into line equation
	//lineDirection is normalized
	//returns 3d point or null
	static intersectionOfLineSegmentToPlane(linePoint1,linePoint2,planePoint,planeNormal){
		let lineDirection = [linePoint2[0]-linePoint1[0],linePoint2[1]-linePoint1[1],linePoint2[2]-linePoint1[2]];//LA.subtractVectors(linePoint2,linePoint1);
		LA.normalize(lineDirection);
		let planePointMinusLinePoint1 = [planePoint[0]-linePoint1[0],planePoint[1]-linePoint1[1],planePoint[2]-linePoint1[2]];
		let t = LA.dotProduct(planeNormal,planePointMinusLinePoint1)/LA.dotProduct(planeNormal,lineDirection);
		///////return null if t invalid?
		return [linePoint1[0]+t*lineDirection[0],linePoint1[1]+t*lineDirection[1],linePoint1[2]+t*lineDirection[2]];// return LA.addVectors(linePoint1,LA.scaleVector(t,lineDirection));
	}
	//ray direction is normalized
	static intersectionOfRayToPlane(raySorce,rayDirection,planePoint,planeNormal){
		let planePointMinusRaySorce = [planePoint[0]-raySorce[0],planePoint[1]-raySorce[1],planePoint[2]-raySorce[2]];
		let t = LA.dotProduct(planeNormal,planePointMinusRaySorce)/LA.dotProduct(planeNormal,rayDirection);
		if(t<0) return null;
		return [raySorce[0]+t*rayDirection[0],raySorce[1]+t*rayDirection[1],raySorce[2]+t*rayDirection[2]];// return LA.addVectors(raySorce,LA.scaleVector(t,rayDirection));
	}



	//returns null. optimized version only for 3X3 matrix and size 3 vector
	static applyTransformationToVector3D(matrix,vector){
		let originalX = vector[0];
		let originalY = vector[1];
		let originalZ = vector[2];
		vector[0] = matrix[0][0]*originalX+matrix[0][1]*originalY+matrix[0][2]*originalZ;
		vector[1] = matrix[1][0]*originalX+matrix[1][1]*originalY+matrix[1][2]*originalZ;
		vector[2] = matrix[2][0]*originalX+matrix[2][1]*originalY+matrix[2][2]*originalZ;
	}
	//returns null. optimized version only for 4X4 matrix and size 4 vector
	static applyTransformationToVector4D(matrix,vector){
		let originalX = vector[0];
		let originalY = vector[1];
		let originalZ = vector[2];
		let originalW = vector[3];
		vector[0] = matrix[0][0]*originalX+matrix[0][1]*originalY+matrix[0][2]*originalZ+matrix[0][3]*originalW;
		vector[1] = matrix[1][0]*originalX+matrix[1][1]*originalY+matrix[1][2]*originalZ+matrix[1][3]*originalW;
		vector[2] = matrix[2][0]*originalX+matrix[2][1]*originalY+matrix[2][2]*originalZ+matrix[2][3]*originalW;
		vector[3] = matrix[3][0]*originalX+matrix[3][1]*originalY+matrix[3][2]*originalZ+matrix[3][3]*originalW;
	}

	//for left handed coordinate system
	static make3DRotationAroundXMatrix(theta){
		return [ [1,0,0],
				 [0,Math.cos(theta),-Math.sin(theta)],
				 [0,Math.sin(theta),Math.cos(theta)]  ];
	}
	static make3DRotationAroundYMatrix(theta){
		return [ [Math.cos(theta),0,Math.sin(theta)],
				 [0,1,0],
				 [-Math.sin(theta),0,Math.cos(theta)]  ];
	}
	static make3DRotationAroundZMatrix(theta){
		return [ [Math.cos(theta),-Math.sin(theta),0],
				 [Math.sin(theta),Math.cos(theta),0],
				 [0,0,1]  ];
	}

	//this is actually 4d and only works with vectors with a 4th compoent of 1 like [x,y,z,1]
	static make3DTranslationMatrix(x,y,z){
		return [ [1,0,0,x],
				 [0,1,0,y],
				 [0,0,1,z],
				 [0,0,0,1]  ];
	}

	//this is actually 4d and only works with vectors with a 4th compoent of 1 like [x,y,z,1]
	//transforms a vertex to a coordinate system where the camera is at (0,0,0) looking at +z with +x on the right and +y up
	//width,height: of canvas (or frustrum) scale dosen't matter as they are divided
	//halfFov: half field of view: angle between forward and top
	//zNear: distance from eye to canvas
	//zFar: max view distance
	//https://www.youtube.com/watch?v=U0_ONQQ5ZNM  end of vid
	//a is fov (angle between top and bottom)   n is distance to near plane, f is distance to far plane  w,h: of canvas (or frustrum) scale dosen't matter as they are divided
	//[1/((w/h)tan(a/2)),0         ,0      ,0]
	//[0                ,1/tan(a/2),0      ,0]
	//[0                ,0         ,f/(f/n),-(f*n)/(f-n)]
	//[0                ,0         ,1      ,0]
	static make3DPerspectiveProjectionMatrix(width,height,halfFov,zNear,zFar){
		let tan=Math.tan(halfFov);
        let zFactor = zFar/(zFar-zNear);
		return [ [height/(width*tan),0    ,0,                   0],
				 [0                   ,1/tan,0,                   0],
				 [0                   ,0    ,zFactor,-zNear*zFactor],
				 [0                   ,0    ,1,                   0]  ];
	}

	//translates 4-d vectors in world space to camera space, where camera can be at (0,0,0) looking at +z with +x on the right and +y up
	//all inputs are 3D vectors
	//matrix for taking the camera to the point would be
	//[newIx,newJx,newKx,translateX]
	//[newIy,newJy,newKy,translateY]
	//[newIz,newJz,newKz,translateZ]
	//[0    ,0    ,0    ,         1]
	//but we want to do the opposite, so the inverse is
	//[newIx,newIy,newIz,-translate dot newI]
	//[newJx,newJy,newJz,-translate dot newJ]
	//[newKx,newKy,newKz,-translate dot newK]
	//[0    ,0    ,0    ,                  1]
	//
	static makeHomogenizationMatrix(translateTo,newI,newJ,newK){///////////////????forward, perpRight,perp2?
		return [	[newI[0],newI[1],newI[2],-LA.dotProduct(translateTo,newI)],
					[newJ[0],newJ[1],newJ[2],-LA.dotProduct(translateTo,newJ)],
					[newK[0],newK[1],newK[2],-LA.dotProduct(translateTo,newK)],
					[0      ,0      ,0      ,                               1]		];

	}

	
}
