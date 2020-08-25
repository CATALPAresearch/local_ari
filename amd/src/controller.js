var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./core_worker"], function (require, exports, core_worker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    class Controller {
        constructor(path) {
            this._path = path;
            console.log(this._path);
            this.go().then((resolve) => {
                console.log(`Resolve: ${resolve}`);
            }, (reject) => {
                console.log(`Reject: ${reject}`);
            });
        }
        go() {
            return __awaiter(this, void 0, void 0, function* () {
                let worker = new core_worker_1.ServiceWorker(M.cfg.wwwroot + "/local/ari/lib/src/worker.js", "/");
                yield worker.create(M.cfg.wwwroot + "/local/ari/lib/src/worker.js", (error) => {
                    console.log(error);
                }, (state) => {
                    console.log(state.target.state);
                });
                yield worker.update();
                return;
            });
        }
    }
    exports.Controller = Controller;
});
//# sourceMappingURL=../tsc/@maps/controller.js.map