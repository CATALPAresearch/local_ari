
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description Generate a uniqid.
 * 
 */

export function uniqid():string{
    var date = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
}