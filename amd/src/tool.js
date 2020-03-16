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
define(["require", "exports", "./config", "core/notification", "jquery"], function (require, exports, config_1, notification_1, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    notification_1 = __importDefault(notification_1);
    jquery_1 = __importDefault(jquery_1);
    var Tool = /** @class */ (function () {
        function Tool(data, prev) {
            this.id = ++Tool._counter;
            this._data = data;
            if (typeof prev === "object")
                this._prev = prev;
            switch (this._data.tool) {
                case EToolType.Notification:
                    this._promise = this.notification(data);
                    break;
                case EToolType.SystemMessage:
                    this._promise = this.systemMessage(data);
                    break;
                case EToolType.ChatMessage:
                    this._promise = this.chatMessage(data);
                    break;
                default: this._promise = Promise.reject(Tool._config.tools.denies.unknownTool);
            }
        }
        // ======================== COLLECTION OF TOOLS ========================
        /**
         *
         * Send a Notification to the user. (https://docs.moodle.org/dev/Notifications)
         * @param data IToolNotificationData
         * @returns Promise<void>
         *
         */
        Tool.prototype.notification = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var type, notificationData;
                return __generator(this, function (_a) {
                    if (typeof data !== "object" ||
                        typeof data.message !== "string" ||
                        data.message.length <= 0 ||
                        !(data.type in ENotificationType))
                        throw new Error(Tool._config.tools.denies.wrongData);
                    type = "info";
                    switch (data.type) {
                        case ENotificationType.error:
                            type = "error";
                            break;
                        case ENotificationType.info:
                            type = "info";
                            break;
                        case ENotificationType.problem:
                            type = "problem";
                            break;
                        case ENotificationType.success:
                            type = "success";
                            break;
                        case ENotificationType.warning:
                            type = "warning";
                            break;
                    }
                    notificationData = {
                        message: data.message,
                        type: type
                    };
                    notification_1.default.addNotification(notificationData);
                    return [2 /*return*/];
                });
            });
        };
        /**
         *
         * Send a system message to the user (see the bell @ navbar).
         * @param data
         *
         */
        Tool.prototype.systemMessage = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        /**
         *
         * Send a chatmessage over the chatbot.
         * @param data
         *
         */
        Tool.prototype.chatMessage = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        /**
         *
         * Change some css properties of an object.
         * @param data IToolCSSData
         *
         */
        Tool.prototype.css = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._promise = new Promise(function (resolve, reject) {
                        if (typeof data.selector !== "string" || data.selector.length <= 0 || typeof data.css !== "object")
                            return reject(Tool._config.tools.denies.wrongData);
                        jquery_1.default(document).ready(function () {
                            jquery_1.default(data.selector).css(data.css);
                            return resolve();
                        });
                    });
                    return [2 /*return*/];
                });
            });
        };
        // ======================== MANAGMENT OF USED TOOLS ========================
        /**
         * Create a new tool usage.
         * @param data IToolData
         * @returns Tool
         *
         */
        Tool.prototype.create = function (data) {
            if (typeof this._next === "object")
                return this._next.create(data);
            var elem = new Tool(data, this);
            this._next = elem;
            return elem;
        };
        /**
         *
         * Get the ID of the current tool
         * @returns number
         *
         */
        Tool.prototype.getID = function () {
            return this.id;
        };
        /**
         *
         * Get the config data of the tool.
         * @return IToolData
         *
         */
        Tool.prototype.getData = function () {
            return this._data;
        };
        /**
         *
         * Get the result of the tool usage.
         *  @returns Promise<void>
         *
         */
        Tool.prototype.getPromise = function () {
            return this._promise;
        };
        /**
         *
         * Get a tool by its ID.
         * @param id number
         * @returns Tool|null
         *
         */
        Tool.prototype.getElementByID = function (id) {
            var first = this.getFirst();
            if (first.getID() === id)
                return this;
            var next = this.getNext();
            while (next !== null) {
                if (next.getID() === id)
                    return this;
                next.getNext();
            }
            return null;
        };
        /**
         *
         * Delete the current tool usage.
         * @returns void
         *
         */
        Tool.prototype.deleteEntry = function () {
            if (typeof this._next === "object" && typeof this._prev === "object") {
                this._next.setPrev(this._prev);
                this._prev.setNext(this._next);
            }
            else if (typeof this._next === "object") {
                this._next.unsetPrev();
            }
            else if (typeof this._prev === "object") {
                this._prev.unsetNext();
            }
            return;
        };
        /**
         *
         * Unset the next tool object pointer.
         * @returns void
         *
         */
        Tool.prototype.unsetNext = function () {
            delete this._next;
            return;
        };
        /**
         *
         * Unset the previous tool object pointer.
         * @returns void
         *
         */
        Tool.prototype.unsetPrev = function () {
            delete this._prev;
            return;
        };
        /**
         *
         * Set the next tool object.
         * @param obj Tool
         * @returns void
         *
         */
        Tool.prototype.setNext = function (obj) {
            this._next = obj;
            return;
        };
        /**
         *
         * Set the previous tool object.
         * @param obj Tool
         * @returns void
         *
         */
        Tool.prototype.setPrev = function (obj) {
            this._prev = obj;
            return;
        };
        Tool.prototype.getNext = function () {
            return typeof this._next === "object" ? this._next : null;
        };
        Tool.prototype.getPrev = function () {
            return typeof this._prev === "object" ? this._prev : null;
        };
        Tool.prototype.getLast = function () {
            if (typeof this._next === "object")
                return this._next.getLast();
            return this;
        };
        Tool.prototype.getFirst = function () {
            if (typeof this._prev === "object")
                return this._prev.getFirst();
            return this;
        };
        Tool._counter = 0;
        Tool._config = config_1.Config;
        return Tool;
    }());
    exports.Tool = Tool;
    var EToolType;
    (function (EToolType) {
        EToolType[EToolType["Notification"] = 0] = "Notification";
        EToolType[EToolType["SystemMessage"] = 1] = "SystemMessage";
        EToolType[EToolType["ChatMessage"] = 2] = "ChatMessage";
    })(EToolType = exports.EToolType || (exports.EToolType = {}));
    var ENotificationType;
    (function (ENotificationType) {
        ENotificationType[ENotificationType["error"] = 0] = "error";
        ENotificationType[ENotificationType["warning"] = 1] = "warning";
        ENotificationType[ENotificationType["info"] = 2] = "info";
        ENotificationType[ENotificationType["problem"] = 3] = "problem";
        ENotificationType[ENotificationType["success"] = 4] = "success";
    })(ENotificationType = exports.ENotificationType || (exports.ENotificationType = {}));
});
