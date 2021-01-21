export class Observable {
    _listeners = [];

    constructor(val) {
        this._val = val;
    }

    get() {
        return this._val;
    }

    set(val) {
        if (this._val !== val) {
            this._val = val;
            this._listeners.forEach(l => l(val));
        }
    }

    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }
}