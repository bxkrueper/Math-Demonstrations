//subclasses need to have the function generateCamera() which returns the camera that world wants to use
class World{

	constructor(){
		this._worldObjects = [];
		this._nameObjectMap = {};
		this._currentTarget = null;
		this._timeOfLastClick = 0;
		if((typeof this['generateCamera']) == "function"){
			this._camera = this.generateCamera();
		}else{
			throw "world subclass does not override generateCamera()!"
		}
		
		///////////use map for clicked and double clicked? (faster, doesn't need to be ordered)
		let initialEventList = ['drawWorld',//params: ctx: (transormed to world coordinates)
							'drawCanvas',//params: ctx: (canvas coordinates)
							'mouseButtonDown',//params: buttonType ('left','right','middle','touch')
							'mouseButtonUp',//params: buttonType ('left','right','middle','touch')
							'mouseClicked',//params: buttonType ('left','right','middle','touch')   target only
							'mouseDoubleClicked',//params: buttonType ('left','right','middle','touch')    target only
							'mouseTripleClicked',//params: buttonType ('left','right','middle','touch')    target only
							'mouseMoved',//params: none (will usually need to get mouse locaiton from the world.worldView)
							'draged',//params: none(will usually need to get mouse locaiton and previous location from the world.worldView). needs acceptMouseTarget to have a chance to trigger
							'touchHold',//params: none
							'acceptMouseTarget',//params: none (will usually need to get mouse locaiton from the world.worldView)
							'keyDown',//params: keyName (ex: 'f','b','ctrl') from WorldView Map
							'keyUp',//params: keyName (ex: 'f','b','ctrl') from WorldView Map
							'keyInput',//params: keyName (ex: 'f','b','ctrl') (if you hold down a key, this will fire once on press, then rapidly)
							'stringInput',//params: inputtedString (usually the character inputed, but will add paste support later)
							'scroll',//params: direction ('up' or 'down')
							'scrollOn',//params: direction ('up' or 'down')    target only
							// 'mouseEnter',
							// 'mouseLeave',
							'resize_window',
							'resize_canvas',
							'windowFocused',
							'windowDeFocused',
							'pasteText',//params: pasted text
							'pasteImage',//params: pasted image
							'doOnWorldViewSet',//trigger when window dimensions are known
							'currentTargetChanged'];
		this._eventMap = {};
		let self = this;
		initialEventList.forEach(function(value){
			self.addMethod(value);
		});

		this._timerMap = {};//methodName:timerObject

		this._debugMode = false;
		this._priorities = {};// string:number   keeps track of what priorities mean what. subclasses should fill this up on creation
	}

	get allWorldObjects(){
		return this._worldObjects;
	}

	get worldView(){
		return this._worldView;
	}

	set worldView(worldView){
		this._worldView = worldView;
		
		this._worldView.redraw();
	}

	//what the mouse is immediatly hovering over
	get currentTarget(){
		return this._currentTarget;
	}

	get camera(){
		return this._camera;
	}

	get debugMode(){
		return this._debugMode;
	}

	set debugMode(bool){
		this._debugMode = bool;
	}

	get priorities(){
		return this._priorities;
	}

	objectIsInWorld(object){
		return this._worldObjects.includes(object);
	}

	//subclasses can override
	doOnWorldViewSet(){
		//iterate 
		for(const obFuncPair of this._eventMap['doOnWorldViewSet'].listenerList.iterator()){
	      	obFuncPair.eventFunction.call(obFuncPair.object);
	    }
	}

	redrawAfter(methodName,bool=true){
		this._eventMap[methodName].redrawAfter = bool;
	}

	redraw(){
		this.worldView.redraw();
	}
	
	addMethod(methodName){
		if(this._eventMap[methodName]!=null){
			console.log('method name already exists! Nothing added');
			return;
		}

		this._eventMap[methodName] = {
									listenerList:new SortedLinkedList(),//contains{'object':worldObject,'eventFunction':func}
									addAfterList:[],////contains worldObjects. these will be added to the world after the next time listener list has been run through
									doAfterList:[],//contains methods to be executed after the next time listener list has been run through
									redrawAfter:false
									};
	}
	hasMethod(methodName){
		return this._eventMap[methodName]!=null;
	}
	deleteMethod(methodName){
		if(this._eventMap[methodName]==null){
			console.log('method could not be found. Nothing deleted');
			return;
		}

		delete this._eventMap[methodName];
	}
	
	
	addEventListener(worldObject,methodName,func,priority = 0){
		if(this._eventMap[methodName]==null){
			console.log('could not find method named ' + methodName + '  event not added');
			return;
		}
		
		this._eventMap[methodName].listenerList.add({'object':worldObject,'eventFunction':func},priority);
	}
	deleteObjectFromEventLists(worldObject,methodName){//deletes every method registered to that object. May be more than one

		this._eventMap[methodName].listenerList.deleteAllThat(function(objectToTest){//need new function here because objectToTest is {object,eventFunction}, not object
			return worldObject===objectToTest.object;
		});
	}
	removeEventListener(worldObject,methodName,func){
		this._eventMap[methodName].listenerList.deleteAllThat(function(objectToTest){//need new function here because objectToTest is {object,eventFunction}, not object
			return func===objectToTest.eventFunction && objectToTest.object === worldObject;
		});
	}
	changePriority(worldObject,methodName,func,newPriority){
		this.removeEventListener(worldObject,methodName,func);
		this.addEventListener(worldObject,methodName,func,newPriority);
	}

	//world objects will be given some properties and functions upon being added. Do not call these in their constructors. Instead make sure 
	//this object has doOnAdd(){instructions};
	_addPropertiesToObject(worldObject){
		worldObject.world = this;
	}

	//adds the object's methods to the current event lists
	add(worldObject){
		this._addPropertiesToObject(worldObject);

		this._worldObjects.push(worldObject);


		if(((typeof worldObject['doOnAdd']) == "function")){
			worldObject.doOnAdd();
		}

		console.log(worldObject.toString() + " added");
	}
	addAfterFinishedWithMethod(worldObject,methodName){//after the next time list has been run through
		if(this._eventMap[methodName]==null){
			console.log('could not find method named ' + methodName + '  object will not be not added');
			return;
		}
		
		this._eventMap[methodName].addAfterList.push(worldObject);
	}
	doAfterFinishedWithMethod(methodName,methodToBeDoneAfter){//after the next time list has been run through
		if(this._eventMap[methodName]==null){
			console.log('could not find method named ' + methodName + '  object will not be not added');
			return;
		}
		
		this._eventMap[methodName].doAfterList.push(methodToBeDoneAfter);
	}

	//removes the object's methods from the current event lists
	delete(worldObject){
		for(var methodName in this._eventMap){
			this.deleteObjectFromEventLists(worldObject,methodName);//delete everything to do with that object
		}

		this._worldObjects = this._worldObjects.filter(ob => ob != worldObject);//delete from the world object list
		

		worldObject.doOnDelete?.();
		// if(((typeof worldObject['doOnDelete']) === "function")){
		// 	worldObject.doOnDelete();
		// }

		this.deRegisterName(this._getNameByObject(worldObject));

		if(this._currentTarget===worldObject) this.setTarget();

		console.log(worldObject.toString() + " deleted");
	}

	registerName(name,object){
		this._nameObjectMap[name] = object;
	}
	deRegisterName(name){
		delete this._nameObjectMap[name];
	}
	getObjectByName(name){
		return this._nameObjectMap[name];
	}

	_getNameByObject(worldObject){
		for(name in this._nameObjectMap){
			if(this._nameObjectMap[name]==worldObject){
				return name;
			}
		}
		return null;
	}

	//things like mouseButton that have additional code
	doFunctionToAllObjects(methodName,param){
		this._doFunctionToAllObjectsCore(methodName,param);
	    this._afterStuff(methodName);
	}

	//iterate 
	_doFunctionToAllObjectsCore(methodName,param){
		for(const obFuncPair of this._eventMap[methodName].listenerList.iterator()){
	      	let stopPrematurely = obFuncPair.eventFunction.call(obFuncPair.object,param);
	      	if(stopPrematurely){
	      		console.log('stopPrematurely');
	      		break;
	      	}
	    }
	}

	

	_afterStuff(methodName){
		this._flushAddAfterList(methodName);
	    this._flushDoAfterList(methodName);

	    if(this._eventMap[methodName].redrawAfter){
	    	this.worldView.redraw();
	    }
	}
	//adds the waiting functions to the list and clears the list
	_flushAddAfterList(methodName){
		let list = this._eventMap[methodName].addAfterList;
		if (list.length==0){
			return;//no need to do anything
		}

		let self = this;
		list.forEach(function(value){// value is a worldObject
			self.add(value);
		});
		this._eventMap[methodName].addAfterList = [];//clear the list
	}
	//executes the waiting functions and clears the list
	_flushDoAfterList(methodName){
		let list = this._eventMap[methodName].doAfterList;
		if (list.length==0){
			return;//no need to do anything
		}

		list.forEach(function(value){// value is a method
			value();
		});
		this._eventMap[methodName].doAfterList = [];//clear the list
	}

	//finds the method registeredto the object and calls it. Returns true if a function was found and executed
	callObjectsRegisteredMethod(object,methodName,param){
		let obFuncPair = this._eventMap[methodName].listenerList.getTest(function(objectToTest){//need new function here because objectToTest is {object,eventFunction}, not object
			return objectToTest.object === object;
		});
		if(obFuncPair!=null){
			obFuncPair.eventFunction.call(object,param);
			return true;
		}else{
			return false;
		}
	}


	setTarget(){
		var prevTarget = this._currentTarget;

		for(const obFuncPair of this._eventMap['acceptMouseTarget'].listenerList.reverseIterator()){//reversed so this method list and draw can have the same numbering system
	      	var potentialTarget = obFuncPair.object;
			if(obFuncPair.eventFunction.call(potentialTarget)){
				//object accepted. Target aquired
				this._currentTarget = potentialTarget;
				if(prevTarget!=this._currentTarget){
					// console.log('current target: ' + potentialTarget);
					this.doFunctionToAllObjects('currentTargetChanged',this._currentTarget);
				}
				
				return;
			}
	    }

		//no targets were found in the for loop
		if(prevTarget!=null){
			this._currentTarget = null;
			console.log('current target: nothing');
			this.doFunctionToAllObjects('currentTargetChanged',this._currentTarget);
		}
		
	}



	//objects added after this call with the method of the given name should have that method triggered every interval
	addTimer(name,periodMills){
		if(name in this._eventMap){
			console.log("timer with name: " + name + " already exists! nothing done");
			return;
		}
		if(periodMills<=0){
			console.log("period given <=0 : no timer added");
			return;
		}
		if(periodMills==null){
			console.log('periodMills not defined. defaulting to 1000 (1s)');
			periodMills = 1000;
		}
		

		this.addMethod(name);

		//make function
		var self = this;//need a local variable here because this means the window in the inline function
		var tickFunction = function(){
			self.doFunctionToAllObjects(name);
		};

		this._timerMap[name] = new Timer(tickFunction,periodMills);
		this.startTimer(name);
	}
	deleteTimer(name){
		if(!(name in this._eventMap)){
			console.log("could not find timer with name: " + name  + " to delete!");
			return;
		}else{
			this._timerMap[name].stop();
			delete this._timerMap[name];
			// delete this._eventMap[name];
			this.deleteMethod(name);
		}
		console.log(this._eventMap);
    	console.log(this._timerMap);
		
	}
	pauseTimer(name){
		if(name in this._timerMap){
			this._timerMap[name].stop();
		}else{
			console.log("could not find timer with name: " + name  + " to pause!");
			return;
		}
	}
	startTimer(name){
		if(name in this._timerMap){
			this._timerMap[name].start();
		}else{
			console.log("could not find timer with name: " + name  + " to start!");
			return;
		}

		
	}
	changeTimerInterval(name,newPeriod){
		//save the method list
		let methodList = this._eventMap[name];

		this.deleteTimer(name);
		this.addTimer(name,newPeriod);

		//put back
		this._eventMap[name] = methodList;
	}



	//period in miliseconds
	//call once only
	//enables the 'animationDataUpdate' timer
	//animated objects should register with 'animationDataUpdate' to update their data.
	//	Redraw is called right after, where they can draw slightly differently to the sceen.
	//this is useful for situations where there is not animations going on constantly and you want to
	//	not redraw when nothing is going on. For a game, just have a periodic redraw with a 'gameTick' timer
	enableAnimation(period){
		if(this._isAnimating) return;
		this._isAnimating = true;

		this.addTimer('animationDataUpdate',period);

		this.addTimer('animationDrawUpdate',period);//should only have one method in it
		this.addEventListener(this,'animationDrawUpdate',this._animationDrawUpdate);
	}

	// Not tested yet. Implement if needed.
	// disableAnimation(){
	// 	if(!this._isAnimating) return;
	// 	this._isAnimating = false;

	// 	this.deleteTimer('animationDataUpdate');

	// 	this.deleteTimer('animationDrawUpdate');//should only have one method in it
	// 	this.removeEventListener(this,'animationDrawUpdate',this._animationDrawUpdate);
	// }

	//triggers periodically. If there are any animations in the animationDataUpdate, then redraw
	_animationDrawUpdate(){
		if(!this._eventMap['animationDataUpdate'].listenerList.isEmpty()){//if there is something in it
			this._animationDrawUpdate.oldContainsSomething = true;//var contained inside this method
			this.worldView.redraw();
		}else{//it is empty
			if(this._animationDrawUpdate.oldContainsSomething){//had something last time
				this.worldView.redraw();//redraw one last time
				this._animationDrawUpdate.oldContainsSomething = false;
			}
		}
	}

}