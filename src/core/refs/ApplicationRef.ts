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

        // FIXME: This really is just a temp fix, should be done in a more proper way
        if(moduleRef.plugins) {
            await asyncForEach(moduleRef.plugins, async (plugin) => {
                await this.server.register(plugin);
            });
        }

        if(moduleRef.auth) {
            if(moduleRef.auth.strategies) {
                await asyncForEach(moduleRef.auth.strategies, async (strategy) => {
                    this.server.auth.strategy(strategy.name, strategy.scheme, strategy.options);
                });
            }

            if(moduleRef.auth.default) {
                this.server.auth.default(moduleRef.auth.default);
            }
        }

        await asyncForEach(moduleFactory.controllers, async (controller) => {
            const controllerFactory = new ControllerFactory(this.resolver.getControllerSummary(controller));

            const controllerRef = controllerFactory.create(moduleRef.injector);

            this.server.route([...controllerRef.routes]);
        });

        await this.server.start();

        return this.server;
    }
}