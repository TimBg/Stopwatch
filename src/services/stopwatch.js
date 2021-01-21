import { Observable } from './../observable/observable';

export class StopwatchService {
    s = new Observable(0);
    m = new Observable(0);
    h = new Observable(0);

    setS(s) {
        this.s.set(s);
    }

    setM(m) {
        this.m.set(m);
    }

    setH(h) {
        this.h.set(h);
    }

    getS() {
        return this.s.get();
    }

    getM() {
        return this.m.get();
    }

    getH() {
        this.h.get();
    }
}