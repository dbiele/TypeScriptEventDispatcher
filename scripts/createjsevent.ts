
export class Event {

    private type: string;
    private target:any = null;
    private currentTarget:any;
    private eventPhase:number = 0;
    private bubbles: boolean;
    private cancelable: boolean;
    private timeStamp: number = new Date().getTime();
    private defaultPrevented: boolean = false;
    private propagationStopped: boolean = false;
    private immediatePropagationStopped: boolean = false;
    private removed: boolean = false;

    // constructor:
    /**
	 * Contains properties and methods shared by all events for use with
	 * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
	 * 
	 * Note that Event objects are often reused, so you should never
	 * rely on an event object's state outside of the call stack it was received in.
	 * @class Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/

    constructor(type: string, bubbles: boolean, cancelable: boolean) {
        this.type = type;
        // dont like using !! for a type conversion. Personal choice
        //this.bubbles = !!bubbles;
        //this.cancelable = !!cancelable;
        if (bubbles !== undefined) {
            this.bubbles = Boolean(bubbles)
        };
        if (cancelable !== undefined) {
            this.cancelable = Boolean(cancelable)
        };
        
    }

    /**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
    // p.initialize = function() {}; // searchable for devs wondering where it is.

    // public methods:
    /**
	 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
	 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
	 * cancel the default behaviour associated with the event.
	 * @method preventDefault
	 **/
    public preventDefault():void {
        this.defaultPrevented = this.cancelable && true;
    };

    /**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopPropagation
	 **/
    public stopPropagation():void {
        this.propagationStopped = true;
    };

    /**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopImmediatePropagation
	 **/
    public stopImmediatePropagation():void {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };

    /**
	 * Causes the active listener to be removed via removeEventListener();
	 * 
	 * 		myBtn.addEventListener("click", function(evt) {
	 * 			// do stuff...
	 * 			evt.remove(); // removes this listener.
	 * 		});
	 * 
	 * @method remove
	 **/
    public remove():void {
        this.removed = true;
    };

    /**
	 * Returns a clone of the Event instance.
	 * @method clone
	 * @return {Event} a clone of the Event instance.
	 **/
    public clone():Event {
        return new Event(this.type, this.bubbles, this.cancelable);
    };

    /**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the instance.
	 * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	*/
    public set(props: Object): Event {
        for (var n in props) {
            this[n] = props[n];
        }
        return this;
    };

    /**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
    public toString():string {
        return "[Event (type=" + this.type + ")]";
    };
}
