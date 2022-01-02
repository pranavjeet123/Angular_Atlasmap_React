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
exports.useForm = void 0;
var react_1 = require("react");
function useForm(options) {
    var initialState = options.initialState, validators = options.validators;
    var _hasError = react_1.useCallback(function (field, value, prevFormState) {
        var validator = validators === null || validators === void 0 ? void 0 : validators[field];
        return typeof validator === 'function' ? validator(value, prevFormState) : false;
    }, [validators]);
    var _initFormState = react_1.useCallback(function (formData) {
        var formState = {};
        var fields = Object.keys(formData);
        var nextFormState = fields.reduce(function (accumulatedFormState, field) {
            var value = formData[field];
            accumulatedFormState[field] = {
                value: value,
                isDirty: false,
                error: _hasError(field, value, null)
            };
            return accumulatedFormState;
        }, formState);
        return nextFormState;
    }, [_hasError]);
    var _a = react_1.useState(_initFormState(initialState)), state = _a[0], setState = _a[1];
    /**
     * This setter it utilized by inputs to update its own part in the form state.
     */
    var set = react_1.useCallback(function (updatedData) {
        var updatedFields = Object.keys(updatedData);
        setState(function (prevFormState) {
            var nextFormState = __assign({}, prevFormState);
            updatedFields.forEach(function (field) {
                var value = updatedData[field];
                nextFormState[field] = {
                    value: value,
                    isDirty: true,
                    error: _hasError(field, value, prevFormState)
                };
            });
            return nextFormState;
        });
    }, [_hasError]);
    /**
     * Keeps track of whether there are ANY errors present in entire form state.
     */
    var hasErrors = Object.keys(state || {}).some(function (field) { return Boolean(state[field].error); });
    /**
     * Keeps track of whether a single change has been made.
     */
    var isDirty = Object.keys(state || {}).some(function (field) { return Boolean(state[field].isDirty); });
    /**
     * Get the value for a field.
     */
    var getValue = react_1.useCallback(function (field) {
        return state[field].value;
    }, [state]);
    /**
     * Get the error for a field.
     */
    var getError = react_1.useCallback(function (field) {
        return state[field].error;
    }, [state]);
    /**
     * Get the error for a field.
     */
    var isFieldDirty = react_1.useCallback(function (field) {
        return state[field].isDirty;
    }, [state]);
    /**
     * Resets form state back to initialization period.
     */
    var reset = react_1.useCallback(function () {
        setState(function () { return _initFormState(initialState); });
    }, [_initFormState, initialState]);
    return {
        set: set,
        hasErrors: hasErrors,
        data: state,
        reset: reset,
        getValue: getValue,
        getError: getError,
        isFieldDirty: isFieldDirty,
        isDirty: isDirty
    };
}
exports.useForm = useForm;
