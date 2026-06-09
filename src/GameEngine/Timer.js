class Timer{
	constructor(func,periodMills){
		this._func = func;
		this._periodMills = periodMills;
		this._id = -1;
	}

	start(){
		if(this.running()){
			console.log('timer already running');
		}else{
			this._id = setInterval(this._func,this._periodMills);//starts the timer and saves its id
			console.log("timer started");
		}
	}
	stop(){
		if(this.running()){
			clearInterval(this._id);
			this._id = -1;
			console.log("timer stopped");
		}else{
			console.log('timer already stopped');
		}
		
	}

	running(){
		return (this._id != -1);
	}

	toString(){
		return "timer " + periodMills;
	}
}