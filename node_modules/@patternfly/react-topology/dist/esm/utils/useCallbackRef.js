import { useRef, useCallback } from 'react';
/**
 * @param rawCallback
 */
export default function useCallbackRef(rawCallback) {
    const cleanupRef = useRef(null);
    const callback = useCallback((node => {
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
//# sourceMappingURL=useCallbackRef.js.map