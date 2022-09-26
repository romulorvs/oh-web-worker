export default function worker<T extends (...args: any) => any>(fn: T): (...args: Parameters<T>) => (cb: (res: ReturnType<T>, err?: string) => void) => void;
export const uniqueWorker: typeof worker;