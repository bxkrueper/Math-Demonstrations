// Intermediary for I/O between Canvas and World
class WorldView{

  constructor(ctx) {
      if(ctx==null){
        throw "can't make worldView. Context is null!";
      }else{
        this._ctx = ctx;
      }

      this._ctxSetToWorld = false;

      this._redrawPending = false;
      this._redrawCheckInterval = 30;//how many miliseconds it takes to check if it should redraw. This is a throttle on how often redraws can happen
      this._mouseMovedPending = false;
      this._mouseDownTarget = null;
      this.defaultMouseMovedThrottlePeriod = 40;//This is a throttle on how often mouse updates can happen
      this.haveSetContextListeners = false;//only set them once
      this.HOLD_TIME = 600;//ms to hold until triggering touch hold event
      this.holdDistanceAllowed = 20;

      this._inputStatus = {"currentButtonDown":'none',"lastButtonType":"none","mouseInCanvas": false,
        "currentXCanvas":0,"currentYCanvas":0,"currentXWorld":0,"currentYWorld":0,
        "previousXCanvas":0,"previousYCanvas":0,"previousXWorld":0,"previousYWorld":0,
        currentKeys:new Set()
      };

      this._lastClickInfo = {
        number:0,
        canvasCords:{x:0,y:0},
        time:0,
        button:'none',
        target:null,
      };

      this._mousedown = this._getMouseDown();
      this._mouseup = this._getMouseup();
      this._mousemove = this._getMouseMoved();
      this._keydown = this._getKeydown();
      this._keyup = this._getKeyup();
      this._wheel = this._getWheel();
      this._mouseenter = this._getMouseenter();
      this._mouseleave = this._getMouseleave();
      this._resize_window = this._getResizeWindow();
      this._resize_canvas = this._getResizeCanvas();
      this._onfocusin = this._getOnfocusin();
      this._onfocusout = this._getOnfocusout();
      this._paste = this._getOnPaste();
      this._touchstart = this._getTouchStart();
      this._touchend = this._getTouchEnd();
      this._touchmove = this._getTouchMove();
  }

//functions to use when input happens
  get mouseButtonDown(){
    return this._mousedown;
  }
  get mouseButtonUp(){
    return this._mouseup;
  }
  //objects can call this to manually trigger a mouse moved event (like when the camera zooms, mouse is in a different world position)
  get mouseMoved(){
    return this._mousemove;
  }
  get keyDown(){
    return this._keydown;
  }
  get keyUp(){
    return this._keyup;
  }
  get scroll(){
    return this._wheel;
  }
  get mouseEnter(){
    return this._mouseenter;
  }
  get mouseLeave(){
    return this._mouseleave;
  }
  get resize_window(){
    return this._resize_window;
  }
  get resize_canvas(){
    return this._resize_canvas;
  }
  get onfocusin(){
    return this._onfocusin;
  }
  get onfocusout(){
    return this._onfocusout;
  }
  get touchStart(){
    return this._touchstart;
  }
  get touchEnd(){
    return this._touchend;
  }
  get touchMove(){
    return this._touchmove;
  }

  get ctx(){
    return this._ctx;
  }
  get canvas(){
    return this._ctx.canvas;
  }



//info getters

  //mouse button  expected 'none', 'left', 'middle', 'right'
  get currentButtonDown(){
    return this._inputStatus.currentButtonDown;
  }
  get lastButtonType(){
    return this._inputStatus.lastButtonType;
  }
  get mouseInCanvas(){
    return this._inputStatus.mouseInCanvas;
  }
  get currentXCanvas(){
    return this._inputStatus.currentXCanvas;
  }
  get currentYCanvas(){
    return this._inputStatus.currentYCanvas;
  }
  get currentXWorld(){
    return this._inputStatus.currentXWorld;
  }
  get currentYWorld(){
    return this._inputStatus.currentYWorld;
  }
  get previousXCanvas(){//last down
    return this._inputStatus.previousXCanvas;
  }
  get previousYCanvas(){//last down
    return this._inputStatus.previousYCanvas;
  }
  get previousXWorld(){//last down
    return this._inputStatus.previousXWorld;
  }
  get previousYWorld(){//last down
    return this._inputStatus.previousYWorld;
  }
  get lastXCanvas(){//location of last mouse event/////only being used by 3dCamera as of 2/17/23
    return this._inputStatus.lastXCanvas;
  }
  get lastYCanvas(){//location of last mouse event/////only being used by 3dCamera as of 2/17/23
    return this._inputStatus.lastYCanvas;
  }
  get lastXWorld(){//location of last mouse event
    return this._inputStatus.lastXWorld;
  }
  get lastYWorld(){//location of last mouse event
    return this._inputStatus.lastYWorld;
  }
  //returns the Set of current keys down
  get currentKeys(){
    return this._inputStatus.currentKeys;
  }

  //keyName: a,b,1,shift,...
  keyIsDown(keyName){
    return this._inputStatus.currentKeys.has(keyName);
  }

  get canvasWidth(){
    return this._ctx.canvas.width;
  }
  get canvasHeight(){
    return this._ctx.canvas.height;
  }

  get windowFocused(){
    return document.hasFocus();
  }

  get canvasFocused(){
    return this._ctx.canvas===document.activeElement;
  }

  _clickRemap = {
                'left':'left',
                'middle':'middle',
                'right':'right',
                'touch':'touch'
                };
  remapClick(actualClick,remapedClick){
    this._clickRemap[actualClick] = remapedClick;
  }
  getClickRemap(buttonType){
    return this._clickRemap[buttonType];
  }

//the functions to handle input events. These are called once by the constructor and remembered

  _getMouseDown(){
    var self = this;
    return function(event) {
      if(supportsTouch) return;
      var buttonType;
      switch(event.button){
        case 0: //left or touch
          buttonType = 'left';
        break;
        case 1: //middle
          buttonType = 'middle';
        break;
        case 2: //right
          buttonType = 'right';
        break;
      }
      buttonType = self._clickRemap[buttonType];

      self._mouseOrTouchDownFunc(self,buttonType,event.offsetX,event.offsetY);
      console.log(buttonType + " mouse button down");
    };
  }
  _mouseOrTouchDownFunc(self,buttonType,x,y){//buttonType: 'left','middle','right', or 'touch'
      switch(buttonType){
        case 'left':
          // event.preventDefault();//put here to prevent triple clicking highlighting another html thing
          //////not doing this on moble allows zooming, but causes double clicking on math objects and hold selects hamburger opener
          // Main.focusCanvas();//still want it to focus
        break;
        case 'middle':
          event.preventDefault();//stops middle mouse button scroll thing, but not right click context menu
          // Main.focusCanvas();//still want it to focus
        break;
        case 'right':

        break;
        case 'touch':
          
        break;
      }
      //only one mouse button is considered to be down at at time. Other button presses that occur during a button press are ignored
      if(self._inputStatus.currentButtonDown !== 'none') return;

      self._inputStatus.currentButtonDown = buttonType;
      self._inputStatus.lastButtonType = buttonType;

      self._inputStatus.previousXCanvas = x;
      self._inputStatus.previousYCanvas = y;
      self._inputStatus.previousXWorld = self._world.camera.canvasXToWorldX(x);
      self._inputStatus.previousYWorld = self._world.camera.canvasYToWorldY(y);

      self._mouseDownTarget = self.world.currentTarget;

      self._world.doFunctionToAllObjects('mouseButtonDown',buttonType);
  }
  _getMouseup(){
    
    var self = this;
    return function(event) {
      if(supportsTouch) return;

      var buttonType;
      switch(event.button){
        case 0: //left
          buttonType = 'left';
        break;
        case 1: //middle
          buttonType = 'middle';
        break;
        case 2: //right
          buttonType = 'right';
        break;
      }
      buttonType = self._clickRemap[buttonType];

      self._mouseOrTouchUpFunc(self,buttonType);
      console.log(buttonType + " mouse button up");
    };
  }
  _mouseOrTouchUpFunc(self,buttonType){//buttonType: 'left','middle','right', or 'touch'
    if(self._inputStatus.currentButtonDown == buttonType){//only trigger if mouse up was the same button that is registered to be down
      self._inputStatus.currentButtonDown = 'none';//////////move below doFunctionToAllObjects?

      self._clickLogicForMouseUp(buttonType);
      self._world.doFunctionToAllObjects('mouseButtonUp',buttonType);
    }
  }
  _clickLogicForMouseUp(buttonType){
    const maxTimeBetweenMultiClick = 500;//ms
    const maxDistanceBetweenDownAndUp = 10;
    const maxDistanceBetweenMultiClick = 5;
    let distanceBetweenUpAndDown = Math.hypot(this.currentXCanvas-this.previousXCanvas,this.currentYCanvas-this.previousYCanvas);
    let distanceBetweenLastClick = Math.hypot(this.currentXCanvas-this._lastClickInfo.canvasCords.x,this.currentYCanvas-this._lastClickInfo.canvasCords.y);
    if(this._mouseDownTarget === this.world.currentTarget && distanceBetweenUpAndDown<maxDistanceBetweenDownAndUp){
      //there was a click
      let currentTime = new Date().getTime();

      //update
      if(currentTime<this._lastClickInfo.time+maxTimeBetweenMultiClick){
        this._lastClickInfo.number++;
        if(this._lastClickInfo.number>3) this._lastClickInfo.number=2;//spam clicking will alternate between triple and double clicks
      }else{
        this._lastClickInfo.number = 1;
      }
      
      this._lastClickInfo.canvasCords = {x:this.currentXCanvas,y:this.currentYCanvas};
      this._lastClickInfo.time = currentTime;
      let oldButtonType = this._lastClickInfo.button;
      this._lastClickInfo.button = buttonType;

      console.log('click');
      this.world.callObjectsRegisteredMethod(this.world.currentTarget,'mouseClicked',buttonType);
      // this.world.doFunctionToAllObjects('mouseClicked',buttonType);/////////??????do for all clicks?
      if(distanceBetweenLastClick<maxDistanceBetweenMultiClick && oldButtonType===buttonType){
        if(this._lastClickInfo.number===2){
          console.log('double click');
          // this.clearSelection();
          this.world.callObjectsRegisteredMethod(this.world.currentTarget,'mouseDoubleClicked',buttonType);
          // this.world.doFunctionToAllObjects('mouseDoubleClicked',buttonType);
        }
        else if(this._lastClickInfo.number===3){
          console.log('triple click');
          // this.clearSelection();
          this.world.callObjectsRegisteredMethod(this.world.currentTarget,'mouseTripleClicked',buttonType);
          // this.world.doFunctionToAllObjects('mouseTripleClicked',buttonType);
        }
      }
    }
    this._mouseDownTarget = null;
  }
  

  _getMouseMoved(){
    const self = this;
    return function(event){//this function is called whenever the mouse is moved just a little bit

      if(event!=null) self._mouseOrTouchMovedFunc(self,event.offsetX,event.offsetY);
    };
  }
  _mouseOrTouchMovedFunc(self,x,y){
    // if(event!=null){
      self._immediateXCanvas = x;
      self._immediateYCanvas = y;
    // }
    self._mouseMovedPending = true;
  }


  _keyToKeyName(key){
    if(key.length===1 && key.toUpperCase() != key.toLowerCase()){
      return key.toLowerCase();
    }
    return key;
  }
  _getKeydown(){
    var self = this;
    return function(event) {
      //////////var keyValue = WorldView._keyCodeToStirngMap[event.keyCode];
      if(['Space',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab','/','Alt'].includes(event.key)){///both Space and ' '?
        event.preventDefault();//stops the page from scrolling with the space bar or arrow keys,tab from defocusing, '/' firefox from opening search
      }
      if(self.keyIsDown('Control') && ['a'].includes(event.key)){
        event.preventDefault();
      }
      

      //only fire keydown in world if this was the first event for that key
      let keyName = self._keyToKeyName(event.key);
      if(self._inputStatus.currentKeys.has(keyName)){
        //do nothing
      }else{
        self._inputStatus.currentKeys.add(keyName);

        console.log("key down: " + keyName);

        self._world.doFunctionToAllObjects('keyDown',keyName);
      }


      //keydown in canvas event listener still triggers constantly after key is held. This is called keyInput in world
      console.log("key input: " + keyName);
      self._world.doFunctionToAllObjects('keyInput',keyName);

      //string input
      // let inputtedChar = self._getCharTyped(event.key,self.keyIsDown('Shift'),event.getModifierState("CapsLock"));
      // if(inputtedChar!=null){
      //   console.log("stringInput (char): '" + inputtedChar + "'");
      //   self._world.doFunctionToAllObjects('stringInput',inputtedChar);
      // }
      if(event.key.length===1 && !self.keyIsDown('Control') && !self.keyIsDown('Alt')){
        console.log("stringInput (char): '" + event.key + "'");
        self._world.doFunctionToAllObjects('stringInput',event.key);
      }


      if(keyName==='v' && !MyAlgs.canPaste && self.keyIsDown('Control')){
        console.log('force paste');
        self._world.doFunctionToAllObjects('pasteText',MyAlgs.personalClipboard);
      }

    };
  }
  _getKeyup(){
    var self = this;
    return function(event) {
      ///////var keyValue = WorldView._keyCodeToStirngMap[event.keyCode];
      let keyName = self._keyToKeyName(event.key);
      self._inputStatus.currentKeys.delete(keyName);

      console.log("key up: " + keyName);

      self._world.doFunctionToAllObjects('keyUp',keyName);
      

      //console.log(Array.from(self._inputStatus.currentKeys).join(','));
    };
  }
  _getWheel(){
    var self = this;
    return function(event){
      var direction = event.deltaY<0?'up':'down';
      self._world.doFunctionToAllObjects('scroll',direction);

      // console.log('wheelDeltaX: ' + event.wheelDeltaX);
      // console.log('wheelDeltaY: ' + event.wheelDeltaY);

      event.preventDefault();//stops the page from scrolling
      console.log("scroll " + direction);
      if(self.world.currentTarget!=null){
        let executed = self.world.callObjectsRegisteredMethod(self.world.currentTarget,'scrollOn',direction);
        if(executed) console.log('scrollOn')
      }
    };
  }
  _getMouseenter(){
    var self = this;
    return function(){
      console.log("mouse entered canvas");
      self._inputStatus.mouseInCanvas = true;
    };
  }
  _getMouseleave(){
    var self = this;
    return function(){
      console.log("mouse left canvas");
      if(self.currentButtonDown!='none') self._world.doFunctionToAllObjects('mouseButtonUp',self.currentButtonDown);//tell world the mouse button went up even though it may not have
      self._inputStatus.mouseInCanvas = false;
      self._inputStatus.currentButtonDown = 'none';//////////clean up. put input functions in seperate methods
    };
  }
  _getResizeWindow(){
    var self = this;
    return function(){
      self._world.doFunctionToAllObjects('resize_window');
      self._redrawNow();//canvas automatically clears on resize, so this should be called afterwards no mater what
    };
  }
  _getResizeCanvas(){
    var self = this;
    return function(){
      var rect = self._ctx.canvas.getBoundingClientRect();//absolute position of ctx
      console.log('canvas resized: ',rect.top, rect.right, rect.bottom, rect.left);
      
      //update camera info
      self._world.camera.canvasWidth = self._ctx.canvas.width;
      self._world.camera.canvasHeight = self._ctx.canvas.height;

      self._world.doFunctionToAllObjects('resize_canvas');
      self._redrawNow();//canvas automatically clears on resize, so this should be called afterwards no mater what
    };
  }
  _getOnfocusin(){
    var self = this;
    return function(){
      console.log("window re-focused!:");
      self._world.doFunctionToAllObjects('windowFocused');
    };
  }
  _getOnfocusout(){
    var self = this;
    return function(){
      console.log("window de-focused!:");
      self._world.doFunctionToAllObjects('windowDeFocused');

      //clear memory of current keys down
      //call keyUp  and mouse methods?
      // for (const keyValue of self._inputStatus.currentKeys) {////needed?
      //   console.log("key up: " + keyValue);
      //   self._world.doFunctionToAllObjects('keyUp',keyValue);
      // }
      self._inputStatus.currentKeys.clear();

      // if(self.currentButtonDown!='none'){////needed?
      //   self._world.doFunctionToAllObjects('mouseButtonUp',self.currentButtonDown);//tell world the mouse button went up even though it may not have
      //   self._inputStatus.mouseInCanvas = false;
      //   self._inputStatus.currentButtonDown = 'none';//////////clean up. put input functions in seperate methods
      // }
      
    };
  }
  _getOnPaste(){
    var self = this;
    return function(event){
      event.preventDefault();
      event.stopPropagation();

      const dT = event.clipboardData || window.clipboardData;
      let items = dT.items;
      for(let i=0;i<items.length;i++){
        let dataTransferItem = items[i];
        if(dataTransferItem.kind==='string' && dataTransferItem.type === 'text/plain'){
          let text = event.clipboardData.getData('Text');
          console.log("pasted text in canvas: " + text);
          self._world.doFunctionToAllObjects('pasteText',text);
        }
        if(dataTransferItem.kind==='file'){
          var blob = dataTransferItem.getAsFile();
          var reader = new FileReader();
          reader.onload = function(readerEvent){
            console.log(readerEvent.target.result);
            let image = new Image();
            image.onload = function(){
              self._world.doFunctionToAllObjects('pasteImage',image);
              // self.world.getObjectByName('DrawLayer').pasteImage(image,200,200);
            };
            image.src = readerEvent.target.result;
            
          }; // data url!
          reader.readAsDataURL(blob);

          console.log("pasted picture in canvas: ");
        }
      }



      // let type = dT.types[0];
      

      // if(type==='text/plain'){
      //   let text = event.clipboardData.getData('Text');
      //   console.log("pasted text in canvas: " + text);
      //   self._world.doFunctionToAllObjects('paste',text);
      //   return;
      // }
      // if(type==='text/html'){
        
      // }
      // if(type==='Files'){
      //   let file = dT.files[0];
      //   if(file.type==='image/png'){
      //     console.log("pasted picture in canvas: " + file);

      //   }
      // }
      
    };
  }

  _getTouchStart(){
    var self = this;
    return function(event) {
      var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      let canvasRect = self._ctx.canvas.getBoundingClientRect();//to help make position of input relative to canvas
      
      self._immediateXCanvas = touch.pageX-canvasRect.left;
      self._immediateYCanvas = touch.pageY-canvasRect.top;
      self._mouseMovedNow();

      self._setHoldTimeout();

      let buttonType = self._clickRemap['touch'];
      self._mouseOrTouchDownFunc(self,buttonType,touch.pageX-canvasRect.left,touch.pageY-canvasRect.top);
      console.log("touch down");
    };
  }
  _getTouchEnd(){
    var self = this;
    return function(event) {
      self._clearHoldTimeout();
      let buttonType = self._clickRemap['touch'];
      self._mouseOrTouchUpFunc(self,buttonType);
      console.log("touch up");
    };
  }

  _setHoldTimeout(){
    let self = this;
    self._clearHoldTimeout();
    self._touchHoldTimeout = window.setTimeout(function(){
      self._world.doFunctionToAllObjects('touchHold');
      console.log('Touch hold');
    },self.HOLD_TIME);
  }
  _clearHoldTimeout(){
    if(this._touchHoldTimeout!=null){
      clearTimeout(this._touchHoldTimeout);
      this._touchHoldTimeout = null;
    }
  }

  _getTouchMove(){
    const self = this;
    return function(event){//this function is called whenever the touch is moved just a little bit
      let evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
      let touch = evt.touches[0] || evt.changedTouches[0];
      let canvasRect = self._ctx.canvas.getBoundingClientRect();//to help make position of input relative to canvas
      self._immediateXCanvas = touch.pageX-canvasRect.left;
      self._immediateYCanvas = touch.pageY-canvasRect.top;

      if(self._touchHoldTimeout!=null && Math.hypot(self._immediateXCanvas-self.previousXCanvas,self._immediateYCanvas-self.previousYCanvas)>self.holdDistanceAllowed){
        self._clearHoldTimeout();
      }
    
      self._mouseOrTouchMovedFunc(self,self._immediateXCanvas,self._immediateYCanvas);
    };
  }




//called when the world is set
/////////call some or all in constructor?  (world is null then)   if I want to change the world, this might need work.
  setContextListeners(){
    let self = this;

    this._ctx.canvas.addEventListener('mousedown', this.mouseButtonDown);
    this._ctx.canvas.addEventListener('mouseup', this.mouseButtonUp);
    this._ctx.canvas.addEventListener('mousemove', this.mouseMoved);
    this._ctx.canvas.addEventListener('keydown', this.keyDown,false);
    this._ctx.canvas.addEventListener('keyup', this.keyUp,false);
    this._ctx.canvas.addEventListener('wheel', this.scroll,false);
    this._ctx.canvas.addEventListener('mouseenter', this.mouseEnter);
    this._ctx.canvas.addEventListener('mouseleave', this.mouseLeave);
    this._ctx.canvas.addEventListener('focusin', this.onfocusin);
    this._ctx.canvas.addEventListener('focusout', this.onfocusout);
    this._ctx.canvas.addEventListener('paste', this._paste);
    window.addEventListener("resize", this.resize_window);
    // this._ctx.canvas.addEventListener('resize', this.resize_canvas);//didn't work when manually setting width and height
    const resizeObserver = new ResizeObserver(entries => {
			self.resize_canvas();
		});
		resizeObserver.observe(this._ctx.canvas);
    this._ctx.canvas.addEventListener('touchstart', this.touchStart);
    this._ctx.canvas.addEventListener('touchend', this.touchEnd);
    this._ctx.canvas.addEventListener('touchmove', this.touchMove);

    //redraw throttle   ///make settable like mouse throttle?
    setInterval(function(){
      if(self._redrawPending){
        self._redrawNow();
      }
      
      } , this._redrawCheckInterval);
    //mouseMoved throttle
    this.mouseMovedThrottlePeriod = this.defaultMouseMovedThrottlePeriod;

    //make canvas focus  
    this._ctx.canvas.setAttribute('tabindex','0');
    window.scroll(0, 0);//put scroll back to top

    //disable right click context menu in the canvas
    this._ctx.canvas.addEventListener("contextmenu", function(event){
      event.preventDefault();
    }, false);
  }


  set mouseMovedThrottlePeriod(periodMills){
    this._mouseMovedThrottlePeriod = periodMills;
    let self = this;

    if(this._mouseThrottleID!=null){
      clearInterval(this._mouseThrottleID);//remove current interval
      this._mouseThrottleID = null;
    }

    //set new interval
    this._mouseThrottleID = setInterval(function(){
      if(self._mouseMovedPending){
        self._mouseMovedNow();
      }
      
      } , this._mouseMovedThrottlePeriod);
  }
  get mouseMovedThrottlePeriod(){
    return this._mouseMovedThrottlePeriod;
  }


  get world(){
    return this._world;
  }
  set world(world){
    this._world = world;

    let self = this;
    this._world.worldView = self;

    this._world.camera.canvasWidth = this._ctx.canvas.width;
    this._world.camera.canvasHeight = this._ctx.canvas.height;

    this._world.doOnWorldViewSet();
    
    if(!this.haveSetContextListeners){
      this.setContextListeners();
      this.haveSetContextListeners = true;
    }
  }

  getTextLength(text,textSize,fontName){
    this._ctx.font = textSize + 'px ' + fontName;
    return this._ctx.measureText(text).width;
  }

  

  redraw(){
    this._redrawPending = true;
  }

  _redrawNow(){
    // console.log('redrawing...');
    try{
      //clear the canvas
      this.canvasMode();
      this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
///////////////////////////////don't separate draw world and draw canvas? just use canvasMode and worldMode instead
///////////////////////////////store the transformed matrix on the first worldMode call and use that?
      this.worldMode();
      this._world.doFunctionToAllObjects('drawWorld',this._ctx);//add draw world objects assume the canvas has been transformed to world coordinates
      this.canvasMode();

      this._world.doFunctionToAllObjects('drawCanvas',this._ctx);//canvas context has been reverted back to canvas coordinates (origin top left, +x right, +y down)
    }catch(err){
      console.log(err);
    }finally{
      this._redrawPending = false;
    }
    
  }

  canvasMode(){
    if(this._ctxSetToWorld){
      this._ctxSetToWorld = false;
      // this._ctx.restore();
      this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  worldMode(){
    if(this._ctxSetToWorld){
      return;
    }
    this._ctxSetToWorld = true;
    // this._ctx.save();
    this._world.camera.setTransformContext(this._ctx);
  }

  

  _mouseMovedNow(){
    const self = this;

    // let currentTime = Date.now();
    // console.log('time: ' + (currentTime-this.timeLast));
    // this.timeLast = currentTime;
    
    self._inputStatus.lastXCanvas = self._inputStatus.currentXCanvas;
    self._inputStatus.lastYCanvas = self._inputStatus.currentYCanvas;
    self._inputStatus.lastXWorld = self._inputStatus.currentXWorld;
    self._inputStatus.lastYWorld = self._inputStatus.currentYWorld;

    self._inputStatus.currentXCanvas = self._immediateXCanvas;
    self._inputStatus.currentYCanvas = self._immediateYCanvas;

    //put here instead of non-now method to reduce conversion calculations
    self._inputStatus.currentXWorld = self._world.camera.canvasXToWorldX(self._inputStatus.currentXCanvas);
    self._inputStatus.currentYWorld = self._world.camera.canvasYToWorldY(self._inputStatus.currentYCanvas);



    self.world.setTarget();//the target object is updated every time the mouse is moved



    try{
      this._world.doFunctionToAllObjects('mouseMoved');
    }catch(err){
      console.log(err);
    }finally{
      this._mouseMovedPending = false;
    }
    
    
    console.log("mouse moved");
  }

  // _getCharTyped(key){
  //   if(['Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Shift','Alt','Control','Tab','CapsLock','Backspace','Delete','PageUp','PageDown','End','Insert','Home','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Escape'].includes(event.key)){
  //     return null;
  //   }
  //   if(this.keyIsDown('Control')||this.keyIsDown('Alt')){
  //     return null;
  //   }
  //   return key;
  // }



}