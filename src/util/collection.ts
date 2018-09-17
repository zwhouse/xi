export function arrayToObject(array: any[], key: string) {
    return array.reduce((obj, item) => {
        obj[item[key]] = item;
        return obj;
    }, {});
}