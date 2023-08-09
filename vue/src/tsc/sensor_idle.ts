/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Detects users being idle for a given amount of time
 *
 */

import { IRuleAction } from './rules';

export function sensor_idle(callback: (action: IRuleAction) => void, action: IRuleAction, idleTime?: number) {

    idleTime = idleTime === undefined ? 3000 : idleTime;
    let timerID: number;
    // Register events
    window.addEventListener('load', resetTimer, true);
    var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
        document.addEventListener(name, resetTimer, true);
    });

    function resetTimer() {
        clearTimeout(timerID);
        timerID = window.setTimeout((() => {
            callback(action);
        }), idleTime)
    }
};