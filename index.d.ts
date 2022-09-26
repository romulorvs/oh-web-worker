type Properties = Pick<InstanceType<typeof Worker>, 'terminate' | 'addEventListener' | 'removeEventListener' | 'dispatchEvent'>;
export default function worker<T extends (...args: any) => any>(fn: T): Properties & ((...args: Parameters<T>) => (cb: (res: ReturnType<T>, err?: string) => void) => void);
export const uniqueWorker: typeof worker;