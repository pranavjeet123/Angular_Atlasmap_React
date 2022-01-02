"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
var useBatchQuery_1 = require("./useBatchQuery");
function useQuery(method, options) {
    // useQuery is simply an implementation of useBatchQuery, therefore must adjust any args
    // so they become compatible with useBatchQuery's reqs.
    var query = useBatchQuery_1.useBatchQuery(method, __assign(__assign({}, (options || {})), { 
        // Can be [undefined | null] as well, which is ok.
        // If empty list, useBatchQuery will not invoke it.
        args: [options.args] }));
    return __assign(__assign({}, query), { 
        // De-structure the sole result object from the list when available.
        result: query.result ? query.result[0] : null });
}
exports.useQuery = useQuery;
