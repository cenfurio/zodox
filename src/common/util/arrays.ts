export async function asyncForEach<T>(array: T[]|ReadonlyArray<T>, callback: { (item: T, index: number, array: T[]|ReadonlyArray<T>): Promise<void> }) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export function removeItem<T>(array: T[], item: T): boolean {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
        return true;
    }

    return false;
}