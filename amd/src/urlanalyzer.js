/**
 *
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description A class to analyze the current window location.
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var URLAnalyzer = /** @class */ (function () {
        function URLAnalyzer() {
            this.url = window.location.href;
            this.hostname = window.location.hostname;
            this.path = window.location.pathname;
            this.protocol = window.location.protocol;
            this.params = {};
            var params = window.location.search.substr(1);
            if (params.length > 0) {
                var split = params.split("&");
                for (var i in split) {
                    var item = split[i].split("=");
                    if (item.length !== 2)
                        continue;
                    if (!isNaN(+item[1]))
                        item[1] = +item[1];
                    this.params[item[0]] = item[1];
                }
            }
        }
        return URLAnalyzer;
    }());
    exports.default = URLAnalyzer;
});
