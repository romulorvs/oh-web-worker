import getWorker from '../_internal';

function worker(fn) {
  return getWorker(fn, false, true);
}

export function uniqueWorker(fn) {
  return getWorker(fn, true, true);
}

export default worker;
