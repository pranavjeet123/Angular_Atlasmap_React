export declare namespace UseQuery {
    interface Options<T> {
        /**
         * Must provide this key to options.
         */
        args: T;
        wait?: boolean;
        caching?: Caching;
        polling?: Polling;
        retries?: number;
    }
    interface Caching {
        /**
         * A unique key to store the query in the caching layer.
         * The final caching key is a combination of this key + the args passed to the method.
         */
        key?: string;
        /**
         * In seconds.
         */
        maxAge?: number;
        /**
         * In seconds.
         */
        staleWhileRevalidate?: number;
        /**
         * The amount of time to wait before retrying the cache for a pending result. In milliseconds.
         * Default is 250ms.
         */
        retryInterval?: number;
    }
    interface Polling {
        /**
         * Number representing the delay in ms. Set to `null` to "pause" the interval.
         */
        delay: number | null;
        /**
         * Should invoking the the query be paused when the document visiblilty changes?
         * Default is true.
         * https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
         */
        pauseOnVisibilityChange?: boolean;
    }
    interface Response<U> {
        result: U | null;
        refresh: () => Promise<void>;
        error: Error | null;
        loading: boolean;
    }
}
export declare function useQuery<T, U>(method: (args: T) => Promise<U>, options: UseQuery.Options<T>): UseQuery.Response<U>;
