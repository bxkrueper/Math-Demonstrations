class DebugToggle{

	//keyName: ex- 'd'   keysToHoldDown: ex- ['Shift','Control'];
	constructor(keyName,keysToHoldDown){
		this._keyName = keyName;
		this._keysToHoldDown = keysToHoldDown;
	}
	

	doOnAdd(){
		this.world.addEventListener(this,'keyDown',this.keyDown);
	}

	keyDown(keyName){
		if(keyName==this._keyName && this._allKeysHeldDown()){
			this.world.debugMode = !this.world.debugMode;
			if(this.world.debugMode){
				console.log('enabled debug mode');
			}else{
				console.log('disabled debug mode');
			}
		}
	}

	_allKeysHeldDown(){
		let world = this.world;
		return this._keysToHoldDown.every(function(value, index, array){
			return world.worldView.keyIsDown(value);
		});
	}
}