import { InjectionToken } from "./di";
import { Injectable, Inject, Optional } from "./annotations";

export const APP_INITIALIZER = new InjectionToken<Promise<any>[]>('Application Initializers');

@Injectable()
export class ApplicationInitializer {
    private _donePromise: Promise<any>;
    private _done = false;

    constructor(@Inject(APP_INITIALIZER) @Optional() initializers: Promise<any>[] = []) {
        this._donePromise = Promise.all(initializers).then(() => this._done = true);
    }

    get done(): boolean {
        return this.done;
    }

    get promise(): Promise<any> {
        return this._donePromise;
    }
}