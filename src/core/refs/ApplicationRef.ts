import { Type, asyncForEach, Destroyable, removeItem } from '../../common';
import { Injector } from "../di";
import { Type, asyncForEach } from '../../common';
import { Injector, InjectionToken } from "../di";

import { MetadataResolver } from "../resolvers/MetadataResolver";
import { ModuleFactory } from '../factories/ModuleFactory';
import { ControllerFactory } from '../factories/ControllerFactory';
import { Injectable, Inject, Optional } from '../annotations';

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

    destroy() {
        console.debug('[ApplicationRef]: destroy()');
        this.modules.forEach(moduleRef => moduleRef.destroy());
        this.server.stop();
        console.debug('[ServerRef]: Destroyed');
        console.debug('[ApplicationRef]: Destroyed');
    }
}

export abstract class ApplicationRef {
    abstract start(): Promise<any>;
}