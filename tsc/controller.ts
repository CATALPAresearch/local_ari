/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */

import { Toolbox } from "./toolbox";

export default class Controller{

    constructor(){        
        alert("test");
        console.log("=== CONTROLLER ===");
        Toolbox.highlight();
    }

}