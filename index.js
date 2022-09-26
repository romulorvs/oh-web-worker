import getWorker from './_internal';

function worker(fn) {
  return getWorker(fn);
}

export function uniqueWorker(fn) {
  return getWorker(fn, true);
}

export default worker;
