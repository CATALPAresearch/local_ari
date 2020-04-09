define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cookie = /** @class */ (function () {
        function Cookie() {
        }
        Cookie.set = function (name, value, expires, path) {
            name = name.replace(";", "");
            if (typeof name !== "string" || name.length <= 0)
                throw Error("Invalide cookie name");
            if (typeof path === "string")
                path = path.replace(";", "");
            if (typeof value !== "string")
                value = JSON.stringify(value);
            document.cookie = name + "=" + value + (typeof expires === "object" && typeof expires.toUTCString === "function" ? ";expires=" + expires.toUTCString() : "") + (typeof path === "string" && path.length > 0 ? ";path=" + path : "path=/");
            return;
        };
        Cookie.getAll = function () {
            var cookies = document.cookie.split(";");
            var object = {};
            var tryToObjectify = function (input) {
                try {
                    var obj = JSON.parse(input);
                    return obj;
                }
                catch (error) {
                    return input;
                }
            };
            for (var i in cookies) {
                var cookie = cookies[i].split("=");
                if (cookie.length < 2)
                    continue;
                var name_1 = cookie.shift().replace(" ", "");
                var value = tryToObjectify(cookie.join("=").replace(" ", ""));
                object[name_1] = value;
            }
            return object;
        };
        return Cookie;
    }());
    exports.default = Cookie;
});
