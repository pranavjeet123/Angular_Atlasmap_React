"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mobx_1 = require("mobx");
class Stateful {
    constructor() {
        this.state = {};
    }
    getState() {
        return this.state;
    }
    setState(state) {
        if (state) {
            Object.assign(this.state, state);
        }
    }
}
tslib_1.__decorate([
    mobx_1.observable.shallow
], Stateful.prototype, "state", void 0);
tslib_1.__decorate([
    mobx_1.action
], Stateful.prototype, "setState", null);
exports.default = Stateful;
//# sourceMappingURL=Stateful.js.map