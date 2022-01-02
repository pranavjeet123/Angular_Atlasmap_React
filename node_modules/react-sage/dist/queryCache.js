"use strict";
/**
 * Helper class for dealing with in-memory cache.
 */
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCache = exports.Cache = void 0;
var NAMESPACE = '_queryCache';
var Cache = /** @class */ (function () {
    function Cache() {
        this._queryCache = new Map();
        /**
         * Defaults to 0, which means users must configure this for the cache to do anything at all.
         */
        this.maxAge = 0;
        /**
         * Defaults to 0, which means users must configure this for the cache to do anything at all.
         */
        this.staleWhileRevalidate = 0;
        /**
         * Defaults to 0, which means users must configure this for the cache to do anything at all.
         */
        this.maxSize = 0;
        this.mode = 'ONLINE';
        this.type = 'IN_MEMORY';
        this.logWarnings = true;
        this.configure = this.configure.bind(this);
        this.upsert = this.upsert.bind(this);
        this.retrieve = this.retrieve.bind(this);
        this.createKey = this.createKey.bind(this);
        this.deleteKey = this.deleteKey.bind(this);
        this.deleteKeysWithPartialMatch = this.deleteKeysWithPartialMatch.bind(this);
        this.expireKey = this.expireKey.bind(this);
    }
    Object.defineProperty(Cache.prototype, "cache", {
        get: function () {
            try {
                if (this.type === 'LOCAL_STORAGE') {
                    var _queryCacheFromStorage = window.localStorage.getItem(NAMESPACE);
                    if (_queryCacheFromStorage) {
                        this._queryCache = new Map(JSON.parse(_queryCacheFromStorage));
                    }
                }
                if (this.type === 'SESSION_STORAGE') {
                    var _queryCacheFromStorage = window.sessionStorage.getItem(NAMESPACE);
                    if (_queryCacheFromStorage) {
                        this._queryCache = new Map(JSON.parse(_queryCacheFromStorage));
                    }
                }
                return this._queryCache;
            }
            catch (err) {
                return this._queryCache;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Calling this method persists the in-mem map to local storage.
     */
    Cache.prototype.save = function () {
        try {
            if (this.type === 'LOCAL_STORAGE') {
                var serializedData = JSON.stringify(Array.from(this._queryCache.entries()));
                window.localStorage.setItem(NAMESPACE, serializedData);
            }
            if (this.type === 'SESSION_STORAGE') {
                var serializedData = JSON.stringify(Array.from(this._queryCache.entries()));
                window.sessionStorage.setItem(NAMESPACE, serializedData);
            }
        }
        catch (err) {
            // no-op
        }
    };
    /**
     * @param ttl - this value (in seconds) is used for all cache retrievals that do not specify a TTL.
     * If a TTL is included in a given cache.retrieve(key, ttl), it will override this setting.
     *
     * @param maxSize - this value is to control how many entries are allowed in the cache before begin space is reclaimed for new ones.
     */
    Cache.prototype.configure = function (configs) {
        if (configs.mode) {
            this.mode = configs.mode;
        }
        if (configs.type) {
            this.type = configs.type;
        }
        if (configs.logWarnings) {
            this.logWarnings = configs.logWarnings;
        }
        if (typeof configs.maxAge === 'number' && configs.maxAge >= 0) {
            this.maxAge = configs.maxAge;
        }
        if (typeof configs.maxSize === 'number' && configs.maxSize >= 0) {
            this.maxSize = configs.maxSize;
        }
        if (typeof configs.staleWhileRevalidate === 'number' && configs.staleWhileRevalidate >= 0) {
            this.staleWhileRevalidate = configs.staleWhileRevalidate;
        }
    };
    Cache.prototype.logWarning = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        if (this.logWarnings) {
            console.warn.apply(console, __spreadArrays(['[react-sage]', '[queryCache]'], parts));
        }
    };
    Cache.prototype.upsert = function (item) {
        // When maxSize is set to zero, then upsert is essentially a no-op.
        if (this.maxSize <= 0) {
            this.logWarning('maxSize must be configured to a value greater than 0 in to enable the query cache');
            return false;
        }
        // When offline, do not add to the cache.
        if (this.mode === 'OFFLINE')
            return false;
        if (this.cache.size >= this.maxSize) {
            // When exceeds max size, shift (ie, remove the oldest key) and delete from cache.
            // NOTE: ES6 maps retain the order in which keys are inserted, hence using pop method is reliable.
            var oldestKey = this.cache.entries().next().value[0];
            // NOTE: delete from this.cache (instead of using deleteKey method) so that
            // save method is only invoked once (see below)
            if (oldestKey)
                this.cache.delete(oldestKey);
        }
        // NOTE: Delete operation is important precedent, as it ensures that the newly
        // set item is last in the list of entries (ie, the latest) and will not get
        // shifted too soon.
        this.cache.delete(item.key);
        this.cache.set(item.key, {
            data: item.value.data,
            error: item.value.error,
            status: item.value.status,
            cachedAt: Date.now()
        });
        // Save the side effect of this delete + set
        this.save();
        return true;
    };
    /**
     * @param key The key on which to store this cached value.
     * @param ttl The TTL (in seconds) for this particular retrieval.
     */
    Cache.prototype.retrieve = function (args) {
        var _a, _b;
        if (this.maxAge <= 0 && args.maxAge === undefined) {
            this.logWarning(args.key, 'maxAge must be configured to a value greater than 0 in order to enable proper caching');
            return undefined;
        }
        if (this.staleWhileRevalidate <= 0 && args.staleWhileRevalidate === undefined) {
            this.logWarning(args.key, 'staleWhileRevalidate must be configured to a value greater than 0 in order to enable proper caching');
            return undefined;
        }
        var cachedItem = this.cache.get(args.key);
        if (cachedItem === undefined) {
            return undefined;
        }
        // When in OFFLINE mode, return all cached items right away.
        // Do not include pending items, though, as that will lead to misguided UI.
        if (this.mode === 'OFFLINE' && cachedItem.status !== 'PENDING') {
            return cachedItem;
        }
        // NOTE: Date.now() and cachedAt are both in MS, therefore divide to convert to seconds.
        var cacheAge = (Date.now() - cachedItem.cachedAt) / 1000;
        // Check Stale While Revalidate (must go before maxAge for obvious reasons)
        // Go by specificity: if a SWR value is provided in the retrieve params, use that, else use the default configuration.
        var staleWhileRevalidate = (_a = args.staleWhileRevalidate) !== null && _a !== void 0 ? _a : this.staleWhileRevalidate;
        if (cacheAge > staleWhileRevalidate) {
            this.deleteKey(args.key);
            return undefined;
        }
        // Check max age
        // Go by specificity: if a maxAge value is provided in the retrieve params, use that, else use the default configuration.
        var maxAge = (_b = args.maxAge) !== null && _b !== void 0 ? _b : this.maxAge;
        if (cacheAge > maxAge) {
            var expiredItem = this.expireKey(args.key);
            return expiredItem;
        }
        return cachedItem;
    };
    /**
     * This is essentially a helper-class.
     */
    Cache.prototype.createKey = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        if (parts.length)
            return parts.join('::');
        return undefined;
    };
    /**
     * Provide the exact key to delete from the cache.
     */
    Cache.prototype.deleteKey = function (key) {
        this.deleteKeys([key]);
    };
    /**
     * Provide a list of exact keys delete from the cache.
     * Also saves the side effect of the delete operation (after bulk change is made)
     */
    Cache.prototype.deleteKeys = function (keys) {
        var _this = this;
        keys.forEach(function (key) {
            _this.cache.delete(key);
        });
        this.save();
    };
    /**
     * Provide one or many parts of the keys that should be deleted from the cache.
     */
    Cache.prototype.deleteKeysWithPartialMatch = function () {
        var parts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parts[_i] = arguments[_i];
        }
        var keysToDelete = [];
        if (parts.length) {
            this.cache.forEach(function (_, key) {
                var shouldDelete = parts.every(function (part) { return key.includes(String(part)); });
                if (shouldDelete)
                    keysToDelete.push(key);
            });
            if (keysToDelete.length) {
                this.deleteKeys(keysToDelete);
            }
        }
    };
    /**
     * This job of this method is to  update the status property of the provided key.
     * Also saves the side effect of this update.
     */
    Cache.prototype.expireKey = function (key) {
        var value = this.cache.get(key);
        if (value) {
            var newValue = __assign(__assign({}, value), { status: 'EXPIRED' });
            var updatedMap = this.cache.set(key, newValue);
            var updatedValue = updatedMap.get(key);
            this.save();
            return updatedValue;
        }
        return undefined;
    };
    /**
     * Clears the map and saves the side effect of doing so.
     * Is a no-op when cahce is in OFFLINE mode.
     */
    Cache.prototype.clear = function () {
        if (this.mode === 'ONLINE') {
            this.cache.clear();
            this.save();
        }
    };
    return Cache;
}());
exports.Cache = Cache;
exports.queryCache = new Cache();
