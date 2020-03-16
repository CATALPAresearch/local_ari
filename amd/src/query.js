define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Query = /** @class */ (function () {
        function Query(prev) {
            this.id = ++Query._counter;
            this.data = data;
            if (typeof prev === "object")
                this._prev = prev;
        }
        Query.prototype.createEntry = function (data) {
            if (typeof this._next === "object")
                return this._next.createEntry(data);
            var elem = new Query(data, this);
            this._next = elem;
            return;
        };
        Query.prototype.getID = function () {
            return this.id;
        };
        Query.prototype.getElementByID = function (id) {
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
        Query.prototype.deleteEntry = function () {
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
        Query.prototype.unsetNext = function () {
            delete this._next;
            return;
        };
        Query.prototype.unsetPrev = function () {
            delete this._prev;
            return;
        };
        Query.prototype.setNext = function (obj) {
            this._next = obj;
            return;
        };
        Query.prototype.setPrev = function (obj) {
            this._prev = obj;
            return;
        };
        Query.prototype.getNext = function () {
            return typeof this._next === "object" ? this._next : null;
        };
        Query.prototype.getPrev = function () {
            return typeof this._prev === "object" ? this._prev : null;
        };
        Query.prototype.getLast = function () {
            if (typeof this._next === "object")
                return this._next.getLast();
            return this;
        };
        Query.prototype.getFirst = function () {
            if (typeof this._prev === "object")
                return this._prev.getFirst();
            return this;
        };
        Query._counter = 0;
        return Query;
    }());
    exports.Query = Query;
});
