import { Omit, Type, makeDecorator } from "@zodox/common";
import { Module } from "@zodox/core";

export interface WebModule extends Omit<Module, 'declarations'> {
    controllers?: Type<any>[];
    middleware?: Type<any>[];
}

export const WebModule = makeDecorator(Module, (module: WebModule) => ({
    ...module,
    declarations: [...module.controllers || [], ...module.middleware || []]
    // exports: module.controllers // Automatically export all controllers
}));