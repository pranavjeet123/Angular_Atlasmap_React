"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const LayersProvider_1 = tslib_1.__importDefault(require("./layers/LayersProvider"));
const ElementWrapper_1 = tslib_1.__importDefault(require("./ElementWrapper"));
// This inner Component will prevent the re-rendering of all children when the transform changes
const ElementChildren = mobx_react_1.observer(({ element }) => (React.createElement(React.Fragment, null,
    element.getEdges().map(e => (React.createElement(ElementWrapper_1.default, { key: e.getId(), element: e }))),
    element.getNodes().map(e => (React.createElement(ElementWrapper_1.default, { key: e.getId(), element: e }))))));
// This inner Component will prevent re-rendering layers when the transform changes
const Inner = React.memo(mobx_react_1.observer(({ element }) => (React.createElement(LayersProvider_1.default, { layers: element.getLayers() },
    React.createElement(ElementChildren, { element: element })))));
const GraphComponent = ({ element, panZoomRef, dndDropRef, onSelect, onContextMenu }) => {
    const { x, y, width, height } = element.getBounds();
    return (React.createElement(React.Fragment, null,
        React.createElement("rect", { ref: dndDropRef, x: 0, y: 0, width: width, height: height, fillOpacity: 0, onClick: onSelect, onContextMenu: onContextMenu }),
        React.createElement("g", { "data-surface": "true", ref: panZoomRef, transform: `translate(${x}, ${y}) scale(${element.getScale()})` },
            React.createElement(Inner, { element: element }))));
};
exports.default = mobx_react_1.observer(GraphComponent);
//# sourceMappingURL=GraphComponent.js.map