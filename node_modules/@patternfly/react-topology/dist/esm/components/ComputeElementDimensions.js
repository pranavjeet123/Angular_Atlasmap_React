import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import Dimensions from '../geom/Dimensions';
const ComputeElementDimensions = ({ element, children }) => {
    const gRef = React.useRef(null);
    React.useEffect(() => {
        if (gRef.current && !element.isDimensionsInitialized()) {
            const { width, height } = gRef.current.getBBox();
            action(() => element.setDimensions(new Dimensions(width, height)))();
        }
    }, [element]);
    // render an invisible node
    return (React.createElement("g", { ref: gRef, style: { visibility: 'hidden' } }, children));
};
// export for testing
export const InternalComputeElementDimensions = ComputeElementDimensions;
export default observer(ComputeElementDimensions);
//# sourceMappingURL=ComputeElementDimensions.js.map