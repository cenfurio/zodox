import { TypeProvider } from "./TypeProvider";
import { ClassProvider } from "./ClassProvider";
import { FactoryProvider } from "./FactoryProvider";
import { ValueProvider } from "./ValueProvider";

export type Provider<T = any> = TypeProvider<T> | ClassProvider<T> | FactoryProvider<T> | ValueProvider<T>