var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CSS {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.selector !== "string" || this._data.selector.length <= 0)
                return false;
            if (typeof this._data.properties !== "object")
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let _this = this;
                return new Promise((resolve, reject) => {
                    jquery_1.default(document).ready(function () {
                        let selector = jquery_1.default(_this._data.selector);
                        if (selector.length <= 0)
                            return reject(new Error("Unknown selector"));
                        selector.css(_this._data.properties);
                        return resolve();
                    });
                });
            });
        }
    }
    exports.CSS = CSS;
});
