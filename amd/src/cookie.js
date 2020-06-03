define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Cookie {
        static set(name, value, expires, path) {
            name = name.replace(" ", "");
            name = name.replace(";", "");
            if (typeof name !== "string" || name.length <= 0)
                throw Error("Invalide cookie name");
            if (typeof path === "string")
                path = path.replace(";", "");
            if (typeof value !== "string")
                value = JSON.stringify(value);
            document.cookie = `${name}=${value}${typeof expires === "object" && typeof expires.toUTCString === "function" ? ";expires=" + expires.toUTCString() : ""}${typeof path === "string" && path.length > 0 ? ";path=" + path : "path=/"}`;
            return;
        }
        static getAll() {
            let cookies = document.cookie.split(";");
            let object = {};
            let tryToObjectify = function (input) {
                try {
                    let obj = JSON.parse(input);
                    return obj;
                }
                catch (error) {
                    return input;
                }
            };
            for (let i in cookies) {
                let cookie = cookies[i].split("=");
                if (cookie.length < 2)
                    continue;
                let name = cookie.shift().replace(" ", "");
                let value = tryToObjectify(cookie.join("=").replace(" ", ""));
                object[name] = value;
            }
            return object;
        }
        static get(name) {
            name = name.replace(" ", "");
            let all = Cookie.getAll();
            if (typeof all[name] !== "undefined")
                return all[name];
            return undefined;
        }
        static remove(name, path) {
            let date = new Date(new Date().setDate(new Date().getDate() - 100));
            Cookie.set(name, "", date, path);
            return;
        }
    }
    exports.default = Cookie;
});
