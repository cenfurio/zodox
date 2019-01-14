import { Type, asyncForEach } from '../../common';
import { Injector } from "../di";

import { Server } from 'hapi';
import { MetadataResolver } from "../resolvers/MetadataResolver";
import { ModuleFactory } from '../factories/ModuleFactory';
import { ControllerFactory } from '../factories/ControllerFactory';
import { Injectable } from '../annotations';

@Injectable()
export class ApplicationRef {
    constructor(
        private injector: Injector,
        private server: Server,
        private resolver: MetadataResolver) {}

    /**
     * Loads a module and starts the hapi server
     * @param module The module to load
     */
    async loadModule(module: Type<any>) {
        const moduleFactory = new ModuleFactory(this.resolver.getModuleSummary(module));
        const moduleRef = moduleFactory.create(this.injector);

        await asyncForEach(moduleFactory.controllers, async (controller) => {
            const controllerFactory = new ControllerFactory(this.resolver.getControllerSummary(controller));

            const controllerRef = controllerFactory.create(moduleRef.injector);

            this.server.route([...controllerRef.routes]);
        });

        await this.server.start();

        return this.server;
    }
}