# Light Workers

*A friendly and lightweight method to work with **Web Workers**, using Promises and Callback Functions.*

![npm](https://img.shields.io/npm/dt/light-workers.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/light-workers)

```ts
import worker from "light-workers";

const calculate = worker((a: number, b: number) => {
  return a + b;
});

calculate(1, 2)(res => console.log("result: " + res)); // result: 3
```
To get the result as a **Promise**, set the package path to **"light-workers/promise"**.

```ts
import worker from "light-workers/promise";

const calculate = worker((a: number, b: number) => {
  return a + b;
});

calculate(1, 2).then(res => console.log("result: " + res)); // result: 3
```
---
## **Running multiple workers concurrently**
Use the **uniqueWorker** function to create a new Worker every time the derived function is called. Those workers will get terminated immediately after they finish running.
```ts
import { uniqueWorker } from "light-workers/promise";

const calculate = uniqueWorker((a: number, b: number) => {
  return a + b;
});

calculate(1, 2).then(res => console.log("result: " + res)); // result: 3
calculate(2, 2).then(res => console.log("result: " + res)); // result: 4
// Two workers got created, and they've run concurrently.
```
---
### **Important**: The function passed to **worker()** or **uniqueWorker()** must be a **Pure Function** *(it can only use the params that are passed to it. It cannot use any external variable - not even global or system variables, like **window**)*.
---
## **Handling Errors**
You can get the errors of the workers in the second parameter of the callback function (or just use **"catch"**, when working with Promises).

**Callback Function example:**
```ts
import worker from "light-workers";

const calculate = worker((a: number, b: number) => {
  return a + b;
});

calculate(1, 2)((res, err) => {
  if(err) {
    console.error("An error ocurred: ", err);
  } else {
    console.log("result: " + res);
  }
});
```
**Promises example:**
```ts
import worker from "light-workers/promise";

const calculate = worker((a: number, b: number) => {
  return a + b;
});

calculate(1, 2)
  .then(res => console.log("result: " + res))
  .catch(err => console.log("An error ocurred: " + err));
```