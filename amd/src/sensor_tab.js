define(["require", "exports", "./core_storage", "./core_helper"], function (require, exports, core_storage_1, core_helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTabID = void 0;
    function getTabID() {
        let old = core_storage_1.SessionStorage.get("uniqid");
        if (old !== null && typeof old === "string" && old.length > 0)
            return old;
        let newID = core_helper_1.uniqid();
        core_storage_1.SessionStorage.set("uniqid", newID, true);
        return newID;
    }
    exports.getTabID = getTabID;
});
//# sourceMappingURL=../tsc/@maps/sensor_tab.js.map