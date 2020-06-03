export default class MS {

    private _mediaStream:MediaStream;
    private _constraints:MediaStreamConstraints;
    private _objectURL:string;

    constructor(constraints:MediaStreamConstraints){
        this._constraints = constraints;
    }

    public async start():Promise<void>{
        if(!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw Error("Webbrowser does not support user media.");
        let stream = await navigator.mediaDevices.getUserMedia(this._constraints);
        if(typeof stream !== "object") throw Error("No media stream found.");
        this._mediaStream = stream;
        return;
    }   

    public getStream():MediaStream|null{
        if(typeof this._mediaStream === "object") return this._mediaStream;
        return null;
    }

    public getURL():string|null{
        if(this._objectURL) return this._objectURL;
        if(!this._mediaStream) return null;
        this._objectURL = window.URL.createObjectURL(this._mediaStream);
        return this._objectURL;
    }

    public async stop():Promise<void>{
        if(typeof this._mediaStream !== "object") return;
        let tracks = this._mediaStream.getTracks();
        for(let i in tracks){
            tracks[i].stop();
        }       
        delete this._mediaStream;
        return;
    }

    public takeScreenshot(){}
}

/*

video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;

  */