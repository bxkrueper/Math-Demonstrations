class SortedLinkedList{
	constructor(){
		this._head = null;
		this._tail = null;
	}

	add(obj,priority = 0){
		let node = {object:obj,priority:priority,next:null,prev:null};
		this._addNode(node);
	}

	_addNode(node){
		if(this.isEmpty()){
			this._head = node;
			this._tail = node;
		}else{
			let currentNode = this._getInsertionNode(node.priority);

			this._insertNodeAfter(currentNode,node);
		}
	}

	_insertNodeAfter(baseNode,nodeToInsert){
		if(baseNode==null){
			//add at the beginning
			nodeToInsert.next = this._head;
			nodeToInsert.prev = null;
			this._head.prev = nodeToInsert;
			this._head = nodeToInsert;
		}else{//order at end should be: currrentNode, node, 3rd
			nodeToInsert.next = baseNode.next;//may be null, but that is fine here
			nodeToInsert.prev = baseNode;
			baseNode.next = nodeToInsert;
			//re-assign the 3rd node's prev, if it exists
			if(nodeToInsert.next==null){
				this._tail = nodeToInsert;
			}else{
				nodeToInsert.next.prev = nodeToInsert;
			}
		}
	}

	//deletes the first object it finds
	delete(object){
		const test=this._getTestForObjectEqualsFunction(object);

		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				this._deleteNode(currentNode);
				return;
			}
			currentNode = currentNode.next;
		}
	}

	//same as delete, but deletes everything that matches instead of stopping at one
	deleteAllOf(object){
		const test=this._getTestForObjectEqualsFunction(object);

		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				this._deleteNode(currentNode);
			}
			currentNode = currentNode.next;
		}
	}

	//does for all    //input: function(object)
	deleteAllThat(test){
		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				this._deleteNode(currentNode);
			}
			currentNode = currentNode.next;
		}
	}

	//input: test(object)
	//returns true/false
	containTest(test){
		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				return true;
			}
			currentNode = currentNode.next;
		}
		return false;
	}

	//returns the first object that passes the test, or undefined if it can't find it
	getTest(test){
		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				return currentNode.object;
			}
			currentNode = currentNode.next;
		}
		return null;
	}

	//input: test(object)
	_findNodeThat(test){
		let currentNode = this._head;
		while(currentNode!=null){
			if(test(currentNode.object)){
				return currentNode;
			}
			currentNode = currentNode.next;
		}
		return null;
	}

	_getTestForObjectEqualsFunction(object){
		return function(objectToTest){
			return object===objectToTest;
		};
	}

	//does not mess with nodeToDelete's next and prev. they will still be used before nodeToDelete is forgotten
	_deleteNode(nodeToDelete){
		if(nodeToDelete==null){
			return;
		}

		//deal with previous
		if(nodeToDelete.prev!=null){
			nodeToDelete.prev.next = nodeToDelete.next;
		}

		//deal with next
		if(nodeToDelete.next!=null){
			nodeToDelete.next.prev = nodeToDelete.prev;
		}

		//reassign head and tail if needed
		if(nodeToDelete==this._head){
			this._head = nodeToDelete.next;
		}
		if(nodeToDelete==this._tail){
			this._tail = nodeToDelete.prev;
		}
	}

	//only works for the first object it finds that matches
	getPriority(object){
		let node = this._findNodeThat(this._getTestForObjectEqualsFunction(object));
		return node.priority;
	}

	//only works for the first object it finds that matches
	changePriority(object,newPriority){
		let node = this._findNodeThat(this._getTestForObjectEqualsFunction(object));
		this._deleteNode(node);
		node.priority = newPriority;
		this._addNode(node);
	}

	*iterator(){
		let currentNode = this._head;
		while(currentNode!=null){
			yield currentNode.object;
			currentNode = currentNode.next;
		}
		return;
	}
	*reverseIterator(){
		let currentNode = this._tail;
		while(currentNode!=null){
			yield currentNode.object;
			currentNode = currentNode.prev;
		}
		return;
	}


	isEmpty(){
		return this._head==null;
	}

	//returns node that is closest to the tail that is less than or equal to the target priority. returns null if the inertion point should be at the front
	_getInsertionNode(priority){
		if(this.isEmpty() || priority<this._head.priority){
			return null;
		}
		if(priority>=this._tail.priority){
			return this._tail;
		}
		let currentNode = this._tail;
		while(currentNode.prev != null && currentNode.prev.priority>priority){
			currentNode = currentNode.prev;
		}
		return currentNode.prev;
		
	}
}