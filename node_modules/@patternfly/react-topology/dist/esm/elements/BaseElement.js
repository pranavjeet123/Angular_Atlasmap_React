import { __decorate } from "tslib";
import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import { isGraph, isNode, ADD_CHILD_EVENT, REMOVE_CHILD_EVENT, ELEMENT_VISIBILITY_CHANGE_EVENT } from '../types';
import Stateful from '../utils/Stateful';
export default class BaseElement extends Stateful {
    constructor() {
        super(...arguments);
        this.id = '';
        this.type = '';
        this.visible = true;
        this.children = [];
        this.style = {};
    }
    get ordering() {
        if (!this.parent) {
            return [];
        }
        const idx = this.parent.getChildren().indexOf(this);
        const result = [...this.parent.getOrderKey(), idx];
        return result;
    }
    getLabel() {
        return this.label || '';
    }
    setLabel(label) {
        this.label = label;
    }
    getOrderKey() {
        return this.ordering;
    }
    getController() {
        if (!this.controller) {
            throw new Error(`GraphElement with ID '${this.getId()}' has no controller.`);
        }
        return this.controller;
    }
    setController(controller) {
        this.controller = controller;
    }
    getGraph() {
        // TODO fix project eslint rules
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p = this;
        while (!isGraph(p)) {
            p = p.getParent();
        }
        return p;
    }
    getParent() {
        if (!this.parent) {
            throw new Error(`GraphElement with ID '${this.getId()}' has no parent.`);
        }
        return this.parent;
    }
    setParent(parent) {
        if (this.parent !== parent) {
            if (this.parent) {
                this.remove();
            }
            this.parent = parent;
        }
    }
    hasParent() {
        return this.parent !== undefined;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
    setVisible(visible) {
        if (this.visible !== visible) {
            this.visible = visible;
            if (this.controller) {
                this.controller.fireEvent(ELEMENT_VISIBILITY_CHANGE_EVENT, { visible, target: this });
            }
        }
    }
    isVisible() {
        return (this.visible &&
            (!this.parent || (this.parent.isVisible() && (!isNode(this.parent) || !this.parent.isCollapsed()))));
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
    getStyle() {
        return this.style;
    }
    getChildren() {
        return this.children;
    }
    insertChild(child, index) {
        if (this.children.length === 0 || index >= this.children.length || this.children[index] !== child) {
            const idx = this.children.indexOf(child);
            if (idx !== -1) {
                this.children.splice(idx, 1);
                this.children.splice(index, 0, child);
            }
            else {
                // remove from old parent
                child.remove();
                child.setParent(this);
                this.children.splice(index, 0, child);
                if (this.controller) {
                    this.controller.fireEvent(ADD_CHILD_EVENT, { target: this, child });
                }
            }
        }
    }
    appendChild(child) {
        if (this.children.length === 0 || this.children[this.children.length - 1] !== child) {
            const idx = this.children.indexOf(child);
            if (idx !== -1) {
                this.children.splice(idx, 1);
                this.children.push(child);
            }
            else {
                // remove from old parent
                child.remove();
                child.setParent(this);
                this.children.push(child);
                if (this.controller) {
                    this.controller.fireEvent(ADD_CHILD_EVENT, { target: this, child });
                }
            }
        }
    }
    removeChild(child) {
        if (this.children) {
            const idx = this.children.indexOf(child);
            if (idx !== -1) {
                this.children.splice(idx, 1);
                child.setParent(undefined);
                if (this.controller) {
                    this.controller.fireEvent(REMOVE_CHILD_EVENT, { target: this, child });
                }
            }
        }
    }
    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    setModel(model) {
        if ('type' in model) {
            this.setType(model.type);
        }
        if ('visible' in model) {
            this.setVisible(!!model.visible);
        }
        if (Array.isArray(model.children)) {
            const controller = this.getController();
            const childElements = model.children.map(id => {
                const element = controller.getElementById(id);
                if (!element) {
                    throw new Error(`No element found with ID '${id}'.`);
                }
                return element;
            });
            // remove children
            _.difference(this.children, childElements).forEach(child => this.removeChild(child));
            // add children
            const toAdd = _.difference(childElements, this.children);
            toAdd.reverse().forEach(child => this.insertChild(child, 0));
        }
        if ('data' in model) {
            this.data = model.data;
        }
        if ('label' in model) {
            this.label = model.label;
        }
        if ('style' in model) {
            _.merge(this.style, model.style);
        }
    }
    toModel() {
        return {
            id: this.getId(),
            type: this.getType(),
            label: this.getLabel(),
            visible: this.isVisible(),
            children: this.getChildren().map(c => c.getId()),
            data: this.getData(),
            style: this.getStyle()
        };
    }
    raise() {
        const { parent } = this;
        if (parent) {
            parent.appendChild(this);
            parent.raise();
        }
    }
    translateToAbsolute(t) {
        this.translateToParent(t);
        const { parent } = this;
        if (parent) {
            parent.translateToAbsolute(t);
        }
    }
    translateFromAbsolute(t) {
        const { parent } = this;
        if (parent) {
            parent.translateFromAbsolute(t);
        }
        this.translateFromParent(t);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    translateToParent(t) {
        // nothing to do
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    translateFromParent(t) {
        // nothing to do
    }
    destroy() {
        // nothing to do
    }
}
__decorate([
    observable
], BaseElement.prototype, "type", void 0);
__decorate([
    observable.ref
], BaseElement.prototype, "data", void 0);
__decorate([
    observable.ref
], BaseElement.prototype, "parent", void 0);
__decorate([
    observable
], BaseElement.prototype, "visible", void 0);
__decorate([
    observable.shallow
], BaseElement.prototype, "children", void 0);
__decorate([
    observable.ref
], BaseElement.prototype, "controller", void 0);
__decorate([
    observable
], BaseElement.prototype, "label", void 0);
__decorate([
    observable
], BaseElement.prototype, "style", void 0);
__decorate([
    computed({ equals: _.isEqual })
], BaseElement.prototype, "ordering", null);
//# sourceMappingURL=BaseElement.js.map