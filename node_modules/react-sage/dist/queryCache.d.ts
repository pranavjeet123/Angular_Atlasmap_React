/**
 * Helper class for dealing with in-memory cache.
 */
export declare namespace QueryCache {
    type Status = 'PENDING' | 'DONE' | 'FAILED' | 'EXPIRED';
    type Mode = 'ONLINE' | 'OFFLINE';
    type Type = 'IN_MEMORY' | 'SESSION_STORAGE' | 'LOCAL_STORAGE';
    interface Item<T> {
        cachedAt: number;
        data: T | null;
        error: Error | null;
        status: Status;
    }
    interface ItemCreateParams<T> {
        key: string;
        value: Pick<Item<T>, 'data' | 'error' | 'status'>;
    }
}
export declare class Cache {
    /**
     * A global TTL (in seconds) to cosnider when retrieving data from the cache.
     * Default is 0 - so important to configure for your needs.
     * NOTE: A more specific TTL can be applied to individual cache retrievals.
     */
    maxAge: number;
    /**
     * https://web.dev/stale-while-revalidate/
     */
    staleWhileRevalidate: number;
    /**
     * The maximum number of keys to be stored in the cache.
     * Default is 0 - so important to configure for your needs.
     */
    maxSize: number;
    /**
     * Either online or offline.
     * When offline, TTLs and clearing are ignored - and cache is always returned if exists.
     */
    mode: QueryCache.Mode;
    /**
     * Print warnings and tips to the console
     */
    logWarnings: boolean;
    /**
     * Either in-memory or persisted.
     */
    type: QueryCache.Type;
    _queryCache: Map<string, QueryCache.Item<unknown>>;
    constructor();
    get cache(): Map<string, QueryCache.Item<unknown>>;
    /**
     * Calling this method persists the in-mem map to local storage.
     */
    private save;
    /**
     * @param ttl - this value (in seconds) is used for all cache retrievals that do not specify a TTL.
     * If a TTL is included in a given cache.retrieve(key, ttl), it will override this setting.
     *
     * @param maxSize - this value is to control how many entries are allowed in the cache before begin space is reclaimed for new ones.
     */
    configure(configs: {
        /**
         * In seconds.
         */
        maxAge?: number;
        maxSize?: number;
        staleWhileRevalidate?: number;
        mode?: QueryCache.Mode;
        type?: QueryCache.Type;
        logWarnings?: boolean;
    }): void;
    private logWarning;
    upsert<T>(item: QueryCache.ItemCreateParams<T>): boolean;
    /**
     * @param key The key on which to store this cached value.
     * @param ttl The TTL (in seconds) for this particular retrieval.
     */
    retrieve<T>(args: {
        key: string;
        maxAge?: number;
        staleWhileRevalidate?: number;
    }): QueryCache.Item<T> | undefined;
    /**
     * This is essentially a helper-class.
     */
    createKey(...parts: string[]): string | undefined;
    /**
     * Provide the exact key to delete from the cache.
     */
    deleteKey(key: string): void;
    /**
     * Provide a list of exact keys delete from the cache.
     * Also saves the side effect of the delete operation (after bulk change is made)
     */
    deleteKeys(keys: string[]): void;
    /**
     * Provide one or many parts of the keys that should be deleted from the cache.
     */
    deleteKeysWithPartialMatch(...parts: Array<string | number>): void;
    /**
     * This job of this method is to  update the status property of the provided key.
     * Also saves the side effect of this update.
     */
    expireKey<T>(key: string): QueryCache.Item<T> | undefined;
    /**
     * Clears the map and saves the side effect of doing so.
     * Is a no-op when cahce is in OFFLINE mode.
     */
    clear(): void;
}
export declare const queryCache: Cache;
