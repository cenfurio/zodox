import { TypeProvider } from "./TypeProvider";
import { ClassProvider } from "./ClassProvider";
import { FactoryProvider } from "./FactoryProvider";
import { ValueProvider } from "./ValueProvider";

export interface NormalizedProvider<T> extends TypeProvider<T>, ClassProvider<T>, FactoryProvider<T>, ValueProvider<T> {
    
}