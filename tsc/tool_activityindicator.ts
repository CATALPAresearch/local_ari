//@ts-ignore
import $ from "jquery";
import Tool from "./tool";

export default class ActivityIndicator extends Tool{

    private _config:IActivityIndicatorConfig;

    constructor(config?:IActivityIndicatorConfig){
        super();
        if(config){
            this._config = config;
        } else {
            this._config = defConfig;
        }
        this._createLine("div.longpage-container");
    }

    public _createLine(selector:string){
        $(document).ready(
            function(){
                alert("hi");
            }
        );
    }


}

export interface IActivityIndicatorConfig{

}

const defConfig:IActivityIndicatorConfig = {

}