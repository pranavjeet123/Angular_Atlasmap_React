import * as _ from 'lodash';
import { isNode, isGraph } from '../types';
const groupNodeElements = (nodes) => {
    if (!_.size(nodes)) {
        return [];
    }
    const groupNodes = [];
    _.forEach(nodes, nextNode => {
        if (isNode(nextNode) && nextNode.isGroup() && !nextNode.isCollapsed()) {
            groupNodes.push(nextNode);
            groupNodes.push(...groupNodeElements(nextNode.getChildren()));
        }
    });
    return groupNodes;
};
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
            _.forEach(children.filter(e => isNode(e)), element => {
                leafNodes.push(...leafNodeElements(element));
            });
        }
        return leafNodes;
    }
    return [nodeElements];
};
const getTopCollapsedParent = (node) => {
    let returnNode = node;
    try {
        let parent = !isGraph(node) && node.getParent();
        while (parent && !isGraph(parent)) {
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
const getGroupPadding = (element, padding = 0) => {
    if (isGraph(element)) {
        return padding;
    }
    let newPadding = padding;
    if (isNode(element) && element.isGroup() && !element.isCollapsed()) {
        newPadding += getElementPadding(element);
    }
    if (element.getParent()) {
        return getGroupPadding(element.getParent(), newPadding);
    }
    return newPadding;
};
export { groupNodeElements, leafNodeElements, getTopCollapsedParent, getClosestVisibleParent, getElementPadding, getGroupPadding };
//# sourceMappingURL=element-utils.js.map