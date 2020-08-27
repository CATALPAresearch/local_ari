define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uniqid = void 0;
    function uniqid() {
        var date = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        ;
    }
    exports.uniqid = uniqid;
});
//# sourceMappingURL=../tsc/@maps/core_helper.js.map