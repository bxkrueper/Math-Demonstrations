class DemoSwitcher{

	constructor(){
        this.storage = {};
	}

	//Override
	doOnAdd(){
		

        let hash = window.location.hash;//use hash fragment in url
        let name = hash.substring(1);
        if(hash.length>0 && hash[0]==='#'){
            
            this.activeObject = this.getObjectFromName(name);
        }
        if(this.activeObject==null){
            this.activeObject = this.getObjectFromName('none');
            window.location.hash = '';//to show invalid hash
        }
        if(!this.activeObject.isNullObject){
            document.getElementById("demoSelect").value = name;
        }


		this.addObjectMaybeLoad(this.activeObject);
	}

    optionSelected(){
        let demoSelect = document.getElementById("demoSelect");
		let choice = demoSelect.value;
        let newObject = this.getObjectFromName(choice);

        this.world.delete(this.activeObject);
        this.activeObject = newObject;
        this.addObjectMaybeLoad(newObject);

        window.location.hash = choice;
    }

    optionUpdated(htmlElement){
        this.activeObject?.optionUpdated(htmlElement);
        this.world.worldView.redraw();
    }

    getObjectFromName(name){
        if(this.storage[name]!=null) return this.storage[name];

        let object;
        switch(name){
            case "none": object = new NullObject();break;
            case "ASS_Triangle": object = new ASS_Triangle(); break;
            case "Unit_Circle": object = new UnitCircle(); break;
            case "Triangle_Centers": object = new TriangleCenters(); break;

            default: return null;
        }

        this.storage[name] = object;
        return object;
    }


    addObjectMaybeLoad(newObject){
        let world = this.world;
        if(newObject.isT){
            loadScript('src/MyLibraries/LinearAlgebra.js',function(){
                world.add(newObject);
                world.worldView.redraw();
            });
        }else{
            this.world.add(newObject);
        }
    }

}