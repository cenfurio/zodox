import { InjectionKey } from "../InjectionKey";

export interface BaseProvider<T> {
    provide: InjectionKey<T>;
}