/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description Cookies let you store user information in web pages.
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cookie = /** @class */ (function () {
        function Cookie() {
        }
        Cookie.set = function (name, value, expires, path) {
            name = name.replace(" ", "");
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
        Cookie.get = function (name) {
            name = name.replace(" ", "");
            var all = Cookie.getAll();
            if (typeof all[name] !== "undefined")
                return all[name];
            return undefined;
        };
        Cookie.remove = function (name, path) {
            var date = new Date(new Date().setDate(new Date().getDate() - 100));
            Cookie.set(name, "", date, path);
            return;
        };
        return Cookie;
    }());
    exports.default = Cookie;
});
