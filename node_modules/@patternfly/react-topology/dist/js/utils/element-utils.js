"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupPadding = exports.getElementPadding = exports.getClosestVisibleParent = exports.getTopCollapsedParent = exports.leafNodeElements = exports.groupNodeElements = void 0;
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const types_1 = require("../types");
const groupNodeElements = (nodes) => {
    if (!_.size(nodes)) {
        return [];
    }
    const groupNodes = [];
    _.forEach(nodes, nextNode => {
        if (types_1.isNode(nextNode) && nextNode.isGroup() && !nextNode.isCollapsed()) {
            groupNodes.push(nextNode);
            groupNodes.push(...groupNodeElements(nextNode.getChildren()));
        }
    });
    return groupNodes;
};
exports.groupNodeElements = groupNodeElements;
const leafNodeElements = (nodeElements) => {
    const nodes = [];
    if (!nodeElements) {
        return nodes;
    }
    if (Array.isArray(nodeElements)) {
        _.forEach(nodeElements, (nodeElement) => {
            nodes.push(...leafNodeElements(nodeElement));
        });
        return nodes;
    }
    if (nodeElements.isGroup() && !nodeElements.isCollapsed()) {
        const leafNodes = [];
        const children = nodeElements.getChildren();
        if (_.size(children)) {
            _.forEach(children.filter(e => types_1.isNode(e)), element => {
                leafNodes.push(...leafNodeElements(element));
            });
        }
        return leafNodes;
    }
    return [nodeElements];
};
exports.leafNodeElements = leafNodeElements;
const getTopCollapsedParent = (node) => {
    let returnNode = node;
    try {
        let parent = !types_1.isGraph(node) && node.getParent();
        while (parent && !types_1.isGraph(parent)) {
            if (parent.isCollapsed()) {
                returnNode = parent;
            }
            parent = parent.getParent();
        }
        // eslint-disable-next-line no-empty
    }
    catch (e) { }
    return returnNode;
};
exports.getTopCollapsedParent = getTopCollapsedParent;
const getClosestVisibleParent = (node) => {
    if (!node) {
        return null;
    }
    let returnNode = null;
    try {
        let parent = node.getParent();
        while (parent) {
            if (!parent.isVisible()) {
                // parent isn't visible so no descendant could be visible
                returnNode = null;
            }
            else if (parent.isCollapsed() || !returnNode) {
                // parent is collapsed, no descendant is visible, but parent is
                returnNode = parent;
            }
            parent = parent.getParent();
        }
        // eslint-disable-next-line no-empty
    }
    catch (e) { }
    return returnNode;
};
exports.getClosestVisibleParent = getClosestVisibleParent;
const getElementPadding = (element) => {
    const stylePadding = element.getStyle().padding;
    if (!stylePadding) {
        return 0;
    }
    if (Array.isArray(stylePadding)) {
        // For a padding that is not consistent on all sides, use the max padding
        return stylePadding.reduce((val, current) => Math.max(val, current), 0);
    }
    return stylePadding;
};
exports.getElementPadding = getElementPadding;
const getGroupPadding = (element, padding = 0) => {
    if (types_1.isGraph(element)) {
        return padding;
    }
    let newPadding = padding;
    if (types_1.isNode(element) && element.isGroup() && !element.isCollapsed()) {
        newPadding += getElementPadding(element);
    }
    if (element.getParent()) {
        return getGroupPadding(element.getParent(), newPadding);
    }
    return newPadding;
};
exports.getGroupPadding = getGroupPadding;
//# sourceMappingURL=element-utils.js.map