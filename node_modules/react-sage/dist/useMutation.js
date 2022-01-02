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
exports.useMutation = void 0;
var useBatchMutation_1 = require("./useBatchMutation");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useMutation(method, onSuccess, onError) {
    // useMutation is simply an implementation of useBatchMutation, but with
    // one set of params and one response object.
    var mutation = useBatchMutation_1.useBatchMutation(method, function (response) {
        onSuccess && onSuccess(response[0]);
    }, function (error) {
        onError && onError(error);
    });
    return __assign(__assign({}, mutation), { result: __assign(__assign({}, mutation.result), { 
            // De-structure the sole respones object from the list when available.
            response: mutation.result.response ? mutation.result.response[0] : null }), 
        // [[{...}]] -> [{...}]
        invocations: mutation.invocations.flatMap(function (i) { return i; }), invoke: function (params) {
            // Put params in a list so they meet useBatchMutation's reqs.
            mutation.invoke([params]);
        } });
}
exports.useMutation = useMutation;
