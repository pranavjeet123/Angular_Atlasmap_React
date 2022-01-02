import { WithState, State } from '../types';
export default class Stateful implements WithState {
    private state;
    getState<S = {}>(): S;
    setState(state: State): void;
}
//# sourceMappingURL=Stateful.d.ts.map