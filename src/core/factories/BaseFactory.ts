import { Injector } from "../di";

export abstract class BaseFactory<Summary, Ref> {

    constructor(protected summary: Summary) { }

    /**
     * Creates a new object of Ref
     * @param injector The parent injector
     */
    abstract create(parent: Injector): Ref;
}