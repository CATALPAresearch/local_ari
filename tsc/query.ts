import { EToolType } from "./tool";

export class Query {

    private static _counter = 0;
    protected readonly id:number;
    private _prev?: Query;
    private _next?: Query;    

    constructor(prev?:Query){
        this.id = ++Query._counter;
        this.data = data;
        if(typeof prev === "object") this._prev = prev;
    }

    public createEntry(data:object):void{
        if(typeof this._next === "object") return this._next.createEntry(data);
        let elem = new Query(data, this);
        this._next = elem;
        return;
    }

    public getID():number{
        return this.id;  
    }

    public getElementByID(id:number):Query|null{
        let first = this.getFirst();
        if(first.getID() === id) return this;
        let next = this.getNext();
        while(next !== null){
            if(next.getID() === id) return this;
            next.getNext();
        }
        return null;
    }

    public deleteEntry():void{
        if(typeof this._next === "object" && typeof this._prev === "object"){
            this._next.setPrev(this._prev);
            this._prev.setNext(this._next);
        } else if(typeof this._next === "object"){
            this._next.unsetPrev();
        } else if(typeof this._prev === "object"){
            this._prev.unsetNext();
        }
        return;
    }

    public unsetNext():void{
        delete this._next;
        return;
    }

    public unsetPrev():void{
        delete this._prev;
        return;
    }

    public setNext(obj:Query):void{
        this._next = obj;
        return;
    }

    public setPrev(obj:Query):void{
        this._prev = obj;
        return;
    }

    public getNext():Query|null{
        return typeof this._next === "object"? this._next : null;
    }

    public getPrev():Query|null{
        return typeof this._prev === "object"? this._prev : null;
    }

    public getLast():Query{
        if(typeof this._next === "object") return this._next.getLast();
        return this;
    }

    public getFirst():Query{
        if(typeof this._prev === "object") return this._prev.getFirst();
        return this;
    }

}