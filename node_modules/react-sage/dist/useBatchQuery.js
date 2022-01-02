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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBatchQuery = void 0;
var React = __importStar(require("react"));
var useInterval_1 = require("./useInterval");
var queryCache_1 = require("./queryCache");
var utils_1 = require("./utils");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useBatchQuery(method, options) {
    var _this = this;
    // Parse out and create defaults for options
    var _a = options.wait, wait = _a === void 0 ? false : _a, _b = options.caching, caching = _b === void 0 ? {} : _b, polling = options.polling, args = options.args, _c = options.retries, retries = _c === void 0 ? 0 : _c;
    // defaults
    var delay = (polling === null || polling === void 0 ? void 0 : polling.delay) ? polling.delay : null;
    var pauseOnVisibilityChange = (polling === null || polling === void 0 ? void 0 : polling.pauseOnVisibilityChange) ? polling.pauseOnVisibilityChange : true;
    // Generate a cache key
    var stableArgs = React.useMemo(function () {
        var arrayOfStableArgs = args.map(function (arg) { return JSON.stringify(arg, Object.keys(arg || {}).sort()); });
        return JSON.stringify(arrayOfStableArgs);
    }, [args]);
    var cacheKey = caching.key ? queryCache_1.queryCache.createKey(caching.key, stableArgs) : undefined;
    var retrieveCachedResult = React.useCallback(function () {
        if (cacheKey) {
            return queryCache_1.queryCache.retrieve({
                key: cacheKey,
                maxAge: caching.maxAge,
                staleWhileRevalidate: caching.staleWhileRevalidate
            });
        }
    }, [cacheKey, caching.maxAge, caching.staleWhileRevalidate]);
    var _d = React.useState(function () {
        var cachedResult = retrieveCachedResult();
        if (cachedResult) {
            return {
                result: cachedResult.data,
                error: cachedResult.error,
                loading: cachedResult.status === 'PENDING' || cachedResult.status === 'EXPIRED' ? true : !wait
            };
        }
        return {
            result: null,
            error: null,
            loading: !wait
        };
    }), state = _d[0], setState = _d[1];
    var fetchQuery = React.useCallback(function (networkRetryCount) { return __awaiter(_this, void 0, void 0, function () {
        var cachedResult, parsedArgs, result_1, error_1, _retries, retryInterval;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    /**
                     * Nothing further to do when the query is told to wait.
                     */
                    if (wait)
                        return [2 /*return*/];
                    cachedResult = retrieveCachedResult();
                    if (!((cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.status) === 'PENDING' && networkRetryCount === undefined)) return [3 /*break*/, 3];
                    setState(function (prevState) {
                        var _a, _b;
                        return {
                            result: (_a = cachedResult.data) !== null && _a !== void 0 ? _a : prevState.result,
                            error: (_b = cachedResult.error) !== null && _b !== void 0 ? _b : prevState.error,
                            loading: true
                        };
                    });
                    // NOTE: 250 is a hard-coded opinion about how long to wait before accessing the cache again to check
                    // for a result. Eventually, if something goes wrong with the underlying network request, then it will flip
                    // to FAILED, in which case this recusrive call should discontinue.
                    return [4 /*yield*/, utils_1.sleep(250)];
                case 1:
                    // NOTE: 250 is a hard-coded opinion about how long to wait before accessing the cache again to check
                    // for a result. Eventually, if something goes wrong with the underlying network request, then it will flip
                    // to FAILED, in which case this recusrive call should discontinue.
                    _e.sent();
                    return [4 /*yield*/, fetchQuery()
                        /**
                         * If we end up here it means that a previous invocation of this query has completed
                         * and been stored in the cache. Therefore, we can proceed with the cached result.
                         */
                    ];
                case 2: return [2 /*return*/, _e.sent()
                    /**
                     * If we end up here it means that a previous invocation of this query has completed
                     * and been stored in the cache. Therefore, we can proceed with the cached result.
                     */
                ];
                case 3:
                    if (!((cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.status) === 'DONE')) return [3 /*break*/, 4];
                    setState(function (prevState) {
                        var _a, _b;
                        return {
                            result: (_a = cachedResult.data) !== null && _a !== void 0 ? _a : prevState.result,
                            error: (_b = cachedResult.error) !== null && _b !== void 0 ? _b : prevState.error,
                            loading: false
                        };
                    });
                    return [3 /*break*/, 12];
                case 4:
                    if (!((cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.status) === 'FAILED')) return [3 /*break*/, 5];
                    setState(function (prevState) {
                        var _a, _b;
                        return {
                            result: (_a = cachedResult.data) !== null && _a !== void 0 ? _a : prevState.result,
                            error: (_b = cachedResult.error) !== null && _b !== void 0 ? _b : prevState.error,
                            loading: false
                        };
                    });
                    return [3 /*break*/, 12];
                case 5:
                    _e.trys.push([5, 7, , 12]);
                    // NOTE: an EXPIRED cache item result will end up here and flip to a state of
                    // PENDING and bring with it all the previous data.
                    if (cacheKey) {
                        queryCache_1.queryCache.upsert({
                            key: cacheKey,
                            value: {
                                status: 'PENDING',
                                // NOTE: keep any previous results or errors in the cache.
                                // This allows UIs to do background fetches without clearing all data.
                                data: (_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _a !== void 0 ? _a : null,
                                error: (_b = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.error) !== null && _b !== void 0 ? _b : null
                            }
                        });
                    }
                    setState(function (prevState) {
                        var _a, _b, _c, _d;
                        return {
                            result: (_b = (_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _a !== void 0 ? _a : prevState.result) !== null && _b !== void 0 ? _b : null,
                            error: (_d = (_c = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.error) !== null && _c !== void 0 ? _c : prevState.error) !== null && _d !== void 0 ? _d : null,
                            loading: true
                        };
                    });
                    parsedArgs = JSON.parse(stableArgs).map(function (stableArg) { return JSON.parse(stableArg); });
                    return [4 /*yield*/, Promise.all(parsedArgs.map(method))
                        /**
                         * If we end up here, it means that all went well and the data returned smoothly.
                         */
                    ];
                case 6:
                    result_1 = _e.sent();
                    /**
                     * If we end up here, it means that all went well and the data returned smoothly.
                     */
                    if (cacheKey) {
                        queryCache_1.queryCache.upsert({
                            key: cacheKey,
                            value: {
                                status: 'DONE',
                                data: result_1,
                                // Can nullify any error on a successul network response.
                                error: null
                            }
                        });
                    }
                    setState(function () {
                        return {
                            result: result_1,
                            error: null,
                            loading: false
                        };
                    });
                    return [3 /*break*/, 12];
                case 7:
                    error_1 = _e.sent();
                    _retries = networkRetryCount !== null && networkRetryCount !== void 0 ? networkRetryCount : retries;
                    if (!(_retries > 0)) return [3 /*break*/, 10];
                    retryInterval = (_c = caching.retryInterval) !== null && _c !== void 0 ? _c : 250;
                    // Either utilize the recursive retryCount or the user-configured initial number of retries.
                    return [4 /*yield*/, utils_1.sleep(_retries * retryInterval)];
                case 8:
                    // Either utilize the recursive retryCount or the user-configured initial number of retries.
                    _e.sent();
                    return [4 /*yield*/, fetchQuery(_retries - 1)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 10:
                    if (cacheKey) {
                        queryCache_1.queryCache.upsert({
                            key: cacheKey,
                            value: {
                                error: error_1,
                                status: 'FAILED',
                                // NOTE: keep previous result around (if exists) so that UI can display the data
                                // alongside the error (if applicable)
                                data: (_d = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _d !== void 0 ? _d : null
                            }
                        });
                    }
                    setState(function (prevState) {
                        var _a;
                        return {
                            error: error_1,
                            result: (_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.data) !== null && _a !== void 0 ? _a : prevState.result,
                            loading: false
                        };
                    });
                    _e.label = 11;
                case 11: return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); }, [stableArgs, method, retrieveCachedResult, wait, cacheKey, retries, caching.retryInterval]);
    // Initiate fetch on mount and whenever the stable args change.
    React.useEffect(function () {
        fetchQuery();
        // Adding fetchQuery to the dep list causes too many refetches.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stableArgs, wait]);
    var refresh = React.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (document.visibilityState && document.visibilityState === 'hidden' && pauseOnVisibilityChange)
                        return [2 /*return*/];
                    // Deleted the cache key before fetching again ensures a "hard" refresh.
                    if (cacheKey)
                        queryCache_1.queryCache.expireKey(cacheKey);
                    return [4 /*yield*/, fetchQuery()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, [cacheKey, fetchQuery, pauseOnVisibilityChange]);
    // The value of `wait` also dictates whether the interval should run its course.
    var reconciledDelay = wait ? null : delay;
    useInterval_1.useInterval(refresh, reconciledDelay);
    return __assign(__assign({}, state), { refresh: refresh });
}
exports.useBatchQuery = useBatchQuery;
