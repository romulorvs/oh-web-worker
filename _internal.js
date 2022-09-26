var blob = new Blob([`
  var fn = function(){};
  self.onmessage = function(message) {
    if(typeof message.data !== "object") {
      self.postMessage({ error: "message data is not an object" });
      return;
    }

    if(message.data.register) {
      if(typeof message.data.register !== "string") {
        self.postMessage({ error: "message function must be a string" });
      } else {
        fn = eval(message.data.register);
      }
      return;
    }
    
    if(message.data.run) {
      if(!Array.isArray(message.data.run)) {
        self.postMessage({ error: "message data is not an object" });
      } else {
        self.postMessage({ res: fn(...message.data.run) });
      }
      return;
    }
  }
`], { type: "text/javascript" });

function setProperties(worker, _worker) {
  _worker.terminate = function (...args) {
    return worker.terminate(...args);
  };

  _worker.addEventListener = function (...args) {
    return worker.addEventListener(...args);
  };

  _worker.removeEventListener = function (...args) {
    return worker.removeEventListener(...args);
  };

  _worker.dispatchEvent = function (...args) {
    return worker.dispatchEvent(...args);
  };
}

function getWorker(fn, isUnique = false, getPromise = false) {
  if (typeof fn !== "function") {
    throw new Error("parameter must be a function.");
  }

  var worker;

  if (!isUnique) {
    worker = new Worker(window.URL.createObjectURL(blob));
    worker.postMessage({ register: fn.toString() });
  }

  function _worker(...args) {
    if (isUnique) {
      worker = new Worker(window.URL.createObjectURL(blob));
      worker.postMessage({ register: fn.toString() });
      setProperties(worker, _worker);
    }

    if (getPromise) {
      return new Promise((resolve, reject) => {
        worker.onmessage = function (msg) {
          if (typeof msg.data !== "object") {
            reject("message data must be an object");
            if (isUnique) worker.terminate();
            return;
          }

          if (msg.data.error) {
            reject(msg.data.error);
            if (isUnique) worker.terminate();
            return;
          }

          if (!msg.data.res) {
            reject("message data has no response");
            if (isUnique) worker.terminate();
            return;
          }

          resolve(msg.data.res);
          if (isUnique) worker.terminate();
        };

        worker.onerror = function (evt) {
          reject("there is an error with your worker: " + JSON.stringify(evt));
        };

        worker.onmessageerror = function () {
          reject("message could not be deserialized");
        };

        worker.postMessage({ run: args });
      });
    }

    return function resFn(_fn) {
      worker.onmessage = function (msg) {
        if (typeof msg.data !== "object") {
          _fn(undefined, "message data must be an object");
          if (isUnique) worker.terminate();
          return;
        }

        if (msg.data.error) {
          _fn(undefined, msg.data.error);
          if (isUnique) worker.terminate();
          return;
        }

        if (!msg.data.res) {
          _fn(undefined, "message data has no response");
          if (isUnique) worker.terminate();
          return;
        }

        _fn(msg.data.res);
        if (isUnique) worker.terminate();
      };

      worker.onerror = function (evt) {
        _fn(undefined, "there is an error with your worker: " + JSON.stringify(evt));
      };

      worker.onmessageerror = function () {
        _fn(undefined, "message could not be deserialized");
      };

      worker.postMessage({ run: args });
    };
  }

  if (!isUnique) {
    setProperties(worker, _worker);
  }

  return _worker;
}

export default getWorker;
