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
    class CreateModal {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.selector !== "string" || this._data.selector.length <= 0)
                return false;
            if (typeof this._data.id !== "string" || this._data.id.length <= 0)
                return false;
            if (typeof this._data.header !== "undefined" && (typeof this._data.header !== "string" || this._data.header.length <= 0))
                return false;
            if (typeof this._data.body !== "undefined" && (typeof this._data.body !== "string" || this._data.body.length <= 0))
                return false;
            if (typeof this._data.footer !== "undefined" && (typeof this._data.footer !== "string" || this._data.footer.length <= 0))
                return false;
            if (typeof this._data.hidden !== "boolean")
                return false;
            if (typeof this._data.removeOld !== "boolean")
                return false;
            if (typeof this._data.position !== "number" || !(this._data.position in EDOMPosition))
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let content = `
            <div class="modal-header">${this._data.header ? this._data.header : ""} 
                <button type="button" class="close" data-dismiss="modal" aria-label="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
                if (this._data.body)
                    content += `<div class="modal-body">${this._data.body}</div>`;
                if (this._data.footer)
                    content += `<div class="modal-footer">${this._data.footer}</div>`;
                let dom = `
            <div class="modal fade" id="${this._data.id}" tabindex="-1" aria-labelledby="${this._data.id}" aria-hidden="${this._data.hidden ? "true" : "false"}">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                       ${content}
                    </div>
                </div>
            </div>
        `;
                console.log(dom);
                let _this = this;
                return new Promise((resolve, reject) => {
                    jquery_1.default(document).ready(function () {
                        let selector = jquery_1.default(_this._data.selector);
                        if (_this._data.removeOld && selector.length > 0) {
                            selector.remove();
                        }
                        switch (_this._data.position) {
                            case EDOMPosition.append:
                                selector.append(dom);
                                if (_this._data.hidden === false)
                                    jquery_1.default("#" + _this._data.id).modal("show");
                                console.log("#" + _this._data.id);
                                return resolve();
                            case EDOMPosition.prepend:
                                selector.prepend(dom);
                                if (_this._data.hidden === false)
                                    jquery_1.default("#" + _this._data.id).modal("show");
                                console.log("#" + _this._data.id);
                                return resolve();
                            default: break;
                        }
                        return reject("Unknown position.");
                    });
                });
            });
        }
    }
    exports.CreateModal = CreateModal;
    var EDOMPosition;
    (function (EDOMPosition) {
        EDOMPosition[EDOMPosition["append"] = 0] = "append";
        EDOMPosition[EDOMPosition["prepend"] = 1] = "prepend";
    })(EDOMPosition = exports.EDOMPosition || (exports.EDOMPosition = {}));
    class RemoveDom {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.selector !== "string" || this._data.selector.length <= 0)
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let _this = this;
                return new Promise((resolve, reject) => {
                    jquery_1.default(document).ready(function () {
                        jquery_1.default(_this._data.selector).remove();
                        return resolve();
                    });
                });
            });
        }
    }
    exports.RemoveDom = RemoveDom;
    class AddDom {
        constructor(data) {
            this._data = data;
        }
        validate() {
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
    }
    exports.AddDom = AddDom;
});
