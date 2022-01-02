export declare namespace UseForm {
    /**
     * The internal state of the form for each field provided as initial tate.
     */
    type State<T> = {
        [P in keyof T]: {
            error: boolean | string;
            isDirty: boolean;
            value: T[P];
        };
    };
    /**
     * Required to provide this hook with initialState.
     * Optionally can provide validators for some or all fields.
     */
    interface Options<T> {
        initialState: T;
        validators?: {
            [P in keyof T]?: (value: T[P], prevFormState: UseForm.State<T> | null) => boolean | string;
        };
    }
    interface Form<T> {
        set: (updatedData: Partial<T>) => void;
        hasErrors: boolean;
        isDirty: boolean;
        data: UseForm.State<T>;
        reset(): void;
        getValue: (field: keyof T) => T[keyof T];
        getError: (field: keyof T) => string | boolean;
        isFieldDirty: (field: keyof T) => boolean;
    }
}
export declare function useForm<T>(options: UseForm.Options<T>): UseForm.Form<T>;
