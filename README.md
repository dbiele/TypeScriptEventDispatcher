# TypeScriptEventDispatcher
TypeScript + CreateJS EventDispatcher

Conversion of the CreateJS EventDispatcher to TypeScript format.  

## Example Use: ##

    import {EventDispatcher} from 'folder/location/createjseventdispatcher';
    import {Event} from 'folder/location/createjsevent';
    export class deviceOrientation extends EventDispatcher {
        constructor() {
            super();
            // wait 2 seconds and then fire testDispatch
            setTimeout(() = > {this.testDispatch();}, 2000);
        }
        testDispatch():void {
            this.dispatchEvent(new Event("change", false, false));          
          }
    }

    // This is the starting function
    export function appExternalModuleTest(): void {
        let _deviceOrientation: deviceOrientation;
        _deviceOrientation = new deviceOrientation();
        _deviceOrientation.addEventListener("change", () => this.changeOrientation());
        //_deviceOrientation.on("progress", () => this.changeOrientation());
    }

    export function changeOrientation(event: Event): void {
        console.log('orienationHasChanged ');
    }

## Notes ##
No need for d.ts files.  Code is written in TypeScript.

CreateJS original source code:
[https://github.com/CreateJS/EaselJS/tree/master/src/createjs/events](https://github.com/CreateJS/EaselJS/tree/master/src/createjs/events)

