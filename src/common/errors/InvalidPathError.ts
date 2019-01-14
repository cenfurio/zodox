export class InvalidPathError extends Error {
    constructor(path: string) {
        super(`Invalid path '${path}'. All paths should start with a '/'`);
    }
}