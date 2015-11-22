import {iEvent} from 'utility/createjsevent';
export class iEventDispatcher {

    public _listeners = null;

    public _captureListeners = null;

    constructor() { }

    initialize(target: Object): void {
        target['addEventListener'] = this.addEventListener;
        target['on'] = this.on;
        target['removeEventListener'] = target['off'] = this.removeEventListener;
        target['removeAllEventListeners'] = this.removeAllEventListeners;
        target['hasEventListener'] = this.hasEventListener;
        target['dispatchEvent'] = this.dispatchEvent;
        target['_dispatchEvent'] = this._dispatchEvent;
        target['willTrigger'] = this.willTrigger;
    }

    addEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): Function;
    addEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): Function;
    addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): Object;
    addEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): Object;
    addEventListener(type, listener, useCapture) {
        var listeners;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
        } else {
            listeners = this._listeners = this._listeners || {};
        }
        var arr = listeners[type];
        if (arr) { this.removeEventListener(type, listener, useCapture); }
        arr = listeners[type]; // remove may have deleted the array
        if (!arr) { listeners[type] = [listener]; }
        else { arr.push(listener); }
        return listener;
    };

    on(type: string, listener: (eventObj: Object) => boolean, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
    on(type: string, listener: (eventObj: Object) => void, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Function;
    on(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
    on(type: string, listener: { handleEvent: (eventObj: Object) => void; }, scope?: Object, once?: boolean, data?: any, useCapture?: boolean): Object;
    on(type, listener, scope, once, data, useCapture) {
        if (listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent;
        }
        scope = scope || this;
        return this.addEventListener(type, function (evt) {
            listener.call(scope, evt, data);
            once && evt['remove']();
        }, useCapture);
    };

    removeEventListener(type: string, listener: (eventObj: Object) => boolean, useCapture?: boolean): void;
    removeEventListener(type: string, listener: (eventObj: Object) => void, useCapture?: boolean): void;
    removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => boolean; }, useCapture?: boolean): void;
    removeEventListener(type: string, listener: { handleEvent: (eventObj: Object) => void; }, useCapture?: boolean): void;
    removeEventListener(type: string, listener: Function, useCapture?: boolean): void; // It is necessary for "arguments.callee"
    removeEventListener(type, listener, useCapture): void {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        var arr = listeners[type];
        if (!arr) { return; }
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) { delete (listeners[type]); } // allows for faster checks.
                else { arr.splice(i, 1); }
                break;
            }
        }
    };


    off = removeEventListener;


    removeAllEventListeners(type?: string): void {
        if (!type) { this._listeners = this._captureListeners = null; }
        else {
            if (this._listeners) { delete (this._listeners[type]); }
            if (this._captureListeners) { delete (this._captureListeners[type]); }
        }
    };

    dispatchEvent(eventObj: Object, target?: Object): boolean;
    dispatchEvent(eventObj: string, target?: Object): boolean;
    dispatchEvent(eventObj: Event, target?: Object): boolean;
    public dispatchEvent(eventObj, target): boolean {
        if (typeof eventObj == "string") {
            // skip everything if there's no listeners and it doesn't bubble:
            var listeners = this._listeners;
            //if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
            if ((!listeners || !listeners[eventObj])) { return true; }
            //eventObj = new iEvent(eventObj, bubbles, cancelable);
            eventObj = new iEvent(eventObj, false, false);
        } else if (eventObj.target && eventObj.clone) {
            // redispatching an active event object, so clone it:
            eventObj = eventObj.clone();
        }
		
        // TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
        try { eventObj.target = this; } catch (e) { } // try/catch allows redispatching of native events
        if (!eventObj.bubbles || !parent) {
            this._dispatchEvent(eventObj, 2);
        } else {
            var top = this;
            var list = [top];
            while (top['parent']) {
                list.push(top = top['parent']);
            }
            var i, l = list.length;

            // capture & atTarget
            for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
                list[i]._dispatchEvent(eventObj, (i == 0) ? 2 : 1);
            }
            // bubbling
            for (i = 1; i < l && !eventObj.propagationStopped; i++) {
                list[i]._dispatchEvent(eventObj, 3);
            }
        }
        return !eventObj.defaultPrevented;
    };


    hasEventListener(type: string): boolean {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
    };

    willTrigger(type: string) {
        let o = this;
        while (o) {
            if (o.hasEventListener(type)) { return true; }

            //o = o.parent;
        }
        return false;
    };


    toString(): string {
        return "[EventDispatcher]";
    };


    _dispatchEvent(eventObj, eventPhase): boolean {
        var l, listeners = (eventPhase == 1) ? this._captureListeners : this._listeners;
        if (eventObj && listeners) {
            var arr = listeners[eventObj.type];
            if (!arr || !(l = arr.length)) { return; }
            try { eventObj.currentTarget = this; } catch (e) { }
            try { eventObj.eventPhase = eventPhase; } catch (e) { }
            eventObj.removed = false;

            arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
            for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
                var o = arr[i];
                if (o.handleEvent) { o.handleEvent(eventObj); }
                else { o(eventObj); }
                if (eventObj.removed) {
                    this.off(eventObj.type, o, eventPhase == 1);
                    eventObj.removed = false;
                }
            }
        }
    };

}

