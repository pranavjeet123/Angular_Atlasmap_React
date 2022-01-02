import { UseQuery } from './useQuery';
export declare namespace UseBatchQuery {
    interface Options<T> {
        /**
         * Required. Must provide a list of args.
         */
        args: T[];
        /**
         * The query will not fire on mount while this is set to true.
         */
        wait?: boolean;
        /**
         * Caching-related options.
         */
        caching?: UseQuery.Caching;
        /**
         * The number of network retries to attempt when a query raises an exception.
         */
        retries?: number;
        /**
         * Polling-related options.
         */
        polling?: UseQuery.Polling;
    }
}
export declare function useBatchQuery<T, U>(method: (args: T) => Promise<U>, options: UseBatchQuery.Options<T>): {
    refresh: () => Promise<void>;
    result: U[] | null;
    error: Error | null;
    loading: boolean;
};
