var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "jquery", "jqueryui"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DOMVPTracker = void 0;
    class DOMVPTracker {
        constructor(jQuerySelector, index = 0) {
            this._onEvent = () => {
                window.clearTimeout(this._timer);
                if (typeof this._timeout === "number") {
                    this._timer = window.setTimeout(() => {
                        this.get().then((resolve) => {
                            if (this._last) {
                                if (!this._deepEquality(this._last, resolve) && this._callback) {
                                    this._last = resolve;
                                    this._callback(Object.assign({}, resolve, { date: new Date().getTime() }));
                                }
                            }
                            else {
                                this._last = resolve;
                                if (this._callback)
                                    this._callback(Object.assign({}, resolve, { date: new Date().getTime() }));
                            }
                        });
                    }, this._timeout);
                }
            };
            const e = $(jQuerySelector).get(index);
            this._element = e;
        }
        _deepEquality(o1, o2) {
            const keys1 = Object.keys(o1);
            const keys2 = Object.keys(o2);
            if (keys1.length !== keys2.length)
                return false;
            for (const key of keys1) {
                const val1 = o1[key];
                const val2 = o2[key];
                const areObj = val1 !== null && typeof val1 === "object" && val2 !== null && typeof val2 === "object";
                if ((areObj && !this._deepEquality(val1, val2)) || (!areObj && val1 !== val2))
                    return false;
            }
            return true;
        }
        _isHidden() {
            return window.getComputedStyle(this._element).display === "none" || window.getComputedStyle(this._element).visibility === "hidden";
        }
        startTracking(timeout, callback) {
            this._timeout = timeout;
            this._callback = callback;
            window.removeEventListener("scroll", this._onEvent);
            window.addEventListener("scroll", this._onEvent);
            window.removeEventListener("resize", this._onEvent);
            window.addEventListener("resize", this._onEvent);
            document.documentElement.removeEventListener("DOMSubtreeModified", this._onEvent);
            document.documentElement.addEventListener("DOMSubtreeModified", this._onEvent);
        }
        stopTracking() {
            window.removeEventListener("scroll", this._onEvent);
            window.removeEventListener("resize", this._onEvent);
            document.documentElement.removeEventListener("DOMSubtreeModified", this._onEvent);
        }
        get() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this._element !== "object" || !(this._element instanceof HTMLElement))
                    throw new Error("No valid HTMLElement.");
                const b = this._element.getBoundingClientRect();
                const vpw = (window.innerWidth || document.documentElement.clientWidth);
                const vph = (window.innerHeight || document.documentElement.clientHeight);
                let e = {
                    element: this._element,
                    dimensions: {
                        height: b.height,
                        width: b.width
                    },
                    viewport: {
                        width: vpw,
                        height: vph
                    },
                    position: {
                        top: b.top,
                        left: b.left,
                        right: b.right,
                        bottom: b.bottom,
                        centerX: (b.right + b.width / 2),
                        centerY: (b.top + b.height / 2)
                    },
                    fullyInsideVP: (b.top >= 0 && b.bottom <= vph && b.left >= 0 && b.right <= vpw) ? true : false,
                    isHidden: this._isHidden(),
                    visibility: 0
                };
                if (!e.isHidden) {
                    let px = 0;
                    for (let y = 0; y < Math.floor(b.height); y++) {
                        const posY = b.top + y;
                        for (let x = 0; x < Math.floor(b.width); x++) {
                            const posX = b.left + x;
                            if (posX >= 0 && posX <= vpw && posY >= 0 && posY <= vph) {
                                let elem = document.elementFromPoint(posX, posY);
                                if (elem !== null && elem === this._element)
                                    px++;
                            }
                        }
                    }
                    e.visibility = px / (Math.floor(b.width) * Math.floor(b.height));
                    e.visibility = Number(e.visibility.toFixed(2));
                }
                return e;
            });
        }
    }
    exports.DOMVPTracker = DOMVPTracker;
});
//# sourceMappingURL=../tsc/@maps/sensor_viewport.js.map