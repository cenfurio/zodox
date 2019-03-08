import { Module } from "../../core";
import { Omit, Type, makeDecorator } from "../../common";

export interface DiscordModule extends Omit<Module, 'declarations'> {
    
}

export const DiscordModule = makeDecorator(Module, (module: DiscordModule) => ({
    ...module,
    declarations: []
    // exports: module.controllers // Automatically export all controllers
}));