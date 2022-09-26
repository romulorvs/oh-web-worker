type Properties = Pick<InstanceType<typeof Worker>, 'terminate' | 'addEventListener' | 'removeEventListener' | 'dispatchEvent'>;
export default function worker<T extends (...args: any) => any>(fn: T): Properties & ((...args: Parameters<T>) => Promise<ReturnType<T>>);
export const uniqueWorker: typeof worker;