"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersistedState = void 0;
var React = __importStar(require("react"));
function formatForStorage(version, data) {
    return {
        version: version,
        data: data
    };
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function usePersistedState(_a) {
    var storage = _a.storage, key = _a.key, initialState = _a.initialState, _b = _a.version, version = _b === void 0 ? 0.1 : _b;
    var storageKey = React.useMemo(function () { return "usePersistedState::" + key; }, [key]);
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    var _c = React.useState(function () {
        try {
            var item = storage.getItem(storageKey);
            if (!item)
                return initialState;
            var _a = JSON.parse(item) || {}, existingVersion = _a.version, data = _a.data;
            var hasNewerVersion = parseFloat(existingVersion) !== version;
            if (hasNewerVersion) {
                // @TODO: add migration option
                storage.removeItem(storageKey);
                throw new Error("Newer version for " + key + " in persisted state. Over writing existing version.");
            }
            return data;
        }
        catch (err) {
            // If err also return initialState
            console.error(err);
            return initialState;
        }
    }), state = _c[0], setState = _c[1];
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    var set = function (value) {
        try {
            // Allow value to be a function so we have same API as useState
            var valueToStore = value instanceof Function ? value(state) : value;
            // Save state
            setState(valueToStore);
            // Save to local storage
            storage.setItem(storageKey, JSON.stringify(formatForStorage(version, valueToStore)));
        }
        catch (err) {
            // A more advanced implementation would handle the err case
            console.error(err);
        }
    };
    var remove = function () {
        try {
            setState(initialState);
            storage.removeItem(storageKey);
        }
        catch (err) {
            console.error(err);
        }
    };
    return [state, set, remove];
}
exports.usePersistedState = usePersistedState;
