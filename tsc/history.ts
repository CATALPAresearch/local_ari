
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class History{

    public static goForward(steps?:number){
        if(steps){
            if(steps < 0) steps = steps * (-1);
            window.history.go(steps);
        } else {
            history.forward();
        }        
    }

    public static goBack(steps?:number){
        if(steps){
            if(steps > 0) steps = steps * (-1);
            window.history.go(steps);
        } else {
            history.back();
        }        
    }

}