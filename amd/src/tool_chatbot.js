var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define(["require", "exports", "jquery", "./tool"], function (require, exports, jquery_1, tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    tool_1 = __importDefault(tool_1);
    var Chatbot = /** @class */ (function (_super) {
        __extends(Chatbot, _super);
        function Chatbot(config) {
            var _this = _super.call(this) || this;
            _this._messages = [];
            if (config) {
                _this._config = config;
            }
            else {
                _this._config = defConfig;
            }
            var bootstrap_enabled = (typeof jquery_1.default().modal == 'function');
            return _this;
            //console.log("BOOSTRAP "+bootstrap_enabled);
            //this._create();
        }
        Chatbot.prototype._create = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    jquery_1.default(document).ready(function () {
                        var body = document.body;
                        var bot = " \
                    <div class=\"d-flex flex-row-reverse fixed-bottom mb-2\"> \
                        <div class=\"col-md-3\"> \
                            <div class=\"card\"> \
                                <div class=\"card-header text-white bg-dark\"> \
                                    <a class=\"collapsed text-white d-block\" data-toggle=\"collapse\" href=\"#chatbot-collapse\" aria-expanded=\"true\" aria-controls=\"chatbot-collapse\" id=\"chatbot-head\"> \
                                        <i class=\"fa fa-chevron-down pull-right\"></i> \
                                        Chatbot \
                                    </a> \
                                </div> \
                                <div id=\"chatbot-collapse\" class=\"collapse show\" aria-labelledby=\"chatbot-collapse\"> \
                                    <div class=\"card-body\">Chat</div> \
                                    <div class=\"card-footer\"> \
                                        <div class=\"input-group\"> \
                                            <input id=\"btn-input\" type=\"text\" class=\"form-control input-sm\" placeholder=\"Tippe deine Antwort hier...\" />\
                                            <span class=\"input-group-btn\"> \
                                                <button class=\"btn btn-success btn-block\" id=\"btn-chat\">\
                                                    Senden \
                                                </button> \
                                            </span> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                ";
                        /*
                        let container = document.createElement('div');
                        container.innerHTML = bot;
                        container.id = "chatbot";
                        container.classList.add("position-fixed");
                        body.prepend(container);
                        */
                        body.innerHTML += bot;
                    });
                    return [2 /*return*/];
                });
            });
        };
        return Chatbot;
    }(tool_1.default));
    exports.default = Chatbot;
    var defConfig = {};
});
