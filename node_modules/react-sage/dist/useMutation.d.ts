export declare function useMutation<T, U>(method: (...params: T[]) => Promise<U>, onSuccess?: (r: U) => void, onError?: (e: Error) => void): {
    result: {
        response: U | null;
        error: Error | null;
        loading: boolean;
    };
    invocations: import("./useBatchMutation").UseBatchMutation.Result<U>[];
    invoke: (params: T) => void;
    reset: () => void;
};
