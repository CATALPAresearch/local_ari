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
    class Vibrate {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.duration !== "number" && typeof this._data.duration !== "object")
                return false;
            if (typeof this._data.duration === "object") {
                for (let i in this._data.duration) {
                    if (this._data.duration[i] < 0)
                        return false;
                }
            }
            else {
                if (this._data.duration < 0)
                    return false;
            }
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof navigator !== "object" || typeof navigator.vibrate !== "function")
                    throw new Error("No vibrate function found.");
                if (navigator.vibrate(this._data.duration) !== true)
                    throw new Error("Could not vibrate.");
                return;
            });
        }
    }
    exports.default = Vibrate;
});
