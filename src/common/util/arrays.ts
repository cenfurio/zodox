export async function asyncForEach<T>(array: T[]|ReadonlyArray<T>, callback: { (item: T, index: number, array: T[]|ReadonlyArray<T>): Promise<void> }) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}