export class Tool extends Query{

    constructor(data:IToolData){
        super(data);
        
    }

}

export interface IToolData{
    test:string;
}