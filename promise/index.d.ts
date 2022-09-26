export default function worker<T extends (...args: any) => any>(fn: T): (...args: Parameters<T>) => Promise<ReturnType<T>>;
export const uniqueWorker: typeof worker;