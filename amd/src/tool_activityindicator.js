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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery", "./tool"], function (require, exports, jquery_1, tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    tool_1 = __importDefault(tool_1);
    var ActivityIndicator = /** @class */ (function (_super) {
        __extends(ActivityIndicator, _super);
        function ActivityIndicator(config) {
            var _this = _super.call(this) || this;
            if (config) {
                _this._config = config;
            }
            else {
                _this._config = defConfig;
            }
            _this._createLine("div.longpage-container");
            return _this;
        }
        ActivityIndicator.prototype._createLine = function (selector) {
            jquery_1.default(document).ready(function () {
                alert("hi");
            });
        };
        return ActivityIndicator;
    }(tool_1.default));
    exports.default = ActivityIndicator;
    var defConfig = {};
});
