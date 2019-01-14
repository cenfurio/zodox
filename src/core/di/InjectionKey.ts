import { Type } from "../../common";
import { InjectionToken } from "./InjectionToken";

// TODO: Use symbols instead to make sure all key's are unique

export type InjectionKey<T = any> = Type<T> | InjectionToken<T> | T;