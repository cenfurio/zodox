export { TypeMetadata, ModuleMetadata } from './metadata';
export { Inject, Injectable, Optional, Self, SkipSelf, Module, ModuleWithProviders } from './annotations';
export { Provider, InjectionToken, Injector } from './di';
export { NoAnnotationError, NoProviderError } from './errors';
// export { ControllerFactory, ModuleFactory } from './factories';
export { ApplicationRef, ModuleRef, DeclarationHandler, ModuleDeclarationLoader, PlatformRef, createPlatform, MODULE_DECLARATION_HANDLER } from './refs';
export { MetadataResolver, BaseResolver, ModuleResolver, META_RESOLVERS } from './resolvers';

export { ApplicationModule } from './ApplicationModule';
export { APP_INITIALIZER, ApplicationInitializer } from './ApplicationInitializer';
export { CorePlatform } from './Platform';