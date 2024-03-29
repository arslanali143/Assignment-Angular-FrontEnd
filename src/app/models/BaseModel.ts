export enum State {
    Detached = 1,
    Unchanged = 2,
    Added = 4,
    Deleted = 8,
    Modified = 16
}
export class BaseClass {
    public stateEnum : State; 
    constructor() {
        this.stateEnum = State.Unchanged;
    }
}