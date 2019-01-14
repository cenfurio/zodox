export class InjectionToken<T> {
    constructor(private description: string) {

    }

    toString(): string {
        return `InjectionToken ${this.description}`;
    }
}