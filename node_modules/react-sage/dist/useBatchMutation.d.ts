export declare namespace UseBatchMutation {
    interface Result<U> {
        error: Error | null;
        loading: boolean;
        response: U[];
    }
}
export declare function useBatchMutation<T, U>(method: (params: T) => Promise<U>, onSuccess?: (r: U[]) => void, onError?: (e: Error) => void): {
    result: UseBatchMutation.Result<U>;
    invoke: (params: T[]) => Promise<void>;
    invocations: UseBatchMutation.Result<U>[];
    reset: () => void;
};
