import React, { useEffect, useRef, useState } from 'react';
import { interval, fromEvent, merge, NEVER } from 'rxjs';
import { map, takeUntil, mapTo, scan, startWith, switchMap, tap, buffer, filter, debounceTime } from 'rxjs/operators';
import { stopwatchService as sws } from './realizedServices/stopwatch';
import { useObservable } from './components/useObservalble';

import './App.css';

const App = () => {
    const s = useObservable(sws.s);
    const m = useObservable(sws.m);
    const h = useObservable(sws.h);

    const startBtn = useRef(null);
    const stopBtn = useRef(null);
    const waitBtn = useRef(null);
    const resetBtn = useRef(null);

    const go = v => {

        if (v === 0) {
            debugger;
            sws.setS(0);
            sws.setM(0);
            sws.setH(0);
            return
        }

        if (sws.getM() === 60) {
            sws.setH(sws.getH() + 1);
            sws.setM(0);
        }

        if (sws.getS() === 60) {
            sws.setM(sws.getM() + 1);
            sws.setS(0);
        }

        if (v % 100 === 0) {
            sws.setS(sws.getS() + 1);
        }
    };

    useEffect(() => {
        const toReturnClickObservable = ref => fromEvent(ref.current, 'click');
        const editClickObservable = (ref, obj) => toReturnClickObservable(ref).pipe(mapTo(obj));
        const mergeObservables = merge(
            editClickObservable(startBtn, { count: true }),
            editClickObservable(stopBtn, { count: false }),
            editClickObservable(resetBtn, { value: 0 })
        );

        const globalObservable = mergeObservables.pipe(
            startWith({
                count: false,
                value: 0
            }),
            scan((state, curr) => ({ ...state, ...curr }), {}),
            tap((state) => {
                go(state.value)
            }),
            switchMap((state) =>
                state.count ?
                    interval(10).pipe(
                        map(v => go(v)),
                        takeUntil(fromEvent(waitBtn.current, 'click').pipe(
                            buffer(
                                fromEvent(waitBtn.current, 'click').pipe(debounceTime(300))
                            ),
                            map(list => list.length),
                            filter(x => x === 2)
                        )))
                    : NEVER
            )
        );

        globalObservable.subscribe();

    }, [])

    return (
        <div className='main-wrapper'>
            <h1>Stopwatch</h1>
            <h2>{`${h}:${m}:${s}`}</h2>
            <div>
                <button ref={startBtn}>Start</button>
                <button ref={stopBtn}>Stop</button>
                <button ref={waitBtn}>Wait</button>
                <button ref={resetBtn}>Reset</button>
            </div>
        </div>
    );
}
export default App;