import { Module } from "../../core";
import { Omit, Type, makeDecorator } from "../../common";

export interface WebModule extends Omit<Module, 'declarations'> {
    controllers: Type<any>[];
}

export const WebModule = makeDecorator(Module, (module: WebModule) => ({
    ...module,
    declarations: module.controllers,
    // exports: module.controllers // Automatically export all controllers
}));