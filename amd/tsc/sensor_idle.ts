

import { IRuleAction } from './rule_manager';

export function sensor_idle(callback: (action: IRuleAction) => void, action: IRuleAction, idleTime ?: number) {
    
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
        timerID = setTimeout((() => {
            
            callback(action);
        // @ts-ignore
        }), idleTime)
    }
};