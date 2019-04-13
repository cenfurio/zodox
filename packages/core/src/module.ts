import { Type } from "@zodox/common";

export class Module {
    private readonly _id: string;
    private readonly _imports = new Set<Module>();
    private readonly _exports = new Set<string | symbol>();
    private readonly _providers = new Map<any, any>();
    private readonly _declarations = new Map<any, any[]>();

    constructor(
        private readonly _type: Type<any>,
        private readonly _scope: Type<any>[],
        // private readonly container: ZodoxContainer
    ) {
        // TODO: Write randomizer for id's
        // NOTE: It might even be better to use symbols
        this._id = 'todo.randomize';
    }

    get id(): string {
        return this._id;
    }

    get type(): Type<any> {
        return this._type;
    }

    get scope(): Type<any>[] {
        return this._scope;
    }

    get providers(): Map<any, any> {
        return this._providers;
    }

    get imports(): Set<Module> {
        return this._imports;
    }

    get exports(): Set<string | symbol> {
        return this._exports;
    }


}