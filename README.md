# Oh Web Worker!

*A friendly and lightweight method to work with **Web Workers**, using Promises and Callback Functions.*

![npm](https://img.shields.io/npm/dt/oh-web-worker.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/oh-web-worker)

```ts
import worker from "oh-web-worker";

const sum = worker((a: number, b: number) => {
  return a + b;
});

sum(1, 2)(res => console.log("result: " + res)); // result: 3
```
To get the result as a **Promise**, set the package path to **"oh-web-worker/promise"**.

```ts
import worker from "oh-web-worker/promise";

const sum = worker((a: number, b: number) => {
  return a + b;
});

sum(1, 2).then(res => console.log("result: " + res)); // result: 3
```
---
#### **Important**: The function passed to **worker()** or **uniqueWorker()** must be a **Pure Function** *(it can only use the params that are passed to it. It cannot use any external variable, not even global or system variables)*.
---
## **Running multiple workers concurrently**
Use the **uniqueWorker** function to create a new Worker every time the derived function is called. Those workers will get terminated immediately after they finish running.
```ts
import { uniqueWorker } from "oh-web-worker/promise";

const sum = uniqueWorker((a: number, b: number) => {
  return a + b;
});

sum(1, 2).then(res => console.log("result: " + res)); // result: 3
sum(2, 2).then(res => console.log("result: " + res)); // result: 4
// Two workers got created, and they've run concurrently.
```
---
## **Handling Errors**
You can get the errors of the workers in the second parameter of the callback function (or just use **"catch"**, when working with Promises).

**Callback Function example:**
```ts
import worker from "oh-web-worker";

const sum = worker((a: number, b: number) => {
  return a + b;
});

sum(1, 2)((res, err) => {
  if(err) {
    console.error("An error ocurred: ", err);
  } else {
    console.log("result: " + res);
  }
});
```
**Promises example:**
```ts
import worker from "oh-web-worker/promise";

const sum = worker((a: number, b: number) => {
  return a + b;
});

sum(1, 2)
  .then(res => console.log("result: " + res))
  .catch(err => console.log("An error ocurred: " + err));
```
---
## **Worker Functions**
The derived function has access to the original worker functions.

```ts
import worker from "oh-web-worker";

const workerA = worker(() => {});

workerA.terminate(); // terminates the worker
workerA.addEventListener(); // add listeners for worker events
workerA.removeEventListener(); // remove listeners for worker events
workerA.dispatchEvent(); // dispatch worker events
```