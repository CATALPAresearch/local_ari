//@ts-ignore
import $ from "jquery";
import Tool from "./tool";

export default class Chatbot extends Tool{

    private _config:IChatbotConfig;
    private _messages:IMessage[] = [];

    constructor(config?:IChatbotConfig){
        super();
        if(config){
            this._config = config;
        } else {
            this._config = defConfig;
        }
        var bootstrap_enabled = (typeof $().modal == 'function'); 
        //console.log("BOOSTRAP "+bootstrap_enabled);
        //this._create();
    }
    
    private async _create(){
        $(document).ready(
            function(){
                let body = document.body;
                let bot = " \
                    <div class=\"d-flex flex-row-reverse fixed-bottom mb-2\"> \
                        <div class=\"col-md-3\"> \
                            <div class=\"card\"> \
                                <div class=\"card-header text-white bg-dark\"> \
                                    <a class=\"collapsed text-white d-block\" data-toggle=\"collapse\" href=\"#chatbot-collapse\" aria-expanded=\"true\" aria-controls=\"chatbot-collapse\" id=\"chatbot-head\"> \
                                        <i class=\"fa fa-chevron-down pull-right\"></i> \
                                        Chatbot \
                                    </a> \
                                </div> \
                                <div id=\"chatbot-collapse\" class=\"collapse show\" aria-labelledby=\"chatbot-collapse\"> \
                                    <div class=\"card-body\">Chat</div> \
                                    <div class=\"card-footer\"> \
                                        <div class=\"input-group\"> \
                                            <input id=\"btn-input\" type=\"text\" class=\"form-control input-sm\" placeholder=\"Tippe deine Antwort hier...\" />\
                                            <span class=\"input-group-btn\"> \
                                                <button class=\"btn btn-success btn-block\" id=\"btn-chat\">\
                                                    Senden \
                                                </button> \
                                            </span> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                ";                
                /*
                let container = document.createElement('div');
                container.innerHTML = bot;
                container.id = "chatbot";  
                container.classList.add("position-fixed");   
                body.prepend(container);
                */
                body.innerHTML += bot;
            }
        );
    }
}

interface IMessage{
    sender: string;
    message: string;
    time: Date;
}

export interface IChatbotConfig{

}

const defConfig:IChatbotConfig = {

}