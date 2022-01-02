import { __decorate } from "tslib";
import { action, observable } from 'mobx';
export default class Stateful {
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
__decorate([
    observable.shallow
], Stateful.prototype, "state", void 0);
__decorate([
    action
], Stateful.prototype, "setState", null);
//# sourceMappingURL=Stateful.js.map