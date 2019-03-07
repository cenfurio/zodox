import { makeDecorator } from "../../common";

export interface Middleware {
    name: string;
    priority?: number;
}

export const Middleware = makeDecorator<Middleware, [string, number?]>(null, (name: string, priority?: number) => ({ name, priority }));