/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */

import { Toolbox } from "./toolbox";
import Chatbot from "./tool_chatbot";
import { IConfig, Config } from "./ari_config";
import ActivityIndicator from "./tool_activityindicator";

export default class Controller{

    private _config:IConfig = Config;
    private _chatbot:Chatbot;

    constructor(){   
        console.log("=== CONTROLLER ===");   
        new ActivityIndicator({});
        this._chatbot = new Chatbot(this._config.chatbot);     
        
                  
    }

    public chatbot(){}

}