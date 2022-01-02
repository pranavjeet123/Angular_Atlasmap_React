export declare namespace UsePersistedState {
    interface StorageOptions {
        storage: Storage;
        key: string;
        version?: number;
    }
    interface Options<S> extends StorageOptions {
        initialState?: S;
    }
    interface Data<S> {
        version: number;
        data: S;
    }
}
export declare function usePersistedState<S>({ storage, key, initialState, version }: UsePersistedState.Options<S>): any[];
