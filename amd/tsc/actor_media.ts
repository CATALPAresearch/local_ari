class CMediaStream{

    protected _mediaStream:MediaStream|null = null;
    protected _options?:MediaStreamConstraints;

    constructor(options?:MediaStreamConstraints){
        this._options = options;
    }  

    public getStream():MediaStream|null{
        return this._mediaStream;
    }

    public async stop():Promise<void>{
        if(this._mediaStream === null) return;
        let tracks = this._mediaStream.getTracks();
        for(let i in tracks){
            tracks[i].stop();
        }
        this._mediaStream = null;
        return;    
    }
}




/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200901
 * @description Accessing the user's webcam after he grants permission.
 * 
 */

export class Webcam extends CMediaStream{    

    constructor(options?:MediaStreamConstraints){
        options = Object.assign(options, {video: true});
        super(options);
    }        

    public async start():Promise<void>{
        if(typeof navigator.mediaDevices !== "object" || typeof navigator.mediaDevices.getUserMedia !== "function") throw new Error("Browser does not support media devices.");       
        this._mediaStream = await navigator.mediaDevices.getUserMedia(this._options);
        return;
    }

}

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200901
 * @description Capture user's screen after he grants permission.
 * 
 */

export class ScreenSharing extends CMediaStream{

    constructor(options?:MediaStreamConstraints){
        super(options);
    }        

    public async start():Promise<void>{
        //@ts-ignore
        if(typeof navigator.mediaDevices !== "object" || typeof navigator.mediaDevices.getDisplayMedia !== "function") throw new Error("Browser does not support screen capturing.");       
        //@ts-ignore
        this._mediaStream = await navigator.mediaDevices.getDisplayMedia(this._options);
        return;
    }

}

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200901
 * @description Accessing the user's microphone after he grants permission.
 * 
 */

export class Audio extends CMediaStream{
    constructor(options?:MediaStreamConstraints){
        options = Object.assign(options, {audio: true, video: false});
        super(options);
    }        

    public async start():Promise<void>{        
        if(typeof navigator.mediaDevices !== "object" || typeof navigator.mediaDevices.getUserMedia !== "function") throw new Error("Browser does not support media devices.");       
        this._mediaStream = await navigator.mediaDevices.getUserMedia(this._options);
        return;
    }
}

