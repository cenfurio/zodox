import { Type, asyncForEach, Destroyable, removeItem } from '../../common';
import { Injector } from "../di";

import { Server } from 'hapi';
import { MetadataResolver } from "../resolvers/MetadataResolver";
import { ModuleFactory } from '../factories/ModuleFactory';
import { ControllerFactory } from '../factories/ControllerFactory';
import { Injectable } from '../annotations';
import { ModuleRef } from './ModuleRef';

@Injectable()
export class ApplicationRef implements Destroyable {
    
    private modules: ModuleRef[] = [];

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

        this.modules.push(moduleRef);

        moduleRef.onDestroy(() => removeItem(this.modules, moduleRef));

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

        // setTimeout(() => {
        //     this.destroy();
        // }, 2000);

        return this.server;
    }

    destroy() {
        console.debug('[ApplicationRef]: destroy()');
        this.modules.forEach(moduleRef => moduleRef.destroy());
        this.server.stop();
        console.debug('[ServerRef]: Destroyed');
        console.debug('[ApplicationRef]: Destroyed');
    }
}