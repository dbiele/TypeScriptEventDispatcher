
export class iEvent {

    private type: string;
    private target:any = null;
    private currentTarget:any;
    private eventPhase:number = 0;
    private bubbles: boolean;
    private cancelable: boolean;
    //private timeStamp: number = new Date().getTime();
    private timeStamp: number = new Date().getTime();
    private defaultPrevented: boolean = false;
    private propagationStopped: boolean = false;
    private immediatePropagationStopped: boolean = false;
    private removed: boolean = false;

    constructor(type: string, bubbles: boolean, cancelable: boolean) {
        console.log('ievent');
    }

    public preventDefault():void {
        this.defaultPrevented = this.cancelable && true;
    };

    public stopPropagation():void {
        this.propagationStopped = true;
    };


    public stopImmediatePropagation():void {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };

    public remove():void {
        this.removed = true;
    };

    public clone():iEvent {
        return new iEvent(this.type, this.bubbles, this.cancelable);
    };

    public set(props: Object): iEvent {
        for (var n in props) {
            this[n] = props[n];
        }
        return this;
    };

    public toString():string {
        return "[iEvent (type=" + this.type + ")]";
    };
}
