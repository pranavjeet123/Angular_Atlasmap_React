"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * @param rawCallback
 */
function useCallbackRef(rawCallback) {
    const cleanupRef = react_1.useRef(null);
    const callback = react_1.useCallback((node => {
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
        if (node) {
            cleanupRef.current = rawCallback(node);
        }
    }), [rawCallback]);
    return callback;
}
exports.default = useCallbackRef;
//# sourceMappingURL=useCallbackRef.js.map