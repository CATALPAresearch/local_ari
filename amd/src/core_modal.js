define(["require", "exports", "jquery", "jqueryui"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Modal {
        constructor(config) {
            if (!this._guard(config))
                throw new Error(`[Modal-${config.id}] Incomplete or incorrect configuration.`);
            if ($(`#${this._id}`).length > 0)
                throw new Error(`[Modal-${config.id}] ID is already used.`);
            this._id = config.id;
            let content = "";
            if (typeof config.content === "object") {
                if (typeof config.content.header === "string" && config.content.header.length > 0)
                    content += `<div class="modal-header">${config.content.header}</div>`;
                if (typeof config.content.body === "string" && config.content.body.length > 0)
                    content += `<div class="modal-body">${config.content.body}</div>`;
                if (typeof config.content.footer === "string" && config.content.footer.length > 0)
                    content += `<div class="modal-footer">${config.content.footer}</div>`;
            }
            let size = "";
            let align = "";
            let fade = "";
            let addClass = "";
            if (typeof config.options === "object") {
                if (config.options.centerVertically === true)
                    align = "modal-dialog-centered";
                switch (config.options.size) {
                    case EModalSize.large:
                        size = "modal-lg";
                        break;
                    case EModalSize.small:
                        size = "modal-sm";
                        break;
                }
                if (align.length > 0 && size.length > 0)
                    size = size + " ";
                if (config.options.animate === true)
                    fade = "fade";
            }
            if (typeof config.addClass === "string" && config.addClass.length > 0)
                addClass = config.addClass;
            if (fade.length > 0 && addClass.length > 0)
                fade = fade + " ";
            let dialog = `<div class="modal-dialog ${align}${size}" role="document"><div class="modal-content">${content}</div></div>`;
            let modal = `<div class="modal ${fade}${addClass}" id="${config.id}" tabindex="-1" role="dialog" aria-labelledby="${config.id}" aria-hidden="true">${dialog}</div>`;
            console.log(modal);
            $("body").append(modal);
            if (typeof config.options === "object") {
                let obj = {
                    backdrop: typeof config.options.backdrop === "boolean" ? config.options.backdrop : undefined,
                    keyboard: typeof config.options.keyboard === "boolean" ? config.options.keyboard : undefined,
                    focus: typeof config.options.focus === "boolean" ? config.options.focus : undefined,
                    show: typeof config.options.show === "boolean" ? config.options.show : undefined
                };
                $(`#${this._id}`).modal(obj);
            }
        }
        show() {
            $(`#${this._id}`).modal("show");
        }
        hide() {
            $(`#${this._id}`).modal("hide");
        }
        toggle() {
            $(`#${this._id}`).modal("toggle");
        }
        update() {
            $(`#${this._id}`).modal("handleUpdate");
        }
        destroy() {
            $(`#${this._id}`).modal("dispose");
        }
        addEvent(event, callback) {
            if (typeof callback !== "function")
                throw new Error(`[Modal-${this._id}] Callback is not a function.`);
            $(`#${this._id}`).on(this._getEvent(event), callback);
        }
        removeEvent(event, callback) {
            if (typeof callback !== "function")
                throw new Error(`[Modal-${this._id}] Callback is not a function.`);
            $(`#${this._id}`).off(this._getEvent(event), callback);
        }
        getID() {
            return this._id;
        }
        _getEvent(event) {
            switch (event) {
                case EModalEvent.show: return "show.bs.modal";
                case EModalEvent.shown: return "shown.bs.modal";
                case EModalEvent.hide: return "hide.bs.modal";
                case EModalEvent.hidden: return "hidden.bs.modal";
                default: throw new Error("Unknown Event.");
            }
        }
        _guard(config) {
            if (typeof config !== "object")
                return false;
            if (typeof config.id !== "string" || config.id.length <= 0)
                return false;
            if (typeof config.addClass !== "undefined" && (typeof config.addClass !== "string" || config.addClass.length <= 0))
                return false;
            return true;
        }
    }
    exports.Modal = Modal;
    var EModalEvent;
    (function (EModalEvent) {
        EModalEvent[EModalEvent["show"] = 0] = "show";
        EModalEvent[EModalEvent["shown"] = 1] = "shown";
        EModalEvent[EModalEvent["hide"] = 2] = "hide";
        EModalEvent[EModalEvent["hidden"] = 3] = "hidden";
    })(EModalEvent = exports.EModalEvent || (exports.EModalEvent = {}));
    var EModalSize;
    (function (EModalSize) {
        EModalSize[EModalSize["large"] = 0] = "large";
        EModalSize[EModalSize["small"] = 1] = "small";
    })(EModalSize = exports.EModalSize || (exports.EModalSize = {}));
});
//# sourceMappingURL=core_modal.js.map