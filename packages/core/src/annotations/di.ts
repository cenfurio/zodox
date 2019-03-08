import { makeDecorator, makeParamDecorator } from "@zodox/common";

import { InjectionToken } from "../di";

/**
 * A marker metadata that marks a class as available to {@link Injector} for creation.
 *
 * {@link Injector} will throw an error when trying to instantiate a class that
 * does not have `@Injectable` marker, as shown in the example above.
 */
export const Injectable = makeDecorator(null);

/**
 * A parameter decorator that specifies a dependency.
 *
 * When `@Inject()` is not present, the {@link Injector} will use the type annotation of the
 * parameter.
 */
export const Inject = makeParamDecorator(null, (token: InjectionToken<any>) => ({ token }));

/**
 * Specifies that an {@link Injector} should retrieve a dependency only from itself.
 */
export const Self = makeParamDecorator(null);

/**
 * Specifies that the dependency resolution should start from the parent {@link Injector}.
 */
export const SkipSelf = makeParamDecorator(null);

/**
 * A parameter metadata that marks a dependency as optional.
 */
export const Optional = makeParamDecorator(null);