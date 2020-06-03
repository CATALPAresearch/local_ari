var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MS {
        constructor(constraints) {
            this._constraints = constraints;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
                    throw Error("Webbrowser does not support user media.");
                let stream = yield navigator.mediaDevices.getUserMedia(this._constraints);
                if (typeof stream !== "object")
                    throw Error("No media stream found.");
                this._mediaStream = stream;
                return;
            });
        }
        getStream() {
            if (typeof this._mediaStream === "object")
                return this._mediaStream;
            return null;
        }
        getURL() {
            if (this._objectURL)
                return this._objectURL;
            if (!this._mediaStream)
                return null;
            this._objectURL = window.URL.createObjectURL(this._mediaStream);
            return this._objectURL;
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this._mediaStream !== "object")
                    return;
                let tracks = this._mediaStream.getTracks();
                for (let i in tracks) {
                    tracks[i].stop();
                }
                delete this._mediaStream;
                return;
            });
        }
        takeScreenshot() { }
    }
    exports.default = MS;
});
