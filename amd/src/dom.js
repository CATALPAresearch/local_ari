var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    /**
     *
     * @author Marc Burchart
     * @version 1.0-20200409
     * @description xxx
     *
     */
    var CreateModal = /** @class */ (function () {
        function CreateModal(data) {
            this._data = data;
        }
        CreateModal.prototype.validate = function () {
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
        };
        CreateModal.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                var content, dom, _this;
                return __generator(this, function (_a) {
                    content = "\n            <div class=\"modal-header\">" + (this._data.header ? this._data.header : "") + " \n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"close\">\n                    <span aria-hidden=\"true\">&times;</span>\n                </button>\n            </div>";
                    if (this._data.body)
                        content += "<div class=\"modal-body\">" + this._data.body + "</div>";
                    if (this._data.footer)
                        content += "<div class=\"modal-footer\">" + this._data.footer + "</div>";
                    dom = "\n            <div class=\"modal fade\" id=\"" + this._data.id + "\" tabindex=\"-1\" aria-labelledby=\"" + this._data.id + "\" aria-hidden=\"" + (this._data.hidden ? "true" : "false") + "\">\n                <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">\n                    <div class=\"modal-content\">\n                       " + content + "\n                    </div>\n                </div>\n            </div>\n        ";
                    console.log(dom);
                    _this = this;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            jquery_1.default(document).ready(function () {
                                var selector = jquery_1.default(_this._data.selector);
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
                        })];
                });
            });
        };
        return CreateModal;
    }());
    exports.CreateModal = CreateModal;
    var EDOMPosition;
    (function (EDOMPosition) {
        EDOMPosition[EDOMPosition["append"] = 0] = "append";
        EDOMPosition[EDOMPosition["prepend"] = 1] = "prepend";
    })(EDOMPosition = exports.EDOMPosition || (exports.EDOMPosition = {}));
    var RemoveDom = /** @class */ (function () {
        function RemoveDom(data) {
            this._data = data;
        }
        RemoveDom.prototype.validate = function () {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.selector !== "string" || this._data.selector.length <= 0)
                return false;
            return true;
        };
        RemoveDom.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this;
                return __generator(this, function (_a) {
                    _this = this;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            jquery_1.default(document).ready(function () {
                                jquery_1.default(_this._data.selector).remove();
                                return resolve();
                            });
                        })];
                });
            });
        };
        return RemoveDom;
    }());
    exports.RemoveDom = RemoveDom;
    var AddDom = /** @class */ (function () {
        function AddDom(data) {
            this._data = data;
        }
        AddDom.prototype.validate = function () {
            return true;
        };
        AddDom.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        return AddDom;
    }());
    exports.AddDom = AddDom;
});
