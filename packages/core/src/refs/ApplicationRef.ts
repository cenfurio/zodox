import { Injectable } from '../annotations';
import { ModuleRef } from "./ModuleRef";

@Injectable()
export class ApplicationRef {
    constructor(private moduleRef: ModuleRef<any>) {}

    start() {
        if(this.moduleRef.instance.onStart) {
            this.moduleRef.instance.onStart(this);
        }
    }
}