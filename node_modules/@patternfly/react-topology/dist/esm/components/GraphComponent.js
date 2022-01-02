import * as React from 'react';
import { observer } from 'mobx-react';
import LayersProvider from './layers/LayersProvider';
import ElementWrapper from './ElementWrapper';
// This inner Component will prevent the re-rendering of all children when the transform changes
const ElementChildren = observer(({ element }) => (React.createElement(React.Fragment, null,
    element.getEdges().map(e => (React.createElement(ElementWrapper, { key: e.getId(), element: e }))),
    element.getNodes().map(e => (React.createElement(ElementWrapper, { key: e.getId(), element: e }))))));
// This inner Component will prevent re-rendering layers when the transform changes
const Inner = React.memo(observer(({ element }) => (React.createElement(LayersProvider, { layers: element.getLayers() },
    React.createElement(ElementChildren, { element: element })))));
const GraphComponent = ({ element, panZoomRef, dndDropRef, onSelect, onContextMenu }) => {
    const { x, y, width, height } = element.getBounds();
    return (React.createElement(React.Fragment, null,
        React.createElement("rect", { ref: dndDropRef, x: 0, y: 0, width: width, height: height, fillOpacity: 0, onClick: onSelect, onContextMenu: onContextMenu }),
        React.createElement("g", { "data-surface": "true", ref: panZoomRef, transform: `translate(${x}, ${y}) scale(${element.getScale()})` },
            React.createElement(Inner, { element: element }))));
};
export default observer(GraphComponent);
//# sourceMappingURL=GraphComponent.js.map