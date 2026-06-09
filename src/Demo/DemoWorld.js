class DemoWorld extends World{
	constructor(){
		super();
		this._setPriorities();

		this.enableAnimation(30);

		this.debugMode = false;
		this.add(new DebugToggle('d',['Shift','Alt']));
		this.add(new DisplayUpdaterObject());
		
		// this.twoDCameraManipulator = new TwoDCameraManipulator();//added by graphs

        this.demoSwitcher = new DemoSwitcher();
        this.add(this.demoSwitcher);
        this.add(new DemoBack);
	}


	//override
	generateCamera(){
		return new MoveZoomCamera(0,0,60,-60);
	}

	//override
	doOnWorldViewSet(){
		super.doOnWorldViewSet();
		this.redrawAfter('mouseButtonDown');
		this.redrawAfter('mouseButtonUp');
		this.redrawAfter('mouseMoved');
		// this.redrawAfter('keyDown');//don't need. keyInput always comes right after and it will trigger redraw
		this.redrawAfter('keyUp');
		this.redrawAfter('keyInput');
		this.redrawAfter('scroll');
		this.redrawAfter('windowFocused');
		this.redrawAfter('windowDeFocused');
	}

	//low/negative priorities get called first except for acceptMouseTarget method where it tries the hightest priority drawn objects first
	_setPriorities(){
		this.priorities['DemoBack'] = -10000000000000;
		this.priorities['DemoObjects'] = 0;
	}

}