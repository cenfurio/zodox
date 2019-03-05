import { InjectionKey } from "../InjectionKey";

export interface BaseProvider<T> {
    provide: InjectionKey<T>;

    /**
     * If true, then injector returns an array of instances. This is useful to allow multiple
     * providers spread across many files to provide configuration information to a common token.
     */
    multi?: boolean;
}