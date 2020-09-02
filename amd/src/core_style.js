var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StyleHandler = void 0;
    class StyleHandler {
        static processList(list) {
            return __awaiter(this, void 0, void 0, function* () {
                let push = [];
                for (let i in list) {
                    let obj = list[i];
                    if (obj.value) {
                        push.push(this.style(obj).catch(() => { return Promise.resolve(); }));
                    }
                    else if (obj.params) {
                        push.push(this.animate(obj).catch(() => { return Promise.resolve(); }));
                    }
                }
                Promise.all(push);
            });
        }
        static style(data) {
            return __awaiter(this, void 0, void 0, function* () {
                let func = function () {
                    if (data.duration) {
                        let old = $(data.selector).css(data.property);
                        $(data.selector).css(data.property, data.value).delay(data.duration).css(data.property, old);
                    }
                    else {
                        $(data.selector).css(data.property, data.value);
                    }
                };
                if (data.documentReady) {
                    $(document).ready(func);
                }
                else {
                    func();
                }
            });
        }
        static animate(data) {
            return __awaiter(this, void 0, void 0, function* () {
                let func = function () {
                    $(data.selector).animate(data.params, data.duration);
                };
                if (data.documentReady) {
                    $(document).ready(func);
                }
                else {
                    func();
                }
            });
        }
    }
    exports.StyleHandler = StyleHandler;
});
//# sourceMappingURL=../tsc/@maps/core_style.js.map