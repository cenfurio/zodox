import { WebPlatform } from './WebPlatform';
import { Module } from '../core';
import { WebModule } from './annotations';
import { Type, makeDecorator } from '../common';

export { Controller, Route, Delete, Get, Patch, Post, Put, Auth, Payload, Validate } from './annotations';

class UserModel {};


// Testing module decorator
interface DbModule extends Module {
    models?: Type<any>[];
}

const DbModule = makeDecorator(Module, (module: DbModule) => ({
    ...module,
    declarations: module.models
}));



@DbModule({
    models: [UserModel]
})
class ModelModule {}

@WebModule({
    controllers: [],
    imports: [ModelModule]
})
class MainModule {}

WebPlatform().loadModule(MainModule);