(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkZ4BLTVTBjs = require('./chunk-Z4BLTVTB.js');

// src/JsonRpcEngine.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _safeeventemitter = require('@metamask/safe-event-emitter'); var _safeeventemitter2 = _interopRequireDefault(_safeeventemitter);




var _utils = require('@metamask/utils');
var DESTROYED_ERROR_MESSAGE = "This engine is destroyed and can no longer be used.";
var _isDestroyed, _middleware, _notificationHandler, _assertIsNotDestroyed, assertIsNotDestroyed_fn, _handleBatch, handleBatch_fn, _handle, handle_fn, _processRequest, processRequest_fn, _runAllMiddleware, runAllMiddleware_fn, _runMiddleware, runMiddleware_fn, _runReturnHandlers, runReturnHandlers_fn, _checkForCompletion, checkForCompletion_fn;
var _JsonRpcEngine = class _JsonRpcEngine extends _safeeventemitter2.default {
  /**
   * Constructs a {@link JsonRpcEngine} instance.
   *
   * @param options - Options bag.
   * @param options.notificationHandler - A function for handling JSON-RPC
   * notifications. A JSON-RPC notification is defined as a JSON-RPC request
   * without an `id` property. If this option is _not_ provided, notifications
   * will be treated the same as requests. If this option _is_ provided,
   * notifications will be passed to the handler function without touching
   * the engine's middleware stack. This function should not throw or reject.
   */
  constructor({ notificationHandler } = {}) {
    super();
    /**
     * Throws an error if this engine is destroyed.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _assertIsNotDestroyed);
    /**
     * Handles a batch of JSON-RPC requests, either in `async` or callback
     * fashion.
     *
     * @param requests - The request objects to process.
     * @param callback - The completion callback.
     * @returns The array of responses, or nothing if a callback was specified.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _handleBatch);
    /**
     * Ensures that the request / notification object is valid, processes it, and
     * passes any error and response object to the given callback.
     *
     * Does not reject.
     *
     * @param callerReq - The request object from the caller.
     * @param callback - The callback function.
     * @returns Nothing.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _handle);
    /**
     * Indicating whether this engine is destroyed or not.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _isDestroyed, false);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _middleware, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _notificationHandler, void 0);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _middleware, []);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _notificationHandler, notificationHandler);
  }
  /**
   * Calls the `destroy()` function of any middleware with that property, clears
   * the middleware array, and marks this engine as destroyed. A destroyed
   * engine cannot be used.
   */
  destroy() {
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware).forEach(
      (middleware) => {
        if (
          // `in` walks the prototype chain, which is probably the desired
          // behavior here.
          "destroy" in middleware && typeof middleware.destroy === "function"
        ) {
          middleware.destroy();
        }
      }
    );
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _middleware, []);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _isDestroyed, true);
  }
  /**
   * Add a middleware function to the engine's middleware stack.
   *
   * @param middleware - The middleware function to add.
   */
  push(middleware) {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware).push(middleware);
  }
  handle(req, callback) {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    if (callback && typeof callback !== "function") {
      throw new Error('"callback" must be a function if provided.');
    }
    if (Array.isArray(req)) {
      if (callback) {
        return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handleBatch, handleBatch_fn).call(
          this,
          req,
          // This assertion is safe because of the runtime checks validating that `req` is an array and `callback` is defined.
          // There is only one overload signature that satisfies both conditions, and its `callback` type is the one that's being asserted.
          callback
        );
      }
      return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handleBatch, handleBatch_fn).call(this, req);
    }
    if (callback) {
      return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handle, handle_fn).call(this, req, callback);
    }
    return this._promiseHandle(req);
  }
  /**
   * Returns this engine as a middleware function that can be pushed to other
   * engines.
   *
   * @returns This engine as a middleware function.
   */
  asMiddleware() {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    return async (req, res, next, end) => {
      var _a, _b;
      try {
        const [middlewareError, isComplete, returnHandlers] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runAllMiddleware, runAllMiddleware_fn).call(_a, req, res, _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware));
        if (isComplete) {
          await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _b = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_b, returnHandlers);
          return end(middlewareError);
        }
        return next(async (handlerCallback) => {
          var _a2;
          try {
            await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a2 = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_a2, returnHandlers);
          } catch (error) {
            return handlerCallback(error);
          }
          return handlerCallback();
        });
      } catch (error) {
        return end(error);
      }
    };
  }
  /**
   * A promise-wrapped _handle.
   *
   * @param request - The JSON-RPC request.
   * @returns The JSON-RPC response.
   */
  // This function is used in tests, so we cannot easily change it to use the
  // hash syntax.
  // eslint-disable-next-line no-restricted-syntax
  async _promiseHandle(request) {
    return new Promise((resolve, reject) => {
      _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handle, handle_fn).call(this, request, (error, res) => {
        if (error && res === void 0) {
          reject(error);
        } else {
          resolve(res);
        }
      }).catch(reject);
    });
  }
};
_isDestroyed = new WeakMap();
_middleware = new WeakMap();
_notificationHandler = new WeakMap();
_assertIsNotDestroyed = new WeakSet();
assertIsNotDestroyed_fn = function() {
  if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _isDestroyed)) {
    throw new Error(DESTROYED_ERROR_MESSAGE);
  }
};
_handleBatch = new WeakSet();
handleBatch_fn = async function(requests, callback) {
  try {
    if (requests.length === 0) {
      const response = [
        {
          id: null,
          jsonrpc: "2.0",
          error: new (0, _rpcerrors.JsonRpcError)(
            _rpcerrors.errorCodes.rpc.invalidRequest,
            "Request batch must contain plain objects. Received an empty array"
          )
        }
      ];
      if (callback) {
        return callback(null, response);
      }
      return response;
    }
    const responses = (await Promise.all(
      // 1. Begin executing each request in the order received
      requests.map(this._promiseHandle.bind(this))
    )).filter(
      // Filter out any notification responses.
      (response) => response !== void 0
    );
    if (callback) {
      return callback(null, responses);
    }
    return responses;
  } catch (error) {
    if (callback) {
      return callback(error);
    }
    throw error;
  }
};
_handle = new WeakSet();
handle_fn = async function(callerReq, callback) {
  var _a;
  if (!callerReq || Array.isArray(callerReq) || typeof callerReq !== "object") {
    const error2 = new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.invalidRequest,
      `Requests must be plain objects. Received: ${typeof callerReq}`,
      { request: callerReq }
    );
    return callback(error2, { id: null, jsonrpc: "2.0", error: error2 });
  }
  if (typeof callerReq.method !== "string") {
    const error2 = new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.invalidRequest,
      `Must specify a string method. Received: ${typeof callerReq.method}`,
      { request: callerReq }
    );
    if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler) && !_utils.isJsonRpcRequest.call(void 0, callerReq)) {
      return callback(null);
    }
    return callback(error2, {
      // Typecast: This could be a notification, but we want to access the
      // `id` even if it doesn't exist.
      id: callerReq.id ?? null,
      jsonrpc: "2.0",
      error: error2
    });
  } else if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler) && _utils.isJsonRpcNotification.call(void 0, callerReq) && !_utils.isJsonRpcRequest.call(void 0, callerReq)) {
    try {
      await _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler).call(this, callerReq);
    } catch (error2) {
      return callback(error2);
    }
    return callback(null);
  }
  let error = null;
  const req = { ...callerReq };
  const res = {
    id: req.id,
    jsonrpc: req.jsonrpc
  };
  try {
    await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _processRequest, processRequest_fn).call(_a, req, res, _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware));
  } catch (_error) {
    error = _error;
  }
  if (error) {
    delete res.result;
    if (!res.error) {
      res.error = _rpcerrors.serializeError.call(void 0, error);
    }
  }
  return callback(error, res);
};
_processRequest = new WeakSet();
processRequest_fn = async function(req, res, middlewares) {
  var _a, _b, _c;
  const [error, isComplete, returnHandlers] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runAllMiddleware, runAllMiddleware_fn).call(_a, req, res, middlewares);
  _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _b = _JsonRpcEngine, _checkForCompletion, checkForCompletion_fn).call(_b, req, res, isComplete);
  await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _c = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_c, returnHandlers);
  if (error) {
    throw error;
  }
};
_runAllMiddleware = new WeakSet();
runAllMiddleware_fn = async function(req, res, middlewares) {
  var _a;
  const returnHandlers = [];
  let error = null;
  let isComplete = false;
  for (const middleware of middlewares) {
    [error, isComplete] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runMiddleware, runMiddleware_fn).call(_a, req, res, middleware, returnHandlers);
    if (isComplete) {
      break;
    }
  }
  return [error, isComplete, returnHandlers.reverse()];
};
_runMiddleware = new WeakSet();
runMiddleware_fn = async function(request, response, middleware, returnHandlers) {
  return new Promise((resolve) => {
    const end = (error) => {
      const parsedError = error || response.error;
      if (parsedError) {
        response.error = _rpcerrors.serializeError.call(void 0, parsedError);
      }
      resolve([parsedError, true]);
    };
    const next = (returnHandler) => {
      if (response.error) {
        end(response.error);
      } else {
        if (returnHandler) {
          if (typeof returnHandler !== "function") {
            end(
              new (0, _rpcerrors.JsonRpcError)(
                _rpcerrors.errorCodes.rpc.internal,
                `JsonRpcEngine: "next" return handlers must be functions. Received "${typeof returnHandler}" for request:
${jsonify(
                  request
                )}`,
                { request }
              )
            );
          }
          returnHandlers.push(returnHandler);
        }
        resolve([null, false]);
      }
    };
    try {
      middleware(request, response, next, end);
    } catch (error) {
      end(error);
    }
  });
};
_runReturnHandlers = new WeakSet();
runReturnHandlers_fn = async function(handlers) {
  for (const handler of handlers) {
    await new Promise((resolve, reject) => {
      handler((error) => error ? reject(error) : resolve());
    });
  }
};
_checkForCompletion = new WeakSet();
checkForCompletion_fn = function(request, response, isComplete) {
  if (!_utils.hasProperty.call(void 0, response, "result") && !_utils.hasProperty.call(void 0, response, "error")) {
    throw new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.internal,
      `JsonRpcEngine: Response has no error or result for request:
${jsonify(
        request
      )}`,
      { request }
    );
  }
  if (!isComplete) {
    throw new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.internal,
      `JsonRpcEngine: Nothing ended request:
${jsonify(request)}`,
      { request }
    );
  }
};
/**
 * For the given request and response, runs all middleware and their return
 * handlers, if any, and ensures that internal request processing semantics
 * are satisfied.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param middlewares - The stack of middleware functions.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _processRequest);
/**
 * Serially executes the given stack of middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param middlewares - The stack of middleware functions to execute.
 * @returns An array of any error encountered during middleware execution,
 * a boolean indicating whether the request was completed, and an array of
 * middleware-defined return handlers.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runAllMiddleware);
/**
 * Runs an individual middleware function.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param middleware - The middleware function to execute.
 * @param returnHandlers - The return handlers array for the current request.
 * @returns An array of any error encountered during middleware exection,
 * and a boolean indicating whether the request should end.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runMiddleware);
/**
 * Serially executes array of return handlers. The request and response are
 * assumed to be in their scope.
 *
 * @param handlers - The return handlers to execute.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runReturnHandlers);
/**
 * Throws an error if the response has neither a result nor an error, or if
 * the "isComplete" flag is falsy.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param isComplete - Boolean from {@link JsonRpcEngine.#runAllMiddleware}
 * indicating whether a middleware ended the request.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _checkForCompletion);
var JsonRpcEngine = _JsonRpcEngine;
function jsonify(request) {
  return JSON.stringify(request, null, 2);
}



exports.JsonRpcEngine = JsonRpcEngine;

},{"./chunk-Z4BLTVTB.js":6,"@metamask/rpc-errors":33,"@metamask/safe-event-emitter":100,"@metamask/utils":119}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/createScaffoldMiddleware.ts
function createScaffoldMiddleware(handlers) {
  return (req, res, next, end) => {
    const handler = handlers[req.method];
    if (handler === void 0) {
      return next();
    }
    if (typeof handler === "function") {
      return handler(req, res, next, end);
    }
    res.result = handler;
    return end();
  };
}



exports.createScaffoldMiddleware = createScaffoldMiddleware;

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkXDGWQHNYjs = require('./chunk-XDGWQHNY.js');

// src/idRemapMiddleware.ts
function createIdRemapMiddleware() {
  return (request, response, next, _end) => {
    const originalId = request.id;
    const newId = _chunkXDGWQHNYjs.getUniqueId.call(void 0, );
    request.id = newId;
    response.id = newId;
    next((done) => {
      request.id = originalId;
      response.id = originalId;
      done();
    });
  };
}



exports.createIdRemapMiddleware = createIdRemapMiddleware;

},{"./chunk-XDGWQHNY.js":5}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2LXAFMJDjs = require('./chunk-2LXAFMJD.js');

// src/mergeMiddleware.ts
function mergeMiddleware(middlewareStack) {
  const engine = new (0, _chunk2LXAFMJDjs.JsonRpcEngine)();
  middlewareStack.forEach((middleware) => engine.push(middleware));
  return engine.asMiddleware();
}



exports.mergeMiddleware = mergeMiddleware;

},{"./chunk-2LXAFMJD.js":1}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/getUniqueId.ts
var MAX = 4294967295;
var idCounter = Math.floor(Math.random() * MAX);
function getUniqueId() {
  idCounter = (idCounter + 1) % MAX;
  return idCounter;
}



exports.getUniqueId = getUniqueId;

},{}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};






exports.__privateGet = __privateGet; exports.__privateAdd = __privateAdd; exports.__privateSet = __privateSet; exports.__privateMethod = __privateMethod;

},{}],7:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/createAsyncMiddleware.ts
function createAsyncMiddleware(asyncMiddleware) {
  return async (request, response, next, end) => {
    let resolveNextPromise;
    const nextPromise = new Promise((resolve) => {
      resolveNextPromise = resolve;
    });
    let returnHandlerCallback = null;
    let nextWasCalled = false;
    const asyncNext = async () => {
      nextWasCalled = true;
      next((runReturnHandlersCallback) => {
        returnHandlerCallback = runReturnHandlersCallback;
        resolveNextPromise();
      });
      return nextPromise;
    };
    try {
      await asyncMiddleware(request, response, asyncNext);
      if (nextWasCalled) {
        await nextPromise;
        returnHandlerCallback(null);
      } else {
        end(null);
      }
    } catch (error) {
      if (returnHandlerCallback) {
        returnHandlerCallback(error);
      } else {
        end(error);
      }
    }
  };
}



exports.createAsyncMiddleware = createAsyncMiddleware;

},{}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkZYXL5TCSjs = require('./chunk-ZYXL5TCS.js');


var _chunk3AC2MINDjs = require('./chunk-3AC2MIND.js');


var _chunkPBQXMZM5js = require('./chunk-PBQXMZM5.js');


var _chunkXDGWQHNYjs = require('./chunk-XDGWQHNY.js');


var _chunkVK4MHWJVjs = require('./chunk-VK4MHWJV.js');


var _chunk2LXAFMJDjs = require('./chunk-2LXAFMJD.js');
require('./chunk-Z4BLTVTB.js');







exports.JsonRpcEngine = _chunk2LXAFMJDjs.JsonRpcEngine; exports.createAsyncMiddleware = _chunkZYXL5TCSjs.createAsyncMiddleware; exports.createIdRemapMiddleware = _chunkPBQXMZM5js.createIdRemapMiddleware; exports.createScaffoldMiddleware = _chunk3AC2MINDjs.createScaffoldMiddleware; exports.getUniqueId = _chunkXDGWQHNYjs.getUniqueId; exports.mergeMiddleware = _chunkVK4MHWJVjs.mergeMiddleware;

},{"./chunk-2LXAFMJD.js":1,"./chunk-3AC2MIND.js":2,"./chunk-PBQXMZM5.js":3,"./chunk-VK4MHWJV.js":4,"./chunk-XDGWQHNY.js":5,"./chunk-Z4BLTVTB.js":6,"./chunk-ZYXL5TCS.js":7}],9:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/createStreamMiddleware.ts
var _safeeventemitter = require('@metamask/safe-event-emitter'); var _safeeventemitter2 = _interopRequireDefault(_safeeventemitter);
var _readablestream = require('readable-stream');
function createStreamMiddleware(options = {}) {
  const idMap = {};
  const stream = new (0, _readablestream.Duplex)({
    objectMode: true,
    read: () => void 0,
    write: processMessage
  });
  const events = new (0, _safeeventemitter2.default)();
  const middleware = (req, res, next, end) => {
    idMap[req.id] = { req, res, next, end };
    sendToStream(req);
  };
  return { events, middleware, stream };
  function sendToStream(req) {
    stream.push(req);
  }
  function processMessage(res, _encoding, streamWriteCallback) {
    let errorObj = null;
    try {
      const isNotification = !res.id;
      if (isNotification) {
        processNotification(res);
      } else {
        processResponse(res);
      }
    } catch (_err) {
      errorObj = _err;
    }
    streamWriteCallback(errorObj);
  }
  function processResponse(res) {
    const { id: responseId } = res;
    if (responseId === null) {
      return;
    }
    const context = idMap[responseId];
    if (!context) {
      console.warn(`StreamMiddleware - Unknown response id "${responseId}"`);
      return;
    }
    delete idMap[responseId];
    Object.assign(context.res, res);
    setTimeout(context.end);
  }
  function processNotification(notif) {
    if (options?.retryOnMessage && notif.method === options.retryOnMessage) {
      retryStuckRequests();
    }
    events.emit("notification", notif);
  }
  function retryStuckRequests() {
    Object.values(idMap).forEach(({ req, retryCount = 0 }) => {
      if (!req.id) {
        return;
      }
      if (retryCount >= 3) {
        throw new Error(
          `StreamMiddleware - Retry limit exceeded for request id "${req.id}"`
        );
      }
      const idMapObject = idMap[req.id];
      if (idMapObject) {
        idMapObject.retryCount = retryCount + 1;
      }
      sendToStream(req);
    });
  }
}



exports.createStreamMiddleware = createStreamMiddleware;

},{"@metamask/safe-event-emitter":100,"readable-stream":216}],10:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/createEngineStream.ts
var _readablestream = require('readable-stream');
function createEngineStream(opts) {
  if (!opts?.engine) {
    throw new Error("Missing engine parameter!");
  }
  const { engine } = opts;
  const stream = new (0, _readablestream.Duplex)({ objectMode: true, read: () => void 0, write });
  if (engine.on) {
    engine.on("notification", (message) => {
      stream.push(message);
    });
  }
  return stream;
  function write(req, _encoding, streamWriteCallback) {
    engine.handle(req, (_err, res) => {
      stream.push(res);
    });
    streamWriteCallback();
  }
}



exports.createEngineStream = createEngineStream;

},{"readable-stream":216}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkIDTAZSDCjs = require('./chunk-IDTAZSDC.js');


var _chunk3SFZPJR3js = require('./chunk-3SFZPJR3.js');



exports.createEngineStream = _chunkIDTAZSDCjs.createEngineStream; exports.createStreamMiddleware = _chunk3SFZPJR3js.createStreamMiddleware;

},{"./chunk-3SFZPJR3.js":9,"./chunk-IDTAZSDC.js":10}],12:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectMultiplex = void 0;
const readable_stream_1 = require("readable-stream");
const once_1 = __importDefault(require("once"));
const Substream_1 = require("./Substream");
const IGNORE_SUBSTREAM = Symbol('IGNORE_SUBSTREAM');
class ObjectMultiplex extends readable_stream_1.Duplex {
    constructor(opts = {}) {
        super(Object.assign(Object.assign({}, opts), { objectMode: true }));
        this._substreams = {};
    }
    createStream(name) {
        // guard stream against destroyed already
        if (this.destroyed) {
            throw new Error(`ObjectMultiplex - parent stream for name "${name}" already destroyed`);
        }
        // guard stream against ended already
        if (this._readableState.ended || this._writableState.ended) {
            throw new Error(`ObjectMultiplex - parent stream for name "${name}" already ended`);
        }
        // validate name
        if (!name) {
            throw new Error('ObjectMultiplex - name must not be empty');
        }
        if (this._substreams[name]) {
            throw new Error(`ObjectMultiplex - Substream for name "${name}" already exists`);
        }
        // create substream
        const substream = new Substream_1.Substream({ parent: this, name });
        this._substreams[name] = substream;
        // listen for parent stream to end
        anyStreamEnd(this, (_error) => {
            return substream.destroy(_error || undefined);
        });
        return substream;
    }
    // ignore streams (dont display orphaned data warning)
    ignoreStream(name) {
        // validate name
        if (!name) {
            throw new Error('ObjectMultiplex - name must not be empty');
        }
        if (this._substreams[name]) {
            throw new Error(`ObjectMultiplex - Substream for name "${name}" already exists`);
        }
        // set
        this._substreams[name] = IGNORE_SUBSTREAM;
    }
    _read() {
        return undefined;
    }
    _write(chunk, _encoding, callback) {
        const { name, data } = chunk;
        if (!name) {
            console.warn(`ObjectMultiplex - malformed chunk without name "${chunk}"`);
            return callback();
        }
        // get corresponding substream
        const substream = this._substreams[name];
        if (!substream) {
            console.warn(`ObjectMultiplex - orphaned data for stream "${name}"`);
            return callback();
        }
        // push data into substream
        if (substream !== IGNORE_SUBSTREAM) {
            substream.push(data);
        }
        return callback();
    }
}
exports.ObjectMultiplex = ObjectMultiplex;
// util
function anyStreamEnd(stream, _cb) {
    const cb = (0, once_1.default)(_cb);
    (0, readable_stream_1.finished)(stream, { readable: false }, cb);
    (0, readable_stream_1.finished)(stream, { writable: false }, cb);
}

},{"./Substream":13,"once":197,"readable-stream":216}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Substream = void 0;
const readable_stream_1 = require("readable-stream");
class Substream extends readable_stream_1.Duplex {
    constructor({ parent, name }) {
        super({ objectMode: true });
        this._parent = parent;
        this._name = name;
    }
    /**
     * Explicitly sets read operations to a no-op.
     */
    _read() {
        return undefined;
    }
    /**
     * Called when data should be written to this writable stream.
     *
     * @param chunk - Arbitrary object to write
     * @param encoding - Encoding to use when writing payload
     * @param callback - Called when writing is complete or an error occurs
     */
    _write(chunk, _encoding, callback) {
        this._parent.push({
            name: this._name,
            data: chunk,
        });
        callback();
    }
}
exports.Substream = Substream;

},{"readable-stream":216}],14:[function(require,module,exports){
"use strict";
const ObjectMultiplex_1 = require("./ObjectMultiplex");
module.exports = ObjectMultiplex_1.ObjectMultiplex;

},{"./ObjectMultiplex":12}],15:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};





exports.__privateGet = __privateGet; exports.__privateAdd = __privateAdd; exports.__privateSet = __privateSet;

},{}],16:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/messages.ts
var messages = {
  errors: {
    disconnected: () => "MetaMask: Disconnected from chain. Attempting to connect.",
    permanentlyDisconnected: () => "MetaMask: Disconnected from MetaMask background. Page reload required.",
    sendSiteMetadata: () => `MetaMask: Failed to send site metadata. This is an internal error, please report this bug.`,
    unsupportedSync: (method) => `MetaMask: The MetaMask Ethereum provider does not support synchronous methods like ${method} without a callback parameter.`,
    invalidDuplexStream: () => "Must provide a Node.js-style duplex stream.",
    invalidNetworkParams: () => "MetaMask: Received invalid network parameters. Please report this bug.",
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
    invalidLoggerObject: () => `'args.logger' must be an object if provided.`,
    invalidLoggerMethod: (method) => `'args.logger' must include required method '${method}'.`
  },
  info: {
    connected: (chainId) => `MetaMask: Connected to chain with ID "${chainId}".`
  },
  warnings: {
    // deprecated properties
    chainIdDeprecation: `MetaMask: 'ethereum.chainId' is deprecated and may be removed in the future. Please use the 'eth_chainId' RPC method instead.
For more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
    networkVersionDeprecation: `MetaMask: 'ethereum.networkVersion' is deprecated and may be removed in the future. Please use the 'net_version' RPC method instead.
For more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
    selectedAddressDeprecation: `MetaMask: 'ethereum.selectedAddress' is deprecated and may be removed in the future. Please use the 'eth_accounts' RPC method instead.
For more information, see: https://github.com/MetaMask/metamask-improvement-proposals/discussions/23`,
    // deprecated methods
    enableDeprecation: `MetaMask: 'ethereum.enable()' is deprecated and may be removed in the future. Please use the 'eth_requestAccounts' RPC method instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1102`,
    sendDeprecation: `MetaMask: 'ethereum.send(...)' is deprecated and may be removed in the future. Please use 'ethereum.sendAsync(...)' or 'ethereum.request(...)' instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1193`,
    // deprecated events
    events: {
      close: `MetaMask: The event 'close' is deprecated and may be removed in the future. Please use 'disconnect' instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1193#disconnect`,
      data: `MetaMask: The event 'data' is deprecated and will be removed in the future. Use 'message' instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`,
      networkChanged: `MetaMask: The event 'networkChanged' is deprecated and may be removed in the future. Use 'chainChanged' instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1193#chainchanged`,
      notification: `MetaMask: The event 'notification' is deprecated and may be removed in the future. Use 'message' instead.
For more information, see: https://eips.ethereum.org/EIPS/eip-1193#message`
    },
    rpc: {
      ethDecryptDeprecation: `MetaMask: The RPC method 'eth_decrypt' is deprecated and may be removed in the future.
For more information, see: https://medium.com/metamask/metamask-api-method-deprecation-2b0564a84686`,
      ethGetEncryptionPublicKeyDeprecation: `MetaMask: The RPC method 'eth_getEncryptionPublicKey' is deprecated and may be removed in the future.
For more information, see: https://medium.com/metamask/metamask-api-method-deprecation-2b0564a84686`,
      walletWatchAssetNFTExperimental: `MetaMask: The RPC method 'wallet_watchAsset' is experimental for ERC721/ERC1155 assets and may change in the future.
For more information, see: https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-1.md and https://github.com/MetaMask/metamask-improvement-proposals/blob/main/PROCESS-GUIDE.md#proposal-lifecycle`
    },
    // misc
    experimentalMethods: `MetaMask: 'ethereum._metamask' exposes non-standard, experimental methods. They may be removed or changed without warning.`
  }
};
var messages_default = messages;



exports.messages_default = messages_default;

},{}],17:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


var _chunkZOFGBGOMjs = require('./chunk-ZOFGBGOM.js');


var _chunk4EQNSGSRjs = require('./chunk-4EQNSGSR.js');

// src/middleware/createRpcWarningMiddleware.ts
function createRpcWarningMiddleware(log) {
  const sentWarnings = {
    ethDecryptDeprecation: false,
    ethGetEncryptionPublicKeyDeprecation: false,
    walletWatchAssetNFTExperimental: false
  };
  return (req, _res, next) => {
    if (!sentWarnings.ethDecryptDeprecation && req.method === "eth_decrypt") {
      log.warn(_chunk4EQNSGSRjs.messages_default.warnings.rpc.ethDecryptDeprecation);
      sentWarnings.ethDecryptDeprecation = true;
    } else if (!sentWarnings.ethGetEncryptionPublicKeyDeprecation && req.method === "eth_getEncryptionPublicKey") {
      log.warn(_chunk4EQNSGSRjs.messages_default.warnings.rpc.ethGetEncryptionPublicKeyDeprecation);
      sentWarnings.ethGetEncryptionPublicKeyDeprecation = true;
    } else if (!sentWarnings.walletWatchAssetNFTExperimental && req.method === "wallet_watchAsset" && [_chunkZOFGBGOMjs.ERC721, _chunkZOFGBGOMjs.ERC1155].includes(
      _optionalChain([req, 'access', _ => _.params, 'optionalAccess', _2 => _2.type]) || ""
    )) {
      log.warn(_chunk4EQNSGSRjs.messages_default.warnings.rpc.walletWatchAssetNFTExperimental);
      sentWarnings.walletWatchAssetNFTExperimental = true;
    }
    next();
  };
}



exports.createRpcWarningMiddleware = createRpcWarningMiddleware;

},{"./chunk-4EQNSGSR.js":16,"./chunk-ZOFGBGOM.js":27}],18:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }


var _chunkO5ECOCX2js = require('./chunk-O5ECOCX2.js');


var _chunk4EQNSGSRjs = require('./chunk-4EQNSGSR.js');




var _chunk3W5G4CYIjs = require('./chunk-3W5G4CYI.js');

// src/BaseProvider.ts
var _jsonrpcengine = require('@metamask/json-rpc-engine');
var _rpcerrors = require('@metamask/rpc-errors');
var _safeeventemitter = require('@metamask/safe-event-emitter'); var _safeeventemitter2 = _interopRequireDefault(_safeeventemitter);
var _fastdeepequal = require('fast-deep-equal'); var _fastdeepequal2 = _interopRequireDefault(_fastdeepequal);
var _chainId, _selectedAddress;
var _BaseProvider = class _BaseProvider extends _safeeventemitter2.default {
  /**
   * Create a new instance of the provider.
   *
   * @param options - An options bag.
   * @param options.logger - The logging API to use. Default: `console`.
   * @param options.maxEventListeners - The maximum number of event
   * listeners. Default: 100.
   * @param options.rpcMiddleware - The RPC middleware stack. Default: [].
   */
  constructor({
    logger = console,
    maxEventListeners = 100,
    rpcMiddleware = []
  } = {}) {
    super();
    /**
     * The chain ID of the currently connected Ethereum chain.
     * See [chainId.network]{@link https://chainid.network} for more information.
     */
    _chunk3W5G4CYIjs.__privateAdd.call(void 0, this, _chainId, void 0);
    /**
     * The user's currently selected Ethereum address.
     * If null, MetaMask is either locked or the user has not permitted any
     * addresses to be viewed.
     */
    _chunk3W5G4CYIjs.__privateAdd.call(void 0, this, _selectedAddress, void 0);
    this._log = logger;
    this.setMaxListeners(maxEventListeners);
    this._state = {
      ..._BaseProvider._defaultState
    };
    _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _selectedAddress, null);
    _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _chainId, null);
    this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleChainChanged = this._handleChainChanged.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleUnlockStateChanged = this._handleUnlockStateChanged.bind(this);
    this._rpcRequest = this._rpcRequest.bind(this);
    this.request = this.request.bind(this);
    const rpcEngine = new (0, _jsonrpcengine.JsonRpcEngine)();
    rpcMiddleware.forEach((middleware) => rpcEngine.push(middleware));
    this._rpcEngine = rpcEngine;
  }
  //====================
  // Public Properties
  //====================
  get chainId() {
    return _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _chainId);
  }
  get selectedAddress() {
    return _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _selectedAddress);
  }
  //====================
  // Public Methods
  //====================
  /**
   * Returns whether the provider can process RPC requests.
   *
   * @returns Whether the provider can process RPC requests.
   */
  isConnected() {
    return this._state.isConnected;
  }
  /**
   * Submits an RPC request for the given method, with the given params.
   * Resolves with the result of the method call, or rejects on error.
   *
   * @param args - The RPC request arguments.
   * @param args.method - The RPC method name.
   * @param args.params - The parameters for the RPC method.
   * @returns A Promise that resolves with the result of the RPC method,
   * or rejects if an error is encountered.
   */
  async request(args) {
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw _rpcerrors.rpcErrors.invalidRequest({
        message: _chunk4EQNSGSRjs.messages_default.errors.invalidRequestArgs(),
        data: args
      });
    }
    const { method, params } = args;
    if (typeof method !== "string" || method.length === 0) {
      throw _rpcerrors.rpcErrors.invalidRequest({
        message: _chunk4EQNSGSRjs.messages_default.errors.invalidRequestMethod(),
        data: args
      });
    }
    if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
      throw _rpcerrors.rpcErrors.invalidRequest({
        message: _chunk4EQNSGSRjs.messages_default.errors.invalidRequestParams(),
        data: args
      });
    }
    const payload = params === void 0 || params === null ? {
      method
    } : {
      method,
      params
    };
    return new Promise((resolve, reject) => {
      this._rpcRequest(payload, _chunkO5ECOCX2js.getRpcPromiseCallback.call(void 0, resolve, reject));
    });
  }
  //====================
  // Private Methods
  //====================
  /**
   * MUST be called by child classes.
   *
   * Sets initial state if provided and marks this provider as initialized.
   * Throws if called more than once.
   *
   * Permits the `networkVersion` field in the parameter object for
   * compatibility with child classes that use this value.
   *
   * @param initialState - The provider's initial state.
   * @param initialState.accounts - The user's accounts.
   * @param initialState.chainId - The chain ID.
   * @param initialState.isUnlocked - Whether the user has unlocked MetaMask.
   * @param initialState.networkVersion - The network version.
   * @fires BaseProvider#_initialized - If `initialState` is defined.
   * @fires BaseProvider#connect - If `initialState` is defined.
   */
  _initializeState(initialState) {
    if (this._state.initialized) {
      throw new Error("Provider already initialized.");
    }
    if (initialState) {
      const { accounts, chainId, isUnlocked, networkVersion } = initialState;
      this._handleConnect(chainId);
      this._handleChainChanged({ chainId, networkVersion });
      this._handleUnlockStateChanged({ accounts, isUnlocked });
      this._handleAccountsChanged(accounts);
    }
    this._state.initialized = true;
    this.emit("_initialized");
  }
  /**
   * Internal RPC method. Forwards requests to background via the RPC engine.
   * Also remap ids inbound and outbound.
   *
   * @param payload - The RPC request object.
   * @param callback - The consumer's callback.
   * @returns The result of the RPC request.
   */
  _rpcRequest(payload, callback) {
    let callbackWrapper = callback;
    if (!Array.isArray(payload)) {
      if (!payload.jsonrpc) {
        payload.jsonrpc = "2.0";
      }
      if (payload.method === "eth_accounts" || payload.method === "eth_requestAccounts") {
        callbackWrapper = (error, response) => {
          this._handleAccountsChanged(
            _nullishCoalesce(response.result, () => ( [])),
            payload.method === "eth_accounts"
          );
          callback(error, response);
        };
      }
      return this._rpcEngine.handle(payload, callbackWrapper);
    }
    return this._rpcEngine.handle(payload, callbackWrapper);
  }
  /**
   * When the provider becomes connected, updates internal state and emits
   * required events. Idempotent.
   *
   * @param chainId - The ID of the newly connected chain.
   * @fires MetaMaskInpageProvider#connect
   */
  _handleConnect(chainId) {
    if (!this._state.isConnected) {
      this._state.isConnected = true;
      this.emit("connect", { chainId });
      this._log.debug(_chunk4EQNSGSRjs.messages_default.info.connected(chainId));
    }
  }
  /**
   * When the provider becomes disconnected, updates internal state and emits
   * required events. Idempotent with respect to the isRecoverable parameter.
   *
   * Error codes per the CloseEvent status codes as required by EIP-1193:
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes.
   *
   * @param isRecoverable - Whether the disconnection is recoverable.
   * @param errorMessage - A custom error message.
   * @fires BaseProvider#disconnect - If the disconnection is not recoverable.
   */
  _handleDisconnect(isRecoverable, errorMessage) {
    if (this._state.isConnected || !this._state.isPermanentlyDisconnected && !isRecoverable) {
      this._state.isConnected = false;
      let error;
      if (isRecoverable) {
        error = new (0, _rpcerrors.JsonRpcError)(
          1013,
          // Try again later
          _nullishCoalesce(errorMessage, () => ( _chunk4EQNSGSRjs.messages_default.errors.disconnected()))
        );
        this._log.debug(error);
      } else {
        error = new (0, _rpcerrors.JsonRpcError)(
          1011,
          // Internal error
          _nullishCoalesce(errorMessage, () => ( _chunk4EQNSGSRjs.messages_default.errors.permanentlyDisconnected()))
        );
        this._log.error(error);
        _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _chainId, null);
        this._state.accounts = null;
        _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _selectedAddress, null);
        this._state.isUnlocked = false;
        this._state.isPermanentlyDisconnected = true;
      }
      this.emit("disconnect", error);
    }
  }
  /**
   * Upon receipt of a new `chainId`, emits the corresponding event and sets
   * and sets relevant public state. Does nothing if the given `chainId` is
   * equivalent to the existing value.
   *
   * Permits the `networkVersion` field in the parameter object for
   * compatibility with child classes that use this value.
   *
   * @fires BaseProvider#chainChanged
   * @param networkInfo - An object with network info.
   * @param networkInfo.chainId - The latest chain ID.
   */
  _handleChainChanged({
    chainId
  } = {}) {
    if (!_chunkO5ECOCX2js.isValidChainId.call(void 0, chainId)) {
      this._log.error(_chunk4EQNSGSRjs.messages_default.errors.invalidNetworkParams(), { chainId });
      return;
    }
    this._handleConnect(chainId);
    if (chainId !== _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _chainId)) {
      _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _chainId, chainId);
      if (this._state.initialized) {
        this.emit("chainChanged", _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _chainId));
      }
    }
  }
  /**
   * Called when accounts may have changed. Diffs the new accounts value with
   * the current one, updates all state as necessary, and emits the
   * accountsChanged event.
   *
   * @param accounts - The new accounts value.
   * @param isEthAccounts - Whether the accounts value was returned by
   * a call to eth_accounts.
   */
  _handleAccountsChanged(accounts, isEthAccounts = false) {
    let _accounts = accounts;
    if (!Array.isArray(accounts)) {
      this._log.error(
        "MetaMask: Received invalid accounts parameter. Please report this bug.",
        accounts
      );
      _accounts = [];
    }
    for (const account of accounts) {
      if (typeof account !== "string") {
        this._log.error(
          "MetaMask: Received non-string account. Please report this bug.",
          accounts
        );
        _accounts = [];
        break;
      }
    }
    if (!_fastdeepequal2.default.call(void 0, this._state.accounts, _accounts)) {
      if (isEthAccounts && this._state.accounts !== null) {
        this._log.error(
          `MetaMask: 'eth_accounts' unexpectedly updated accounts. Please report this bug.`,
          _accounts
        );
      }
      this._state.accounts = _accounts;
      if (_chunk3W5G4CYIjs.__privateGet.call(void 0, this, _selectedAddress) !== _accounts[0]) {
        _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _selectedAddress, _accounts[0] || null);
      }
      if (this._state.initialized) {
        const _nextAccounts = [..._accounts];
        this.emit("accountsChanged", _nextAccounts);
      }
    }
  }
  /**
   * Upon receipt of a new isUnlocked state, sets relevant public state.
   * Calls the accounts changed handler with the received accounts, or an empty
   * array.
   *
   * Does nothing if the received value is equal to the existing value.
   * There are no lock/unlock events.
   *
   * @param opts - Options bag.
   * @param opts.accounts - The exposed accounts, if any.
   * @param opts.isUnlocked - The latest isUnlocked value.
   */
  _handleUnlockStateChanged({
    accounts,
    isUnlocked
  } = {}) {
    if (typeof isUnlocked !== "boolean") {
      this._log.error(
        "MetaMask: Received invalid isUnlocked parameter. Please report this bug."
      );
      return;
    }
    if (isUnlocked !== this._state.isUnlocked) {
      this._state.isUnlocked = isUnlocked;
      this._handleAccountsChanged(_nullishCoalesce(accounts, () => ( [])));
    }
  }
};
_chainId = new WeakMap();
_selectedAddress = new WeakMap();
_BaseProvider._defaultState = {
  accounts: null,
  isConnected: false,
  isUnlocked: false,
  initialized: false,
  isPermanentlyDisconnected: false
};
var BaseProvider = _BaseProvider;



exports.BaseProvider = BaseProvider;

},{"./chunk-3W5G4CYI.js":15,"./chunk-4EQNSGSR.js":16,"./chunk-O5ECOCX2.js":24,"@metamask/json-rpc-engine":8,"@metamask/rpc-errors":33,"@metamask/safe-event-emitter":100,"fast-deep-equal":189}],19:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/shimWeb3.ts
function shimWeb3(provider, log = console) {
  let loggedCurrentProvider = false;
  let loggedMissingProperty = false;
  if (!window.web3) {
    const SHIM_IDENTIFIER = "__isMetaMaskShim__";
    let web3Shim = { currentProvider: provider };
    Object.defineProperty(web3Shim, SHIM_IDENTIFIER, {
      value: true,
      enumerable: true,
      configurable: false,
      writable: false
    });
    web3Shim = new Proxy(web3Shim, {
      get: (target, property, ...args) => {
        if (property === "currentProvider" && !loggedCurrentProvider) {
          loggedCurrentProvider = true;
          log.warn(
            "You are accessing the MetaMask window.web3.currentProvider shim. This property is deprecated; use window.ethereum instead. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3"
          );
        } else if (property !== "currentProvider" && property !== SHIM_IDENTIFIER && !loggedMissingProperty) {
          loggedMissingProperty = true;
          log.error(
            `MetaMask no longer injects web3. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3`
          );
          provider.request({ method: "metamask_logWeb3ShimUsage" }).catch((error) => {
            log.debug("MetaMask: Failed to log web3 shim usage.", error);
          });
        }
        return Reflect.get(target, property, ...args);
      },
      set: (...args) => {
        log.warn(
          "You are accessing the MetaMask window.web3 shim. This object is deprecated; use window.ethereum instead. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3"
        );
        return Reflect.set(...args);
      }
    });
    Object.defineProperty(window, "web3", {
      value: web3Shim,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
}



exports.shimWeb3 = shimWeb3;

},{}],20:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkA3W22U42js = require('./chunk-A3W22U42.js');




var _chunkO5ECOCX2js = require('./chunk-O5ECOCX2.js');


var _chunk4EQNSGSRjs = require('./chunk-4EQNSGSR.js');

// src/StreamProvider.ts
var _jsonrpcmiddlewarestream = require('@metamask/json-rpc-middleware-stream');
var _objectmultiplex = require('@metamask/object-multiplex'); var _objectmultiplex2 = _interopRequireDefault(_objectmultiplex);
var _isstream = require('is-stream');
var _readablestream = require('readable-stream');
var AbstractStreamProvider = class extends _chunkA3W22U42js.BaseProvider {
  /**
   * Creates a new AbstractStreamProvider instance.
   *
   * @param connectionStream - A Node.js duplex stream.
   * @param options - An options bag.
   * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
   * @param options.logger - The logging API to use. Default: `console`.
   * @param options.maxEventListeners - The maximum number of event
   * listeners. Default: 100.
   * @param options.rpcMiddleware - The RPC middleware stack to use.
   */
  constructor(connectionStream, {
    jsonRpcStreamName,
    logger = console,
    maxEventListeners = 100,
    rpcMiddleware = []
  }) {
    super({ logger, maxEventListeners, rpcMiddleware });
    if (!_isstream.duplex.call(void 0, connectionStream)) {
      throw new Error(_chunk4EQNSGSRjs.messages_default.errors.invalidDuplexStream());
    }
    this._handleStreamDisconnect = this._handleStreamDisconnect.bind(this);
    const mux = new (0, _objectmultiplex2.default)();
    _readablestream.pipeline.call(void 0, 
      connectionStream,
      mux,
      connectionStream,
      this._handleStreamDisconnect.bind(this, "MetaMask")
    );
    this._jsonRpcConnection = _jsonrpcmiddlewarestream.createStreamMiddleware.call(void 0, {
      retryOnMessage: "METAMASK_EXTENSION_CONNECT_CAN_RETRY"
    });
    _readablestream.pipeline.call(void 0, 
      this._jsonRpcConnection.stream,
      mux.createStream(jsonRpcStreamName),
      this._jsonRpcConnection.stream,
      this._handleStreamDisconnect.bind(this, "MetaMask RpcProvider")
    );
    this._rpcEngine.push(this._jsonRpcConnection.middleware);
    this._jsonRpcConnection.events.on("notification", (payload) => {
      const { method, params } = payload;
      if (method === "metamask_accountsChanged") {
        this._handleAccountsChanged(params);
      } else if (method === "metamask_unlockStateChanged") {
        this._handleUnlockStateChanged(params);
      } else if (method === "metamask_chainChanged") {
        this._handleChainChanged(params);
      } else if (_chunkO5ECOCX2js.EMITTED_NOTIFICATIONS.includes(method)) {
        this.emit("message", {
          type: method,
          data: params
        });
      } else if (method === "METAMASK_STREAM_FAILURE") {
        connectionStream.destroy(
          new Error(_chunk4EQNSGSRjs.messages_default.errors.permanentlyDisconnected())
        );
      }
    });
  }
  //====================
  // Private Methods
  //====================
  /**
   * MUST be called by child classes.
   *
   * Calls `metamask_getProviderState` and passes the result to
   * {@link BaseProvider._initializeState}. Logs an error if getting initial state
   * fails. Throws if called after initialization has completed.
   */
  async _initializeStateAsync() {
    let initialState;
    try {
      initialState = await this.request({
        method: "metamask_getProviderState"
      });
    } catch (error) {
      this._log.error(
        "MetaMask: Failed to get initial state. Please report this bug.",
        error
      );
    }
    this._initializeState(initialState);
  }
  /**
   * Called when connection is lost to critical streams. Emits an 'error' event
   * from the provider with the error message and stack if present.
   *
   * @param streamName - The name of the stream that disconnected.
   * @param error - The error that caused the disconnection.
   * @fires BaseProvider#disconnect - If the provider is not already
   * disconnected.
   */
  // eslint-disable-next-line no-restricted-syntax
  _handleStreamDisconnect(streamName, error) {
    let warningMsg = `MetaMask: Lost connection to "${streamName}".`;
    if (_optionalChain([error, 'optionalAccess', _ => _.stack])) {
      warningMsg += `
${error.stack}`;
    }
    this._log.warn(warningMsg);
    if (this.listenerCount("error") > 0) {
      this.emit("error", warningMsg);
    }
    this._handleDisconnect(false, error ? error.message : void 0);
  }
  /**
   * Upon receipt of a new chainId and networkVersion, emits corresponding
   * events and sets relevant public state. This class does not have a
   * `networkVersion` property, but we rely on receiving a `networkVersion`
   * with the value of `loading` to detect when the network is changing and
   * a recoverable `disconnect` even has occurred. Child classes that use the
   * `networkVersion` for other purposes must implement additional handling
   * therefore.
   *
   * @fires BaseProvider#chainChanged
   * @param networkInfo - An object with network info.
   * @param networkInfo.chainId - The latest chain ID.
   * @param networkInfo.networkVersion - The latest network ID.
   */
  _handleChainChanged({
    chainId,
    networkVersion
  } = {}) {
    if (!_chunkO5ECOCX2js.isValidChainId.call(void 0, chainId) || !_chunkO5ECOCX2js.isValidNetworkVersion.call(void 0, networkVersion)) {
      this._log.error(_chunk4EQNSGSRjs.messages_default.errors.invalidNetworkParams(), {
        chainId,
        networkVersion
      });
      return;
    }
    if (networkVersion === "loading") {
      this._handleDisconnect(true);
    } else {
      super._handleChainChanged({ chainId });
    }
  }
};
var StreamProvider = class extends AbstractStreamProvider {
  /**
   * MUST be called after instantiation to complete initialization.
   *
   * Calls `metamask_getProviderState` and passes the result to
   * {@link BaseProvider._initializeState}. Logs an error if getting initial state
   * fails. Throws if called after initialization has completed.
   */
  async initialize() {
    return this._initializeStateAsync();
  }
};




exports.AbstractStreamProvider = AbstractStreamProvider; exports.StreamProvider = StreamProvider;

},{"./chunk-4EQNSGSR.js":16,"./chunk-A3W22U42.js":18,"./chunk-O5ECOCX2.js":24,"@metamask/json-rpc-middleware-stream":11,"@metamask/object-multiplex":14,"is-stream":193,"readable-stream":216}],21:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkQ4DN6VYNjs = require('./chunk-Q4DN6VYN.js');


var _chunkDWR5HIZKjs = require('./chunk-DWR5HIZK.js');





var _chunkO5ECOCX2js = require('./chunk-O5ECOCX2.js');


var _chunk4EQNSGSRjs = require('./chunk-4EQNSGSR.js');




var _chunk3W5G4CYIjs = require('./chunk-3W5G4CYI.js');

// src/MetaMaskInpageProvider.ts
var _rpcerrors = require('@metamask/rpc-errors');
var MetaMaskInpageProviderStreamName = "metamask-provider";
var _networkVersion;
var MetaMaskInpageProvider = class extends _chunkDWR5HIZKjs.AbstractStreamProvider {
  /**
   * Creates a new `MetaMaskInpageProvider`.
   *
   * @param connectionStream - A Node.js duplex stream.
   * @param options - An options bag.
   * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
   * Default: `metamask-provider`.
   * @param options.logger - The logging API to use. Default: `console`.
   * @param options.maxEventListeners - The maximum number of event
   * listeners. Default: 100.
   * @param options.shouldSendMetadata - Whether the provider should
   * send page metadata. Default: `true`.
   */
  constructor(connectionStream, {
    jsonRpcStreamName = MetaMaskInpageProviderStreamName,
    logger = console,
    maxEventListeners = 100,
    shouldSendMetadata
  } = {}) {
    super(connectionStream, {
      jsonRpcStreamName,
      logger,
      maxEventListeners,
      rpcMiddleware: _chunkO5ECOCX2js.getDefaultExternalMiddleware.call(void 0, logger)
    });
    this._sentWarnings = {
      // properties
      chainId: false,
      networkVersion: false,
      selectedAddress: false,
      // methods
      enable: false,
      experimentalMethods: false,
      send: false,
      // events
      events: {
        close: false,
        data: false,
        networkChanged: false,
        notification: false
      }
    };
    _chunk3W5G4CYIjs.__privateAdd.call(void 0, this, _networkVersion, void 0);
    this._initializeStateAsync();
    _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _networkVersion, null);
    this.isMetaMask = true;
    this._sendSync = this._sendSync.bind(this);
    this.enable = this.enable.bind(this);
    this.send = this.send.bind(this);
    this.sendAsync = this.sendAsync.bind(this);
    this._warnOfDeprecation = this._warnOfDeprecation.bind(this);
    this._metamask = this._getExperimentalApi();
    this._jsonRpcConnection.events.on("notification", (payload) => {
      const { method } = payload;
      if (_chunkO5ECOCX2js.EMITTED_NOTIFICATIONS.includes(method)) {
        this.emit("data", payload);
        this.emit("notification", payload.params.result);
      }
    });
    if (shouldSendMetadata) {
      if (document.readyState === "complete") {
        _chunkQ4DN6VYNjs.sendSiteMetadata.call(void 0, this._rpcEngine, this._log);
      } else {
        const domContentLoadedHandler = () => {
          _chunkQ4DN6VYNjs.sendSiteMetadata.call(void 0, this._rpcEngine, this._log);
          window.removeEventListener(
            "DOMContentLoaded",
            domContentLoadedHandler
          );
        };
        window.addEventListener("DOMContentLoaded", domContentLoadedHandler);
      }
    }
  }
  //====================
  // Deprecated Properties
  //====================
  get chainId() {
    if (!this._sentWarnings.chainId) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.chainIdDeprecation);
      this._sentWarnings.chainId = true;
    }
    return super.chainId;
  }
  get networkVersion() {
    if (!this._sentWarnings.networkVersion) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.networkVersionDeprecation);
      this._sentWarnings.networkVersion = true;
    }
    return _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _networkVersion);
  }
  get selectedAddress() {
    if (!this._sentWarnings.selectedAddress) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.selectedAddressDeprecation);
      this._sentWarnings.selectedAddress = true;
    }
    return super.selectedAddress;
  }
  //====================
  // Public Methods
  //====================
  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param callback - The callback function.
   */
  sendAsync(payload, callback) {
    this._rpcRequest(payload, callback);
  }
  /**
   * We override the following event methods so that we can warn consumers
   * about deprecated events:
   * `addListener`, `on`, `once`, `prependListener`, `prependOnceListener`.
   */
  addListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.addListener(eventName, listener);
  }
  on(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.on(eventName, listener);
  }
  once(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.once(eventName, listener);
  }
  prependListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.prependListener(eventName, listener);
  }
  prependOnceListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.prependOnceListener(eventName, listener);
  }
  //====================
  // Private Methods
  //====================
  /**
   * When the provider becomes disconnected, updates internal state and emits
   * required events. Idempotent with respect to the isRecoverable parameter.
   *
   * Error codes per the CloseEvent status codes as required by EIP-1193:
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes.
   *
   * @param isRecoverable - Whether the disconnection is recoverable.
   * @param errorMessage - A custom error message.
   * @fires BaseProvider#disconnect - If the disconnection is not recoverable.
   */
  _handleDisconnect(isRecoverable, errorMessage) {
    super._handleDisconnect(isRecoverable, errorMessage);
    if (_chunk3W5G4CYIjs.__privateGet.call(void 0, this, _networkVersion) && !isRecoverable) {
      _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _networkVersion, null);
    }
  }
  /**
   * Warns of deprecation for the given event, if applicable.
   *
   * @param eventName - The name of the event.
   */
  _warnOfDeprecation(eventName) {
    if (_optionalChain([this, 'access', _ => _._sentWarnings, 'optionalAccess', _2 => _2.events, 'access', _3 => _3[eventName]]) === false) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.events[eventName]);
      this._sentWarnings.events[eventName] = true;
    }
  }
  //====================
  // Deprecated Methods
  //====================
  /**
   * Equivalent to: `ethereum.request('eth_requestAccounts')`.
   *
   * @deprecated Use request({ method: 'eth_requestAccounts' }) instead.
   * @returns A promise that resolves to an array of addresses.
   */
  async enable() {
    if (!this._sentWarnings.enable) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.enableDeprecation);
      this._sentWarnings.enable = true;
    }
    return new Promise((resolve, reject) => {
      try {
        this._rpcRequest(
          { method: "eth_requestAccounts", params: [] },
          _chunkO5ECOCX2js.getRpcPromiseCallback.call(void 0, resolve, reject)
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  send(methodOrPayload, callbackOrArgs) {
    if (!this._sentWarnings.send) {
      this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.sendDeprecation);
      this._sentWarnings.send = true;
    }
    if (typeof methodOrPayload === "string" && (!callbackOrArgs || Array.isArray(callbackOrArgs))) {
      return new Promise((resolve, reject) => {
        try {
          this._rpcRequest(
            { method: methodOrPayload, params: callbackOrArgs },
            _chunkO5ECOCX2js.getRpcPromiseCallback.call(void 0, resolve, reject, false)
          );
        } catch (error) {
          reject(error);
        }
      });
    } else if (methodOrPayload && typeof methodOrPayload === "object" && typeof callbackOrArgs === "function") {
      return this._rpcRequest(
        methodOrPayload,
        callbackOrArgs
      );
    }
    return this._sendSync(methodOrPayload);
  }
  /**
   * Internal backwards compatibility method, used in send.
   *
   * @param payload - A JSON-RPC request object.
   * @returns A JSON-RPC response object.
   * @deprecated
   */
  _sendSync(payload) {
    let result;
    switch (payload.method) {
      case "eth_accounts":
        result = this.selectedAddress ? [this.selectedAddress] : [];
        break;
      case "eth_coinbase":
        result = _nullishCoalesce(this.selectedAddress, () => ( null));
        break;
      case "eth_uninstallFilter":
        this._rpcRequest(payload, _chunkO5ECOCX2js.NOOP);
        result = true;
        break;
      case "net_version":
        result = _nullishCoalesce(_chunk3W5G4CYIjs.__privateGet.call(void 0, this, _networkVersion), () => ( null));
        break;
      default:
        throw new Error(_chunk4EQNSGSRjs.messages_default.errors.unsupportedSync(payload.method));
    }
    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result
    };
  }
  /**
   * Constructor helper.
   *
   * Gets the experimental _metamask API as Proxy, so that we can warn consumers
   * about its experimental nature.
   *
   * @returns The experimental _metamask API.
   */
  _getExperimentalApi() {
    return new Proxy(
      {
        /**
         * Determines if MetaMask is unlocked by the user.
         *
         * @returns Promise resolving to true if MetaMask is currently unlocked.
         */
        isUnlocked: async () => {
          if (!this._state.initialized) {
            await new Promise((resolve) => {
              this.on("_initialized", () => resolve());
            });
          }
          return this._state.isUnlocked;
        },
        /**
         * Make a batch RPC request.
         *
         * @param requests - The RPC requests to make.
         */
        requestBatch: async (requests) => {
          if (!Array.isArray(requests)) {
            throw _rpcerrors.rpcErrors.invalidRequest({
              message: "Batch requests must be made with an array of request objects.",
              data: requests
            });
          }
          return new Promise((resolve, reject) => {
            this._rpcRequest(requests, _chunkO5ECOCX2js.getRpcPromiseCallback.call(void 0, resolve, reject));
          });
        }
      },
      {
        get: (obj, prop, ...args) => {
          if (!this._sentWarnings.experimentalMethods) {
            this._log.warn(_chunk4EQNSGSRjs.messages_default.warnings.experimentalMethods);
            this._sentWarnings.experimentalMethods = true;
          }
          return Reflect.get(obj, prop, ...args);
        }
      }
    );
  }
  /**
   * Upon receipt of a new chainId and networkVersion, emits corresponding
   * events and sets relevant public state. Does nothing if neither the chainId
   * nor the networkVersion are different from existing values.
   *
   * @fires MetamaskInpageProvider#networkChanged
   * @param networkInfo - An object with network info.
   * @param networkInfo.chainId - The latest chain ID.
   * @param networkInfo.networkVersion - The latest network ID.
   */
  _handleChainChanged({
    chainId,
    networkVersion
  } = {}) {
    super._handleChainChanged({ chainId, networkVersion });
    if (this._state.isConnected && networkVersion !== _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _networkVersion)) {
      _chunk3W5G4CYIjs.__privateSet.call(void 0, this, _networkVersion, networkVersion);
      if (this._state.initialized) {
        this.emit("networkChanged", _chunk3W5G4CYIjs.__privateGet.call(void 0, this, _networkVersion));
      }
    }
  }
};
_networkVersion = new WeakMap();




exports.MetaMaskInpageProviderStreamName = MetaMaskInpageProviderStreamName; exports.MetaMaskInpageProvider = MetaMaskInpageProvider;

},{"./chunk-3W5G4CYI.js":15,"./chunk-4EQNSGSR.js":16,"./chunk-DWR5HIZK.js":20,"./chunk-O5ECOCX2.js":24,"./chunk-Q4DN6VYN.js":25,"@metamask/rpc-errors":33}],22:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkDD6YP3BVjs = require('./chunk-DD6YP3BV.js');


var _chunkWBB62AKCjs = require('./chunk-WBB62AKC.js');


var _chunkHP7EYLLYjs = require('./chunk-HP7EYLLY.js');

// src/initializeInpageProvider.ts
function initializeProvider({
  connectionStream,
  jsonRpcStreamName,
  logger = console,
  maxEventListeners = 100,
  providerInfo,
  shouldSendMetadata = true,
  shouldSetOnWindow = true,
  shouldShimWeb3 = false
}) {
  const provider = new (0, _chunkHP7EYLLYjs.MetaMaskInpageProvider)(connectionStream, {
    jsonRpcStreamName,
    logger,
    maxEventListeners,
    shouldSendMetadata
  });
  const proxiedProvider = new Proxy(provider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,
    // fix issue with Proxy unable to access private variables from getters
    // https://stackoverflow.com/a/73051482
    get(target, propName) {
      return target[propName];
    }
  });
  if (providerInfo) {
    _chunkWBB62AKCjs.announceProvider.call(void 0, {
      info: providerInfo,
      provider: proxiedProvider
    });
  }
  if (shouldSetOnWindow) {
    setGlobalProvider(proxiedProvider);
  }
  if (shouldShimWeb3) {
    _chunkDD6YP3BVjs.shimWeb3.call(void 0, proxiedProvider, logger);
  }
  return proxiedProvider;
}
function setGlobalProvider(providerInstance) {
  window.ethereum = providerInstance;
  window.dispatchEvent(new Event("ethereum#initialized"));
}




exports.initializeProvider = initializeProvider; exports.setGlobalProvider = setGlobalProvider;

},{"./chunk-DD6YP3BV.js":19,"./chunk-HP7EYLLY.js":21,"./chunk-WBB62AKC.js":26}],23:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkHP7EYLLYjs = require('./chunk-HP7EYLLY.js');


var _chunkDWR5HIZKjs = require('./chunk-DWR5HIZK.js');


var _chunkO5ECOCX2js = require('./chunk-O5ECOCX2.js');

// src/extension-provider/createExternalExtensionProvider.ts
var _detectbrowser = require('detect-browser');
var _extensionportstream = require('extension-port-stream'); var _extensionportstream2 = _interopRequireDefault(_extensionportstream);

// src/extension-provider/external-extension-config.json
var external_extension_config_default = {
  chromeIds: {
    stable: "nkbihfbeogaeaoehlefnkodbefgpgknn",
    beta: "pbbkamfgmaedccnfkmjcofcecjhfgldn",
    flask: "ljfoeinjpaedjfecbmggjgodbgkmjkjk"
  },
  firefoxIds: {
    stable: "webextension@metamask.io",
    beta: "webextension-beta@metamask.io",
    flask: "webextension-flask@metamask.io"
  }
};

// src/extension-provider/createExternalExtensionProvider.ts
var browser = _detectbrowser.detect.call(void 0, );
function createExternalExtensionProvider(typeOrId = "stable") {
  let provider;
  try {
    const extensionId = getExtensionId(typeOrId);
    const metamaskPort = chrome.runtime.connect(extensionId);
    const pluginStream = new (0, _extensionportstream2.default)(metamaskPort);
    provider = new (0, _chunkDWR5HIZKjs.StreamProvider)(pluginStream, {
      jsonRpcStreamName: _chunkHP7EYLLYjs.MetaMaskInpageProviderStreamName,
      logger: console,
      rpcMiddleware: _chunkO5ECOCX2js.getDefaultExternalMiddleware.call(void 0, console)
    });
    provider.initialize();
  } catch (error) {
    console.dir(`MetaMask connect error.`, error);
    throw error;
  }
  return provider;
}
function getExtensionId(typeOrId) {
  const ids = _optionalChain([browser, 'optionalAccess', _ => _.name]) === "firefox" ? external_extension_config_default.firefoxIds : external_extension_config_default.chromeIds;
  return _nullishCoalesce(ids[typeOrId], () => ( typeOrId));
}



exports.createExternalExtensionProvider = createExternalExtensionProvider;

},{"./chunk-DWR5HIZK.js":20,"./chunk-HP7EYLLY.js":21,"./chunk-O5ECOCX2.js":24,"detect-browser":186,"extension-port-stream":188}],24:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk6QNVTE4Wjs = require('./chunk-6QNVTE4W.js');

// src/utils.ts
var _jsonrpcengine = require('@metamask/json-rpc-engine');
var _rpcerrors = require('@metamask/rpc-errors');
var EMITTED_NOTIFICATIONS = Object.freeze([
  "eth_subscription"
  // per eth-json-rpc-filters/subscriptionManager
]);
var getDefaultExternalMiddleware = (logger = console) => [
  _jsonrpcengine.createIdRemapMiddleware.call(void 0, ),
  createErrorMiddleware(logger),
  _chunk6QNVTE4Wjs.createRpcWarningMiddleware.call(void 0, logger)
];
function createErrorMiddleware(log) {
  return (request, response, next) => {
    if (typeof request.method !== "string" || !request.method) {
      response.error = _rpcerrors.rpcErrors.invalidRequest({
        message: `The request 'method' must be a non-empty string.`,
        data: request
      });
    }
    next((done) => {
      const { error } = response;
      if (!error) {
        return done();
      }
      log.error(`MetaMask - RPC Error: ${error.message}`, error);
      return done();
    });
  };
}
var getRpcPromiseCallback = (resolve, reject, unwrapResult = true) => (error, response) => {
  if (error || response.error) {
    reject(error || response.error);
  } else {
    !unwrapResult || Array.isArray(response) ? resolve(response) : resolve(response.result);
  }
};
var isValidChainId = (chainId) => Boolean(chainId) && typeof chainId === "string" && chainId.startsWith("0x");
var isValidNetworkVersion = (networkVersion) => Boolean(networkVersion) && typeof networkVersion === "string";
var NOOP = () => void 0;








exports.EMITTED_NOTIFICATIONS = EMITTED_NOTIFICATIONS; exports.getDefaultExternalMiddleware = getDefaultExternalMiddleware; exports.getRpcPromiseCallback = getRpcPromiseCallback; exports.isValidChainId = isValidChainId; exports.isValidNetworkVersion = isValidNetworkVersion; exports.NOOP = NOOP;

},{"./chunk-6QNVTE4W.js":17,"@metamask/json-rpc-engine":8,"@metamask/rpc-errors":33}],25:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkO5ECOCX2js = require('./chunk-O5ECOCX2.js');


var _chunk4EQNSGSRjs = require('./chunk-4EQNSGSR.js');

// src/siteMetadata.ts
async function sendSiteMetadata(engine, log) {
  try {
    const domainMetadata = await getSiteMetadata();
    engine.handle(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "metamask_sendDomainMetadata",
        params: domainMetadata
      },
      _chunkO5ECOCX2js.NOOP
    );
  } catch (error) {
    log.error({
      message: _chunk4EQNSGSRjs.messages_default.errors.sendSiteMetadata(),
      originalError: error
    });
  }
}
async function getSiteMetadata() {
  return {
    name: getSiteName(window),
    icon: await getSiteIcon(window)
  };
}
function getSiteName(windowObject) {
  const { document: document2 } = windowObject;
  const siteName = document2.querySelector(
    'head > meta[property="og:site_name"]'
  );
  if (siteName) {
    return siteName.content;
  }
  const metaTitle = document2.querySelector(
    'head > meta[name="title"]'
  );
  if (metaTitle) {
    return metaTitle.content;
  }
  if (document2.title && document2.title.length > 0) {
    return document2.title;
  }
  return window.location.hostname;
}
async function getSiteIcon(windowObject) {
  const { document: document2 } = windowObject;
  const icons = document2.querySelectorAll(
    'head > link[rel~="icon"]'
  );
  for (const icon of Array.from(icons)) {
    if (icon && await imgExists(icon.href)) {
      return icon.href;
    }
  }
  return null;
}
async function imgExists(url) {
  return new Promise((resolve, reject) => {
    try {
      const img = document.createElement("img");
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}



exports.sendSiteMetadata = sendSiteMetadata;

},{"./chunk-4EQNSGSR.js":16,"./chunk-O5ECOCX2.js":24}],26:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/EIP6963.ts
var _utils = require('@metamask/utils');
var UUID_V4_REGEX = /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;
var FQDN_REGEX = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/u;
function requestProvider(handleProvider) {
  window.addEventListener(
    "eip6963:announceProvider" /* Announce */,
    (event) => {
      if (!isValidAnnounceProviderEvent(event)) {
        throwErrorEIP6963(
          `Invalid EIP-6963 AnnounceProviderEvent object received from ${"eip6963:announceProvider" /* Announce */} event.`
        );
      }
      handleProvider(event.detail);
    }
  );
  window.dispatchEvent(new Event("eip6963:requestProvider" /* Request */));
}
function announceProvider(providerDetail) {
  if (!isValidProviderDetail(providerDetail)) {
    throwErrorEIP6963("Invalid EIP-6963 ProviderDetail object.");
  }
  const { info, provider } = providerDetail;
  const _announceProvider = () => window.dispatchEvent(
    new CustomEvent("eip6963:announceProvider" /* Announce */, {
      detail: Object.freeze({ info: { ...info }, provider })
    })
  );
  _announceProvider();
  window.addEventListener(
    "eip6963:requestProvider" /* Request */,
    (event) => {
      if (!isValidRequestProviderEvent(event)) {
        throwErrorEIP6963(
          `Invalid EIP-6963 RequestProviderEvent object received from ${"eip6963:requestProvider" /* Request */} event.`
        );
      }
      _announceProvider();
    }
  );
}
function isValidRequestProviderEvent(event) {
  return event instanceof Event && event.type === "eip6963:requestProvider" /* Request */;
}
function isValidAnnounceProviderEvent(event) {
  return event instanceof CustomEvent && event.type === "eip6963:announceProvider" /* Announce */ && Object.isFrozen(event.detail) && isValidProviderDetail(event.detail);
}
function isValidProviderDetail(providerDetail) {
  if (!_utils.isObject.call(void 0, providerDetail) || !_utils.isObject.call(void 0, providerDetail.info) || !_utils.isObject.call(void 0, providerDetail.provider)) {
    return false;
  }
  const { info } = providerDetail;
  return typeof info.uuid === "string" && UUID_V4_REGEX.test(info.uuid) && typeof info.name === "string" && Boolean(info.name) && typeof info.icon === "string" && info.icon.startsWith("data:image") && typeof info.rdns === "string" && FQDN_REGEX.test(info.rdns);
}
function throwErrorEIP6963(message) {
  throw new Error(
    `${message} See https://eips.ethereum.org/EIPS/eip-6963 for requirements.`
  );
}




exports.requestProvider = requestProvider; exports.announceProvider = announceProvider;

},{"@metamask/utils":119}],27:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/constants.ts
var ERC721 = "ERC721";
var ERC1155 = "ERC1155";
var ERC20 = "ERC20";





exports.ERC721 = ERC721; exports.ERC1155 = ERC1155; exports.ERC20 = ERC20;

},{}],28:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkKUKZKOBUjs = require('./chunk-KUKZKOBU.js');



var _chunkIZY7ABOLjs = require('./chunk-IZY7ABOL.js');


var _chunkDD6YP3BVjs = require('./chunk-DD6YP3BV.js');



var _chunkWBB62AKCjs = require('./chunk-WBB62AKC.js');



var _chunkHP7EYLLYjs = require('./chunk-HP7EYLLY.js');
require('./chunk-Q4DN6VYN.js');


var _chunkDWR5HIZKjs = require('./chunk-DWR5HIZK.js');


var _chunkA3W22U42js = require('./chunk-A3W22U42.js');
require('./chunk-O5ECOCX2.js');
require('./chunk-6QNVTE4W.js');
require('./chunk-ZOFGBGOM.js');
require('./chunk-4EQNSGSR.js');
require('./chunk-3W5G4CYI.js');











exports.BaseProvider = _chunkA3W22U42js.BaseProvider; exports.MetaMaskInpageProvider = _chunkHP7EYLLYjs.MetaMaskInpageProvider; exports.MetaMaskInpageProviderStreamName = _chunkHP7EYLLYjs.MetaMaskInpageProviderStreamName; exports.StreamProvider = _chunkDWR5HIZKjs.StreamProvider; exports.createExternalExtensionProvider = _chunkKUKZKOBUjs.createExternalExtensionProvider; exports.eip6963AnnounceProvider = _chunkWBB62AKCjs.announceProvider; exports.eip6963RequestProvider = _chunkWBB62AKCjs.requestProvider; exports.initializeProvider = _chunkIZY7ABOLjs.initializeProvider; exports.setGlobalProvider = _chunkIZY7ABOLjs.setGlobalProvider; exports.shimWeb3 = _chunkDD6YP3BVjs.shimWeb3;

},{"./chunk-3W5G4CYI.js":15,"./chunk-4EQNSGSR.js":16,"./chunk-6QNVTE4W.js":17,"./chunk-A3W22U42.js":18,"./chunk-DD6YP3BV.js":19,"./chunk-DWR5HIZK.js":20,"./chunk-HP7EYLLY.js":21,"./chunk-IZY7ABOL.js":22,"./chunk-KUKZKOBU.js":23,"./chunk-O5ECOCX2.js":24,"./chunk-Q4DN6VYN.js":25,"./chunk-WBB62AKC.js":26,"./chunk-ZOFGBGOM.js":27}],29:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/error-constants.ts
var errorCodes = {
  rpc: {
    invalidInput: -32e3,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901
  }
};
var errorValues = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available."
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s)."
  },
  "-32603": {
    standard: "JSON RPC 2.0",
    message: "Internal JSON-RPC error."
  },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input."
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found."
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable."
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected."
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported."
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded."
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request."
  },
  "4100": {
    standard: "EIP-1193",
    message: "The requested account and/or method has not been authorized by the user."
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider."
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains."
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain."
  }
};




exports.errorCodes = errorCodes; exports.errorValues = errorValues;

},{}],30:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }


var _chunkPV5NRPSSjs = require('./chunk-PV5NRPSS.js');


var _chunkXOYARAPPjs = require('./chunk-XOYARAPP.js');


var _chunkFBHPY3A4js = require('./chunk-FBHPY3A4.js');

// src/errors.ts
var rpcErrors = {
  /**
   * Get a JSON RPC 2.0 Parse (-32700) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  parse: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.parse, arg),
  /**
   * Get a JSON RPC 2.0 Invalid Request (-32600) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidRequest: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.invalidRequest, arg),
  /**
   * Get a JSON RPC 2.0 Invalid Params (-32602) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidParams: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.invalidParams, arg),
  /**
   * Get a JSON RPC 2.0 Method Not Found (-32601) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotFound: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.methodNotFound, arg),
  /**
   * Get a JSON RPC 2.0 Internal (-32603) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  internal: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.internal, arg),
  /**
   * Get a JSON RPC 2.0 Server error.
   * Permits integer error codes in the [ -32099 <= -32005 ] range.
   * Codes -32000 through -32004 are reserved by EIP-1474.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  server: (opts) => {
    if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
      throw new Error(
        "Ethereum RPC Server errors must provide single object argument."
      );
    }
    const { code } = opts;
    if (!Number.isInteger(code) || code > -32005 || code < -32099) {
      throw new Error(
        '"code" must be an integer such that: -32099 <= code <= -32005'
      );
    }
    return getJsonRpcError(code, opts);
  },
  /**
   * Get an Ethereum JSON RPC Invalid Input (-32000) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidInput: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.invalidInput, arg),
  /**
   * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceNotFound: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.resourceNotFound, arg),
  /**
   * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceUnavailable: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.resourceUnavailable, arg),
  /**
   * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  transactionRejected: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.transactionRejected, arg),
  /**
   * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotSupported: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.methodNotSupported, arg),
  /**
   * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  limitExceeded: (arg) => getJsonRpcError(_chunkFBHPY3A4js.errorCodes.rpc.limitExceeded, arg)
};
var providerErrors = {
  /**
   * Get an Ethereum Provider User Rejected Request (4001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  userRejectedRequest: (arg) => {
    return getEthProviderError(_chunkFBHPY3A4js.errorCodes.provider.userRejectedRequest, arg);
  },
  /**
   * Get an Ethereum Provider Unauthorized (4100) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unauthorized: (arg) => {
    return getEthProviderError(_chunkFBHPY3A4js.errorCodes.provider.unauthorized, arg);
  },
  /**
   * Get an Ethereum Provider Unsupported Method (4200) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unsupportedMethod: (arg) => {
    return getEthProviderError(_chunkFBHPY3A4js.errorCodes.provider.unsupportedMethod, arg);
  },
  /**
   * Get an Ethereum Provider Not Connected (4900) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  disconnected: (arg) => {
    return getEthProviderError(_chunkFBHPY3A4js.errorCodes.provider.disconnected, arg);
  },
  /**
   * Get an Ethereum Provider Chain Not Connected (4901) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  chainDisconnected: (arg) => {
    return getEthProviderError(_chunkFBHPY3A4js.errorCodes.provider.chainDisconnected, arg);
  },
  /**
   * Get a custom Ethereum Provider error.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  custom: (opts) => {
    if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
      throw new Error(
        "Ethereum Provider custom errors must provide single object argument."
      );
    }
    const { code, message, data } = opts;
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a nonempty string');
    }
    return new (0, _chunkPV5NRPSSjs.EthereumProviderError)(code, message, data);
  }
};
function getJsonRpcError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new (0, _chunkPV5NRPSSjs.JsonRpcError)(code, _nullishCoalesce(message, () => ( _chunkXOYARAPPjs.getMessageFromCode.call(void 0, code))), data);
}
function getEthProviderError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new (0, _chunkPV5NRPSSjs.EthereumProviderError)(
    code,
    _nullishCoalesce(message, () => ( _chunkXOYARAPPjs.getMessageFromCode.call(void 0, code))),
    data
  );
}
function parseOpts(arg) {
  if (arg) {
    if (typeof arg === "string") {
      return [arg];
    } else if (typeof arg === "object" && !Array.isArray(arg)) {
      const { message, data } = arg;
      if (message && typeof message !== "string") {
        throw new Error("Must specify string message.");
      }
      return [_nullishCoalesce(message, () => ( void 0)), data];
    }
  }
  return [];
}




exports.rpcErrors = rpcErrors; exports.providerErrors = providerErrors;

},{"./chunk-FBHPY3A4.js":29,"./chunk-PV5NRPSS.js":31,"./chunk-XOYARAPP.js":32}],31:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkXOYARAPPjs = require('./chunk-XOYARAPP.js');

// src/classes.ts
var _utils = require('@metamask/utils');
var _fastsafestringify = require('fast-safe-stringify'); var _fastsafestringify2 = _interopRequireDefault(_fastsafestringify);
var JsonRpcError = class extends Error {
  constructor(code, message, data) {
    var __super = (...args) => {
      super(...args);
    };
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a non-empty string.');
    }
    if (_chunkXOYARAPPjs.dataHasCause.call(void 0, data)) {
      __super(message, { cause: data.cause });
      if (!_utils.hasProperty.call(void 0, this, "cause")) {
        Object.assign(this, { cause: data.cause });
      }
    } else {
      __super(message);
    }
    if (data !== void 0) {
      this.data = data;
    }
    this.code = code;
  }
  /**
   * Get the error as JSON-serializable object.
   *
   * @returns A plain object with all public class properties.
   */
  serialize() {
    const serialized = {
      code: this.code,
      message: this.message
    };
    if (this.data !== void 0) {
      serialized.data = this.data;
      if (_utils.isPlainObject.call(void 0, this.data)) {
        serialized.data.cause = _chunkXOYARAPPjs.serializeCause.call(void 0, this.data.cause);
      }
    }
    if (this.stack) {
      serialized.stack = this.stack;
    }
    return serialized;
  }
  /**
   * Get a string representation of the serialized error, omitting any circular
   * references.
   *
   * @returns A string representation of the serialized error.
   */
  toString() {
    return _fastsafestringify2.default.call(void 0, this.serialize(), stringifyReplacer, 2);
  }
};
var EthereumProviderError = class extends JsonRpcError {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   *
   * @param code - The JSON-RPC error code. Must be an integer in the
   * `1000 <= n <= 4999` range.
   * @param message - The JSON-RPC error message.
   * @param data - Optional data to include in the error.
   */
  constructor(code, message, data) {
    if (!isValidEthProviderCode(code)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999'
      );
    }
    super(code, message, data);
  }
};
function isValidEthProviderCode(code) {
  return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
function stringifyReplacer(_, value) {
  if (value === "[Circular]") {
    return void 0;
  }
  return value;
}




exports.JsonRpcError = JsonRpcError; exports.EthereumProviderError = EthereumProviderError;

},{"./chunk-XOYARAPP.js":32,"@metamask/utils":44,"fast-safe-stringify":190}],32:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunkFBHPY3A4js = require('./chunk-FBHPY3A4.js');

// src/utils.ts





var _utils = require('@metamask/utils');
var FALLBACK_ERROR_CODE = _chunkFBHPY3A4js.errorCodes.rpc.internal;
var FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
var FALLBACK_ERROR = {
  code: FALLBACK_ERROR_CODE,
  message: getMessageFromCode(FALLBACK_ERROR_CODE)
};
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
  if (isValidCode(code)) {
    const codeString = code.toString();
    if (_utils.hasProperty.call(void 0, _chunkFBHPY3A4js.errorValues, codeString)) {
      return _chunkFBHPY3A4js.errorValues[codeString].message;
    }
    if (isJsonRpcServerError(code)) {
      return JSON_RPC_SERVER_ERROR_MESSAGE;
    }
  }
  return fallbackMessage;
}
function isValidCode(code) {
  return Number.isInteger(code);
}
function serializeError(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = true } = {}) {
  if (!_utils.isJsonRpcError.call(void 0, fallbackError)) {
    throw new Error(
      "Must provide fallback error with integer number code and string message."
    );
  }
  const serialized = buildError(error, fallbackError);
  if (!shouldIncludeStack) {
    delete serialized.stack;
  }
  return serialized;
}
function buildError(error, fallbackError) {
  if (error && typeof error === "object" && "serialize" in error && typeof error.serialize === "function") {
    return error.serialize();
  }
  if (_utils.isJsonRpcError.call(void 0, error)) {
    return error;
  }
  const cause = serializeCause(error);
  const fallbackWithCause = {
    ...fallbackError,
    data: { cause }
  };
  return fallbackWithCause;
}
function isJsonRpcServerError(code) {
  return code >= -32099 && code <= -32e3;
}
function serializeCause(error) {
  if (Array.isArray(error)) {
    return error.map((entry) => {
      if (_utils.isValidJson.call(void 0, entry)) {
        return entry;
      } else if (_utils.isObject.call(void 0, entry)) {
        return serializeObject(entry);
      }
      return null;
    });
  } else if (_utils.isObject.call(void 0, error)) {
    return serializeObject(error);
  }
  if (_utils.isValidJson.call(void 0, error)) {
    return error;
  }
  return null;
}
function serializeObject(object) {
  return Object.getOwnPropertyNames(object).reduce(
    (acc, key) => {
      const value = object[key];
      if (_utils.isValidJson.call(void 0, value)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
}
function dataHasCause(data) {
  return _utils.isObject.call(void 0, data) && _utils.hasProperty.call(void 0, data, "cause") && _utils.isObject.call(void 0, data.cause);
}








exports.JSON_RPC_SERVER_ERROR_MESSAGE = JSON_RPC_SERVER_ERROR_MESSAGE; exports.getMessageFromCode = getMessageFromCode; exports.isValidCode = isValidCode; exports.serializeError = serializeError; exports.serializeCause = serializeCause; exports.dataHasCause = dataHasCause;

},{"./chunk-FBHPY3A4.js":29,"@metamask/utils":44}],33:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunkHJCBU6QBjs = require('./chunk-HJCBU6QB.js');



var _chunkPV5NRPSSjs = require('./chunk-PV5NRPSS.js');





var _chunkXOYARAPPjs = require('./chunk-XOYARAPP.js');


var _chunkFBHPY3A4js = require('./chunk-FBHPY3A4.js');










exports.EthereumProviderError = _chunkPV5NRPSSjs.EthereumProviderError; exports.JsonRpcError = _chunkPV5NRPSSjs.JsonRpcError; exports.dataHasCause = _chunkXOYARAPPjs.dataHasCause; exports.errorCodes = _chunkFBHPY3A4js.errorCodes; exports.getMessageFromCode = _chunkXOYARAPPjs.getMessageFromCode; exports.providerErrors = _chunkHJCBU6QBjs.providerErrors; exports.rpcErrors = _chunkHJCBU6QBjs.rpcErrors; exports.serializeCause = _chunkXOYARAPPjs.serializeCause; exports.serializeError = _chunkXOYARAPPjs.serializeError;

},{"./chunk-FBHPY3A4.js":29,"./chunk-HJCBU6QB.js":30,"./chunk-PV5NRPSS.js":31,"./chunk-XOYARAPP.js":32}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertExhaustive = exports.assertStruct = exports.assert = exports.AssertionError = void 0;
const superstruct_1 = require("@metamask/superstruct");
const errors_1 = require("./errors.cjs");
/**
 * Check if a value is a constructor, i.e., a function that can be called with
 * the `new` keyword.
 *
 * @param fn - The value to check.
 * @returns `true` if the value is a constructor, or `false` otherwise.
 */
function isConstructable(fn) {
    /* istanbul ignore next */
    return Boolean(typeof fn?.prototype?.constructor?.name === 'string');
}
/**
 * Attempts to obtain the message from a possible error object. If it is
 * possible to do so, any trailing period will be removed from the message;
 * otherwise an empty string is returned.
 *
 * @param error - The error object to get the message from.
 * @returns The message without any trailing period if `error` is an object
 * with a `message` property; the string version of `error` without any trailing
 * period if it is not `undefined` or `null`; otherwise an empty string.
 */
function getErrorMessageWithoutTrailingPeriod(error) {
    // We'll add our own period.
    return (0, errors_1.getErrorMessage)(error).replace(/\.$/u, '');
}
/**
 * Initialise an {@link AssertionErrorConstructor} error.
 *
 * @param ErrorWrapper - The error class to use.
 * @param message - The error message.
 * @returns The error object.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getError(ErrorWrapper, message) {
    if (isConstructable(ErrorWrapper)) {
        return new ErrorWrapper({
            message,
        });
    }
    return ErrorWrapper({
        message,
    });
}
/**
 * The default error class that is thrown if an assertion fails.
 */
class AssertionError extends Error {
    constructor(options) {
        super(options.message);
        this.code = 'ERR_ASSERTION';
    }
}
exports.AssertionError = AssertionError;
/**
 * Same as Node.js assert.
 * If the value is falsy, throws an error, does nothing otherwise.
 *
 * @throws {@link AssertionError} If value is falsy.
 * @param value - The test that should be truthy to pass.
 * @param message - Message to be passed to {@link AssertionError} or an
 * {@link Error} instance to throw.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}. If a custom error class is provided for
 * the `message` argument, this argument is ignored.
 */
function assert(value, message = 'Assertion failed.', 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper = AssertionError) {
    if (!value) {
        if (message instanceof Error) {
            throw message;
        }
        throw getError(ErrorWrapper, message);
    }
}
exports.assert = assert;
/**
 * Assert a value against a Superstruct struct.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param errorPrefix - A prefix to add to the error message. Defaults to
 * "Assertion failed".
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the value is not valid.
 */
function assertStruct(value, struct, errorPrefix = 'Assertion failed', 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper = AssertionError) {
    try {
        (0, superstruct_1.assert)(value, struct);
    }
    catch (error) {
        throw getError(ErrorWrapper, `${errorPrefix}: ${getErrorMessageWithoutTrailingPeriod(error)}.`);
    }
}
exports.assertStruct = assertStruct;
/**
 * Use in the default case of a switch that you want to be fully exhaustive.
 * Using this function forces the compiler to enforce exhaustivity during
 * compile-time.
 *
 * @example
 * ```
 * const number = 1;
 * switch (number) {
 *   case 0:
 *     ...
 *   case 1:
 *     ...
 *   default:
 *     assertExhaustive(snapPrefix);
 * }
 * ```
 * @param _object - The object on which the switch is being operated.
 */
function assertExhaustive(_object) {
    throw new Error('Invalid branch reached. Should be detected during compilation.');
}
exports.assertExhaustive = assertExhaustive;

},{"./errors.cjs":42,"@metamask/superstruct":102}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64 = void 0;
const superstruct_1 = require("@metamask/superstruct");
const assert_1 = require("./assert.cjs");
/**
 * Ensure that a provided string-based struct is valid base64.
 *
 * @param struct - The string based struct.
 * @param options - Optional options to specialize base64 validation. See {@link Base64Options} documentation.
 * @returns A superstruct validating base64.
 */
const base64 = (struct, options = {}) => {
    const paddingRequired = options.paddingRequired ?? false;
    const characterSet = options.characterSet ?? 'base64';
    let letters;
    if (characterSet === 'base64') {
        letters = String.raw `[A-Za-z0-9+\/]`;
    }
    else {
        (0, assert_1.assert)(characterSet === 'base64url');
        letters = String.raw `[-_A-Za-z0-9]`;
    }
    let re;
    if (paddingRequired) {
        re = new RegExp(`^(?:${letters}{4})*(?:${letters}{3}=|${letters}{2}==)?$`, 'u');
    }
    else {
        re = new RegExp(`^(?:${letters}{4})*(?:${letters}{2,3}|${letters}{3}=|${letters}{2}==)?$`, 'u');
    }
    return (0, superstruct_1.pattern)(struct, re);
};
exports.base64 = base64;

},{"./assert.cjs":34,"@metamask/superstruct":102}],36:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataView = exports.concatBytes = exports.valueToBytes = exports.base64ToBytes = exports.stringToBytes = exports.numberToBytes = exports.signedBigIntToBytes = exports.bigIntToBytes = exports.hexToBytes = exports.bytesToBase64 = exports.bytesToString = exports.bytesToNumber = exports.bytesToSignedBigInt = exports.bytesToBigInt = exports.bytesToHex = exports.assertIsBytes = exports.isBytes = void 0;
const base_1 = require("@scure/base");
const assert_1 = require("./assert.cjs");
const hex_1 = require("./hex.cjs");
// '0'.charCodeAt(0) === 48
const HEX_MINIMUM_NUMBER_CHARACTER = 48;
// '9'.charCodeAt(0) === 57
const HEX_MAXIMUM_NUMBER_CHARACTER = 58;
const HEX_CHARACTER_OFFSET = 87;
/**
 * Memoized function that returns an array to be used as a lookup table for
 * converting bytes to hexadecimal values.
 *
 * The array is created lazily and then cached for future use. The benefit of
 * this approach is that the performance of converting bytes to hex is much
 * better than if we were to call `toString(16)` on each byte.
 *
 * The downside is that the array is created once and then never garbage
 * collected. This is not a problem in practice because the array is only 256
 * elements long.
 *
 * @returns A function that returns the lookup table.
 */
function getPrecomputedHexValuesBuilder() {
    // To avoid issues with tree shaking, we need to use a function to return the
    // array. This is because the array is only used in the `bytesToHex` function
    // and if we were to use a global variable, the array might be removed by the
    // tree shaker.
    const lookupTable = [];
    return () => {
        if (lookupTable.length === 0) {
            for (let i = 0; i < 256; i++) {
                lookupTable.push(i.toString(16).padStart(2, '0'));
            }
        }
        return lookupTable;
    };
}
/**
 * Function implementation of the {@link getPrecomputedHexValuesBuilder}
 * function.
 */
const getPrecomputedHexValues = getPrecomputedHexValuesBuilder();
/**
 * Check if a value is a `Uint8Array`.
 *
 * @param value - The value to check.
 * @returns Whether the value is a `Uint8Array`.
 */
function isBytes(value) {
    return value instanceof Uint8Array;
}
exports.isBytes = isBytes;
/**
 * Assert that a value is a `Uint8Array`.
 *
 * @param value - The value to check.
 * @throws If the value is not a `Uint8Array`.
 */
function assertIsBytes(value) {
    (0, assert_1.assert)(isBytes(value), 'Value must be a Uint8Array.');
}
exports.assertIsBytes = assertIsBytes;
/**
 * Convert a `Uint8Array` to a hexadecimal string.
 *
 * @param bytes - The bytes to convert to a hexadecimal string.
 * @returns The hexadecimal string.
 */
function bytesToHex(bytes) {
    assertIsBytes(bytes);
    if (bytes.length === 0) {
        return '0x';
    }
    const lookupTable = getPrecomputedHexValues();
    const hexadecimal = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        hexadecimal[i] = lookupTable[bytes[i]];
    }
    return (0, hex_1.add0x)(hexadecimal.join(''));
}
exports.bytesToHex = bytesToHex;
/**
 * Convert a `Uint8Array` to a `bigint`.
 *
 * To convert a `Uint8Array` to a `number` instead, use {@link bytesToNumber}.
 * To convert a two's complement encoded `Uint8Array` to a `bigint`, use
 * {@link bytesToSignedBigInt}.
 *
 * @param bytes - The bytes to convert to a `bigint`.
 * @returns The `bigint`.
 */
function bytesToBigInt(bytes) {
    assertIsBytes(bytes);
    const hexadecimal = bytesToHex(bytes);
    return BigInt(hexadecimal);
}
exports.bytesToBigInt = bytesToBigInt;
/**
 * Convert a `Uint8Array` to a signed `bigint`. This assumes that the bytes are
 * encoded in two's complement.
 *
 * To convert a `Uint8Array` to an unsigned `bigint` instead, use
 * {@link bytesToBigInt}.
 *
 * @see https://en.wikipedia.org/wiki/Two%27s_complement
 * @param bytes - The bytes to convert to a signed `bigint`.
 * @returns The signed `bigint`.
 */
function bytesToSignedBigInt(bytes) {
    assertIsBytes(bytes);
    let value = BigInt(0);
    for (const byte of bytes) {
        // eslint-disable-next-line no-bitwise
        value = (value << BigInt(8)) + BigInt(byte);
    }
    return BigInt.asIntN(bytes.length * 8, value);
}
exports.bytesToSignedBigInt = bytesToSignedBigInt;
/**
 * Convert a `Uint8Array` to a `number`.
 *
 * To convert a `Uint8Array` to a `bigint` instead, use {@link bytesToBigInt}.
 *
 * @param bytes - The bytes to convert to a number.
 * @returns The number.
 * @throws If the resulting number is not a safe integer.
 */
function bytesToNumber(bytes) {
    assertIsBytes(bytes);
    const bigint = bytesToBigInt(bytes);
    (0, assert_1.assert)(bigint <= BigInt(Number.MAX_SAFE_INTEGER), 'Number is not a safe integer. Use `bytesToBigInt` instead.');
    return Number(bigint);
}
exports.bytesToNumber = bytesToNumber;
/**
 * Convert a UTF-8 encoded `Uint8Array` to a `string`.
 *
 * @param bytes - The bytes to convert to a string.
 * @returns The string.
 */
function bytesToString(bytes) {
    assertIsBytes(bytes);
    return new TextDecoder().decode(bytes);
}
exports.bytesToString = bytesToString;
/**
 * Convert a `Uint8Array` to a base64 encoded string.
 *
 * @param bytes - The bytes to convert to a base64 encoded string.
 * @returns The base64 encoded string.
 */
function bytesToBase64(bytes) {
    assertIsBytes(bytes);
    return base_1.base64.encode(bytes);
}
exports.bytesToBase64 = bytesToBase64;
/**
 * Convert a hexadecimal string to a `Uint8Array`. The string can optionally be
 * prefixed with `0x`. It accepts even and odd length strings.
 *
 * If the value is "0x", an empty `Uint8Array` is returned.
 *
 * @param value - The hexadecimal string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
function hexToBytes(value) {
    // "0x" is often used as empty byte array.
    if (value?.toLowerCase?.() === '0x') {
        return new Uint8Array();
    }
    (0, hex_1.assertIsHexString)(value);
    // Remove the `0x` prefix if it exists, and pad the string to have an even
    // number of characters.
    const strippedValue = (0, hex_1.remove0x)(value).toLowerCase();
    const normalizedValue = strippedValue.length % 2 === 0 ? strippedValue : `0${strippedValue}`;
    const bytes = new Uint8Array(normalizedValue.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        // While this is not the prettiest way to convert a hexadecimal string to a
        // `Uint8Array`, it is a lot faster than using `parseInt` to convert each
        // character.
        const c1 = normalizedValue.charCodeAt(i * 2);
        const c2 = normalizedValue.charCodeAt(i * 2 + 1);
        const n1 = c1 -
            (c1 < HEX_MAXIMUM_NUMBER_CHARACTER
                ? HEX_MINIMUM_NUMBER_CHARACTER
                : HEX_CHARACTER_OFFSET);
        const n2 = c2 -
            (c2 < HEX_MAXIMUM_NUMBER_CHARACTER
                ? HEX_MINIMUM_NUMBER_CHARACTER
                : HEX_CHARACTER_OFFSET);
        bytes[i] = n1 * 16 + n2;
    }
    return bytes;
}
exports.hexToBytes = hexToBytes;
/**
 * Convert a `bigint` to a `Uint8Array`.
 *
 * This assumes that the `bigint` is an unsigned integer. To convert a signed
 * `bigint` instead, use {@link signedBigIntToBytes}.
 *
 * @param value - The bigint to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
function bigIntToBytes(value) {
    (0, assert_1.assert)(typeof value === 'bigint', 'Value must be a bigint.');
    (0, assert_1.assert)(value >= BigInt(0), 'Value must be a non-negative bigint.');
    const hexadecimal = value.toString(16);
    return hexToBytes(hexadecimal);
}
exports.bigIntToBytes = bigIntToBytes;
/**
 * Check if a `bigint` fits in a certain number of bytes.
 *
 * @param value - The `bigint` to check.
 * @param bytes - The number of bytes.
 * @returns Whether the `bigint` fits in the number of bytes.
 */
function bigIntFits(value, bytes) {
    (0, assert_1.assert)(bytes > 0);
    /* eslint-disable no-bitwise */
    const mask = value >> BigInt(31);
    return !(((~value & mask) + (value & ~mask)) >> BigInt(bytes * 8 + ~0));
    /* eslint-enable no-bitwise */
}
/**
 * Convert a signed `bigint` to a `Uint8Array`. This uses two's complement
 * encoding to represent negative numbers.
 *
 * To convert an unsigned `bigint` to a `Uint8Array` instead, use
 * {@link bigIntToBytes}.
 *
 * @see https://en.wikipedia.org/wiki/Two%27s_complement
 * @param value - The number to convert to bytes.
 * @param byteLength - The length of the resulting `Uint8Array`. If the number
 * is larger than the maximum value that can be represented by the given length,
 * an error is thrown.
 * @returns The bytes as `Uint8Array`.
 */
function signedBigIntToBytes(value, byteLength) {
    (0, assert_1.assert)(typeof value === 'bigint', 'Value must be a bigint.');
    (0, assert_1.assert)(typeof byteLength === 'number', 'Byte length must be a number.');
    (0, assert_1.assert)(byteLength > 0, 'Byte length must be greater than 0.');
    (0, assert_1.assert)(bigIntFits(value, byteLength), 'Byte length is too small to represent the given value.');
    // ESLint doesn't like mutating function parameters, so to avoid having to
    // disable the rule, we create a new variable.
    let numberValue = value;
    const bytes = new Uint8Array(byteLength);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number(BigInt.asUintN(8, numberValue));
        // eslint-disable-next-line no-bitwise
        numberValue >>= BigInt(8);
    }
    return bytes.reverse();
}
exports.signedBigIntToBytes = signedBigIntToBytes;
/**
 * Convert a `number` to a `Uint8Array`.
 *
 * @param value - The number to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 * @throws If the number is not a safe integer.
 */
function numberToBytes(value) {
    (0, assert_1.assert)(typeof value === 'number', 'Value must be a number.');
    (0, assert_1.assert)(value >= 0, 'Value must be a non-negative number.');
    (0, assert_1.assert)(Number.isSafeInteger(value), 'Value is not a safe integer. Use `bigIntToBytes` instead.');
    const hexadecimal = value.toString(16);
    return hexToBytes(hexadecimal);
}
exports.numberToBytes = numberToBytes;
/**
 * Convert a `string` to a UTF-8 encoded `Uint8Array`.
 *
 * @param value - The string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
function stringToBytes(value) {
    (0, assert_1.assert)(typeof value === 'string', 'Value must be a string.');
    return new TextEncoder().encode(value);
}
exports.stringToBytes = stringToBytes;
/**
 * Convert a base64 encoded string to a `Uint8Array`.
 *
 * @param value - The base64 encoded string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
function base64ToBytes(value) {
    (0, assert_1.assert)(typeof value === 'string', 'Value must be a string.');
    return base_1.base64.decode(value);
}
exports.base64ToBytes = base64ToBytes;
/**
 * Convert a byte-like value to a `Uint8Array`. The value can be a `Uint8Array`,
 * a `bigint`, a `number`, or a `string`.
 *
 * This will attempt to guess the type of the value based on its type and
 * contents. For more control over the conversion, use the more specific
 * conversion functions, such as {@link hexToBytes} or {@link stringToBytes}.
 *
 * If the value is a `string`, and it is prefixed with `0x`, it will be
 * interpreted as a hexadecimal string. Otherwise, it will be interpreted as a
 * UTF-8 string. To convert a hexadecimal string to bytes without interpreting
 * it as a UTF-8 string, use {@link hexToBytes} instead.
 *
 * If the value is a `bigint`, it is assumed to be unsigned. To convert a signed
 * `bigint` to bytes, use {@link signedBigIntToBytes} instead.
 *
 * If the value is a `Uint8Array`, it will be returned as-is.
 *
 * @param value - The value to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
function valueToBytes(value) {
    if (typeof value === 'bigint') {
        return bigIntToBytes(value);
    }
    if (typeof value === 'number') {
        return numberToBytes(value);
    }
    if (typeof value === 'string') {
        if (value.startsWith('0x')) {
            return hexToBytes(value);
        }
        return stringToBytes(value);
    }
    if (isBytes(value)) {
        return value;
    }
    throw new TypeError(`Unsupported value type: "${typeof value}".`);
}
exports.valueToBytes = valueToBytes;
/**
 * Concatenate multiple byte-like values into a single `Uint8Array`. The values
 * can be `Uint8Array`, `bigint`, `number`, or `string`. This uses
 * {@link valueToBytes} under the hood to convert each value to bytes. Refer to
 * the documentation of that function for more information.
 *
 * @param values - The values to concatenate.
 * @returns The concatenated bytes as `Uint8Array`.
 */
function concatBytes(values) {
    const normalizedValues = new Array(values.length);
    let byteLength = 0;
    for (let i = 0; i < values.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = valueToBytes(values[i]);
        normalizedValues[i] = value;
        byteLength += value.length;
    }
    const bytes = new Uint8Array(byteLength);
    for (let i = 0, offset = 0; i < normalizedValues.length; i++) {
        // While we could simply spread the values into an array and use
        // `Uint8Array.from`, that is a lot slower than using `Uint8Array.set`.
        bytes.set(normalizedValues[i], offset);
        offset += normalizedValues[i].length;
    }
    return bytes;
}
exports.concatBytes = concatBytes;
/**
 * Create a {@link DataView} from a {@link Uint8Array}. This is a convenience
 * function that avoids having to create a {@link DataView} manually, which
 * requires passing the `byteOffset` and `byteLength` parameters every time.
 *
 * Not passing the `byteOffset` and `byteLength` parameters can result in
 * unexpected behavior when the {@link Uint8Array} is a view of a larger
 * {@link ArrayBuffer}, e.g., when using {@link Uint8Array.subarray}.
 *
 * This function also supports Node.js {@link Buffer}s.
 *
 * @example
 * ```typescript
 * const bytes = new Uint8Array([1, 2, 3]);
 *
 * // This is equivalent to:
 * // const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
 * const dataView = createDataView(bytes);
 * ```
 * @param bytes - The bytes to create the {@link DataView} from.
 * @returns The {@link DataView}.
 */
function createDataView(bytes) {
    // To maintain compatibility with Node.js, we need to check if the bytes are
    // a Buffer. If so, we need to slice the buffer to get the underlying
    // ArrayBuffer.
    // eslint-disable-next-line no-restricted-globals
    if (typeof Buffer !== 'undefined' && bytes instanceof Buffer) {
        const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        return new DataView(buffer);
    }
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
exports.createDataView = createDataView;

}).call(this)}).call(this,require("buffer").Buffer)
},{"./assert.cjs":34,"./hex.cjs":43,"@scure/base":180,"buffer":183}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCaipChainId = exports.parseCaipAccountId = exports.parseCaipChainId = exports.isCaipAccountAddress = exports.isCaipAccountId = exports.isCaipReference = exports.isCaipNamespace = exports.isCaipChainId = exports.KnownCaipNamespace = exports.CaipAccountAddressStruct = exports.CaipAccountIdStruct = exports.CaipReferenceStruct = exports.CaipNamespaceStruct = exports.CaipChainIdStruct = exports.CAIP_ACCOUNT_ADDRESS_REGEX = exports.CAIP_ACCOUNT_ID_REGEX = exports.CAIP_REFERENCE_REGEX = exports.CAIP_NAMESPACE_REGEX = exports.CAIP_CHAIN_ID_REGEX = void 0;
const superstruct_1 = require("@metamask/superstruct");
exports.CAIP_CHAIN_ID_REGEX = /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})$/u;
exports.CAIP_NAMESPACE_REGEX = /^[-a-z0-9]{3,8}$/u;
exports.CAIP_REFERENCE_REGEX = /^[-_a-zA-Z0-9]{1,32}$/u;
exports.CAIP_ACCOUNT_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;
exports.CAIP_ACCOUNT_ADDRESS_REGEX = /^[-.%a-zA-Z0-9]{1,128}$/u;
/**
 * A CAIP-2 chain ID, i.e., a human-readable namespace and reference.
 */
exports.CaipChainIdStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_CHAIN_ID_REGEX);
/**
 * A CAIP-2 namespace, i.e., the first part of a CAIP chain ID.
 */
exports.CaipNamespaceStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_NAMESPACE_REGEX);
/**
 * A CAIP-2 reference, i.e., the second part of a CAIP chain ID.
 */
exports.CaipReferenceStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_REFERENCE_REGEX);
/**
 * A CAIP-10 account ID, i.e., a human-readable namespace, reference, and account address.
 */
exports.CaipAccountIdStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_ACCOUNT_ID_REGEX);
/**
 * A CAIP-10 account address, i.e., the third part of the CAIP account ID.
 */
exports.CaipAccountAddressStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_ACCOUNT_ADDRESS_REGEX);
/** Known CAIP namespaces. */
var KnownCaipNamespace;
(function (KnownCaipNamespace) {
    /** EIP-155 compatible chains. */
    KnownCaipNamespace["Eip155"] = "eip155";
    KnownCaipNamespace["Wallet"] = "wallet";
})(KnownCaipNamespace = exports.KnownCaipNamespace || (exports.KnownCaipNamespace = {}));
/**
 * Check if the given value is a {@link CaipChainId}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipChainId}.
 */
function isCaipChainId(value) {
    return (0, superstruct_1.is)(value, exports.CaipChainIdStruct);
}
exports.isCaipChainId = isCaipChainId;
/**
 * Check if the given value is a {@link CaipNamespace}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipNamespace}.
 */
function isCaipNamespace(value) {
    return (0, superstruct_1.is)(value, exports.CaipNamespaceStruct);
}
exports.isCaipNamespace = isCaipNamespace;
/**
 * Check if the given value is a {@link CaipReference}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipReference}.
 */
function isCaipReference(value) {
    return (0, superstruct_1.is)(value, exports.CaipReferenceStruct);
}
exports.isCaipReference = isCaipReference;
/**
 * Check if the given value is a {@link CaipAccountId}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipAccountId}.
 */
function isCaipAccountId(value) {
    return (0, superstruct_1.is)(value, exports.CaipAccountIdStruct);
}
exports.isCaipAccountId = isCaipAccountId;
/**
 * Check if a value is a {@link CaipAccountAddress}.
 *
 * @param value - The value to validate.
 * @returns True if the value is a valid {@link CaipAccountAddress}.
 */
function isCaipAccountAddress(value) {
    return (0, superstruct_1.is)(value, exports.CaipAccountAddressStruct);
}
exports.isCaipAccountAddress = isCaipAccountAddress;
/**
 * Parse a CAIP-2 chain ID to an object containing the namespace and reference.
 * This validates the CAIP-2 chain ID before parsing it.
 *
 * @param caipChainId - The CAIP-2 chain ID to validate and parse.
 * @returns The parsed CAIP-2 chain ID.
 */
function parseCaipChainId(caipChainId) {
    const match = exports.CAIP_CHAIN_ID_REGEX.exec(caipChainId);
    if (!match?.groups) {
        throw new Error('Invalid CAIP chain ID.');
    }
    return {
        namespace: match.groups.namespace,
        reference: match.groups.reference,
    };
}
exports.parseCaipChainId = parseCaipChainId;
/**
 * Parse an CAIP-10 account ID to an object containing the chain ID, parsed chain ID, and account address.
 * This validates the CAIP-10 account ID before parsing it.
 *
 * @param caipAccountId - The CAIP-10 account ID to validate and parse.
 * @returns The parsed CAIP-10 account ID.
 */
function parseCaipAccountId(caipAccountId) {
    const match = exports.CAIP_ACCOUNT_ID_REGEX.exec(caipAccountId);
    if (!match?.groups) {
        throw new Error('Invalid CAIP account ID.');
    }
    return {
        address: match.groups.accountAddress,
        chainId: match.groups.chainId,
        chain: {
            namespace: match.groups.namespace,
            reference: match.groups.reference,
        },
    };
}
exports.parseCaipAccountId = parseCaipAccountId;
/**
 * Chain ID as defined per the CAIP-2
 * {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md}.
 *
 * It defines a way to uniquely identify any blockchain in a human-readable
 * way.
 *
 * @param namespace - The standard (ecosystem) of similar blockchains.
 * @param reference - Identify of a blockchain within a given namespace.
 * @throws {@link Error}
 * This exception is thrown if the inputs does not comply with the CAIP-2
 * syntax specification
 * {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md#syntax}.
 * @returns A CAIP chain ID.
 */
function toCaipChainId(namespace, reference) {
    if (!isCaipNamespace(namespace)) {
        throw new Error(`Invalid "namespace", must match: ${exports.CAIP_NAMESPACE_REGEX.toString()}`);
    }
    if (!isCaipReference(reference)) {
        throw new Error(`Invalid "reference", must match: ${exports.CAIP_REFERENCE_REGEX.toString()}`);
    }
    return `${namespace}:${reference}`;
}
exports.toCaipChainId = toCaipChainId;

},{"@metamask/superstruct":102}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecksumStruct = void 0;
const superstruct_1 = require("@metamask/superstruct");
const base64_1 = require("./base64.cjs");
exports.ChecksumStruct = (0, superstruct_1.size)((0, base64_1.base64)((0, superstruct_1.string)(), { paddingRequired: true }), 44, 44);

},{"./base64.cjs":35,"@metamask/superstruct":102}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHex = exports.createBytes = exports.createBigInt = exports.createNumber = void 0;
const superstruct_1 = require("@metamask/superstruct");
const assert_1 = require("./assert.cjs");
const bytes_1 = require("./bytes.cjs");
const hex_1 = require("./hex.cjs");
const NumberLikeStruct = (0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.bigint)(), (0, superstruct_1.string)(), hex_1.StrictHexStruct]);
const NumberCoercer = (0, superstruct_1.coerce)((0, superstruct_1.number)(), NumberLikeStruct, Number);
const BigIntCoercer = (0, superstruct_1.coerce)((0, superstruct_1.bigint)(), NumberLikeStruct, BigInt);
const BytesLikeStruct = (0, superstruct_1.union)([hex_1.StrictHexStruct, (0, superstruct_1.instance)(Uint8Array)]);
const BytesCoercer = (0, superstruct_1.coerce)((0, superstruct_1.instance)(Uint8Array), (0, superstruct_1.union)([hex_1.StrictHexStruct]), bytes_1.hexToBytes);
const HexCoercer = (0, superstruct_1.coerce)(hex_1.StrictHexStruct, (0, superstruct_1.instance)(Uint8Array), bytes_1.bytesToHex);
/**
 * Create a number from a number-like value.
 *
 * - If the value is a number, it is returned as-is.
 * - If the value is a `bigint`, it is converted to a number.
 * - If the value is a string, it is interpreted as a decimal number.
 * - If the value is a hex string (i.e., it starts with "0x"), it is
 * interpreted as a hexadecimal number.
 *
 * This validates that the value is a number-like value, and that the resulting
 * number is not `NaN` or `Infinity`.
 *
 * @example
 * ```typescript
 * const value = createNumber('0x010203');
 * console.log(value); // 66051
 *
 * const otherValue = createNumber(123n);
 * console.log(otherValue); // 123
 * ```
 * @param value - The value to create the number from.
 * @returns The created number.
 * @throws If the value is not a number-like value, or if the resulting number
 * is `NaN` or `Infinity`.
 */
function createNumber(value) {
    try {
        const result = (0, superstruct_1.create)(value, NumberCoercer);
        (0, assert_1.assert)(Number.isFinite(result), `Expected a number-like value, got "${value}".`);
        return result;
    }
    catch (error) {
        if (error instanceof superstruct_1.StructError) {
            throw new Error(`Expected a number-like value, got "${value}".`);
        }
        /* istanbul ignore next */
        throw error;
    }
}
exports.createNumber = createNumber;
/**
 * Create a `bigint` from a number-like value.
 *
 * - If the value is a number, it is converted to a `bigint`.
 * - If the value is a `bigint`, it is returned as-is.
 * - If the value is a string, it is interpreted as a decimal number and
 * converted to a `bigint`.
 * - If the value is a hex string (i.e., it starts with "0x"), it is
 * interpreted as a hexadecimal number and converted to a `bigint`.
 *
 * @example
 * ```typescript
 * const value = createBigInt('0x010203');
 * console.log(value); // 16909060n
 *
 * const otherValue = createBigInt(123);
 * console.log(otherValue); // 123n
 * ```
 * @param value - The value to create the bigint from.
 * @returns The created bigint.
 * @throws If the value is not a number-like value.
 */
function createBigInt(value) {
    try {
        // The `BigInt` constructor throws if the value is not a number-like value.
        // There is no need to validate the value manually.
        return (0, superstruct_1.create)(value, BigIntCoercer);
    }
    catch (error) {
        if (error instanceof superstruct_1.StructError) {
            throw new Error(`Expected a number-like value, got "${String(error.value)}".`);
        }
        /* istanbul ignore next */
        throw error;
    }
}
exports.createBigInt = createBigInt;
/**
 * Create a byte array from a bytes-like value.
 *
 * - If the value is a byte array, it is returned as-is.
 * - If the value is a hex string (i.e., it starts with "0x"), it is interpreted
 * as a hexadecimal number and converted to a byte array.
 *
 * @example
 * ```typescript
 * const value = createBytes('0x010203');
 * console.log(value); // Uint8Array [ 1, 2, 3 ]
 *
 * const otherValue = createBytes('0x010203');
 * console.log(otherValue); // Uint8Array [ 1, 2, 3 ]
 * ```
 * @param value - The value to create the byte array from.
 * @returns The created byte array.
 * @throws If the value is not a bytes-like value.
 */
function createBytes(value) {
    if (typeof value === 'string' && value.toLowerCase() === '0x') {
        return new Uint8Array();
    }
    try {
        return (0, superstruct_1.create)(value, BytesCoercer);
    }
    catch (error) {
        if (error instanceof superstruct_1.StructError) {
            throw new Error(`Expected a bytes-like value, got "${String(error.value)}".`);
        }
        /* istanbul ignore next */
        throw error;
    }
}
exports.createBytes = createBytes;
/**
 * Create a hexadecimal string from a bytes-like value.
 *
 * - If the value is a hex string (i.e., it starts with "0x"), it is returned
 * as-is.
 * - If the value is a `Uint8Array`, it is converted to a hex string.
 *
 * @example
 * ```typescript
 * const value = createHex(new Uint8Array([1, 2, 3]));
 * console.log(value); // '0x010203'
 *
 * const otherValue = createHex('0x010203');
 * console.log(otherValue); // '0x010203'
 * ```
 * @param value - The value to create the hex string from.
 * @returns The created hex string.
 * @throws If the value is not a bytes-like value.
 */
function createHex(value) {
    if ((value instanceof Uint8Array && value.length === 0) ||
        (typeof value === 'string' && value.toLowerCase() === '0x')) {
        return '0x';
    }
    try {
        return (0, superstruct_1.create)(value, HexCoercer);
    }
    catch (error) {
        if (error instanceof superstruct_1.StructError) {
            throw new Error(`Expected a bytes-like value, got "${String(error.value)}".`);
        }
        /* istanbul ignore next */
        throw error;
    }
}
exports.createHex = createHex;

},{"./assert.cjs":34,"./bytes.cjs":36,"./hex.cjs":43,"@metamask/superstruct":102}],40:[function(require,module,exports){
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FrozenMap_map, _FrozenSet_set;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrozenSet = exports.FrozenMap = void 0;
/**
 * A {@link ReadonlyMap} that cannot be modified after instantiation.
 * The implementation uses an inner map hidden via a private field, and the
 * immutability guarantee relies on it being impossible to get a reference
 * to this map.
 */
class FrozenMap {
    get size() {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").size;
    }
    [(_FrozenMap_map = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f")[Symbol.iterator]();
    }
    constructor(entries) {
        _FrozenMap_map.set(this, void 0);
        __classPrivateFieldSet(this, _FrozenMap_map, new Map(entries), "f");
        Object.freeze(this);
    }
    entries() {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").entries();
    }
    forEach(callbackfn, thisArg) {
        // We have to wrap the specified callback in order to prevent it from
        // receiving a reference to the inner map.
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").forEach((value, key, _map) => callbackfn.call(thisArg, value, key, this));
    }
    get(key) {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").get(key);
    }
    has(key) {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").has(key);
    }
    keys() {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").keys();
    }
    values() {
        return __classPrivateFieldGet(this, _FrozenMap_map, "f").values();
    }
    toString() {
        return `FrozenMap(${this.size}) {${this.size > 0
            ? ` ${[...this.entries()]
                .map(([key, value]) => `${String(key)} => ${String(value)}`)
                .join(', ')} `
            : ''}}`;
    }
}
exports.FrozenMap = FrozenMap;
/**
 * A {@link ReadonlySet} that cannot be modified after instantiation.
 * The implementation uses an inner set hidden via a private field, and the
 * immutability guarantee relies on it being impossible to get a reference
 * to this set.
 */
class FrozenSet {
    get size() {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").size;
    }
    [(_FrozenSet_set = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f")[Symbol.iterator]();
    }
    constructor(values) {
        _FrozenSet_set.set(this, void 0);
        __classPrivateFieldSet(this, _FrozenSet_set, new Set(values), "f");
        Object.freeze(this);
    }
    entries() {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").entries();
    }
    forEach(callbackfn, thisArg) {
        // We have to wrap the specified callback in order to prevent it from
        // receiving a reference to the inner set.
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").forEach((value, value2, _set) => callbackfn.call(thisArg, value, value2, this));
    }
    has(value) {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").has(value);
    }
    keys() {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").keys();
    }
    values() {
        return __classPrivateFieldGet(this, _FrozenSet_set, "f").values();
    }
    toString() {
        return `FrozenSet(${this.size}) {${this.size > 0
            ? ` ${[...this.values()].map((member) => String(member)).join(', ')} `
            : ''}}`;
    }
}
exports.FrozenSet = FrozenSet;
Object.freeze(FrozenMap);
Object.freeze(FrozenMap.prototype);
Object.freeze(FrozenSet);
Object.freeze(FrozenSet.prototype);

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapError = exports.getErrorMessage = exports.isErrorWithStack = exports.isErrorWithMessage = exports.isErrorWithCode = void 0;
const pony_cause_1 = require("pony-cause");
const misc_1 = require("./misc.cjs");
/**
 * Type guard for determining whether the given value is an instance of Error.
 * For errors generated via `fs.promises`, `error instanceof Error` won't work,
 * so we have to come up with another way of testing.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isError(error) {
    return (error instanceof Error ||
        ((0, misc_1.isObject)(error) && error.constructor.name === 'Error'));
}
/**
 * Type guard for determining whether the given value is an error object with a
 * `code` property such as the type of error that Node throws for filesystem
 * operations, etc.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithCode(error) {
    return typeof error === 'object' && error !== null && 'code' in error;
}
exports.isErrorWithCode = isErrorWithCode;
/**
 * Type guard for determining whether the given value is an error object with a
 * `message` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithMessage(error) {
    return typeof error === 'object' && error !== null && 'message' in error;
}
exports.isErrorWithMessage = isErrorWithMessage;
/**
 * Type guard for determining whether the given value is an error object with a
 * `stack` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithStack(error) {
    return typeof error === 'object' && error !== null && 'stack' in error;
}
exports.isErrorWithStack = isErrorWithStack;
/**
 * Attempts to obtain the message from a possible error object, defaulting to an
 * empty string if it is impossible to do so.
 *
 * @param error - The possible error to get the message from.
 * @returns The message if `error` is an object with a `message` property;
 * the string version of `error` if it is not `undefined` or `null`; otherwise
 * an empty string.
 */
function getErrorMessage(error) {
    if (isErrorWithMessage(error) && typeof error.message === 'string') {
        return error.message;
    }
    if ((0, misc_1.isNullOrUndefined)(error)) {
        return '';
    }
    return String(error);
}
exports.getErrorMessage = getErrorMessage;
/**
 * Builds a new error object, linking it to the original error via the `cause`
 * property if it is an Error.
 *
 * This function is useful to reframe error messages in general, but is
 * _critical_ when interacting with any of Node's filesystem functions as
 * provided via `fs.promises`, because these do not produce stack traces in the
 * case of an I/O error (see <https://github.com/nodejs/node/issues/30944>).
 *
 * @param originalError - The error to be wrapped (something throwable).
 * @param message - The desired message of the new error.
 * @returns A new error object.
 */
function wrapError(originalError, message) {
    if (isError(originalError)) {
        let error;
        if (Error.length === 2) {
            // for some reason `tsserver` is not complaining that the
            // Error constructor doesn't support a second argument in the editor,
            // but `tsc` does. Error causes are not supported by our current tsc target (ES2020, we need ES2022 to make this work)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error = new Error(message, { cause: originalError });
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error = new pony_cause_1.ErrorWithCause(message, { cause: originalError });
        }
        if (isErrorWithCode(originalError)) {
            error.code = originalError.code;
        }
        return error;
    }
    if (message.length > 0) {
        return new Error(`${String(originalError)}: ${message}`);
    }
    return new Error(String(originalError));
}
exports.wrapError = wrapError;

},{"./misc.cjs":48,"pony-cause":198}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove0x = exports.add0x = exports.isValidChecksumAddress = exports.getChecksumAddress = exports.isValidHexAddress = exports.assertIsStrictHexString = exports.assertIsHexString = exports.isStrictHexString = exports.isHexString = exports.HexChecksumAddressStruct = exports.HexAddressStruct = exports.StrictHexStruct = exports.HexStruct = void 0;
const superstruct_1 = require("@metamask/superstruct");
const sha3_1 = require("@noble/hashes/sha3");
const assert_1 = require("./assert.cjs");
const bytes_1 = require("./bytes.cjs");
exports.HexStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^(?:0x)?[0-9a-f]+$/iu);
exports.StrictHexStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^0x[0-9a-f]+$/iu);
exports.HexAddressStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^0x[0-9a-f]{40}$/u);
exports.HexChecksumAddressStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^0x[0-9a-fA-F]{40}$/u);
/**
 * Check if a string is a valid hex string.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid hex string.
 */
function isHexString(value) {
    return (0, superstruct_1.is)(value, exports.HexStruct);
}
exports.isHexString = isHexString;
/**
 * Strictly check if a string is a valid hex string. A valid hex string must
 * start with the "0x"-prefix.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid hex string.
 */
function isStrictHexString(value) {
    return (0, superstruct_1.is)(value, exports.StrictHexStruct);
}
exports.isStrictHexString = isStrictHexString;
/**
 * Assert that a value is a valid hex string.
 *
 * @param value - The value to check.
 * @throws If the value is not a valid hex string.
 */
function assertIsHexString(value) {
    (0, assert_1.assert)(isHexString(value), 'Value must be a hexadecimal string.');
}
exports.assertIsHexString = assertIsHexString;
/**
 * Assert that a value is a valid hex string. A valid hex string must start with
 * the "0x"-prefix.
 *
 * @param value - The value to check.
 * @throws If the value is not a valid hex string.
 */
function assertIsStrictHexString(value) {
    (0, assert_1.assert)(isStrictHexString(value), 'Value must be a hexadecimal string, starting with "0x".');
}
exports.assertIsStrictHexString = assertIsStrictHexString;
/**
 * Validate that the passed prefixed hex string is an all-lowercase
 * hex address, or a valid mixed-case checksum address.
 *
 * @param possibleAddress - Input parameter to check against.
 * @returns Whether or not the input is a valid hex address.
 */
function isValidHexAddress(possibleAddress) {
    return ((0, superstruct_1.is)(possibleAddress, exports.HexAddressStruct) ||
        isValidChecksumAddress(possibleAddress));
}
exports.isValidHexAddress = isValidHexAddress;
/**
 * Encode a passed hex string as an ERC-55 mixed-case checksum address.
 *
 * @param address - The hex address to encode.
 * @returns The address encoded according to ERC-55.
 * @see https://eips.ethereum.org/EIPS/eip-55
 */
function getChecksumAddress(address) {
    (0, assert_1.assert)((0, superstruct_1.is)(address, exports.HexChecksumAddressStruct), 'Invalid hex address.');
    const unPrefixed = remove0x(address.toLowerCase());
    const unPrefixedHash = remove0x((0, bytes_1.bytesToHex)((0, sha3_1.keccak_256)(unPrefixed)));
    return `0x${unPrefixed
        .split('')
        .map((character, nibbleIndex) => {
        const hashCharacter = unPrefixedHash[nibbleIndex];
        (0, assert_1.assert)((0, superstruct_1.is)(hashCharacter, (0, superstruct_1.string)()), 'Hash shorter than address.');
        return parseInt(hashCharacter, 16) > 7
            ? character.toUpperCase()
            : character;
    })
        .join('')}`;
}
exports.getChecksumAddress = getChecksumAddress;
/**
 * Validate that the passed hex string is a valid ERC-55 mixed-case
 * checksum address.
 *
 * @param possibleChecksum - The hex address to check.
 * @returns True if the address is a checksum address.
 */
function isValidChecksumAddress(possibleChecksum) {
    if (!(0, superstruct_1.is)(possibleChecksum, exports.HexChecksumAddressStruct)) {
        return false;
    }
    return getChecksumAddress(possibleChecksum) === possibleChecksum;
}
exports.isValidChecksumAddress = isValidChecksumAddress;
/**
 * Add the `0x`-prefix to a hexadecimal string. If the string already has the
 * prefix, it is returned as-is.
 *
 * @param hexadecimal - The hexadecimal string to add the prefix to.
 * @returns The prefixed hexadecimal string.
 */
function add0x(hexadecimal) {
    if (hexadecimal.startsWith('0x')) {
        return hexadecimal;
    }
    if (hexadecimal.startsWith('0X')) {
        return `0x${hexadecimal.substring(2)}`;
    }
    return `0x${hexadecimal}`;
}
exports.add0x = add0x;
/**
 * Remove the `0x`-prefix from a hexadecimal string. If the string doesn't have
 * the prefix, it is returned as-is.
 *
 * @param hexadecimal - The hexadecimal string to remove the prefix from.
 * @returns The un-prefixed hexadecimal string.
 */
function remove0x(hexadecimal) {
    if (hexadecimal.startsWith('0x') || hexadecimal.startsWith('0X')) {
        return hexadecimal.substring(2);
    }
    return hexadecimal;
}
exports.remove0x = remove0x;

},{"./assert.cjs":34,"./bytes.cjs":36,"@metamask/superstruct":102,"@noble/hashes/sha3":178}],44:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./assert.cjs"), exports);
__exportStar(require("./base64.cjs"), exports);
__exportStar(require("./bytes.cjs"), exports);
__exportStar(require("./caip-types.cjs"), exports);
__exportStar(require("./checksum.cjs"), exports);
__exportStar(require("./coercers.cjs"), exports);
__exportStar(require("./collections.cjs"), exports);
__exportStar(require("./encryption-types.cjs"), exports);
__exportStar(require("./errors.cjs"), exports);
__exportStar(require("./hex.cjs"), exports);
__exportStar(require("./json.cjs"), exports);
__exportStar(require("./keyring.cjs"), exports);
__exportStar(require("./logging.cjs"), exports);
__exportStar(require("./misc.cjs"), exports);
__exportStar(require("./number.cjs"), exports);
__exportStar(require("./opaque.cjs"), exports);
__exportStar(require("./promise.cjs"), exports);
__exportStar(require("./time.cjs"), exports);
__exportStar(require("./transaction-types.cjs"), exports);
__exportStar(require("./versions.cjs"), exports);

},{"./assert.cjs":34,"./base64.cjs":35,"./bytes.cjs":36,"./caip-types.cjs":37,"./checksum.cjs":38,"./coercers.cjs":39,"./collections.cjs":40,"./encryption-types.cjs":41,"./errors.cjs":42,"./hex.cjs":43,"./json.cjs":45,"./keyring.cjs":46,"./logging.cjs":47,"./misc.cjs":48,"./number.cjs":49,"./opaque.cjs":50,"./promise.cjs":51,"./time.cjs":52,"./transaction-types.cjs":53,"./versions.cjs":54}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonRpcIdValidator = exports.assertIsJsonRpcError = exports.isJsonRpcError = exports.assertIsJsonRpcFailure = exports.isJsonRpcFailure = exports.assertIsJsonRpcSuccess = exports.isJsonRpcSuccess = exports.assertIsJsonRpcResponse = exports.isJsonRpcResponse = exports.assertIsPendingJsonRpcResponse = exports.isPendingJsonRpcResponse = exports.JsonRpcResponseStruct = exports.JsonRpcFailureStruct = exports.JsonRpcSuccessStruct = exports.PendingJsonRpcResponseStruct = exports.assertIsJsonRpcRequest = exports.isJsonRpcRequest = exports.assertIsJsonRpcNotification = exports.isJsonRpcNotification = exports.JsonRpcNotificationStruct = exports.JsonRpcRequestStruct = exports.JsonRpcParamsStruct = exports.JsonRpcErrorStruct = exports.JsonRpcIdStruct = exports.JsonRpcVersionStruct = exports.jsonrpc2 = exports.getJsonSize = exports.getSafeJson = exports.isValidJson = exports.JsonStruct = exports.UnsafeJsonStruct = exports.exactOptional = exports.object = void 0;
const superstruct_1 = require("@metamask/superstruct");
const assert_1 = require("./assert.cjs");
const misc_1 = require("./misc.cjs");
/**
 * A struct to check if the given value is a valid object, with support for
 * {@link exactOptional} types.
 *
 * @param schema - The schema of the object.
 * @returns A struct to check if the given value is an object.
 */
const object = (schema) => 
// The type is slightly different from a regular object struct, because we
// want to make properties with `undefined` in their type optional, but not
// `undefined` itself. This means that we need a type cast.
(0, superstruct_1.object)(schema);
exports.object = object;
/**
 * Check the last field of a path is present.
 *
 * @param context - The context to check.
 * @param context.path - The path to check.
 * @param context.branch - The branch to check.
 * @returns Whether the last field of a path is present.
 */
function hasOptional({ path, branch }) {
    const field = path[path.length - 1];
    return (0, misc_1.hasProperty)(branch[branch.length - 2], field);
}
/**
 * A struct which allows the property of an object to be absent, or to be present
 * as long as it's valid and not set to `undefined`.
 *
 * This struct should be used in conjunction with the {@link object} from this
 * library, to get proper type inference.
 *
 * @param struct - The struct to check the value against, if present.
 * @returns A struct to check if the given value is valid, or not present.
 * @example
 * ```ts
 * const struct = object({
 *   foo: exactOptional(string()),
 *   bar: exactOptional(number()),
 *   baz: optional(boolean()),
 *   qux: unknown(),
 * });
 *
 * type Type = Infer<typeof struct>;
 * // Type is equivalent to:
 * // {
 * //   foo?: string;
 * //   bar?: number;
 * //   baz?: boolean | undefined;
 * //   qux: unknown;
 * // }
 * ```
 */
function exactOptional(struct) {
    return new superstruct_1.Struct({
        ...struct,
        type: `optional ${struct.type}`,
        validator: (value, context) => !hasOptional(context) || struct.validator(value, context),
        refiner: (value, context) => !hasOptional(context) || struct.refiner(value, context),
    });
}
exports.exactOptional = exactOptional;
/**
 * A struct to check if the given value is finite number. Superstruct's
 * `number()` struct does not check if the value is finite.
 *
 * @returns A struct to check if the given value is finite number.
 */
const finiteNumber = () => (0, superstruct_1.define)('finite number', (value) => {
    return (0, superstruct_1.is)(value, (0, superstruct_1.number)()) && Number.isFinite(value);
});
/**
 * A struct to check if the given value is a valid JSON-serializable value.
 *
 * Note that this struct is unsafe. For safe validation, use {@link JsonStruct}.
 */
// We cannot infer the type of the struct, because it is recursive.
exports.UnsafeJsonStruct = (0, superstruct_1.union)([
    (0, superstruct_1.literal)(null),
    (0, superstruct_1.boolean)(),
    finiteNumber(),
    (0, superstruct_1.string)(),
    (0, superstruct_1.array)((0, superstruct_1.lazy)(() => exports.UnsafeJsonStruct)),
    (0, superstruct_1.record)((0, superstruct_1.string)(), (0, superstruct_1.lazy)(() => exports.UnsafeJsonStruct)),
]);
/**
 * A struct to check if the given value is a valid JSON-serializable value.
 *
 * This struct sanitizes the value before validating it, so that it is safe to
 * use with untrusted input.
 */
exports.JsonStruct = (0, superstruct_1.coerce)(exports.UnsafeJsonStruct, (0, superstruct_1.any)(), (value) => {
    (0, assert_1.assertStruct)(value, exports.UnsafeJsonStruct);
    return JSON.parse(JSON.stringify(value, (propKey, propValue) => {
        // Strip __proto__ and constructor properties to prevent prototype pollution.
        if (propKey === '__proto__' || propKey === 'constructor') {
            return undefined;
        }
        return propValue;
    }));
});
/**
 * Check if the given value is a valid {@link Json} value, i.e., a value that is
 * serializable to JSON.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid {@link Json} value.
 */
function isValidJson(value) {
    try {
        getSafeJson(value);
        return true;
    }
    catch {
        return false;
    }
}
exports.isValidJson = isValidJson;
/**
 * Validate and return sanitized JSON.
 *
 * Note:
 * This function uses sanitized JsonStruct for validation
 * that applies stringify and then parse of a value provided
 * to ensure that there are no getters which can have side effects
 * that can cause security issues.
 *
 * @param value - JSON structure to be processed.
 * @returns Sanitized JSON structure.
 */
function getSafeJson(value) {
    return (0, superstruct_1.create)(value, exports.JsonStruct);
}
exports.getSafeJson = getSafeJson;
/**
 * Get the size of a JSON value in bytes. This also validates the value.
 *
 * @param value - The JSON value to get the size of.
 * @returns The size of the JSON value in bytes.
 */
function getJsonSize(value) {
    (0, assert_1.assertStruct)(value, exports.JsonStruct, 'Invalid JSON value');
    const json = JSON.stringify(value);
    return new TextEncoder().encode(json).byteLength;
}
exports.getJsonSize = getJsonSize;
/**
 * The string '2.0'.
 */
exports.jsonrpc2 = '2.0';
exports.JsonRpcVersionStruct = (0, superstruct_1.literal)(exports.jsonrpc2);
exports.JsonRpcIdStruct = (0, superstruct_1.nullable)((0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]));
exports.JsonRpcErrorStruct = (0, exports.object)({
    code: (0, superstruct_1.integer)(),
    message: (0, superstruct_1.string)(),
    data: exactOptional(exports.JsonStruct),
    stack: exactOptional((0, superstruct_1.string)()),
});
exports.JsonRpcParamsStruct = (0, superstruct_1.union)([(0, superstruct_1.record)((0, superstruct_1.string)(), exports.JsonStruct), (0, superstruct_1.array)(exports.JsonStruct)]);
exports.JsonRpcRequestStruct = (0, exports.object)({
    id: exports.JsonRpcIdStruct,
    jsonrpc: exports.JsonRpcVersionStruct,
    method: (0, superstruct_1.string)(),
    params: exactOptional(exports.JsonRpcParamsStruct),
});
exports.JsonRpcNotificationStruct = (0, exports.object)({
    jsonrpc: exports.JsonRpcVersionStruct,
    method: (0, superstruct_1.string)(),
    params: exactOptional(exports.JsonRpcParamsStruct),
});
/**
 * Check if the given value is a valid {@link JsonRpcNotification} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcNotification}
 * object.
 */
function isJsonRpcNotification(value) {
    return (0, superstruct_1.is)(value, exports.JsonRpcNotificationStruct);
}
exports.isJsonRpcNotification = isJsonRpcNotification;
/**
 * Assert that the given value is a valid {@link JsonRpcNotification} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcNotification} object.
 */
function assertIsJsonRpcNotification(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcNotificationStruct, 'Invalid JSON-RPC notification', ErrorWrapper);
}
exports.assertIsJsonRpcNotification = assertIsJsonRpcNotification;
/**
 * Check if the given value is a valid {@link JsonRpcRequest} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcRequest} object.
 */
function isJsonRpcRequest(value) {
    return (0, superstruct_1.is)(value, exports.JsonRpcRequestStruct);
}
exports.isJsonRpcRequest = isJsonRpcRequest;
/**
 * Assert that the given value is a valid {@link JsonRpcRequest} object.
 *
 * @param value - The JSON-RPC request or notification to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcRequest} object.
 */
function assertIsJsonRpcRequest(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcRequestStruct, 'Invalid JSON-RPC request', ErrorWrapper);
}
exports.assertIsJsonRpcRequest = assertIsJsonRpcRequest;
exports.PendingJsonRpcResponseStruct = (0, superstruct_1.object)({
    id: exports.JsonRpcIdStruct,
    jsonrpc: exports.JsonRpcVersionStruct,
    result: (0, superstruct_1.optional)((0, superstruct_1.unknown)()),
    error: (0, superstruct_1.optional)(exports.JsonRpcErrorStruct),
});
exports.JsonRpcSuccessStruct = (0, exports.object)({
    id: exports.JsonRpcIdStruct,
    jsonrpc: exports.JsonRpcVersionStruct,
    result: exports.JsonStruct,
});
exports.JsonRpcFailureStruct = (0, exports.object)({
    id: exports.JsonRpcIdStruct,
    jsonrpc: exports.JsonRpcVersionStruct,
    error: exports.JsonRpcErrorStruct,
});
exports.JsonRpcResponseStruct = (0, superstruct_1.union)([
    exports.JsonRpcSuccessStruct,
    exports.JsonRpcFailureStruct,
]);
/**
 * Type guard to check whether specified JSON-RPC response is a
 * {@link PendingJsonRpcResponse}.
 *
 * @param response - The JSON-RPC response to check.
 * @returns Whether the specified JSON-RPC response is pending.
 */
function isPendingJsonRpcResponse(response) {
    return (0, superstruct_1.is)(response, exports.PendingJsonRpcResponseStruct);
}
exports.isPendingJsonRpcResponse = isPendingJsonRpcResponse;
/**
 * Assert that the given value is a valid {@link PendingJsonRpcResponse} object.
 *
 * @param response - The JSON-RPC response to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link PendingJsonRpcResponse}
 * object.
 */
function assertIsPendingJsonRpcResponse(response, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(response, exports.PendingJsonRpcResponseStruct, 'Invalid pending JSON-RPC response', ErrorWrapper);
}
exports.assertIsPendingJsonRpcResponse = assertIsPendingJsonRpcResponse;
/**
 * Type guard to check if a value is a {@link JsonRpcResponse}.
 *
 * @param response - The object to check.
 * @returns Whether the object is a JsonRpcResponse.
 */
function isJsonRpcResponse(response) {
    return (0, superstruct_1.is)(response, exports.JsonRpcResponseStruct);
}
exports.isJsonRpcResponse = isJsonRpcResponse;
/**
 * Assert that the given value is a valid {@link JsonRpcResponse} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcResponse} object.
 */
function assertIsJsonRpcResponse(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcResponseStruct, 'Invalid JSON-RPC response', ErrorWrapper);
}
exports.assertIsJsonRpcResponse = assertIsJsonRpcResponse;
/**
 * Check if the given value is a valid {@link JsonRpcSuccess} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcSuccess} object.
 */
function isJsonRpcSuccess(value) {
    return (0, superstruct_1.is)(value, exports.JsonRpcSuccessStruct);
}
exports.isJsonRpcSuccess = isJsonRpcSuccess;
/**
 * Assert that the given value is a valid {@link JsonRpcSuccess} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcSuccess} object.
 */
function assertIsJsonRpcSuccess(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcSuccessStruct, 'Invalid JSON-RPC success response', ErrorWrapper);
}
exports.assertIsJsonRpcSuccess = assertIsJsonRpcSuccess;
/**
 * Check if the given value is a valid {@link JsonRpcFailure} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcFailure} object.
 */
function isJsonRpcFailure(value) {
    return (0, superstruct_1.is)(value, exports.JsonRpcFailureStruct);
}
exports.isJsonRpcFailure = isJsonRpcFailure;
/**
 * Assert that the given value is a valid {@link JsonRpcFailure} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcFailure} object.
 */
function assertIsJsonRpcFailure(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcFailureStruct, 'Invalid JSON-RPC failure response', ErrorWrapper);
}
exports.assertIsJsonRpcFailure = assertIsJsonRpcFailure;
/**
 * Check if the given value is a valid {@link JsonRpcError} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcError} object.
 */
function isJsonRpcError(value) {
    return (0, superstruct_1.is)(value, exports.JsonRpcErrorStruct);
}
exports.isJsonRpcError = isJsonRpcError;
/**
 * Assert that the given value is a valid {@link JsonRpcError} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcError} object.
 */
function assertIsJsonRpcError(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0, assert_1.assertStruct)(value, exports.JsonRpcErrorStruct, 'Invalid JSON-RPC error', ErrorWrapper);
}
exports.assertIsJsonRpcError = assertIsJsonRpcError;
/**
 * Gets a function for validating JSON-RPC request / response `id` values.
 *
 * By manipulating the options of this factory, you can control the behavior
 * of the resulting validator for some edge cases. This is useful because e.g.
 * `null` should sometimes but not always be permitted.
 *
 * Note that the empty string (`''`) is always permitted by the JSON-RPC
 * specification, but that kind of sucks and you may want to forbid it in some
 * instances anyway.
 *
 * For more details, see the
 * [JSON-RPC Specification](https://www.jsonrpc.org/specification).
 *
 * @param options - An options object.
 * @param options.permitEmptyString - Whether the empty string (i.e. `''`)
 * should be treated as a valid ID. Default: `true`
 * @param options.permitFractions - Whether fractional numbers (e.g. `1.2`)
 * should be treated as valid IDs. Default: `false`
 * @param options.permitNull - Whether `null` should be treated as a valid ID.
 * Default: `true`
 * @returns The JSON-RPC ID validator function.
 */
function getJsonRpcIdValidator(options) {
    const { permitEmptyString, permitFractions, permitNull } = {
        permitEmptyString: true,
        permitFractions: false,
        permitNull: true,
        ...options,
    };
    /**
     * Type guard for {@link JsonRpcId}.
     *
     * @param id - The JSON-RPC ID value to check.
     * @returns Whether the given ID is valid per the options given to the
     * factory.
     */
    const isValidJsonRpcId = (id) => {
        return Boolean((typeof id === 'number' && (permitFractions || Number.isInteger(id))) ||
            (typeof id === 'string' && (permitEmptyString || id.length > 0)) ||
            (permitNull && id === null));
    };
    return isValidJsonRpcId;
}
exports.getJsonRpcIdValidator = getJsonRpcIdValidator;

},{"./assert.cjs":34,"./misc.cjs":48,"@metamask/superstruct":102}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleLogger = exports.createProjectLogger = void 0;
const debug_1 = __importDefault(require("debug"));
const globalLogger = (0, debug_1.default)('metamask');
/**
 * Creates a logger via the `debug` library whose log messages will be tagged
 * using the name of your project. By default, such messages will be
 * suppressed, but you can reveal them by setting the `DEBUG` environment
 * variable to `metamask:<projectName>`. You can also set this variable to
 * `metamask:*` if you want to see log messages from all MetaMask projects that
 * are also using this function to create their loggers.
 *
 * @param projectName - The name of your project. This should be the name of
 * your NPM package if you're developing one.
 * @returns An instance of `debug`.
 */
function createProjectLogger(projectName) {
    return globalLogger.extend(projectName);
}
exports.createProjectLogger = createProjectLogger;
/**
 * Creates a logger via the `debug` library which is derived from the logger for
 * the whole project whose log messages will be tagged using the name of your
 * module. By default, such messages will be suppressed, but you can reveal them
 * by setting the `DEBUG` environment variable to
 * `metamask:<projectName>:<moduleName>`. You can also set this variable to
 * `metamask:<projectName>:*` if you want to see log messages from the project,
 * or `metamask:*` if you want to see log messages from all MetaMask projects.
 *
 * @param projectLogger - The logger created via {@link createProjectLogger}.
 * @param moduleName - The name of your module. You could use the name of the
 * file where you're using this logger or some other name.
 * @returns An instance of `debug`.
 */
function createModuleLogger(projectLogger, moduleName) {
    return projectLogger.extend(moduleName);
}
exports.createModuleLogger = createModuleLogger;

},{"debug":184}],48:[function(require,module,exports){
"use strict";
//
// Types
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNumberSize = exports.calculateStringSize = exports.isASCII = exports.isPlainObject = exports.ESCAPE_CHARACTERS_REGEXP = exports.JsonSize = exports.getKnownPropertyNames = exports.hasProperty = exports.isObject = exports.isNullOrUndefined = exports.isNonEmptyArray = void 0;
//
// Type Guards
//
/**
 * A {@link NonEmptyArray} type guard.
 *
 * @template Element - The non-empty array member type.
 * @param value - The value to check.
 * @returns Whether the value is a non-empty array.
 */
function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
exports.isNonEmptyArray = isNonEmptyArray;
/**
 * Type guard for "nullishness".
 *
 * @param value - Any value.
 * @returns `true` if the value is null or undefined, `false` otherwise.
 */
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * A type guard for {@link RuntimeObject}.
 *
 * @param value - The value to check.
 * @returns Whether the specified value has a runtime type of `object` and is
 * neither `null` nor an `Array`.
 */
function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
//
// Other utility functions
//
/**
 * A type guard for ensuring an object has a property.
 *
 * @param objectToCheck - The object to check.
 * @param name - The property name to check for.
 * @returns Whether the specified object has an own property with the specified
 * name, regardless of whether it is enumerable or not.
 */
const hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
exports.hasProperty = hasProperty;
/**
 * `Object.getOwnPropertyNames()` is intentionally generic: it returns the
 * immediate property names of an object, but it cannot make guarantees about
 * the contents of that object, so the type of the property names is merely
 * `string[]`. While this is technically accurate, it is also unnecessary if we
 * have an object with a type that we own (such as an enum).
 *
 * @param object - The plain object.
 * @returns The own property names of the object which are assigned a type
 * derived from the object itself.
 */
function getKnownPropertyNames(object) {
    return Object.getOwnPropertyNames(object);
}
exports.getKnownPropertyNames = getKnownPropertyNames;
/**
 * Predefined sizes (in Bytes) of specific parts of JSON structure.
 */
var JsonSize;
(function (JsonSize) {
    JsonSize[JsonSize["Null"] = 4] = "Null";
    JsonSize[JsonSize["Comma"] = 1] = "Comma";
    JsonSize[JsonSize["Wrapper"] = 1] = "Wrapper";
    JsonSize[JsonSize["True"] = 4] = "True";
    JsonSize[JsonSize["False"] = 5] = "False";
    JsonSize[JsonSize["Quote"] = 1] = "Quote";
    JsonSize[JsonSize["Colon"] = 1] = "Colon";
    // eslint-disable-next-line @typescript-eslint/no-shadow
    JsonSize[JsonSize["Date"] = 24] = "Date";
})(JsonSize = exports.JsonSize || (exports.JsonSize = {}));
/**
 * Regular expression with pattern matching for (special) escaped characters.
 */
exports.ESCAPE_CHARACTERS_REGEXP = /"|\\|\n|\r|\t/gu;
/**
 * Check if the value is plain object.
 *
 * @param value - Value to be checked.
 * @returns True if an object is the plain JavaScript object,
 * false if the object is not plain (e.g. function).
 */
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    try {
        let proto = value;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(value) === proto;
    }
    catch (_) {
        return false;
    }
}
exports.isPlainObject = isPlainObject;
/**
 * Check if character is ASCII.
 *
 * @param character - Character.
 * @returns True if a character code is ASCII, false if not.
 */
function isASCII(character) {
    return character.charCodeAt(0) <= 127;
}
exports.isASCII = isASCII;
/**
 * Calculate string size.
 *
 * @param value - String value to calculate size.
 * @returns Number of bytes used to store whole string value.
 */
function calculateStringSize(value) {
    const size = value.split('').reduce((total, character) => {
        if (isASCII(character)) {
            return total + 1;
        }
        return total + 2;
    }, 0);
    // Also detect characters that need backslash escape
    return size + (value.match(exports.ESCAPE_CHARACTERS_REGEXP) ?? []).length;
}
exports.calculateStringSize = calculateStringSize;
/**
 * Calculate size of a number ofter JSON serialization.
 *
 * @param value - Number value to calculate size.
 * @returns Number of bytes used to store whole number in JSON.
 */
function calculateNumberSize(value) {
    return value.toString().length;
}
exports.calculateNumberSize = calculateNumberSize;

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBigInt = exports.hexToNumber = exports.bigIntToHex = exports.numberToHex = void 0;
const assert_1 = require("./assert.cjs");
const hex_1 = require("./hex.cjs");
/**
 * Convert a number to a hexadecimal string. This verifies that the number is a
 * non-negative safe integer.
 *
 * To convert a `bigint` to a hexadecimal string instead, use
 * {@link bigIntToHex}.
 *
 * @example
 * ```typescript
 * numberToHex(0); // '0x0'
 * numberToHex(1); // '0x1'
 * numberToHex(16); // '0x10'
 * ```
 * @param value - The number to convert to a hexadecimal string.
 * @returns The hexadecimal string, with the "0x"-prefix.
 * @throws If the number is not a non-negative safe integer.
 */
const numberToHex = (value) => {
    (0, assert_1.assert)(typeof value === 'number', 'Value must be a number.');
    (0, assert_1.assert)(value >= 0, 'Value must be a non-negative number.');
    (0, assert_1.assert)(Number.isSafeInteger(value), 'Value is not a safe integer. Use `bigIntToHex` instead.');
    return (0, hex_1.add0x)(value.toString(16));
};
exports.numberToHex = numberToHex;
/**
 * Convert a `bigint` to a hexadecimal string. This verifies that the `bigint`
 * is a non-negative integer.
 *
 * To convert a number to a hexadecimal string instead, use {@link numberToHex}.
 *
 * @example
 * ```typescript
 * bigIntToHex(0n); // '0x0'
 * bigIntToHex(1n); // '0x1'
 * bigIntToHex(16n); // '0x10'
 * ```
 * @param value - The `bigint` to convert to a hexadecimal string.
 * @returns The hexadecimal string, with the "0x"-prefix.
 * @throws If the `bigint` is not a non-negative integer.
 */
const bigIntToHex = (value) => {
    (0, assert_1.assert)(typeof value === 'bigint', 'Value must be a bigint.');
    (0, assert_1.assert)(value >= 0, 'Value must be a non-negative bigint.');
    return (0, hex_1.add0x)(value.toString(16));
};
exports.bigIntToHex = bigIntToHex;
/**
 * Convert a hexadecimal string to a number. This verifies that the string is a
 * valid hex string, and that the resulting number is a safe integer. Both
 * "0x"-prefixed and unprefixed strings are supported.
 *
 * To convert a hexadecimal string to a `bigint` instead, use
 * {@link hexToBigInt}.
 *
 * @example
 * ```typescript
 * hexToNumber('0x0'); // 0
 * hexToNumber('0x1'); // 1
 * hexToNumber('0x10'); // 16
 * ```
 * @param value - The hexadecimal string to convert to a number.
 * @returns The number.
 * @throws If the value is not a valid hexadecimal string, or if the resulting
 * number is not a safe integer.
 */
const hexToNumber = (value) => {
    (0, hex_1.assertIsHexString)(value);
    // `parseInt` accepts values without the "0x"-prefix, whereas `Number` does
    // not. Using this is slightly faster than `Number(add0x(value))`.
    const numberValue = parseInt(value, 16);
    (0, assert_1.assert)(Number.isSafeInteger(numberValue), 'Value is not a safe integer. Use `hexToBigInt` instead.');
    return numberValue;
};
exports.hexToNumber = hexToNumber;
/**
 * Convert a hexadecimal string to a `bigint`. This verifies that the string is
 * a valid hex string. Both "0x"-prefixed and unprefixed strings are supported.
 *
 * To convert a hexadecimal string to a number instead, use {@link hexToNumber}.
 *
 * @example
 * ```typescript
 * hexToBigInt('0x0'); // 0n
 * hexToBigInt('0x1'); // 1n
 * hexToBigInt('0x10'); // 16n
 * ```
 * @param value - The hexadecimal string to convert to a `bigint`.
 * @returns The `bigint`.
 * @throws If the value is not a valid hexadecimal string.
 */
const hexToBigInt = (value) => {
    (0, hex_1.assertIsHexString)(value);
    // The `BigInt` constructor requires the "0x"-prefix to parse a hex string.
    return BigInt((0, hex_1.add0x)(value));
};
exports.hexToBigInt = hexToBigInt;

},{"./assert.cjs":34,"./hex.cjs":43}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferredPromise = void 0;
/**
 * Create a defered Promise.
 *
 * If the Promise is rejected prior to a handler being added, this can result in an
 * `UnhandledPromiseRejection` error. Optionally this can be suppressed with the
 * `suppressUnhandledRejection` flag, as it's common to belatedly handle deferred Promises, or to
 * ignore them if they're no longer relevant (e.g. related to a cancelled request).
 *
 * However, be very careful that you have handled the Promise if you do this. Suppressing these
 * errors is dangerous, they exist for good reason. An unhandled rejection can hide errors, making
 * debugging extremely difficult. They should only be suppressed if you're confident that the
 * Promise is always handled correctly, in both the success and failure cases.
 *
 * @param args - The arguments.
 * @param args.suppressUnhandledRejection - This option adds an empty error handler
 * to the Promise to suppress the UnhandledPromiseRejection error. This can be
 * useful if the deferred Promise is sometimes intentionally not used.
 * @returns A deferred Promise.
 * @template Result - The result type of the Promise.
 */
function createDeferredPromise({ suppressUnhandledRejection = false, } = {}) {
    let resolve;
    let reject;
    const promise = new Promise((innerResolve, innerReject) => {
        resolve = innerResolve;
        reject = innerReject;
    });
    if (suppressUnhandledRejection) {
        promise.catch((_error) => {
            // This handler is used to suppress the UnhandledPromiseRejection error
        });
    }
    // @ts-expect-error We know that these are assigned, but TypeScript doesn't
    return { promise, resolve, reject };
}
exports.createDeferredPromise = createDeferredPromise;

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSince = exports.inMilliseconds = exports.Duration = void 0;
/**
 * Common duration constants, in milliseconds.
 */
var Duration;
(function (Duration) {
    /**
     * A millisecond.
     */
    Duration[Duration["Millisecond"] = 1] = "Millisecond";
    /**
     * A second, in milliseconds.
     */
    Duration[Duration["Second"] = 1000] = "Second";
    /**
     * A minute, in milliseconds.
     */
    Duration[Duration["Minute"] = 60000] = "Minute";
    /**
     * An hour, in milliseconds.
     */
    Duration[Duration["Hour"] = 3600000] = "Hour";
    /**
     * A day, in milliseconds.
     */
    Duration[Duration["Day"] = 86400000] = "Day";
    /**
     * A week, in milliseconds.
     */
    Duration[Duration["Week"] = 604800000] = "Week";
    /**
     * A year, in milliseconds.
     */
    Duration[Duration["Year"] = 31536000000] = "Year";
})(Duration = exports.Duration || (exports.Duration = {}));
const isNonNegativeInteger = (number) => Number.isInteger(number) && number >= 0;
const assertIsNonNegativeInteger = (number, name) => {
    if (!isNonNegativeInteger(number)) {
        throw new Error(`"${name}" must be a non-negative integer. Received: "${number}".`);
    }
};
/**
 * Calculates the millisecond value of the specified number of units of time.
 *
 * @param count - The number of units of time.
 * @param duration - The unit of time to count.
 * @returns The count multiplied by the specified duration.
 */
function inMilliseconds(count, duration) {
    assertIsNonNegativeInteger(count, 'count');
    return count * duration;
}
exports.inMilliseconds = inMilliseconds;
/**
 * Gets the milliseconds since a particular Unix epoch timestamp.
 *
 * @param timestamp - A Unix millisecond timestamp.
 * @returns The number of milliseconds elapsed since the specified timestamp.
 */
function timeSince(timestamp) {
    assertIsNonNegativeInteger(timestamp, 'timestamp');
    return Date.now() - timestamp;
}
exports.timeSince = timeSince;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfiesVersionRange = exports.gtRange = exports.gtVersion = exports.assertIsSemVerRange = exports.assertIsSemVerVersion = exports.isValidSemVerRange = exports.isValidSemVerVersion = exports.VersionRangeStruct = exports.VersionStruct = void 0;
const superstruct_1 = require("@metamask/superstruct");
const semver_1 = require("semver");
const assert_1 = require("./assert.cjs");
/**
 * A struct for validating a version string.
 */
exports.VersionStruct = (0, superstruct_1.refine)((0, superstruct_1.string)(), 'Version', (value) => {
    if ((0, semver_1.valid)(value) === null) {
        return `Expected SemVer version, got "${value}"`;
    }
    return true;
});
exports.VersionRangeStruct = (0, superstruct_1.refine)((0, superstruct_1.string)(), 'Version range', (value) => {
    if ((0, semver_1.validRange)(value) === null) {
        return `Expected SemVer range, got "${value}"`;
    }
    return true;
});
/**
 * Checks whether a SemVer version is valid.
 *
 * @param version - A potential version.
 * @returns `true` if the version is valid, and `false` otherwise.
 */
function isValidSemVerVersion(version) {
    return (0, superstruct_1.is)(version, exports.VersionStruct);
}
exports.isValidSemVerVersion = isValidSemVerVersion;
/**
 * Checks whether a SemVer version range is valid.
 *
 * @param versionRange - A potential version range.
 * @returns `true` if the version range is valid, and `false` otherwise.
 */
function isValidSemVerRange(versionRange) {
    return (0, superstruct_1.is)(versionRange, exports.VersionRangeStruct);
}
exports.isValidSemVerRange = isValidSemVerRange;
/**
 * Asserts that a value is a valid concrete SemVer version.
 *
 * @param version - A potential SemVer concrete version.
 */
function assertIsSemVerVersion(version) {
    (0, assert_1.assertStruct)(version, exports.VersionStruct);
}
exports.assertIsSemVerVersion = assertIsSemVerVersion;
/**
 * Asserts that a value is a valid SemVer range.
 *
 * @param range - A potential SemVer range.
 */
function assertIsSemVerRange(range) {
    (0, assert_1.assertStruct)(range, exports.VersionRangeStruct);
}
exports.assertIsSemVerRange = assertIsSemVerRange;
/**
 * Checks whether a SemVer version is greater than another.
 *
 * @param version1 - The left-hand version.
 * @param version2 - The right-hand version.
 * @returns `version1 > version2`.
 */
function gtVersion(version1, version2) {
    return (0, semver_1.gt)(version1, version2);
}
exports.gtVersion = gtVersion;
/**
 * Checks whether a SemVer version is greater than all possibilities in a range.
 *
 * @param version - A SemvVer version.
 * @param range - The range to check against.
 * @returns `version > range`.
 */
function gtRange(version, range) {
    return (0, semver_1.gtr)(version, range);
}
exports.gtRange = gtRange;
/**
 * Returns whether a SemVer version satisfies a SemVer range.
 *
 * @param version - The SemVer version to check.
 * @param versionRange - The SemVer version range to check against.
 * @returns Whether the version satisfied the version range.
 */
function satisfiesVersionRange(version, versionRange) {
    return (0, semver_1.satisfies)(version, versionRange, {
        includePrerelease: true,
    });
}
exports.satisfiesVersionRange = satisfiesVersionRange;

},{"./assert.cjs":34,"@metamask/superstruct":102,"semver":82}],55:[function(require,module,exports){
const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = require('../internal/parse-options')
const { safeRe: re, t } = require('../internal/re')
const cmp = require('../functions/cmp')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const Range = require('./range')

},{"../functions/cmp":59,"../internal/debug":84,"../internal/parse-options":87,"../internal/re":88,"./range":56,"./semver":57}],56:[function(require,module,exports){
const SPACE_CHARACTERS = /\s+/g

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.formatted = undefined
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range.trim().replace(SPACE_CHARACTERS, ' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.formatted = undefined
  }

  get range () {
    if (this.formatted === undefined) {
      this.formatted = ''
      for (let i = 0; i < this.set.length; i++) {
        if (i > 0) {
          this.formatted += '||'
        }
        const comps = this.set[i]
        for (let k = 0; k < comps.length; k++) {
          if (k > 0) {
            this.formatted += ' '
          }
          this.formatted += comps[k].toString().trim()
        }
      }
    }
    return this.formatted
  }

  format () {
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = require('../internal/lrucache')
const cache = new LRU()

const parseOptions = require('../internal/parse-options')
const Comparator = require('./comparator')
const debug = require('../internal/debug')
const SemVer = require('./semver')
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = require('../internal/re')
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require('../internal/constants')

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

},{"../internal/constants":83,"../internal/debug":84,"../internal/lrucache":86,"../internal/parse-options":87,"../internal/re":88,"./comparator":55,"./semver":57}],57:[function(require,module,exports){
const debug = require('../internal/debug')
const { MAX_LENGTH, MAX_SAFE_INTEGER } = require('../internal/constants')
const { safeRe: re, t } = require('../internal/re')

const parseOptions = require('../internal/parse-options')
const { compareIdentifiers } = require('../internal/identifiers')
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('build compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer

},{"../internal/constants":83,"../internal/debug":84,"../internal/identifiers":85,"../internal/parse-options":87,"../internal/re":88}],58:[function(require,module,exports){
const parse = require('./parse')
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean

},{"./parse":74}],59:[function(require,module,exports){
const eq = require('./eq')
const neq = require('./neq')
const gt = require('./gt')
const gte = require('./gte')
const lt = require('./lt')
const lte = require('./lte')

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp

},{"./eq":65,"./gt":66,"./gte":67,"./lt":69,"./lte":70,"./neq":73}],60:[function(require,module,exports){
const SemVer = require('../classes/semver')
const parse = require('./parse')
const { safeRe: re, t } = require('../internal/re')

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL]
    let next
    while ((next = coerceRtlRegex.exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    coerceRtlRegex.lastIndex = -1
  }

  if (match === null) {
    return null
  }

  const major = match[2]
  const minor = match[3] || '0'
  const patch = match[4] || '0'
  const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : ''
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : ''

  return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options)
}
module.exports = coerce

},{"../classes/semver":57,"../internal/re":88,"./parse":74}],61:[function(require,module,exports){
const SemVer = require('../classes/semver')
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild

},{"../classes/semver":57}],62:[function(require,module,exports){
const compare = require('./compare')
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose

},{"./compare":63}],63:[function(require,module,exports){
const SemVer = require('../classes/semver')
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare

},{"../classes/semver":57}],64:[function(require,module,exports){
const parse = require('./parse.js')

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // Otherwise it can be determined by checking the high version

    if (highVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (highVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff

},{"./parse.js":74}],65:[function(require,module,exports){
const compare = require('./compare')
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq

},{"./compare":63}],66:[function(require,module,exports){
const compare = require('./compare')
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt

},{"./compare":63}],67:[function(require,module,exports){
const compare = require('./compare')
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte

},{"./compare":63}],68:[function(require,module,exports){
const SemVer = require('../classes/semver')

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc

},{"../classes/semver":57}],69:[function(require,module,exports){
const compare = require('./compare')
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt

},{"./compare":63}],70:[function(require,module,exports){
const compare = require('./compare')
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte

},{"./compare":63}],71:[function(require,module,exports){
const SemVer = require('../classes/semver')
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major

},{"../classes/semver":57}],72:[function(require,module,exports){
const SemVer = require('../classes/semver')
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor

},{"../classes/semver":57}],73:[function(require,module,exports){
const compare = require('./compare')
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq

},{"./compare":63}],74:[function(require,module,exports){
const SemVer = require('../classes/semver')
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse

},{"../classes/semver":57}],75:[function(require,module,exports){
const SemVer = require('../classes/semver')
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch

},{"../classes/semver":57}],76:[function(require,module,exports){
const parse = require('./parse')
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease

},{"./parse":74}],77:[function(require,module,exports){
const compare = require('./compare')
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare

},{"./compare":63}],78:[function(require,module,exports){
const compareBuild = require('./compare-build')
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort

},{"./compare-build":61}],79:[function(require,module,exports){
const Range = require('../classes/range')
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies

},{"../classes/range":56}],80:[function(require,module,exports){
const compareBuild = require('./compare-build')
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort

},{"./compare-build":61}],81:[function(require,module,exports){
const parse = require('./parse')
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid

},{"./parse":74}],82:[function(require,module,exports){
// just pre-load all the stuff that index.js lazily exports
const internalRe = require('./internal/re')
const constants = require('./internal/constants')
const SemVer = require('./classes/semver')
const identifiers = require('./internal/identifiers')
const parse = require('./functions/parse')
const valid = require('./functions/valid')
const clean = require('./functions/clean')
const inc = require('./functions/inc')
const diff = require('./functions/diff')
const major = require('./functions/major')
const minor = require('./functions/minor')
const patch = require('./functions/patch')
const prerelease = require('./functions/prerelease')
const compare = require('./functions/compare')
const rcompare = require('./functions/rcompare')
const compareLoose = require('./functions/compare-loose')
const compareBuild = require('./functions/compare-build')
const sort = require('./functions/sort')
const rsort = require('./functions/rsort')
const gt = require('./functions/gt')
const lt = require('./functions/lt')
const eq = require('./functions/eq')
const neq = require('./functions/neq')
const gte = require('./functions/gte')
const lte = require('./functions/lte')
const cmp = require('./functions/cmp')
const coerce = require('./functions/coerce')
const Comparator = require('./classes/comparator')
const Range = require('./classes/range')
const satisfies = require('./functions/satisfies')
const toComparators = require('./ranges/to-comparators')
const maxSatisfying = require('./ranges/max-satisfying')
const minSatisfying = require('./ranges/min-satisfying')
const minVersion = require('./ranges/min-version')
const validRange = require('./ranges/valid')
const outside = require('./ranges/outside')
const gtr = require('./ranges/gtr')
const ltr = require('./ranges/ltr')
const intersects = require('./ranges/intersects')
const simplifyRange = require('./ranges/simplify')
const subset = require('./ranges/subset')
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}

},{"./classes/comparator":55,"./classes/range":56,"./classes/semver":57,"./functions/clean":58,"./functions/cmp":59,"./functions/coerce":60,"./functions/compare":63,"./functions/compare-build":61,"./functions/compare-loose":62,"./functions/diff":64,"./functions/eq":65,"./functions/gt":66,"./functions/gte":67,"./functions/inc":68,"./functions/lt":69,"./functions/lte":70,"./functions/major":71,"./functions/minor":72,"./functions/neq":73,"./functions/parse":74,"./functions/patch":75,"./functions/prerelease":76,"./functions/rcompare":77,"./functions/rsort":78,"./functions/satisfies":79,"./functions/sort":80,"./functions/valid":81,"./internal/constants":83,"./internal/identifiers":85,"./internal/re":88,"./ranges/gtr":89,"./ranges/intersects":90,"./ranges/ltr":91,"./ranges/max-satisfying":92,"./ranges/min-satisfying":93,"./ranges/min-version":94,"./ranges/outside":95,"./ranges/simplify":96,"./ranges/subset":97,"./ranges/to-comparators":98,"./ranges/valid":99}],83:[function(require,module,exports){
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}

},{}],84:[function(require,module,exports){
(function (process){(function (){
const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug

}).call(this)}).call(this,require('_process'))
},{"_process":201}],85:[function(require,module,exports){
const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}

},{}],86:[function(require,module,exports){
class LRUCache {
  constructor () {
    this.max = 1000
    this.map = new Map()
  }

  get (key) {
    const value = this.map.get(key)
    if (value === undefined) {
      return undefined
    } else {
      // Remove the key from the map and add it to the end
      this.map.delete(key)
      this.map.set(key, value)
      return value
    }
  }

  delete (key) {
    return this.map.delete(key)
  }

  set (key, value) {
    const deleted = this.delete(key)

    if (!deleted && value !== undefined) {
      // If cache is full, delete the least recently used item
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value
        this.delete(firstKey)
      }

      this.map.set(key, value)
    }

    return this
  }
}

module.exports = LRUCache

},{}],87:[function(require,module,exports){
// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions

},{}],88:[function(require,module,exports){
const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = require('./constants')
const debug = require('./debug')
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`)
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`)
createToken('COERCEFULL', src[t.COERCEPLAIN] +
              `(?:${src[t.PRERELEASE]})?` +
              `(?:${src[t.BUILD]})?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)
createToken('COERCERTLFULL', src[t.COERCEFULL], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')

},{"./constants":83,"./debug":84}],89:[function(require,module,exports){
// Determine if version is greater than all the versions possible in the range.
const outside = require('./outside')
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr

},{"./outside":95}],90:[function(require,module,exports){
const Range = require('../classes/range')
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects

},{"../classes/range":56}],91:[function(require,module,exports){
const outside = require('./outside')
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr

},{"./outside":95}],92:[function(require,module,exports){
const SemVer = require('../classes/semver')
const Range = require('../classes/range')

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying

},{"../classes/range":56,"../classes/semver":57}],93:[function(require,module,exports){
const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying

},{"../classes/range":56,"../classes/semver":57}],94:[function(require,module,exports){
const SemVer = require('../classes/semver')
const Range = require('../classes/range')
const gt = require('../functions/gt')

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion

},{"../classes/range":56,"../classes/semver":57,"../functions/gt":66}],95:[function(require,module,exports){
const SemVer = require('../classes/semver')
const Comparator = require('../classes/comparator')
const { ANY } = Comparator
const Range = require('../classes/range')
const satisfies = require('../functions/satisfies')
const gt = require('../functions/gt')
const lt = require('../functions/lt')
const lte = require('../functions/lte')
const gte = require('../functions/gte')

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside

},{"../classes/comparator":55,"../classes/range":56,"../classes/semver":57,"../functions/gt":66,"../functions/gte":67,"../functions/lt":69,"../functions/lte":70,"../functions/satisfies":79}],96:[function(require,module,exports){
// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = require('../functions/satisfies.js')
const compare = require('../functions/compare.js')
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}

},{"../functions/compare.js":63,"../functions/satisfies.js":79}],97:[function(require,module,exports){
const Range = require('../classes/range.js')
const Comparator = require('../classes/comparator.js')
const { ANY } = Comparator
const satisfies = require('../functions/satisfies.js')
const compare = require('../functions/compare.js')

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset

},{"../classes/comparator.js":55,"../classes/range.js":56,"../functions/compare.js":63,"../functions/satisfies.js":79}],98:[function(require,module,exports){
const Range = require('../classes/range')

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators

},{"../classes/range":56}],99:[function(require,module,exports){
const Range = require('../classes/range')
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange

},{"../classes/range":56}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(() => {
            throw err;
        });
    }
}
function arrayClone(arr) {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
class SafeEventEmitter extends events_1.EventEmitter {
    emit(type, ...args) {
        let doError = type === 'error';
        const events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        // If there is no 'error' event listener then throw.
        if (doError) {
            let er;
            if (args.length > 0) {
                [er] = args;
            }
            if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
            }
            // At least give some kind of context to the user
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            err.context = er;
            throw err; // Unhandled 'error' event
        }
        const handler = events[type];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    }
}
exports.default = SafeEventEmitter;

},{"events":187}],101:[function(require,module,exports){
"use strict";
/**
 * A `StructFailure` represents a single specific failure in validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructError = void 0;
/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */
class StructError extends TypeError {
    constructor(failure, failures) {
        let cached;
        const { message, explanation, ...rest } = failure;
        const { path } = failure;
        const cause = path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`;
        super(explanation ?? cause);
        if (explanation !== null && explanation !== undefined) {
            this.cause = cause;
        }
        Object.assign(this, rest);
        this.name = this.constructor.name;
        this.failures = () => {
            return (cached ?? (cached = [failure, ...failures()]));
        };
    }
}
exports.StructError = StructError;

},{}],102:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./error.cjs"), exports);
__exportStar(require("./struct.cjs"), exports);
__exportStar(require("./structs/coercions.cjs"), exports);
__exportStar(require("./structs/refinements.cjs"), exports);
__exportStar(require("./structs/types.cjs"), exports);
__exportStar(require("./structs/utilities.cjs"), exports);

},{"./error.cjs":101,"./struct.cjs":103,"./structs/coercions.cjs":104,"./structs/refinements.cjs":105,"./structs/types.cjs":106,"./structs/utilities.cjs":107}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.is = exports.mask = exports.create = exports.assert = exports.Struct = void 0;
const error_js_1 = require("./error.cjs");
const utils_js_1 = require("./utils.cjs");
/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */
class Struct {
    constructor(props) {
        const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {
            /* noop */
        }, } = props;
        this.type = type;
        this.schema = schema;
        this.entries = entries;
        this.coercer = coercer;
        if (validator) {
            this.validator = (value, context) => {
                const result = validator(value, context);
                return (0, utils_js_1.toFailures)(result, context, this, value);
            };
        }
        else {
            this.validator = () => [];
        }
        if (refiner) {
            this.refiner = (value, context) => {
                const result = refiner(value, context);
                return (0, utils_js_1.toFailures)(result, context, this, value);
            };
        }
        else {
            this.refiner = () => [];
        }
    }
    /**
     * Assert that a value passes the struct's validation, throwing if it doesn't.
     */
    assert(value, message) {
        return assert(value, this, message);
    }
    /**
     * Create a value with the struct's coercion logic, then validate it.
     */
    create(value, message) {
        return create(value, this, message);
    }
    /**
     * Check if a value passes the struct's validation.
     */
    is(value) {
        return is(value, this);
    }
    /**
     * Mask a value, coercing and validating it, but returning only the subset of
     * properties defined by the struct's schema.
     */
    mask(value, message) {
        return mask(value, this, message);
    }
    /**
     * Validate a value with the struct's validation logic, returning a tuple
     * representing the result.
     *
     * You may optionally pass `true` for the `withCoercion` argument to coerce
     * the value before attempting to validate it. If you do, the result will
     * contain the coerced result when successful.
     */
    validate(value, options = {}) {
        return validate(value, this, options);
    }
}
exports.Struct = Struct;
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param message - An optional message to include in the error.
 */
function assert(value, struct, message) {
    const result = validate(value, struct, { message });
    if (result[0]) {
        throw result[0];
    }
}
exports.assert = assert;
/**
 * Create a value with the coercion logic of struct and validate it.
 *
 * @param value - The value to coerce and validate.
 * @param struct - The struct to validate against.
 * @param message - An optional message to include in the error.
 * @returns The coerced and validated value.
 */
function create(value, struct, message) {
    const result = validate(value, struct, { coerce: true, message });
    if (result[0]) {
        throw result[0];
    }
    else {
        return result[1];
    }
}
exports.create = create;
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 *
 * @param value - The value to mask.
 * @param struct - The struct to mask against.
 * @param message - An optional message to include in the error.
 * @returns The masked value.
 */
function mask(value, struct, message) {
    const result = validate(value, struct, { coerce: true, mask: true, message });
    if (result[0]) {
        throw result[0];
    }
    else {
        return result[1];
    }
}
exports.mask = mask;
/**
 * Check if a value passes a struct.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @returns `true` if the value passes the struct, `false` otherwise.
 */
function is(value, struct) {
    const result = validate(value, struct);
    return !result[0];
}
exports.is = is;
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param options - Optional settings.
 * @param options.coerce - Whether to coerce the value before validating it.
 * @param options.mask - Whether to mask the value before validating it.
 * @param options.message - An optional message to include in the error.
 * @returns A tuple containing the error (if invalid) and the validated value.
 */
function validate(value, struct, options = {}) {
    const tuples = (0, utils_js_1.run)(value, struct, options);
    const tuple = (0, utils_js_1.shiftIterator)(tuples);
    if (tuple[0]) {
        const error = new error_js_1.StructError(tuple[0], function* () {
            for (const innerTuple of tuples) {
                if (innerTuple[0]) {
                    yield innerTuple[0];
                }
            }
        });
        return [error, undefined];
    }
    const validatedValue = tuple[1];
    return [undefined, validatedValue];
}
exports.validate = validate;

},{"./error.cjs":101,"./utils.cjs":108}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimmed = exports.defaulted = exports.coerce = void 0;
const struct_js_1 = require("../struct.cjs");
const utils_js_1 = require("../utils.cjs");
const types_js_1 = require("./types.cjs");
/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @param condition - A struct that the input must pass to be coerced.
 * @param coercer - A function that takes the input and returns the coerced
 * value.
 * @returns A new struct that will coerce its input before validating it.
 */
function coerce(struct, condition, coercer) {
    return new struct_js_1.Struct({
        ...struct,
        coercer: (value, ctx) => {
            return (0, struct_js_1.is)(value, condition)
                ? struct.coercer(coercer(value, ctx), ctx)
                : struct.coercer(value, ctx);
        },
    });
}
exports.coerce = coerce;
/**
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @param fallback - The value to use when the input is `undefined`.
 * @param options - An optional options object.
 * @param options.strict - When `true`, the fallback will only be used when the
 * input is `undefined`. When `false`, the fallback will be used when the input
 * is `undefined` or when the input is a plain object and the fallback is a
 * plain object, and any keys in the fallback are missing from the input.
 * @returns A new struct that will replace `undefined` inputs with a default.
 */
function defaulted(struct, fallback, options = {}) {
    return coerce(struct, (0, types_js_1.unknown)(), (value) => {
        const result = typeof fallback === 'function' ? fallback() : fallback;
        if (value === undefined) {
            return result;
        }
        if (!options.strict && (0, utils_js_1.isPlainObject)(value) && (0, utils_js_1.isPlainObject)(result)) {
            const ret = { ...value };
            let changed = false;
            for (const key in result) {
                if (ret[key] === undefined) {
                    ret[key] = result[key];
                    changed = true;
                }
            }
            if (changed) {
                return ret;
            }
        }
        return value;
    });
}
exports.defaulted = defaulted;
/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will trim string inputs before validating them.
 */
function trimmed(struct) {
    return coerce(struct, (0, types_js_1.string)(), (value) => value.trim());
}
exports.trimmed = trimmed;

},{"../struct.cjs":103,"../utils.cjs":108,"./types.cjs":106}],105:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refine = exports.size = exports.pattern = exports.nonempty = exports.min = exports.max = exports.empty = void 0;
const struct_js_1 = require("../struct.cjs");
const utils_js_1 = require("../utils.cjs");
/**
 * Ensure that a string, array, map, or set is empty.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will only accept empty values.
 */
function empty(struct) {
    return refine(struct, 'empty', (value) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const size = getSize(value);
        return (size === 0 ||
            `Expected an empty ${struct.type} but received one with a size of \`${size}\``);
    });
}
exports.empty = empty;
/**
 * Get the size of a string, array, map, or set.
 *
 * @param value - The value to measure.
 * @returns The size of the value.
 */
function getSize(value) {
    if (value instanceof Map || value instanceof Set) {
        return value.size;
    }
    return value.length;
}
/**
 * Ensure that a number or date is below a threshold.
 *
 * @param struct - The struct to augment.
 * @param threshold - The maximum value that the input can be.
 * @param options - An optional options object.
 * @param options.exclusive - When `true`, the input must be strictly less than
 * the threshold. When `false`, the input must be less than or equal to the
 * threshold.
 * @returns A new struct that will only accept values below the threshold.
 */
function max(struct, threshold, options = {}) {
    const { exclusive } = options;
    return refine(struct, 'max', (value) => {
        return exclusive
            ? value < threshold
            : value <= threshold ||
                `Expected a ${struct.type} less than ${exclusive ? '' : 'or equal to '
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                }${threshold} but received \`${value}\``;
    });
}
exports.max = max;
/**
 * Ensure that a number or date is above a threshold.
 *
 * @param struct - The struct to augment.
 * @param threshold - The minimum value that the input can be.
 * @param options - An optional options object.
 * @param options.exclusive - When `true`, the input must be strictly greater
 * than the threshold. When `false`, the input must be greater than or equal to
 * the threshold.
 * @returns A new struct that will only accept values above the threshold.
 */
function min(struct, threshold, options = {}) {
    const { exclusive } = options;
    return refine(struct, 'min', (value) => {
        return exclusive
            ? value > threshold
            : value >= threshold ||
                `Expected a ${struct.type} greater than ${exclusive ? '' : 'or equal to '
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                }${threshold} but received \`${value}\``;
    });
}
exports.min = min;
/**
 * Ensure that a string, array, map or set is not empty.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will only accept non-empty values.
 */
function nonempty(struct) {
    return refine(struct, 'nonempty', (value) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const size = getSize(value);
        return (size > 0 || `Expected a nonempty ${struct.type} but received an empty one`);
    });
}
exports.nonempty = nonempty;
/**
 * Ensure that a string matches a regular expression.
 *
 * @param struct - The struct to augment.
 * @param regexp - The regular expression to match against.
 * @returns A new struct that will only accept strings matching the regular
 * expression.
 */
function pattern(struct, regexp) {
    return refine(struct, 'pattern', (value) => {
        return (regexp.test(value) ||
            `Expected a ${struct.type} matching \`/${regexp.source}/\` but received "${value}"`);
    });
}
exports.pattern = pattern;
/**
 * Ensure that a string, array, number, date, map, or set has a size (or length,
 * or time) between `min` and `max`.
 *
 * @param struct - The struct to augment.
 * @param minimum - The minimum size that the input can be.
 * @param maximum - The maximum size that the input can be.
 * @returns A new struct that will only accept values within the given size
 * range.
 */
function size(struct, minimum, maximum = minimum) {
    const expected = `Expected a ${struct.type}`;
    const of = minimum === maximum
        ? `of \`${minimum}\``
        : `between \`${minimum}\` and \`${maximum}\``;
    return refine(struct, 'size', (value) => {
        if (typeof value === 'number' || value instanceof Date) {
            return ((minimum <= value && value <= maximum) ||
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${expected} ${of} but received \`${value}\``);
        }
        else if (value instanceof Map || value instanceof Set) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { size } = value;
            return ((minimum <= size && size <= maximum) ||
                `${expected} with a size ${of} but received one with a size of \`${size}\``);
        }
        const { length } = value;
        return ((minimum <= length && length <= maximum) ||
            `${expected} with a length ${of} but received one with a length of \`${length}\``);
    });
}
exports.size = size;
/**
 * Augment a `Struct` to add an additional refinement to the validation.
 *
 * The refiner function is guaranteed to receive a value of the struct's type,
 * because the struct's existing validation will already have passed. This
 * allows you to layer additional validation on top of existing structs.
 *
 * @param struct - The struct to augment.
 * @param name - The name of the refinement.
 * @param refiner - The refiner function.
 * @returns A new struct that will run the refiner function after the existing
 * validation.
 */
function refine(struct, name, refiner) {
    return new struct_js_1.Struct({
        ...struct,
        *refiner(value, ctx) {
            yield* struct.refiner(value, ctx);
            const result = refiner(value, ctx);
            const failures = (0, utils_js_1.toFailures)(result, ctx, struct, value);
            for (const failure of failures) {
                yield { ...failure, refinement: name };
            }
        },
    });
}
exports.refine = refine;

},{"../struct.cjs":103,"../utils.cjs":108}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknown = exports.union = exports.type = exports.tuple = exports.string = exports.set = exports.regexp = exports.record = exports.optional = exports.object = exports.number = exports.nullable = exports.never = exports.map = exports.literal = exports.intersection = exports.integer = exports.instance = exports.func = exports.enums = exports.date = exports.boolean = exports.bigint = exports.array = exports.any = void 0;
const struct_js_1 = require("../struct.cjs");
const utils_js_1 = require("../utils.cjs");
const utilities_js_1 = require("./utilities.cjs");
/**
 * Ensure that any value passes validation.
 *
 * @returns A struct that will always pass validation.
 */
function any() {
    return (0, utilities_js_1.define)('any', () => true);
}
exports.any = any;
/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 *
 * @param Element - The struct to validate each element in the array against.
 * @returns A new struct that will only accept arrays of the given type.
 */
function array(Element) {
    return new struct_js_1.Struct({
        type: 'array',
        schema: Element,
        *entries(value) {
            if (Element && Array.isArray(value)) {
                for (const [index, arrayValue] of value.entries()) {
                    yield [index, arrayValue, Element];
                }
            }
        },
        coercer(value) {
            return Array.isArray(value) ? value.slice() : value;
        },
        validator(value) {
            return (Array.isArray(value) ||
                `Expected an array value, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.array = array;
/**
 * Ensure that a value is a bigint.
 *
 * @returns A new struct that will only accept bigints.
 */
function bigint() {
    return (0, utilities_js_1.define)('bigint', (value) => {
        return typeof value === 'bigint';
    });
}
exports.bigint = bigint;
/**
 * Ensure that a value is a boolean.
 *
 * @returns A new struct that will only accept booleans.
 */
function boolean() {
    return (0, utilities_js_1.define)('boolean', (value) => {
        return typeof value === 'boolean';
    });
}
exports.boolean = boolean;
/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 *
 * @returns A new struct that will only accept valid `Date` objects.
 */
function date() {
    return (0, utilities_js_1.define)('date', (value) => {
        return ((value instanceof Date && !isNaN(value.getTime())) ||
            `Expected a valid \`Date\` object, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.date = date;
/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 *
 * @param values - The potential values that the input can be.
 * @returns A new struct that will only accept the given values.
 */
function enums(values) {
    const schema = {};
    const description = values.map((value) => (0, utils_js_1.print)(value)).join();
    for (const key of values) {
        schema[key] = key;
    }
    return new struct_js_1.Struct({
        type: 'enums',
        schema,
        validator(value) {
            return (values.includes(value) ||
                `Expected one of \`${description}\`, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.enums = enums;
/**
 * Ensure that a value is a function.
 *
 * @returns A new struct that will only accept functions.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function func() {
    return (0, utilities_js_1.define)('func', (value) => {
        return (typeof value === 'function' ||
            `Expected a function, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.func = func;
/**
 * Ensure that a value is an instance of a specific class.
 *
 * @param Class - The class that the value must be an instance of.
 * @returns A new struct that will only accept instances of the given class.
 */
function instance(Class) {
    return (0, utilities_js_1.define)('instance', (value) => {
        return (value instanceof Class ||
            `Expected a \`${Class.name}\` instance, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.instance = instance;
/**
 * Ensure that a value is an integer.
 *
 * @returns A new struct that will only accept integers.
 */
function integer() {
    return (0, utilities_js_1.define)('integer', (value) => {
        return ((typeof value === 'number' && !isNaN(value) && Number.isInteger(value)) ||
            `Expected an integer, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.integer = integer;
/**
 * Ensure that a value matches all of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match all of the
 * given structs.
 */
function intersection(Structs) {
    return new struct_js_1.Struct({
        type: 'intersection',
        schema: null,
        *entries(value, context) {
            for (const { entries } of Structs) {
                yield* entries(value, context);
            }
        },
        *validator(value, context) {
            for (const { validator } of Structs) {
                yield* validator(value, context);
            }
        },
        *refiner(value, context) {
            for (const { refiner } of Structs) {
                yield* refiner(value, context);
            }
        },
    });
}
exports.intersection = intersection;
/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
function literal(constant) {
    const description = (0, utils_js_1.print)(constant);
    const valueType = typeof constant;
    return new struct_js_1.Struct({
        type: 'literal',
        schema: valueType === 'string' ||
            valueType === 'number' ||
            valueType === 'boolean'
            ? constant
            : null,
        validator(value) {
            return (value === constant ||
                `Expected the literal \`${description}\`, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.literal = literal;
/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 *
 * @param Key - The struct to validate each key in the map against.
 * @param Value - The struct to validate each value in the map against.
 * @returns A new struct that will only accept `Map` objects.
 */
function map(Key, Value) {
    return new struct_js_1.Struct({
        type: 'map',
        schema: null,
        *entries(value) {
            if (Key && Value && value instanceof Map) {
                for (const [mapKey, mapValue] of value.entries()) {
                    yield [mapKey, mapKey, Key];
                    yield [mapKey, mapValue, Value];
                }
            }
        },
        coercer(value) {
            return value instanceof Map ? new Map(value) : value;
        },
        validator(value) {
            return (value instanceof Map ||
                `Expected a \`Map\` object, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.map = map;
/**
 * Ensure that no value ever passes validation.
 *
 * @returns A new struct that will never pass validation.
 */
function never() {
    return (0, utilities_js_1.define)('never', () => false);
}
exports.never = never;
/**
 * Augment an existing struct to allow `null` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `null` values.
 */
function nullable(struct) {
    return new struct_js_1.Struct({
        ...struct,
        validator: (value, ctx) => value === null || struct.validator(value, ctx),
        refiner: (value, ctx) => value === null || struct.refiner(value, ctx),
    });
}
exports.nullable = nullable;
/**
 * Ensure that a value is a number.
 *
 * @returns A new struct that will only accept numbers.
 */
function number() {
    return (0, utilities_js_1.define)('number', (value) => {
        return ((typeof value === 'number' && !isNaN(value)) ||
            `Expected a number, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.number = number;
/**
 * Ensure that a value is an object, that it has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
function object(schema) {
    const knowns = schema ? Object.keys(schema) : [];
    const Never = never();
    return new struct_js_1.Struct({
        type: 'object',
        schema: schema ?? null,
        *entries(value) {
            if (schema && (0, utils_js_1.isObject)(value)) {
                const unknowns = new Set(Object.keys(value));
                for (const key of knowns) {
                    unknowns.delete(key);
                    yield [key, value[key], schema[key]];
                }
                for (const key of unknowns) {
                    yield [key, value[key], Never];
                }
            }
        },
        validator(value) {
            return ((0, utils_js_1.isObject)(value) || `Expected an object, but received: ${(0, utils_js_1.print)(value)}`);
        },
        coercer(value) {
            return (0, utils_js_1.isObject)(value) ? { ...value } : value;
        },
    });
}
exports.object = object;
/**
 * Augment a struct to allow `undefined` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `undefined` values.
 */
function optional(struct) {
    return new struct_js_1.Struct({
        ...struct,
        validator: (value, ctx) => value === undefined || struct.validator(value, ctx),
        refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
    });
}
exports.optional = optional;
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * @param Key - The struct to validate each key in the record against.
 * @param Value - The struct to validate each value in the record against.
 * @returns A new struct that will only accept objects.
 */
function record(Key, Value) {
    return new struct_js_1.Struct({
        type: 'record',
        schema: null,
        *entries(value) {
            if ((0, utils_js_1.isObject)(value)) {
                // eslint-disable-next-line guard-for-in
                for (const objectKey in value) {
                    const objectValue = value[objectKey];
                    yield [objectKey, objectKey, Key];
                    yield [objectKey, objectValue, Value];
                }
            }
        },
        validator(value) {
            return ((0, utils_js_1.isObject)(value) || `Expected an object, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.record = record;
/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 *
 * @returns A new struct that will only accept `RegExp` objects.
 */
function regexp() {
    return (0, utilities_js_1.define)('regexp', (value) => {
        return value instanceof RegExp;
    });
}
exports.regexp = regexp;
/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 *
 * @param Element - The struct to validate each element in the set against.
 * @returns A new struct that will only accept `Set` objects.
 */
function set(Element) {
    return new struct_js_1.Struct({
        type: 'set',
        schema: null,
        *entries(value) {
            if (Element && value instanceof Set) {
                for (const setValue of value) {
                    yield [setValue, setValue, Element];
                }
            }
        },
        coercer(value) {
            return value instanceof Set ? new Set(value) : value;
        },
        validator(value) {
            return (value instanceof Set ||
                `Expected a \`Set\` object, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.set = set;
/**
 * Ensure that a value is a string.
 *
 * @returns A new struct that will only accept strings.
 */
function string() {
    return (0, utilities_js_1.define)('string', (value) => {
        return (typeof value === 'string' ||
            `Expected a string, but received: ${(0, utils_js_1.print)(value)}`);
    });
}
exports.string = string;
/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept tuples of the given types.
 */
function tuple(Structs) {
    const Never = never();
    return new struct_js_1.Struct({
        type: 'tuple',
        schema: null,
        *entries(value) {
            if (Array.isArray(value)) {
                const length = Math.max(Structs.length, value.length);
                for (let i = 0; i < length; i++) {
                    yield [i, value[i], Structs[i] || Never];
                }
            }
        },
        validator(value) {
            return (Array.isArray(value) ||
                `Expected an array, but received: ${(0, utils_js_1.print)(value)}`);
        },
    });
}
exports.tuple = tuple;
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
function type(schema) {
    const keys = Object.keys(schema);
    return new struct_js_1.Struct({
        type: 'type',
        schema,
        *entries(value) {
            if ((0, utils_js_1.isObject)(value)) {
                for (const k of keys) {
                    yield [k, value[k], schema[k]];
                }
            }
        },
        validator(value) {
            return ((0, utils_js_1.isObject)(value) || `Expected an object, but received: ${(0, utils_js_1.print)(value)}`);
        },
        coercer(value) {
            return (0, utils_js_1.isObject)(value) ? { ...value } : value;
        },
    });
}
exports.type = type;
/**
 * Ensure that a value matches one of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match one of the
 * given structs.
 */
function union(Structs) {
    const description = Structs.map((struct) => struct.type).join(' | ');
    return new struct_js_1.Struct({
        type: 'union',
        schema: null,
        coercer(value) {
            for (const InnerStruct of Structs) {
                const [error, coerced] = InnerStruct.validate(value, { coerce: true });
                if (!error) {
                    return coerced;
                }
            }
            return value;
        },
        validator(value, ctx) {
            const failures = [];
            for (const InnerStruct of Structs) {
                const [...tuples] = (0, utils_js_1.run)(value, InnerStruct, ctx);
                const [first] = tuples;
                if (!first?.[0]) {
                    return [];
                }
                for (const [failure] of tuples) {
                    if (failure) {
                        failures.push(failure);
                    }
                }
            }
            return [
                `Expected the value to satisfy a union of \`${description}\`, but received: ${(0, utils_js_1.print)(value)}`,
                ...failures,
            ];
        },
    });
}
exports.union = union;
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 *
 * @returns A struct that will always pass validation.
 */
function unknown() {
    return (0, utilities_js_1.define)('unknown', () => true);
}
exports.unknown = unknown;

},{"../struct.cjs":103,"../utils.cjs":108,"./utilities.cjs":107}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.partial = exports.omit = exports.lazy = exports.dynamic = exports.deprecated = exports.define = exports.assign = void 0;
const struct_js_1 = require("../struct.cjs");
const types_js_1 = require("./types.cjs");
/**
 * Create a new struct that combines the properties from multiple object or type
 * structs. Its return type will match the first parameter's type.
 *
 * @param Structs - The structs to combine.
 * @returns A new struct that combines the properties of the input structs.
 */
function assign(...Structs) {
    const isType = Structs[0]?.type === 'type';
    const schemas = Structs.map(({ schema }) => schema);
    const schema = Object.assign({}, ...schemas);
    return isType ? (0, types_js_1.type)(schema) : (0, types_js_1.object)(schema);
}
exports.assign = assign;
/**
 * Define a new struct type with a custom validation function.
 *
 * @param name - The name of the struct type.
 * @param validator - The validation function.
 * @returns A new struct type.
 */
function define(name, validator) {
    return new struct_js_1.Struct({ type: name, schema: null, validator });
}
exports.define = define;
/**
 * Create a new struct based on an existing struct, but the value is allowed to
 * be `undefined`. `log` will be called if the value is not `undefined`.
 *
 * @param struct - The struct to augment.
 * @param log - The function to call when the value is not `undefined`.
 * @returns A new struct that will only accept `undefined` or values that pass
 * the input struct.
 */
function deprecated(struct, log) {
    return new struct_js_1.Struct({
        ...struct,
        refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
        validator(value, ctx) {
            if (value === undefined) {
                return true;
            }
            log(value, ctx);
            return struct.validator(value, ctx);
        },
    });
}
exports.deprecated = deprecated;
/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 *
 * @param fn - The callback to create the struct.
 * @returns A new struct with dynamic validation logic.
 */
function dynamic(fn) {
    return new struct_js_1.Struct({
        type: 'dynamic',
        schema: null,
        *entries(value, ctx) {
            const struct = fn(value, ctx);
            yield* struct.entries(value, ctx);
        },
        validator(value, ctx) {
            const struct = fn(value, ctx);
            return struct.validator(value, ctx);
        },
        coercer(value, ctx) {
            const struct = fn(value, ctx);
            return struct.coercer(value, ctx);
        },
        refiner(value, ctx) {
            const struct = fn(value, ctx);
            return struct.refiner(value, ctx);
        },
    });
}
exports.dynamic = dynamic;
/**
 * Create a struct with lazily evaluated validation logic.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
 *
 * @param fn - The callback to create the struct.
 * @returns A new struct with lazily evaluated validation logic.
 */
function lazy(fn) {
    let struct;
    return new struct_js_1.Struct({
        type: 'lazy',
        schema: null,
        *entries(value, ctx) {
            struct ?? (struct = fn());
            yield* struct.entries(value, ctx);
        },
        validator(value, ctx) {
            struct ?? (struct = fn());
            return struct.validator(value, ctx);
        },
        coercer(value, ctx) {
            struct ?? (struct = fn());
            return struct.coercer(value, ctx);
        },
        refiner(value, ctx) {
            struct ?? (struct = fn());
            return struct.refiner(value, ctx);
        },
    });
}
exports.lazy = lazy;
/**
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
 *
 * @param struct - The struct to augment.
 * @param keys - The keys to omit.
 * @returns A new struct that will not accept the input keys.
 */
function omit(struct, keys) {
    const { schema } = struct;
    const subschema = { ...schema };
    for (const key of keys) {
        delete subschema[key];
    }
    switch (struct.type) {
        case 'type':
            return (0, types_js_1.type)(subschema);
        default:
            return (0, types_js_1.object)(subschema);
    }
}
exports.omit = omit;
/**
 * Create a new struct based on an existing object struct, but with all of its
 * properties allowed to be `undefined`.
 *
 * Like TypeScript's `Partial` utility.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept the input keys as `undefined`.
 */
function partial(struct) {
    const isStruct = struct instanceof struct_js_1.Struct;
    const schema = isStruct ? { ...struct.schema } : { ...struct };
    // eslint-disable-next-line guard-for-in
    for (const key in schema) {
        schema[key] = (0, types_js_1.optional)(schema[key]);
    }
    if (isStruct && struct.type === 'type') {
        return (0, types_js_1.type)(schema);
    }
    return (0, types_js_1.object)(schema);
}
exports.partial = partial;
/**
 * Create a new struct based on an existing object struct, but only including
 * specific properties.
 *
 * Like TypeScript's `Pick` utility.
 *
 * @param struct - The struct to augment.
 * @param keys - The keys to pick.
 * @returns A new struct that will only accept the input keys.
 */
function pick(struct, keys) {
    const { schema } = struct;
    const subschema = {};
    for (const key of keys) {
        subschema[key] = schema[key];
    }
    switch (struct.type) {
        case 'type':
            return (0, types_js_1.type)(subschema);
        default:
            return (0, types_js_1.object)(subschema);
    }
}
exports.pick = pick;

},{"../struct.cjs":103,"./types.cjs":106}],108:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.toFailures = exports.toFailure = exports.shiftIterator = exports.print = exports.isPlainObject = exports.isObject = void 0;
/**
 * Check if a value is an iterator.
 *
 * @param value - The value to check.
 * @returns Whether the value is an iterator.
 */
function isIterable(value) {
    return isObject(value) && typeof value[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
exports.isObject = isObject;
/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}
exports.isPlainObject = isPlainObject;
/**
 * Return a value as a printable string.
 *
 * @param value - The value to print.
 * @returns The value as a string.
 */
function print(value) {
    if (typeof value === 'symbol') {
        return value.toString();
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return typeof value === 'string' ? JSON.stringify(value) : `${value}`;
}
exports.print = print;
/**
 * Shift (remove and return) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 *
 * @param input - The iterator to shift.
 * @returns The first value of the iterator, or `undefined` if the iterator is
 * empty.
 */
function shiftIterator(input) {
    const { done, value } = input.next();
    return done ? undefined : value;
}
exports.shiftIterator = shiftIterator;
/**
 * Convert a single validation result to a failure.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @returns A failure if the result is a failure, or `undefined` if the result
 * is a success.
 */
function toFailure(result, context, struct, value) {
    if (result === true) {
        return undefined;
    }
    else if (result === false) {
        // eslint-disable-next-line no-param-reassign
        result = {};
    }
    else if (typeof result === 'string') {
        // eslint-disable-next-line no-param-reassign
        result = { message: result };
    }
    const { path, branch } = context;
    const { type } = struct;
    const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ''}, but received: \`${print(value)}\``, } = result;
    return {
        value,
        type,
        refinement,
        key: path[path.length - 1],
        path,
        branch,
        ...result,
        message,
    };
}
exports.toFailure = toFailure;
/**
 * Convert a validation result to an iterable of failures.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @yields The failures.
 * @returns An iterable of failures.
 */
function* toFailures(result, context, struct, value) {
    if (!isIterable(result)) {
        // eslint-disable-next-line no-param-reassign
        result = [result];
    }
    for (const validationResult of result) {
        const failure = toFailure(validationResult, context, struct, value);
        if (failure) {
            yield failure;
        }
    }
}
exports.toFailures = toFailures;
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 *
 * @param value - The value to check.
 * @param struct - The struct to check against.
 * @param options - Optional settings.
 * @param options.path - The path to the value in the input data.
 * @param options.branch - The branch of the value in the input data.
 * @param options.coerce - Whether to coerce the value before validating it.
 * @param options.mask - Whether to mask the value before validating it.
 * @param options.message - An optional message to include in the error.
 * @yields An iterator of failures or success.
 * @returns An iterator of failures or success.
 */
function* run(value, struct, options = {}) {
    const { path = [], branch = [value], coerce = false, mask = false } = options;
    const context = { path, branch };
    if (coerce) {
        // eslint-disable-next-line no-param-reassign
        value = struct.coercer(value, context);
        if (mask &&
            struct.type !== 'type' &&
            isObject(struct.schema) &&
            isObject(value) &&
            !Array.isArray(value)) {
            for (const key in value) {
                if (struct.schema[key] === undefined) {
                    delete value[key];
                }
            }
        }
    }
    let status = 'valid';
    for (const failure of struct.validator(value, context)) {
        failure.explanation = options.message;
        status = 'not_valid';
        yield [failure, undefined];
    }
    // eslint-disable-next-line prefer-const
    for (let [innerKey, innerValue, innerStruct] of struct.entries(value, context)) {
        const iterable = run(innerValue, innerStruct, {
            path: innerKey === undefined ? path : [...path, innerKey],
            branch: innerKey === undefined ? branch : [...branch, innerValue],
            coerce,
            mask,
            message: options.message,
        });
        for (const result of iterable) {
            if (result[0]) {
                status =
                    result[0].refinement === null || result[0].refinement === undefined
                        ? 'not_valid'
                        : 'not_refined';
                yield [result[0], undefined];
            }
            else if (coerce) {
                innerValue = result[1];
                if (innerKey === undefined) {
                    // eslint-disable-next-line no-param-reassign
                    value = innerValue;
                }
                else if (value instanceof Map) {
                    value.set(innerKey, innerValue);
                }
                else if (value instanceof Set) {
                    value.add(innerValue);
                }
                else if (isObject(value)) {
                    if (innerValue !== undefined || innerKey in value) {
                        value[innerKey] = innerValue;
                    }
                }
            }
        }
    }
    if (status !== 'not_valid') {
        for (const failure of struct.refiner(value, context)) {
            failure.explanation = options.message;
            status = 'not_refined';
            yield [failure, undefined];
        }
    }
    if (status === 'valid') {
        yield [undefined, value];
    }
}
exports.run = run;

},{}],109:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./errors.cjs":117,"@metamask/superstruct":102,"dup":34}],110:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./assert.cjs":109,"@metamask/superstruct":102,"dup":35}],111:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./assert.cjs":109,"./hex.cjs":118,"@scure/base":180,"buffer":183,"dup":36}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCaipChainId = exports.parseCaipAccountId = exports.parseCaipChainId = exports.isCaipAccountAddress = exports.isCaipAccountId = exports.isCaipReference = exports.isCaipNamespace = exports.isCaipChainId = exports.KnownCaipNamespace = exports.CaipAccountAddressStruct = exports.CaipAccountIdStruct = exports.CaipReferenceStruct = exports.CaipNamespaceStruct = exports.CaipChainIdStruct = exports.CAIP_ACCOUNT_ADDRESS_REGEX = exports.CAIP_ACCOUNT_ID_REGEX = exports.CAIP_REFERENCE_REGEX = exports.CAIP_NAMESPACE_REGEX = exports.CAIP_CHAIN_ID_REGEX = void 0;
const superstruct_1 = require("@metamask/superstruct");
exports.CAIP_CHAIN_ID_REGEX = /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})$/u;
exports.CAIP_NAMESPACE_REGEX = /^[-a-z0-9]{3,8}$/u;
exports.CAIP_REFERENCE_REGEX = /^[-_a-zA-Z0-9]{1,32}$/u;
exports.CAIP_ACCOUNT_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;
exports.CAIP_ACCOUNT_ADDRESS_REGEX = /^[-.%a-zA-Z0-9]{1,128}$/u;
/**
 * A CAIP-2 chain ID, i.e., a human-readable namespace and reference.
 */
exports.CaipChainIdStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_CHAIN_ID_REGEX);
/**
 * A CAIP-2 namespace, i.e., the first part of a CAIP chain ID.
 */
exports.CaipNamespaceStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_NAMESPACE_REGEX);
/**
 * A CAIP-2 reference, i.e., the second part of a CAIP chain ID.
 */
exports.CaipReferenceStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_REFERENCE_REGEX);
/**
 * A CAIP-10 account ID, i.e., a human-readable namespace, reference, and account address.
 */
exports.CaipAccountIdStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_ACCOUNT_ID_REGEX);
/**
 * A CAIP-10 account address, i.e., the third part of the CAIP account ID.
 */
exports.CaipAccountAddressStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), exports.CAIP_ACCOUNT_ADDRESS_REGEX);
/** Known CAIP namespaces. */
var KnownCaipNamespace;
(function (KnownCaipNamespace) {
    /** EIP-155 compatible chains. */
    KnownCaipNamespace["Eip155"] = "eip155";
})(KnownCaipNamespace = exports.KnownCaipNamespace || (exports.KnownCaipNamespace = {}));
/**
 * Check if the given value is a {@link CaipChainId}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipChainId}.
 */
function isCaipChainId(value) {
    return (0, superstruct_1.is)(value, exports.CaipChainIdStruct);
}
exports.isCaipChainId = isCaipChainId;
/**
 * Check if the given value is a {@link CaipNamespace}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipNamespace}.
 */
function isCaipNamespace(value) {
    return (0, superstruct_1.is)(value, exports.CaipNamespaceStruct);
}
exports.isCaipNamespace = isCaipNamespace;
/**
 * Check if the given value is a {@link CaipReference}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipReference}.
 */
function isCaipReference(value) {
    return (0, superstruct_1.is)(value, exports.CaipReferenceStruct);
}
exports.isCaipReference = isCaipReference;
/**
 * Check if the given value is a {@link CaipAccountId}.
 *
 * @param value - The value to check.
 * @returns Whether the value is a {@link CaipAccountId}.
 */
function isCaipAccountId(value) {
    return (0, superstruct_1.is)(value, exports.CaipAccountIdStruct);
}
exports.isCaipAccountId = isCaipAccountId;
/**
 * Check if a value is a {@link CaipAccountAddress}.
 *
 * @param value - The value to validate.
 * @returns True if the value is a valid {@link CaipAccountAddress}.
 */
function isCaipAccountAddress(value) {
    return (0, superstruct_1.is)(value, exports.CaipAccountAddressStruct);
}
exports.isCaipAccountAddress = isCaipAccountAddress;
/**
 * Parse a CAIP-2 chain ID to an object containing the namespace and reference.
 * This validates the CAIP-2 chain ID before parsing it.
 *
 * @param caipChainId - The CAIP-2 chain ID to validate and parse.
 * @returns The parsed CAIP-2 chain ID.
 */
function parseCaipChainId(caipChainId) {
    const match = exports.CAIP_CHAIN_ID_REGEX.exec(caipChainId);
    if (!match?.groups) {
        throw new Error('Invalid CAIP chain ID.');
    }
    return {
        namespace: match.groups.namespace,
        reference: match.groups.reference,
    };
}
exports.parseCaipChainId = parseCaipChainId;
/**
 * Parse an CAIP-10 account ID to an object containing the chain ID, parsed chain ID, and account address.
 * This validates the CAIP-10 account ID before parsing it.
 *
 * @param caipAccountId - The CAIP-10 account ID to validate and parse.
 * @returns The parsed CAIP-10 account ID.
 */
function parseCaipAccountId(caipAccountId) {
    const match = exports.CAIP_ACCOUNT_ID_REGEX.exec(caipAccountId);
    if (!match?.groups) {
        throw new Error('Invalid CAIP account ID.');
    }
    return {
        address: match.groups.accountAddress,
        chainId: match.groups.chainId,
        chain: {
            namespace: match.groups.namespace,
            reference: match.groups.reference,
        },
    };
}
exports.parseCaipAccountId = parseCaipAccountId;
/**
 * Chain ID as defined per the CAIP-2
 * {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md}.
 *
 * It defines a way to uniquely identify any blockchain in a human-readable
 * way.
 *
 * @param namespace - The standard (ecosystem) of similar blockchains.
 * @param reference - Identify of a blockchain within a given namespace.
 * @throws {@link Error}
 * This exception is thrown if the inputs does not comply with the CAIP-2
 * syntax specification
 * {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md#syntax}.
 * @returns A CAIP chain ID.
 */
function toCaipChainId(namespace, reference) {
    if (!isCaipNamespace(namespace)) {
        throw new Error(`Invalid "namespace", must match: ${exports.CAIP_NAMESPACE_REGEX.toString()}`);
    }
    if (!isCaipReference(reference)) {
        throw new Error(`Invalid "reference", must match: ${exports.CAIP_REFERENCE_REGEX.toString()}`);
    }
    return `${namespace}:${reference}`;
}
exports.toCaipChainId = toCaipChainId;

},{"@metamask/superstruct":102}],113:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./base64.cjs":110,"@metamask/superstruct":102,"dup":38}],114:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"./assert.cjs":109,"./bytes.cjs":111,"./hex.cjs":118,"@metamask/superstruct":102,"dup":39}],115:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],116:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],117:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./misc.cjs":123,"dup":42,"pony-cause":198}],118:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"./assert.cjs":109,"./bytes.cjs":111,"@metamask/superstruct":102,"@noble/hashes/sha3":178,"dup":43}],119:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./assert.cjs":109,"./base64.cjs":110,"./bytes.cjs":111,"./caip-types.cjs":112,"./checksum.cjs":113,"./coercers.cjs":114,"./collections.cjs":115,"./encryption-types.cjs":116,"./errors.cjs":117,"./hex.cjs":118,"./json.cjs":120,"./keyring.cjs":121,"./logging.cjs":122,"./misc.cjs":123,"./number.cjs":124,"./opaque.cjs":125,"./promise.cjs":126,"./time.cjs":127,"./transaction-types.cjs":128,"./versions.cjs":129,"dup":44}],120:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./assert.cjs":109,"./misc.cjs":123,"@metamask/superstruct":102,"dup":45}],121:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],122:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"debug":184,"dup":47}],123:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],124:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./assert.cjs":109,"./hex.cjs":118,"dup":49}],125:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],126:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],127:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],128:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"dup":53}],129:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"./assert.cjs":109,"@metamask/superstruct":102,"dup":54,"semver":157}],130:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"../functions/cmp":134,"../internal/debug":159,"../internal/parse-options":162,"../internal/re":163,"./range":131,"./semver":132,"dup":55}],131:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"../internal/constants":158,"../internal/debug":159,"../internal/lrucache":161,"../internal/parse-options":162,"../internal/re":163,"./comparator":130,"./semver":132,"dup":56}],132:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"../internal/constants":158,"../internal/debug":159,"../internal/identifiers":160,"../internal/parse-options":162,"../internal/re":163,"dup":57}],133:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"./parse":149,"dup":58}],134:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"./eq":140,"./gt":141,"./gte":142,"./lt":144,"./lte":145,"./neq":148,"dup":59}],135:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"../classes/semver":132,"../internal/re":163,"./parse":149,"dup":60}],136:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":61}],137:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./compare":138,"dup":62}],138:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":63}],139:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"./parse.js":149,"dup":64}],140:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"./compare":138,"dup":65}],141:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./compare":138,"dup":66}],142:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"./compare":138,"dup":67}],143:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":68}],144:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"./compare":138,"dup":69}],145:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"./compare":138,"dup":70}],146:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":71}],147:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":72}],148:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"./compare":138,"dup":73}],149:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":74}],150:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"../classes/semver":132,"dup":75}],151:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"./parse":149,"dup":76}],152:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./compare":138,"dup":77}],153:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"./compare-build":136,"dup":78}],154:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"../classes/range":131,"dup":79}],155:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"./compare-build":136,"dup":80}],156:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"./parse":149,"dup":81}],157:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"./classes/comparator":130,"./classes/range":131,"./classes/semver":132,"./functions/clean":133,"./functions/cmp":134,"./functions/coerce":135,"./functions/compare":138,"./functions/compare-build":136,"./functions/compare-loose":137,"./functions/diff":139,"./functions/eq":140,"./functions/gt":141,"./functions/gte":142,"./functions/inc":143,"./functions/lt":144,"./functions/lte":145,"./functions/major":146,"./functions/minor":147,"./functions/neq":148,"./functions/parse":149,"./functions/patch":150,"./functions/prerelease":151,"./functions/rcompare":152,"./functions/rsort":153,"./functions/satisfies":154,"./functions/sort":155,"./functions/valid":156,"./internal/constants":158,"./internal/identifiers":160,"./internal/re":163,"./ranges/gtr":164,"./ranges/intersects":165,"./ranges/ltr":166,"./ranges/max-satisfying":167,"./ranges/min-satisfying":168,"./ranges/min-version":169,"./ranges/outside":170,"./ranges/simplify":171,"./ranges/subset":172,"./ranges/to-comparators":173,"./ranges/valid":174,"dup":82}],158:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"dup":83}],159:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"_process":201,"dup":84}],160:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],161:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"dup":86}],162:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],163:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"./constants":158,"./debug":159,"dup":88}],164:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./outside":170,"dup":89}],165:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"../classes/range":131,"dup":90}],166:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"./outside":170,"dup":91}],167:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"../classes/range":131,"../classes/semver":132,"dup":92}],168:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"../classes/range":131,"../classes/semver":132,"dup":93}],169:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"../classes/range":131,"../classes/semver":132,"../functions/gt":141,"dup":94}],170:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../classes/comparator":130,"../classes/range":131,"../classes/semver":132,"../functions/gt":141,"../functions/gte":142,"../functions/lt":144,"../functions/lte":145,"../functions/satisfies":154,"dup":95}],171:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"../functions/compare.js":138,"../functions/satisfies.js":154,"dup":96}],172:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"../classes/comparator.js":130,"../classes/range.js":131,"../functions/compare.js":138,"../functions/satisfies.js":154,"dup":97}],173:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"../classes/range":131,"dup":98}],174:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"../classes/range":131,"dup":99}],175:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBytes = isBytes;
exports.number = number;
exports.bool = bool;
exports.bytes = bytes;
exports.hash = hash;
exports.exists = exists;
exports.output = output;
function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`positive integer expected, not ${n}`);
}
function bool(b) {
    if (typeof b !== 'boolean')
        throw new Error(`boolean expected, not ${b}`);
}
// copied from utils
function isBytes(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
function bytes(b, ...lengths) {
    if (!isBytes(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(h.outputLen);
    number(h.blockLen);
}
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
const assert = { number, bool, bytes, hash, exists, output };
exports.default = assert;

},{}],176:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add5L = exports.add5H = exports.add4H = exports.add4L = exports.add3H = exports.add3L = exports.rotlBL = exports.rotlBH = exports.rotlSL = exports.rotlSH = exports.rotr32L = exports.rotr32H = exports.rotrBL = exports.rotrBH = exports.rotrSL = exports.rotrSH = exports.shrSL = exports.shrSH = exports.toBig = void 0;
exports.fromBig = fromBig;
exports.split = split;
exports.add = add;
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
exports.toBig = toBig;
// for Shift in [0, 32)
const shrSH = (h, _l, s) => h >>> s;
exports.shrSH = shrSH;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
exports.shrSL = shrSL;
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
exports.rotrSH = rotrSH;
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
exports.rotrSL = rotrSL;
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
exports.rotrBH = rotrBH;
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
exports.rotrBL = rotrBL;
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h, l) => l;
exports.rotr32H = rotr32H;
const rotr32L = (h, _l) => h;
exports.rotr32L = rotr32L;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
exports.rotlSH = rotlSH;
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
exports.rotlSL = rotlSL;
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
exports.rotlBH = rotlBH;
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
exports.rotlBL = rotlBL;
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
exports.add3L = add3L;
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
exports.add3H = add3H;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
exports.add4L = add4L;
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
exports.add4H = add4H;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
exports.add5L = add5L;
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
exports.add5H = add5H;
// prettier-ignore
const u64 = {
    fromBig, split, toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
exports.default = u64;

},{}],177:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto = void 0;
exports.crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

},{}],178:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = void 0;
exports.keccakP = keccakP;
const _assert_js_1 = require("./_assert.js");
const _u64_js_1 = require("./_u64.js");
const utils_js_1 = require("./utils.js");
// SHA3 (keccak) is based on a new design: basically, the internal state is bigger than output size.
// It's called a sponge function.
// Various per round constants calculations
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _7n = /* @__PURE__ */ BigInt(7);
const _256n = /* @__PURE__ */ BigInt(256);
const _0x71n = /* @__PURE__ */ BigInt(0x71);
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n)
            t ^= _1n << ((_1n << /* @__PURE__ */ BigInt(j)) - _1n);
    }
    _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ (0, _u64_js_1.split)(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => (s > 32 ? (0, _u64_js_1.rotlBH)(h, l, s) : (0, _u64_js_1.rotlSH)(h, l, s));
const rotlL = (h, l, s) => (s > 32 ? (0, _u64_js_1.rotlBL)(h, l, s) : (0, _u64_js_1.rotlSL)(h, l, s));
// Same as keccakf1600, but allows to skip some rounds
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta θ
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
}
class Keccak extends utils_js_1.Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        // Can be passed from user as dkLen
        (0, _assert_js_1.number)(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        if (0 >= this.blockLen || this.blockLen >= 200)
            throw new Error('Sha3 supports only keccak-f1600 function');
        this.state = new Uint8Array(200);
        this.state32 = (0, utils_js_1.u32)(this.state);
    }
    keccak() {
        if (!utils_js_1.isLE)
            (0, utils_js_1.byteSwap32)(this.state32);
        keccakP(this.state32, this.rounds);
        if (!utils_js_1.isLE)
            (0, utils_js_1.byteSwap32)(this.state32);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        (0, _assert_js_1.exists)(this);
        const { blockLen, state } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        (0, _assert_js_1.exists)(this, false);
        (0, _assert_js_1.bytes)(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= blockLen)
                this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        (0, _assert_js_1.number)(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        (0, _assert_js_1.output)(out, this);
        if (this.finished)
            throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        this.state.fill(0);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
exports.Keccak = Keccak;
const gen = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapConstructor)(() => new Keccak(blockLen, suffix, outputLen));
exports.sha3_224 = gen(0x06, 144, 224 / 8);
/**
 * SHA3-256 hash function
 * @param message - that would be hashed
 */
exports.sha3_256 = gen(0x06, 136, 256 / 8);
exports.sha3_384 = gen(0x06, 104, 384 / 8);
exports.sha3_512 = gen(0x06, 72, 512 / 8);
exports.keccak_224 = gen(0x01, 144, 224 / 8);
/**
 * keccak-256 hash function. Different from SHA3-256.
 * @param message - that would be hashed
 */
exports.keccak_256 = gen(0x01, 136, 256 / 8);
exports.keccak_384 = gen(0x01, 104, 384 / 8);
exports.keccak_512 = gen(0x01, 72, 512 / 8);
const genShake = (suffix, blockLen, outputLen) => (0, utils_js_1.wrapXOFConstructorWithOpts)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === undefined ? outputLen : opts.dkLen, true));
exports.shake128 = genShake(0x1f, 168, 128 / 8);
exports.shake256 = genShake(0x1f, 136, 256 / 8);

},{"./_assert.js":175,"./_u64.js":176,"./utils.js":179}],179:[function(require,module,exports){
"use strict";
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
exports.isBytes = isBytes;
exports.byteSwap32 = byteSwap32;
exports.bytesToHex = bytesToHex;
exports.hexToBytes = hexToBytes;
exports.asyncLoop = asyncLoop;
exports.utf8ToBytes = utf8ToBytes;
exports.toBytes = toBytes;
exports.concatBytes = concatBytes;
exports.checkOpts = checkOpts;
exports.wrapConstructor = wrapConstructor;
exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
exports.randomBytes = randomBytes;
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
const crypto_1 = require("@noble/hashes/crypto");
const _assert_js_1 = require("./_assert.js");
// export { isBytes } from './_assert.js';
// We can't reuse isBytes from _assert, because somehow this causes huge perf issues
function isBytes(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
// Cast array to different type
const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
exports.u8 = u8;
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
exports.u32 = u32;
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
exports.createView = createView;
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
exports.rotr = rotr;
// The rotate left (circular left shift) operation for uint32
const rotl = (word, shift) => (word << shift) | ((word >>> (32 - shift)) >>> 0);
exports.rotl = rotl;
exports.isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// The byte swap operation for uint32
const byteSwap = (word) => ((word << 24) & 0xff000000) |
    ((word << 8) & 0xff0000) |
    ((word >>> 8) & 0xff00) |
    ((word >>> 24) & 0xff);
exports.byteSwap = byteSwap;
// Conditionally byte swap if on a big-endian platform
exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
// In place byte swap for Uint32Array
function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = (0, exports.byteSwap)(arr[i]);
    }
}
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
    (0, _assert_js_1.bytes)(bytes);
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
    }
    return hex;
}
// We use optimized technique to convert hex string to byte array
const asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16(char) {
    if (char >= asciis._0 && char <= asciis._9)
        return char - asciis._0;
    if (char >= asciis._A && char <= asciis._F)
        return char - (asciis._A - 10);
    if (char >= asciis._a && char <= asciis._f)
        return char - (asciis._a - 10);
    return;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
    }
    return array;
}
// There is no setImmediate in browser and setTimeout is slow.
// call of async fn will return Promise, which will be fullfiled only on
// next scheduler queue processing step and this is exactly what we need.
const nextTick = async () => { };
exports.nextTick = nextTick;
// Returns control to thread each 'tick' ms to avoid blocking
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await (0, exports.nextTick)();
        ts += diff;
    }
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    (0, _assert_js_1.bytes)(data);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_1.bytes)(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
exports.Hash = Hash;
const toStr = {}.toString;
function checkOpts(defaults, opts) {
    if (opts !== undefined && toStr.call(opts) !== '[object Object]')
        throw new Error('Options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
function wrapConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
function wrapXOFConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
    if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === 'function') {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    // Legacy Node.js compatibility
    if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === 'function') {
        return crypto_1.crypto.randomBytes(bytesLength);
    }
    throw new Error('crypto.getRandomValues must be defined');
}

},{"./_assert.js":175,"@noble/hashes/crypto":177}],180:[function(require,module,exports){
"use strict";
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytes = exports.stringToBytes = exports.str = exports.bytesToString = exports.hex = exports.utf8 = exports.bech32m = exports.bech32 = exports.base58check = exports.createBase58check = exports.base58xmr = exports.base58xrp = exports.base58flickr = exports.base58 = exports.base64urlnopad = exports.base64url = exports.base64nopad = exports.base64 = exports.base32crockford = exports.base32hexnopad = exports.base32hex = exports.base32nopad = exports.base32 = exports.base16 = exports.utils = void 0;
exports.assertNumber = assertNumber;
// Utilities
/**
 * @__NO_SIDE_EFFECTS__
 */
function assertNumber(n) {
    if (!Number.isSafeInteger(n))
        throw new Error(`Wrong integer: ${n}`);
}
function isBytes(a) {
    return (a instanceof Uint8Array ||
        (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array'));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function chain(...args) {
    const id = (a) => a;
    // Wrap call in closure so JIT can inline calls
    const wrap = (a, b) => (c) => a(b(c));
    // Construct chain of args[-1].encode(args[-2].encode([...]))
    const encode = args.map((x) => x.encode).reduceRight(wrap, id);
    // Construct chain of args[0].decode(args[1].decode(...))
    const decode = args.map((x) => x.decode).reduce(wrap, id);
    return { encode, decode };
}
/**
 * Encodes integer radix representation to array of strings using alphabet and back
 * @__NO_SIDE_EFFECTS__
 */
function alphabet(alphabet) {
    return {
        encode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('alphabet.encode input should be an array of numbers');
            return digits.map((i) => {
                assertNumber(i);
                if (i < 0 || i >= alphabet.length)
                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
                return alphabet[i];
            });
        },
        decode: (input) => {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('alphabet.decode input should be array of strings');
            return input.map((letter) => {
                if (typeof letter !== 'string')
                    throw new Error(`alphabet.decode: not string element=${letter}`);
                const index = alphabet.indexOf(letter);
                if (index === -1)
                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
                return index;
            });
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function join(separator = '') {
    if (typeof separator !== 'string')
        throw new Error('join separator should be string');
    return {
        encode: (from) => {
            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
                throw new Error('join.encode input should be array of strings');
            for (let i of from)
                if (typeof i !== 'string')
                    throw new Error(`join.encode: non-string input=${i}`);
            return from.join(separator);
        },
        decode: (to) => {
            if (typeof to !== 'string')
                throw new Error('join.decode input should be string');
            return to.split(separator);
        },
    };
}
/**
 * Pad strings array so it has integer number of bits
 * @__NO_SIDE_EFFECTS__
 */
function padding(bits, chr = '=') {
    assertNumber(bits);
    if (typeof chr !== 'string')
        throw new Error('padding chr should be string');
    return {
        encode(data) {
            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of data)
                if (typeof i !== 'string')
                    throw new Error(`padding.encode: non-string input=${i}`);
            while ((data.length * bits) % 8)
                data.push(chr);
            return data;
        },
        decode(input) {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of input)
                if (typeof i !== 'string')
                    throw new Error(`padding.decode: non-string input=${i}`);
            let end = input.length;
            if ((end * bits) % 8)
                throw new Error('Invalid padding: string should have whole number of bytes');
            for (; end > 0 && input[end - 1] === chr; end--) {
                if (!(((end - 1) * bits) % 8))
                    throw new Error('Invalid padding: string has too much padding');
            }
            return input.slice(0, end);
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function normalize(fn) {
    if (typeof fn !== 'function')
        throw new Error('normalize fn should be function');
    return { encode: (from) => from, decode: (to) => fn(to) };
}
/**
 * Slow: O(n^2) time complexity
 * @__NO_SIDE_EFFECTS__
 */
function convertRadix(data, from, to) {
    // base 1 is impossible
    if (from < 2)
        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
    if (to < 2)
        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
    if (!Array.isArray(data))
        throw new Error('convertRadix: data should be array');
    if (!data.length)
        return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data);
    digits.forEach((d) => {
        assertNumber(d);
        if (d < 0 || d >= from)
            throw new Error(`Wrong integer: ${d}`);
    });
    while (true) {
        let carry = 0;
        let done = true;
        for (let i = pos; i < digits.length; i++) {
            const digit = digits[i];
            const digitBase = from * carry + digit;
            if (!Number.isSafeInteger(digitBase) ||
                (from * carry) / from !== carry ||
                digitBase - digit !== from * carry) {
                throw new Error('convertRadix: carry overflow');
            }
            carry = digitBase % to;
            const rounded = Math.floor(digitBase / to);
            digits[i] = rounded;
            if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
                throw new Error('convertRadix: carry overflow');
            if (!done)
                continue;
            else if (!rounded)
                pos = i;
            else
                done = false;
        }
        res.push(carry);
        if (done)
            break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
        res.push(0);
    return res.reverse();
}
const gcd = /* @__NO_SIDE_EFFECTS__ */ (a, b) => (!b ? a : gcd(b, a % b));
const radix2carry = /*@__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
/**
 * Implemented with numbers, because BigInt is 5x slower
 * @__NO_SIDE_EFFECTS__
 */
function convertRadix2(data, from, to, padding) {
    if (!Array.isArray(data))
        throw new Error('convertRadix2: data should be array');
    if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
    if (radix2carry(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0; // bitwise position in current element
    const mask = 2 ** to - 1;
    const res = [];
    for (const n of data) {
        assertNumber(n);
        if (n >= 2 ** from)
            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
            res.push(((carry >> (pos - to)) & mask) >>> 0);
        carry &= 2 ** pos - 1; // clean carry, otherwise it will cause overflow
    }
    carry = (carry << (to - pos)) & mask;
    if (!padding && pos >= from)
        throw new Error('Excess padding');
    if (!padding && carry)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.push(carry >>> 0);
    return res;
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function radix(num) {
    assertNumber(num);
    return {
        encode: (bytes) => {
            if (!isBytes(bytes))
                throw new Error('radix.encode input should be Uint8Array');
            return convertRadix(Array.from(bytes), 2 ** 8, num);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix.decode input should be array of numbers');
            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
        },
    };
}
/**
 * If both bases are power of same number (like `2**8 <-> 2**64`),
 * there is a linear algorithm. For now we have implementation for power-of-two bases only.
 * @__NO_SIDE_EFFECTS__
 */
function radix2(bits, revPadding = false) {
    assertNumber(bits);
    if (bits <= 0 || bits > 32)
        throw new Error('radix2: bits should be in (0..32]');
    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
        throw new Error('radix2: carry overflow');
    return {
        encode: (bytes) => {
            if (!isBytes(bytes))
                throw new Error('radix2.encode input should be Uint8Array');
            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix2.decode input should be array of numbers');
            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function unsafeWrapper(fn) {
    if (typeof fn !== 'function')
        throw new Error('unsafeWrapper fn should be function');
    return function (...args) {
        try {
            return fn.apply(null, args);
        }
        catch (e) { }
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function checksum(len, fn) {
    assertNumber(len);
    if (typeof fn !== 'function')
        throw new Error('checksum fn should be function');
    return {
        encode(data) {
            if (!isBytes(data))
                throw new Error('checksum.encode: input should be Uint8Array');
            const checksum = fn(data).slice(0, len);
            const res = new Uint8Array(data.length + len);
            res.set(data);
            res.set(checksum, data.length);
            return res;
        },
        decode(data) {
            if (!isBytes(data))
                throw new Error('checksum.decode: input should be Uint8Array');
            const payload = data.slice(0, -len);
            const newChecksum = fn(payload).slice(0, len);
            const oldChecksum = data.slice(-len);
            for (let i = 0; i < len; i++)
                if (newChecksum[i] !== oldChecksum[i])
                    throw new Error('Invalid checksum');
            return payload;
        },
    };
}
// prettier-ignore
exports.utils = {
    alphabet, chain, checksum, convertRadix, convertRadix2, radix, radix2, join, padding,
};
// RFC 4648 aka RFC 3548
// ---------------------
exports.base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
exports.base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
exports.base32nopad = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), join(''));
exports.base32hex = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
exports.base32hexnopad = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), join(''));
exports.base32crockford = chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
exports.base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
exports.base64nopad = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), join(''));
exports.base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
exports.base64urlnopad = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), join(''));
// base58 code
// -----------
const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
exports.base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
exports.base58flickr = genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
exports.base58xrp = genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
// xmr ver is done in 8-byte blocks (which equals 11 chars in decoding). Last (non-full) block padded with '1' to size in XMR_BLOCK_LEN.
// Block encoding significantly reduces quadratic complexity of base58.
// Data len (index) -> encoded block len
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
exports.base58xmr = {
    encode(data) {
        let res = '';
        for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            res += exports.base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
        }
        return res;
    },
    decode(str) {
        let res = [];
        for (let i = 0; i < str.length; i += 11) {
            const slice = str.slice(i, i + 11);
            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
            const block = exports.base58.decode(slice);
            for (let j = 0; j < block.length - blockLen; j++) {
                if (block[j] !== 0)
                    throw new Error('base58xmr: wrong padding');
            }
            res = res.concat(Array.from(block.slice(block.length - blockLen)));
        }
        return Uint8Array.from(res);
    },
};
const createBase58check = (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), exports.base58);
exports.createBase58check = createBase58check;
// legacy export, bad name
exports.base58check = exports.createBase58check;
const BECH_ALPHABET = /* @__PURE__ */ chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
/**
 * @__NO_SIDE_EFFECTS__
 */
function bech32Polymod(pre) {
    const b = pre >> 25;
    let chk = (pre & 0x1ffffff) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
        if (((b >> i) & 1) === 1)
            chk ^= POLYMOD_GENERATORS[i];
    }
    return chk;
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod(chk) ^ (c >> 5);
    }
    chk = bech32Polymod(chk);
    for (let i = 0; i < len; i++)
        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
    for (let v of words)
        chk = bech32Polymod(chk) ^ v;
    for (let i = 0; i < 6; i++)
        chk = bech32Polymod(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function genBech32(encoding) {
    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
    const _words = radix2(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
        if (typeof prefix !== 'string')
            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
        if (words instanceof Uint8Array)
            words = Array.from(words);
        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
        if (prefix.length === 0)
            throw new TypeError(`Invalid prefix length ${prefix.length}`);
        const actualLength = prefix.length + 7 + words.length;
        if (limit !== false && actualLength > limit)
            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        const lowered = prefix.toLowerCase();
        const sum = bechChecksum(lowered, words, ENCODING_CONST);
        return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
    }
    function decode(str, limit = 90) {
        if (typeof str !== 'string')
            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
        if (str.length < 8 || (limit !== false && str.length > limit))
            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
        // don't allow mixed case
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
            throw new Error(`String must be lowercase or uppercase`);
        const sepIndex = lowered.lastIndexOf('1');
        if (sepIndex === 0 || sepIndex === -1)
            throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = lowered.slice(0, sepIndex);
        const data = lowered.slice(sepIndex + 1);
        if (data.length < 6)
            throw new Error('Data must be at least 6 characters long');
        const words = BECH_ALPHABET.decode(data).slice(0, -6);
        const sum = bechChecksum(prefix, words, ENCODING_CONST);
        if (!data.endsWith(sum))
            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode);
    function decodeToBytes(str) {
        const { prefix, words } = decode(str, false);
        return { prefix, words, bytes: fromWords(words) };
    }
    function encodeFromBytes(prefix, bytes) {
        return encode(prefix, toWords(bytes));
    }
    return {
        encode,
        decode,
        encodeFromBytes,
        decodeToBytes,
        decodeUnsafe,
        fromWords,
        fromWordsUnsafe,
        toWords,
    };
}
exports.bech32 = genBech32('bech32');
exports.bech32m = genBech32('bech32m');
exports.utf8 = {
    encode: (data) => new TextDecoder().decode(data),
    decode: (str) => new TextEncoder().encode(str),
};
exports.hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize((s) => {
    if (typeof s !== 'string' || s.length % 2)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
    return s.toLowerCase();
}));
// prettier-ignore
const CODERS = {
    utf8: exports.utf8, hex: exports.hex, base16: exports.base16, base32: exports.base32, base64: exports.base64, base64url: exports.base64url, base58: exports.base58, base58xmr: exports.base58xmr
};
const coderTypeError = 'Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr';
const bytesToString = (type, bytes) => {
    if (typeof type !== 'string' || !CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (!isBytes(bytes))
        throw new TypeError('bytesToString() expects Uint8Array');
    return CODERS[type].encode(bytes);
};
exports.bytesToString = bytesToString;
exports.str = exports.bytesToString; // as in python, but for bytes only
const stringToBytes = (type, str) => {
    if (!CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (typeof str !== 'string')
        throw new TypeError('stringToBytes() expects string');
    return CODERS[type].decode(str);
};
exports.stringToBytes = stringToBytes;
exports.bytes = exports.stringToBytes;

},{}],181:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],182:[function(require,module,exports){

},{}],183:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":181,"buffer":183,"ieee754":191}],184:[function(require,module,exports){
(function (process){(function (){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this)}).call(this,require('_process'))
},{"./common":185,"_process":201}],185:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":196}],186:[function(require,module,exports){
(function (process){(function (){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeVersion = exports.detectOS = exports.parseUserAgent = exports.browserName = exports.detect = exports.ReactNativeInfo = exports.BotInfo = exports.SearchBotDeviceInfo = exports.NodeInfo = exports.BrowserInfo = void 0;
var BrowserInfo = /** @class */ (function () {
    function BrowserInfo(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = 'browser';
    }
    return BrowserInfo;
}());
exports.BrowserInfo = BrowserInfo;
var NodeInfo = /** @class */ (function () {
    function NodeInfo(version) {
        this.version = version;
        this.type = 'node';
        this.name = 'node';
        this.os = process.platform;
    }
    return NodeInfo;
}());
exports.NodeInfo = NodeInfo;
var SearchBotDeviceInfo = /** @class */ (function () {
    function SearchBotDeviceInfo(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = 'bot-device';
    }
    return SearchBotDeviceInfo;
}());
exports.SearchBotDeviceInfo = SearchBotDeviceInfo;
var BotInfo = /** @class */ (function () {
    function BotInfo() {
        this.type = 'bot';
        this.bot = true; // NOTE: deprecated test name instead
        this.name = 'bot';
        this.version = null;
        this.os = null;
    }
    return BotInfo;
}());
exports.BotInfo = BotInfo;
var ReactNativeInfo = /** @class */ (function () {
    function ReactNativeInfo() {
        this.type = 'react-native';
        this.name = 'react-native';
        this.version = null;
        this.os = null;
    }
    return ReactNativeInfo;
}());
exports.ReactNativeInfo = ReactNativeInfo;
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
    ['aol', /AOLShield\/([0-9\._]+)/],
    ['edge', /Edge\/([0-9\._]+)/],
    ['edge-ios', /EdgiOS\/([0-9\._]+)/],
    ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
    ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['silk', /\bSilk\/([0-9._-]+)\b/],
    ['miui', /MiuiBrowser\/([0-9\.]+)$/],
    ['beaker', /BeakerBrowser\/([0-9\.]+)/],
    ['edge-chromium', /EdgA?\/([0-9\.]+)/],
    [
        'chromium-webview',
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
    ],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
    ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['fxios', /FxiOS\/([0-9\.]+)/],
    ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
    ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
    ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
    ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
    ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
    ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
    ['ie', /MSIE\s(7\.0)/],
    ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['facebook', /FB[AS]V\/([0-9\.]+)/],
    ['instagram', /Instagram\s([0-9\.]+)/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
    ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
    ['curl', /^curl\/([0-9\.]+)$/],
    ['searchbot', SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
    ['iOS', /iP(hone|od|ad)/],
    ['Android OS', /Android/],
    ['BlackBerry OS', /BlackBerry|BB10/],
    ['Windows Mobile', /IEMobile/],
    ['Amazon OS', /Kindle/],
    ['Windows 3.11', /Win16/],
    ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
    ['Windows 98', /(Windows 98)|(Win98)/],
    ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
    ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
    ['Windows Server 2003', /(Windows NT 5.2)/],
    ['Windows Vista', /(Windows NT 6.0)/],
    ['Windows 7', /(Windows NT 6.1)/],
    ['Windows 8', /(Windows NT 6.2)/],
    ['Windows 8.1', /(Windows NT 6.3)/],
    ['Windows 10', /(Windows NT 10.0)/],
    ['Windows ME', /Windows ME/],
    ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
    ['Open BSD', /OpenBSD/],
    ['Sun OS', /SunOS/],
    ['Chrome OS', /CrOS/],
    ['Linux', /(Linux)|(X11)/],
    ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
    ['QNX', /QNX/],
    ['BeOS', /BeOS/],
    ['OS/2', /OS\/2/],
];
function detect(userAgent) {
    if (!!userAgent) {
        return parseUserAgent(userAgent);
    }
    if (typeof document === 'undefined' &&
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return new ReactNativeInfo();
    }
    if (typeof navigator !== 'undefined') {
        return parseUserAgent(navigator.userAgent);
    }
    return getNodeVersion();
}
exports.detect = detect;
function matchUserAgent(ua) {
    // opted for using reduce here rather than Array#first with a regex.test call
    // this is primarily because using the reduce we only perform the regex
    // execution once rather than once for the test and for the exec again below
    // probably something that needs to be benchmarked though
    return (ua !== '' &&
        userAgentRules.reduce(function (matched, _a) {
            var browser = _a[0], regex = _a[1];
            if (matched) {
                return matched;
            }
            var uaMatch = regex.exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false));
}
function browserName(ua) {
    var data = matchUserAgent(ua);
    return data ? data[0] : null;
}
exports.browserName = browserName;
function parseUserAgent(ua) {
    var matchedRule = matchUserAgent(ua);
    if (!matchedRule) {
        return null;
    }
    var name = matchedRule[0], match = matchedRule[1];
    if (name === 'searchbot') {
        return new BotInfo();
    }
    // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
    var versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
    if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
            versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
    }
    else {
        versionParts = [];
    }
    var version = versionParts.join('.');
    var os = detectOS(ua);
    var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
    if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
    }
    return new BrowserInfo(name, version, os);
}
exports.parseUserAgent = parseUserAgent;
function detectOS(ua) {
    for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
            return os;
        }
    }
    return null;
}
exports.detectOS = detectOS;
function getNodeVersion() {
    var isNode = typeof process !== 'undefined' && process.version;
    return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
exports.getNodeVersion = getNodeVersion;
function createVersionParts(count) {
    var output = [];
    for (var ii = 0; ii < count; ii++) {
        output.push('0');
    }
    return output;
}

}).call(this)}).call(this,require('_process'))
},{"_process":201}],187:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],188:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readable_stream_1 = require("readable-stream");
class PortDuplexStream extends readable_stream_1.Duplex {
    /**
     * @param port - An instance of WebExtensions Runtime.Port. See:
     * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port}
     */
    constructor(port) {
        super({ objectMode: true });
        this._port = port;
        this._port.onMessage.addListener((msg) => this._onMessage(msg));
        this._port.onDisconnect.addListener(() => this._onDisconnect());
        this._log = () => null;
    }
    /**
     * Callback triggered when a message is received from
     * the remote Port associated with this Stream.
     *
     * @param msg - Payload from the onMessage listener of the port
     */
    _onMessage(msg) {
        if (Buffer.isBuffer(msg)) {
            const data = Buffer.from(msg);
            this._log(data, false);
            this.push(data);
        }
        else {
            this._log(msg, false);
            this.push(msg);
        }
    }
    /**
     * Callback triggered when the remote Port associated with this Stream
     * disconnects.
     */
    _onDisconnect() {
        this.destroy();
    }
    /**
     * Explicitly sets read operations to a no-op.
     */
    _read() {
        return undefined;
    }
    /**
     * Called internally when data should be written to this writable stream.
     *
     * @param msg - Arbitrary object to write
     * @param encoding - Encoding to use when writing payload
     * @param cb - Called when writing is complete or an error occurs
     */
    _write(msg, _encoding, cb) {
        try {
            if (Buffer.isBuffer(msg)) {
                const data = msg.toJSON();
                data._isBuffer = true;
                this._log(data, true);
                this._port.postMessage(data);
            }
            else {
                this._log(msg, true);
                this._port.postMessage(msg);
            }
        }
        catch (error) {
            return cb(new Error('PortDuplexStream - disconnected'));
        }
        return cb();
    }
    /**
     * Call to set a custom logger for incoming/outgoing messages
     *
     * @param log - the logger function
     */
    _setLogger(log) {
        this._log = log;
    }
}
exports.default = PortDuplexStream;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":183,"readable-stream":216}],189:[function(require,module,exports){
'use strict';

// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

},{}],190:[function(require,module,exports){
module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}

},{}],191:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],192:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],193:[function(require,module,exports){
'use strict';

const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function';

module.exports = isStream;

},{}],194:[function(require,module,exports){
module.exports={
  "CHROME_ID": "nkbihfbeogaeaoehlefnkodbefgpgknn",
  "FIREFOX_ID": "webextension@metamask.io"
}

},{}],195:[function(require,module,exports){
const { MetaMaskInpageProvider } = require('@metamask/providers')
const PortStream = require('extension-port-stream').default
const { detect } = require('detect-browser')
const browser = detect()
const config = require('./config.json')

module.exports = function createMetaMaskProvider () {
  let provider
  try {
    let currentMetaMaskId = getMetaMaskId()
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId)
    const pluginStream = new PortStream(metamaskPort)
    provider = new MetaMaskInpageProvider(pluginStream)
 } catch (e) {
    console.dir(`Metamask connect error `, e)
    throw e
  }
  return provider
}

function getMetaMaskId () {
  switch (browser && browser.name) {
    case 'chrome':
      return config.CHROME_ID
    case 'firefox':
      return config.FIREFOX_ID
    default:
      return config.CHROME_ID
  }
}


},{"./config.json":194,"@metamask/providers":28,"detect-browser":186,"extension-port-stream":188}],196:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],197:[function(require,module,exports){
var wrappy = require('wrappy')
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}

},{"wrappy":222}],198:[function(require,module,exports){
'use strict';

const { ErrorWithCause } = require('./lib/error-with-cause'); // linemod-replace-with: export { ErrorWithCause } from './lib/error-with-cause.mjs';

const { // linemod-replace-with: export {
  findCauseByReference,
  getErrorCause,
  messageWithCauses,
  stackWithCauses,
} = require('./lib/helpers'); // linemod-replace-with: } from './lib/helpers.mjs';

module.exports = {      // linemod-remove
  ErrorWithCause,       // linemod-remove
  findCauseByReference, // linemod-remove
  getErrorCause,        // linemod-remove
  stackWithCauses,      // linemod-remove
  messageWithCauses,    // linemod-remove
};                      // linemod-remove

},{"./lib/error-with-cause":199,"./lib/helpers":200}],199:[function(require,module,exports){
'use strict';

/** @template [T=undefined] */
class ErrorWithCause extends Error { // linemod-prefix-with: export
  /**
   * @param {string} message
   * @param {{ cause?: T }} options
   */
  constructor (message, { cause } = {}) {
    super(message);

    /** @type {string} */
    this.name = ErrorWithCause.name;
    if (cause) {
      /** @type {T} */
      this.cause = cause;
    }
    /** @type {string} */
    this.message = message;
  }
}

module.exports = {      // linemod-remove
  ErrorWithCause,       // linemod-remove
};                      // linemod-remove

},{}],200:[function(require,module,exports){
'use strict';

/**
 * @template {Error} T
 * @param {unknown} err
 * @param {new(...args: any[]) => T} reference
 * @returns {T|undefined}
 */
const findCauseByReference = (err, reference) => { // linemod-prefix-with: export
  if (!err || !reference) return;
  if (!(err instanceof Error)) return;
  if (
    !(reference.prototype instanceof Error) &&
    // @ts-ignore
    reference !== Error
  ) return;

  /**
   * Ensures we don't go circular
   *
   * @type {Set<Error>}
   */
  const seen = new Set();

  /** @type {Error|undefined} */
  let currentErr = err;

  while (currentErr && !seen.has(currentErr)) {
    seen.add(currentErr);

    if (currentErr instanceof reference) {
      return currentErr;
    }

    currentErr = getErrorCause(currentErr);
  }
};

/**
 * @param {Error|{ cause?: unknown|(()=>err)}} err
 * @returns {Error|undefined}
 */
const getErrorCause = (err) => { // linemod-prefix-with: export
  if (!err || typeof err !== 'object' || !('cause' in err)) {
    return;
  }

  // VError / NError style causes
  if (typeof err.cause === 'function') {
    const causeResult = err.cause();

    return causeResult instanceof Error
      ? causeResult
      : undefined;
  } else {
    return err.cause instanceof Error
      ? err.cause
      : undefined;
  }
};

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @returns {string}
 */
const _stackWithCauses = (err, seen) => {
  if (!(err instanceof Error)) return '';

  const stack = err.stack || '';

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return stack + '\ncauses have become circular...';
  }

  const cause = getErrorCause(err);

  // TODO: Follow up in https://github.com/nodejs/node/issues/38725#issuecomment-920309092 on how to log stuff

  if (cause) {
    seen.add(err);
    return (stack + '\ncaused by: ' + _stackWithCauses(cause, seen));
  } else {
    return stack;
  }
};

/**
 * @param {Error} err
 * @returns {string}
 */
const stackWithCauses = (err) => _stackWithCauses(err, new Set()); // linemod-prefix-with: export

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @param {boolean} [skip]
 * @returns {string}
 */
const _messageWithCauses = (err, seen, skip) => {
  if (!(err instanceof Error)) return '';

  const message = skip ? '' : (err.message || '');

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return message + ': ...';
  }

  const cause = getErrorCause(err);

  if (cause) {
    seen.add(err);

    const skipIfVErrorStyleCause = 'cause' in err && typeof err.cause === 'function';

    return (message +
      (skipIfVErrorStyleCause ? '' : ': ') +
      _messageWithCauses(cause, seen, skipIfVErrorStyleCause));
  } else {
    return message;
  }
};

/**
 * @param {Error} err
 * @returns {string}
 */
const messageWithCauses = (err) => _messageWithCauses(err, new Set()); // linemod-prefix-with: export

module.exports = {      // linemod-remove
  findCauseByReference, // linemod-remove
  getErrorCause,        // linemod-remove
  stackWithCauses,      // linemod-remove
  messageWithCauses,    // linemod-remove
};                      // linemod-remove

},{}],201:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],202:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

},{}],203:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

module.exports = Duplex;
var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');
require('inherits')(Duplex, Readable);
{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;
  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;
    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}
Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

// the no-half-open enforcer
function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(onEndNT, this);
}
function onEndNT(self) {
  self.end();
}
Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
}).call(this)}).call(this,require('_process'))
},{"./_stream_readable":205,"./_stream_writable":207,"_process":201,"inherits":192}],204:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;
var Transform = require('./_stream_transform');
require('inherits')(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":206,"inherits":192}],205:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

module.exports = Readable;

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;
var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

var Buffer = require('buffer').Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*<replacement>*/
var debugUtil = require('util');
var debug;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/buffer_list');
var destroyImpl = require('./internal/streams/destroy');
var _require = require('./internal/streams/state'),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = require('../errors').codes,
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;

// Lazy loaded to improve the startup performance.
var StringDecoder;
var createReadableStreamAsyncIterator;
var from;
require('inherits')(Readable, Stream);
var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}
function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'end' (and potentially 'finish')
  this.autoDestroy = !!options.autoDestroy;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options);

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex);

  // legacy
  this.readable = true;
  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }
  Stream.call(this);
}
Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;
  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }
  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};
function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  }

  // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.
  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}
function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }
  return er;
}
Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder;
  // If setEncoding(null), decoder.encoding equals utf8
  this._readableState.encoding = this._readableState.decoder.encoding;

  // Iterate over current buffer to convert already stored Buffers:
  var p = this._readableState.buffer.head;
  var content = '';
  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }
  this._readableState.buffer.clear();
  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
};

// Don't raise the hwm > 1GB
var MAX_HWM = 0x40000000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }
  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }
  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }
  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }
  if (ret !== null) this.emit('data', ret);
  return ret;
};
function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;
    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}
function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);
  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  }

  // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};
Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;
  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }
  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);
    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);
  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  return dest;
};
function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}
Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    for (var i = 0; i < len; i++) dests[i].emit('unpipe', this, {
      hasUnpiped: false
    });
    return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;
  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }
  return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);
  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);
  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;
  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true;

    // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}
function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()
    state.flowing = !state.readableListening;
    resume(this, state);
  }
  state.paused = false;
  return this;
};
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  debug('resume', state.reading);
  if (!state.reading) {
    stream.read(0);
  }
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}
Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  this._readableState.paused = true;
  return this;
};
function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;
  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }
    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };
  return this;
};
if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }
    return createReadableStreamAsyncIterator(this);
  };
}
Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
});

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);
  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length);

  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;
      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}
if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }
    return from(Readable, iterable, opts);
  };
}
function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":202,"./_stream_duplex":203,"./internal/streams/async_iterator":208,"./internal/streams/buffer_list":209,"./internal/streams/destroy":210,"./internal/streams/from":212,"./internal/streams/state":214,"./internal/streams/stream":215,"_process":201,"buffer":183,"events":187,"inherits":192,"string_decoder/":218,"util":182}],206:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;
var _require$codes = require('../errors').codes,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
  ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
var Duplex = require('./_stream_duplex');
require('inherits')(Transform, Duplex);
function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }
  ts.writechunk = null;
  ts.writecb = null;
  if (data != null)
    // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}
function prefinish() {
  var _this = this;
  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}
Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};
Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;
  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};
Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};
function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null)
    // single equals check for both `null` and `undefined`
    stream.push(data);

  // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
},{"../errors":202,"./_stream_duplex":203,"inherits":192}],207:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

var Buffer = require('buffer').Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
var destroyImpl = require('./internal/streams/destroy');
var _require = require('./internal/streams/state'),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = require('../errors').codes,
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
  ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
  ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
var errorOrDestroy = destroyImpl.errorOrDestroy;
require('inherits')(Writable, Stream);
function nop() {}
function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'finish' (and potentially 'end')
  this.autoDestroy = !!options.autoDestroy;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}
WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}
function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex);

  // legacy.
  this.writable = true;
  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }
  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};
function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END();
  // TODO: defer error events consistently everywhere, not just the cb
  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var er;
  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }
  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }
  return true;
}
Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);
  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};
Writable.prototype.cork = function () {
  this._writableState.corked++;
};
Writable.prototype.uncork = function () {
  var state = this._writableState;
  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};
Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}
Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }
    if (entry === null) state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};
Writable.prototype._writev = null;
Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;
  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending) endWritable(this, state, cb);
  return this;
};
Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      errorOrDestroy(stream, err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;
        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}
function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  // reuse the free corkReq.
  state.corkedRequestsFree.next = corkReq;
}
Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":202,"./_stream_duplex":203,"./internal/streams/destroy":210,"./internal/streams/state":214,"./internal/streams/stream":215,"_process":201,"buffer":183,"inherits":192,"util-deprecate":220}],208:[function(require,module,exports){
(function (process){(function (){
'use strict';

var _Object$setPrototypeO;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var finished = require('./end-of-stream');
var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');
function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}
function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}
function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}
function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}
var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },
  next: function next() {
    var _this = this;
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return Promise.reject(error);
    }
    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }
    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise;
    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }
      promise = new Promise(this[kHandlePromise]);
    }
    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;
  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);
var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;
  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();
      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject];
      // reject if we are waiting for data in the Promise
      // returned by next() and store the error
      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }
      iterator[kError] = err;
      return;
    }
    var resolve = iterator[kLastResolve];
    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }
    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};
module.exports = createReadableStreamAsyncIterator;
}).call(this)}).call(this,require('_process'))
},{"./end-of-stream":211,"_process":201}],209:[function(require,module,exports){
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _require = require('buffer'),
  Buffer = _require.Buffer;
var _require2 = require('util'),
  inspect = _require2.inspect;
var custom = inspect && inspect.custom || 'inspect';
function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}
module.exports = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck(this, BufferList);
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }

    // Consumes a specified amount of bytes or characters from the buffered data.
  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;
      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    }

    // Consumes a specified amount of characters from the buffered data.
  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Consumes a specified amount of bytes from the buffered data.
  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Make sure the linked list only shows the minimal necessary information.
  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);
  return BufferList;
}();
},{"buffer":183,"util":182}],210:[function(require,module,exports){
(function (process){(function (){
'use strict';

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;
  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;
  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }
  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });
  return this;
}
function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}
function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}
function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }
  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}
function emitErrorNT(self, err) {
  self.emit('error', err);
}
function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.

  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}
module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this)}).call(this,require('_process'))
},{"_process":201}],211:[function(require,module,exports){
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).

'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    callback.apply(this, args);
  };
}
function noop() {}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;
  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };
  var writableEnded = stream._writableState && stream._writableState.finished;
  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };
  var readableEnded = stream._readableState && stream._readableState.endEmitted;
  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };
  var onerror = function onerror(err) {
    callback.call(stream, err);
  };
  var onclose = function onclose() {
    var err;
    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };
  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };
  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }
  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}
module.exports = eos;
},{"../../../errors":202}],212:[function(require,module,exports){
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

},{}],213:[function(require,module,exports){
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).

'use strict';

var eos;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}
var _require$codes = require('../../../errors').codes,
  ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true;

    // request.destroy just do .end - .abort is what we want
    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}
function call(fn) {
  fn();
}
function pipe(from, to) {
  return from.pipe(to);
}
function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}
function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }
  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }
  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}
module.exports = pipeline;
},{"../../../errors":202,"./end-of-stream":211}],214:[function(require,module,exports){
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }
    return Math.floor(hwm);
  }

  // Default value
  return state.objectMode ? 16 : 16 * 1024;
}
module.exports = {
  getHighWaterMark: getHighWaterMark
};
},{"../../../errors":202}],215:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":187}],216:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
exports.finished = require('./lib/internal/streams/end-of-stream.js');
exports.pipeline = require('./lib/internal/streams/pipeline.js');

},{"./lib/_stream_duplex.js":203,"./lib/_stream_passthrough.js":204,"./lib/_stream_readable.js":205,"./lib/_stream_transform.js":206,"./lib/_stream_writable.js":207,"./lib/internal/streams/end-of-stream.js":211,"./lib/internal/streams/pipeline.js":213}],217:[function(require,module,exports){
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":183}],218:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":217}],219:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":201,"timers":219}],220:[function(require,module,exports){
(function (global){(function (){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],221:[function(require,module,exports){
(function (setImmediate){(function (){
/*! For license information please see web3.min.js.LICENSE.txt */

}).call(this)}).call(this,require("timers").setImmediate)
},{"timers":219}],222:[function(require,module,exports){
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}],223:[function(require,module,exports){
const createMetaMaskProvider = require("metamask-extension-provider");
// const axios = require('axios');
const Web3 = require('web3');

let provider = createMetaMaskProvider();
let chainIdCont = null;
let accountAddress = provider.selectedAddress;

provider.on("chainChanged", (chainId) => {
    console.log("chainChanged", chainId);
    // onUpdateChainID(parseInt(chainId));
    chainIdCont = parseInt(chainId);  // Update the chainId variable
});
provider.on("disconnect", (error) => {
    console.log("disconnect", error);
    chrome.runtime.sendMessage({ action: "WALLET_DISCONNECTED" });

});
provider.on("connect", (connectInfo) => {
    console.log("connect", connectInfo);
    // onUpdateChainID(parseInt(connectInfo.chainId));
    chrome.runtime.sendMessage({ action: "WALLET_CONNECTED", data: connectInfo });

});
provider.on("accountsChanged", (accounts) => {
    console.log("accountsChanged", accounts);
    // onAccountChange(accounts[0]);

    if (accounts.length > 0) {
        accountAddress = accounts[0];  // Update the accountAddress variable
    } else {
        accountAddress = null;  // No accounts connected
    }
} );



async function connectWallet() {
    // console.log("connect wallet", ethers);
    console.log("provider", provider);
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // const provider = await detectEthereumProvider()
    if (provider) {
        // Prompt user for account connections
        // await checkNetwork();
        await provider.request({ method: 'eth_requestAccounts' });
        const account = provider.selectedAddress;
        console.log(":connectWallet:", account)
        // onAccountChange(account);

         // Send provider data to the background or popup
        chrome.runtime.sendMessage({
            action: "WALLET_CONNECTED",
            provider: provider,
            accountAddress: provider.selectedAddress,
            chainId: "84532"
        });
    } else {
        alert("no provider");
    }
}

// const mintFunc = async () =>
//   {
//     try {
//       const data = {
//         userAddress: "0x20613aBe93e4611Cf547b4395E4248c6129c8697",
//         chainId: '0x14a34',
//         tokenName: `testing name`,
//         tokenSymbol: `testing`,
//         maxSupply: '10000000909090909090909000098098',
//         fundingGoal: '100000000000000000000',
//         amount: '500000000000000',
//       }

//       const response = await axios.post(
//         'https://magicmeme-backend.potp.xyz/memehub/getCreateCalldata',
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       console.log("response =========>>>>>>>>>",response.data)

//       const callData = response.data.data

//       const web3 = new Web3(provider)



//       const transactionData = {
//         data: callData.calldata,
//         to: callData.to,
//         from: callData.from,
//         value: callData.value,
//         gasLimit: 800000,
//       }

//       console.log('send transaction function ======>>>>>>>', transactionData)

//       const signedTx = await web3.eth.sendTransaction( transactionData )

//       console.log('Transaction successful, hash: ========>>>>>>>>', signedTx.transactionHash)

//       await addMemeDetails(signedTx.transactionHash)

//       return  signedTx

//     } catch (e) {
//       console.log('error =======>>>>>>>>', e)
//     }
// }


const mintFunc = async (memeName, symbol, amountInWei, desc, logoUrl) => {
    console.log("account address from ==============>", provider.selectedAddress);
    console.log("caling mint function properly ===========>>>>>>")
    try {
        const data = {
            // userAddress: `${provider.selectedAddress}`,
            userAddress: "0x6AEEb12fe14b7DAE54277e6bb0042466E2161bF8",
            chainId: '84532', //84532
            tokenName: `${memeName}`,
            tokenSymbol: `${symbol}`,
            maxSupply: '10000000909090909090909000098098',
            fundingGoal: '100000000000000000000',
            amount: `${amountInWei}`,
        };

        const response = await fetch('https://magicmeme-backend.potp.xyz/memehub/getCreateCalldata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("response =========>>>>>>>>>", responseData);

        const callData = responseData.data;
        const web3 = new Web3(provider);

        const transactionData = {
            data: callData.calldata,
            to: callData.to,
            from: callData.from,
            value: callData.value,
            gasLimit: 850000,
        };

        console.log('send transaction function ======>>>>>>>', transactionData);

        const signedTx = await web3.eth.sendTransaction(transactionData);
        console.log('Transaction successful, hash: ========>>>>>>>>', signedTx.transactionHash);

        // let tranhash = `0x7533b6eefc47d4c5b4a96e5b4070779afb8e7ec075b0562db901c36c106bf4cd`;
        await addMemeDetails(signedTx.transactionHash, memeName, symbol, desc, logoUrl);
        return signedTx;

    } catch (e) {
        console.log('error =======>>>>>>>>', e);

    }
};


const addMemeDetails = async (tranHash, memeName, symbol, desc, logoUrl) => {
    try {
        const response = await fetch('https://magicmeme-backend.potp.xyz/memehub/addDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userAddress: provider.selectedAddress,
                chainId: '84532',
                symbol: symbol,
                fullname: memeName,
                description: desc,
                logo: logoUrl,
                transactionHash: tranHash,
            }),
        });

        if (!response.ok) {
            // If the response status is not OK, handle the error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        console.log('Response from addMemeDetails function:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);

    if (request.action === "mint") {
        const { memeName, symbol, amount, desc, logoUrl } = request;  // Extract memeName and symbol from request object
        console.log("Message received:", memeName, symbol, amount, desc, logoUrl);
        const amountInWei = Web3.utils.toWei(amount, 'ether'); // Convert to wei

        mintFunc(memeName, symbol, amountInWei, desc, logoUrl)  // Pass memeName and symbol to mintFunc
            .then((result) => {
                console.log("Mint function result:", result);
                sendResponse({ status: 'success', data: result });
            })
            .catch((error) => {
                console.error("Mint function error:", error);
                sendResponse({ status: 'error', error: error.message });
            });

        return true; // Keep the message channel open for async response
    }
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'CONNECT_WALLET') {
        connectWallet()
            .then(() => {
                sendResponse({ status: 'success' });
            })
            .catch((error) => {
                sendResponse({ status: 'error', message: error.message });
            });
        return true; // Keep the message channel open for async response
    }
});

// To reset extension's state on new session
const initialColors = [
    "yellow",
    "green",
    "cyan",
    "gray",
    "orange",
    "pink",
    "blue",
    "purple",
    "rose",
    "teal",
];

chrome.storage.local.set({
    highlightedWords: [], availableColors: initialColors,
    chatInputValue: "", chatResponseValue: "", chatWasSubmitted: false,
    summaryInputValue: "", summaryResponseValue: "", summaryWasSubmitted: false
});

const messagesFromReactAppListener = (message, sender, response) => {

    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message === 'Get page text') {
        const pageText = document.body.innerText;
        response(pageText);
    }


    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("highlight")) {
        let splits = message.message.split(" ");
        const searchTerm = splits[1];
        const className = "highColor" + splits[2].charAt(0).toUpperCase() + splits[2].slice(1);
        const searchTermRegex = new RegExp(searchTerm, 'gi'); // 'g' for global match and 'i' for case insensitive

        // Function to recursively traverse and highlight text nodes
        function highlightTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const matches = node.nodeValue.match(searchTermRegex);
                if (matches) {
                    const span = document.createElement('span');
                    span.innerHTML = node.nodeValue.replace(searchTermRegex, (match) => `<span class=${className}>${match}</span>`);
                    node.parentNode.replaceChild(span, node);
                }
            } else {
                for (let child of node.childNodes) {
                    highlightTextNodes(child);
                }
            }
        }

        highlightTextNodes(document.body);
        response("Done")
    }

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("unhighlight")) {
        let splits = message.message.split(" ");
        const className = "highColor" + splits[1].charAt(0).toUpperCase() + splits[1].slice(1);
        const highlightedElements = document.querySelectorAll(`span.${className}`);

        highlightedElements.forEach(element => {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.innerText), element);
            parent.normalize(); // Merge adjacent text nodes
        });

        response("Done")
    }
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);










let debounceTimer;
function debouncedDoSomething() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSomething, 3000);
    // debounceTimer = setTimeout(getWarpcastText, 3000);

}
function debouncedWarpcast() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(getWarpcastText, 1000);

}
function debouncedTwitter() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(getTwitterText, 1000);

}

function getEmojiForLabel(label) {
    const emojiMap = {
        // Topics
        "arts_culture": "🎨",
        "business_entrepreneurs": "💼",
        "celebrity_pop_culture": "🌟",
        "diaries_daily_life": "📔",
        "family": "👨‍👩‍👧‍👦",
        "fashion_style": "👗",
        "film_tv_video": "🎬",
        "fitness_health": "💪",
        "food_dining": "🍽️",
        "gaming": "🎮",
        "learning_educational": "📚",
        "music": "🎵",
        "news_social_concern": "📰",
        "other_hobbies": "🎲",
        "relationships": "💞",
        "science_technology": "💻",
        "sports": "🏅",
        "travel_adventure": "✈️",
        "youth_student_life": "🎓",
        // Sentiment
        "positive": "😊",
        "neutral": "😐",
        "negative": "😠",
        // Emotion
        "anger": "😡",
        "anticipation": "🔮",
        "disgust": "🤢",
        "fear": "😨",
        "joy": "😂",
        "love": "❤️",
        "optimism": "👍",
        "pessimism": "👎",
        "sadness": "😢",
        "surprise": "😲",
        "trust": "🤝",
    };

    return emojiMap[label] || "❓"; // Default to question mark if label not found
}

const iconsAbove50 = {
    "llm_generated": "🤖",
    "spam": "🔺",
    "sexual": "🔞",
    "hate": "😡",
    "violence": "⚔️",
    "harassment": "🚷",
    "self_harm": "🆘",
    "sexual_minors": "🚸",
    "hate_threatening": "🚨",
    "violence_graphic": "💥"
};

const iconsBelow50 = {
    "llm_generated": "👾", // Different icon or the same, depending on your preference
    "spam": "▼",
    "sexual": "🙈",
    "hate": "😠",
    "violence": "🛡️",
    "harassment": "🛑",
    "self_harm": "🚑",
    "sexual_minors": "👶",
    "hate_threatening": "⚠️",
    "violence_graphic": "🔨"
};

// Function to get the appropriate icon based on score
function getIcon(category, score) {
    if (score > 0.5) {
        return iconsAbove50[category];
    } else {
        return iconsBelow50[category];
    }
}

function getWarpcastText() {
    try {

        let text = document.getElementsByClassName("flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal")[0].innerText

        chrome.runtime.sendMessage({
            action: 'SEND_WARPCAST_TEXT',
            data: text
        });

    } catch (error) {
        console.log("error in getwrapcat ======>>>>>", error)

    }


}

function getTwitterText() {
    const parts = window.location.href.split('/');
    if (parts.length === 6) {
        let text_twitter = document.getElementsByClassName("css-175oi2r r-1s2bzr4")[0]?.innerText;

        chrome.runtime.sendMessage({
            action: 'SEND_WARPCAST_TEXT',
            data: text_twitter
        });
        console.log(text_twitter);
    }
}

function openPopupTwitter() {
    chrome.runtime.sendMessage({ action: "open_popup" });
    debouncedTwitter();

}


function openPoup() {
    chrome.runtime.sendMessage({ action: "open_popup" });
    debouncedWarpcast();

}




function doSomething() {


    const parts = window.location.href.split('/');

    console.log(parts.length);
    console.log(parts);

    if (parts.length === 4 && parts[2] == "x.com") {
        let username = parts[3];
        console.log("username from twitter ======", username);
    
        const div = document.querySelector('div[data-testid="UserName"]');
    
        // Create the new button element
        const button = document.createElement('button');
        button.textContent = 'Swap';
    
        // Add styles directly to the button
        button.style.backgroundColor = '#e7e8e9';  // light gray background
        button.style.border = 'none';
        button.style.borderRadius = '50px';        // rounded edges
        button.style.padding = '10px 20px';        // space inside the button
        button.style.color = 'black';              // text color
        button.style.fontSize = '16px';            // text size
        button.style.cursor = 'pointer';           // shows pointer on hover
        button.style.fontFamily = 'Arial, sans-serif'; // font style
        button.style.fontWeight = 'bold';          // bold text
        button.style.width = '90px';              // set button width
        button.style.marginBottom = '10px';            // set margin (10px top and bottom)
    
        // Add hover effect (using JavaScript)
        button.addEventListener('mouseenter', function () {
            button.style.backgroundColor = '#d6d7d8'; // darker gray on hover
        });
        button.addEventListener('mouseleave', function () {
            button.style.backgroundColor = '#e7e8e9'; // return to original color
        });
    
        // Insert the button after the div
        // div.insertAdjacentElement('afterend', button);
        div.appendChild(button);
    }
    

    if (parts.length === 6) {
        let text_twitter = document.getElementsByClassName("css-175oi2r r-1s2bzr4")[0]?.innerText
        console.log('twitter text : ', text_twitter);


        let globalData1 = null;
        let loadingInterval = null;

        if (!document.getElementById("uniqueId0")) {
            const outerDivx = document.createElement('div');
            outerDivx.id = 'uniqueId0';
            outerDivx.className = 'css-175oi2r r-1kbdv8c r-18u37iz r-1oszu61 r-3qxfft r-n7gxbd r-2sztyj r-1efd50x r-5kkj8d r-h3s6tt r-1wtj0ep';

            const svgIcon = `<svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="20" stroke="#061F30" stroke-width="5" fill="none"/>
                <circle cx="25" cy="25" r="20" stroke="#1D97EB" stroke-width="5" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
                  <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
              `;

            // Create a span for the loading text
            const loadingText = document.createElement('span');
            loadingText.textContent = 'Loading';
            loadingText.style.marginLeft = '10px'; // Add some space between the SVG and the text

            outerDivx.innerHTML = svgIcon;
            outerDivx.appendChild(loadingText);


            const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


            // Insert outerDivx after the target element
            if (targetElement) {
                targetElement.insertAdjacentElement('afterend', outerDivx);
            }


            let dotCount = 0;
            loadingInterval = setInterval(() => {
                dotCount = (dotCount % 3) + 1;
                loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
            }, 500);

        }


    //     const newDiv = document.createElement('div');
    //     newDiv.id = "uniqueId6";
    //     const svgIcon = `<svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    //     <circle cx="25" cy="25" r="20" stroke="#061F30" stroke-width="5" fill="none"/>
    //     <circle cx="25" cy="25" r="20" stroke="#1D97EB" stroke-width="5" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
    //       <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="1s" repeatCount="indefinite"/>
    //     </circle>
    //   </svg>`;

    //     newDiv.innerHTML = '<div class="flex flex-col"><h3>Sentiplex Summary</h3><p>' + svgIcon + '</p></div>';

    //     // Select the target element
    //     const targetElement = document.querySelector('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');

    //     // Insert newDiv before targetElement
    //     targetElement.parentNode.insertBefore(newDiv, targetElement);


        // URLs for the APIs
        const url_1 = 'https://content-analysis.onrender.com/api/label-text';
        const url_2 = 'https://content-analysis.onrender.com/vision/gpt-4o';
        const url_3 = 'https://content-analysis.onrender.com/vision/mixtral-8x7b';
        const url_4 = 'https://content-analysis.onrender.com/vision/llama-3';
        const url_5 = 'https://content-analysis.onrender.com/onchain/send-message';
        const url_6 = 'https://content-analysis.onrender.com/vision/gpt-4o';

        // Data for the POST requests
        const data_1 = JSON.stringify({ text_inputs: [text_twitter] });
        const sumarize = "Give me a brief and crisp summary of this text: " + "'" + text_twitter + "'"
        text_twitter = "Give me an estimate of authenticity of this post. Don't give any explanations, just a number from 1 to 100: " + "'" + text_twitter + "'"
        console.log('text', text_twitter);
        const data_2 = JSON.stringify({ content: text_twitter });
        const data_3 = JSON.stringify({ content: text_twitter });
        const data_4 = JSON.stringify({ content: text_twitter });
        const data_5 = JSON.stringify({ message: text_twitter });
        const data_6 = JSON.stringify({ content: sumarize });

        // Fetch requests
        const fetch_1 = fetch(url_1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_1 });
        const fetch_2 = fetch(url_2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_2 });
        const fetch_3 = fetch(url_3, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_3 });
        const fetch_4 = fetch(url_4, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_4 });
        const fetch_5 = fetch(url_5, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_5 });
        const fetch_6 = fetch(url_6, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_6 });


        Promise.all([fetch_1, fetch_2, fetch_3, fetch_4, fetch_5, fetch_6])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([data_1, data_2, data_3, data_4, data_5, data_6]) => {
                clearInterval(loadingInterval);
                document.getElementById('uniqueId0').remove();
                // document.getElementById('uniqueId6').remove();

                console.log('twitter_Data from API 1:', data_1);
                console.log('Data from API 2:', data_2.content);
                console.log('Data from API 3:', data_3.content);
                console.log('Data from API 4:', data_4.content);
                console.log('Data from API 5:', data_5.response);
                console.log('Data from API 6:', data_6.content);

                // Step 1: Create an array with all values
                const values1 = [data_2.content, data_3.content, data_4.content, data_5.response]
                    .map(Number) // Convert all values to numbers
                    .filter(val => !isNaN(val) && val <= 100); // Filter out NaN values and values greater than 100

                // Step 3: Calculate the average of the remaining values
                const average1 = values1.length > 0 ? values1.reduce((acc, val) => acc + val, 0) / values1.length : 0;
                console.log('Average of twitter_post:', average1);


                // Check if the element already exists
                // Check if uniqueId0 already exists
                // if (!document.getElementById("uniqueId0")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId0';
                //     outerDivx.className = 'css-175oi2r r-1kbdv8c r-18u37iz r-1oszu61 r-3qxfft r-n7gxbd r-2sztyj r-1efd50x r-5kkj8d r-h3s6tt r-1wtj0ep';

                //     const innerDiv = document.createElement('div');
                //     innerDiv.id = 'firstIcon';
                //     innerDiv.style.paddingTop = "10px";
                //     // Determine fill color based on average1 value
                //     const fillColor = average1 > 70 ? '#4CAF50' : average1 < 40 ? '#F44336' : '#FFEB3B';

                //     // SVG icon with dynamic fill color
                //     innerDiv.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                //                   <circle cx="12" cy="12" r="10" fill="${fillColor}"/>
                //                </svg>`;

                //     // Set tooltip title with data contents
                //     innerDiv.title = `GPT-4o: ${data_2.content}%\nMixtral-8x7b: ${data_3.content}%\nLlama-3: ${data_4.content}%\nClaude 3.5 Sonnet: ${data_5.response}%`;

                //     outerDivx.appendChild(innerDiv);
                //     // Select the target element
                //     const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


                //     // Insert outerDivx after the target element
                //     if (targetElement) {
                //         targetElement.insertAdjacentElement('afterend', outerDivx);
                //     }
                // }


                globalData1 = data_1;


                // if (!document.getElementById("uniqueId1")) {
                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId1';

                //     const svgIcon = getEmojiForLabel(globalData1.topics.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.topics.label + ' ' + Math.round(globalData1.topics.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }

                // if (!document.getElementById("uniqueId2")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId2';

                //     const svgIcon = getEmojiForLabel(globalData1.sentiment.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.sentiment.label + ' ' + Math.round(globalData1.sentiment.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }


                // if (!document.getElementById("uniqueId3")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId3';

                //     const svgIcon = getEmojiForLabel(globalData1.moderation.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.moderation.label + ' ' + Math.round(globalData1.moderation.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);

                // }


                // if (!document.getElementById("uniqueId4")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId4';


                //     const svgIcon = getEmojiForLabel(globalData1.emotion.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.emotion.label + ' ' + Math.round(globalData1.emotion.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }




                if (!document.getElementById("uniqueButton")) {

                    const outerDivx = document.createElement('div');
                    outerDivx.id = 'uniqueButton';
                    outerDivx.style.paddingTop = "10px";
                    // Create the button element
                    const button = document.createElement('button');
                    button.innerHTML = "CreateAiAgent";  // Set button text
                    button.id = "btn_unique";

                    // Add inline style to match the button in the image
                    button.style.backgroundColor = '#f2f2f2';  // Light background
                    button.style.color = '#000';  // Black text
                    button.style.border = '1px solid #d1d1d1';  // Light gray border
                    button.style.padding = '8px 16px';  // Padding
                    button.style.borderRadius = '20px';  // Rounded corners
                    button.style.fontSize = '14px';  // Font size
                    button.style.fontFamily = 'Arial, sans-serif';  // Font family
                    button.style.cursor = 'pointer';  // Cursor change on hover
                    button.style.outline = 'none';  // Remove outline on focus
                    button.style.fontWeight = 'bold';
                    button.style.marginLeft = '10px';
                    // Add event listeners for hover and active states
                    button.onmouseover = function () {
                        button.style.backgroundColor = '#e0e0e0';  // Slightly darker on hover
                    };

                    button.onmouseout = function () {
                        button.style.backgroundColor = '#f2f2f2';  // Revert to original color
                    };

                    button.onmousedown = function () {
                        button.style.backgroundColor = '#d1d1d1';  // Darker when clicked
                    };

                    button.onmouseup = function () {
                        button.style.backgroundColor = '#e0e0e0';  // Go back to hover state
                    };

                    button.onclick = function () {
                        openPopupTwitter();
                    };

                    // Add the button to the div
                    outerDivx.appendChild(button);

                    // const targetElement = document.querySelector('#uniqueId0');
                    // targetElement.appendChild(outerDivx);

                    const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


                    // Insert outerDivx after the target element
                    if (targetElement) {
                        targetElement.insertAdjacentElement('afterend', outerDivx);
                    }
                }





                // const newDiv = document.createElement('div');
                // newDiv.id = "uniqueId6";
                // newDiv.innerHTML = '<div class="flex flex-col"><h3>Sentiplex Summary</h3><p>' + data_6.content + '</p></div>';

                // // Select the target element
                // const targetElement = document.querySelector('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');

                // // Insert newDiv before targetElement
                // targetElement.parentNode.insertBefore(newDiv, targetElement);



            })
            .catch(error => {
                console.error('Error:', error);
            });







    }






    // if (parts.length === 5) {
    //     let text = document.getElementsByClassName("flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal")[0].innerText
    //     console.log('text =========>>>>>>>>', text);
    //     // flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal

    //     let globalData = null;
    //     let loadingInterval = null;

    //     if (!document.getElementById("uniqueElementId0")) {
    //         const outerDiv = document.createElement('div');
    //         outerDiv.id = "uniqueElementId0"; // Set a unique ID for the outer div
    //         outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //         // group flex w-9 flex-row items-center text-sm text-faint cursor-pointer

    //         const innerDiv = document.createElement('div');
    //         innerDiv.className = "group flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //         // const svgIcon = `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><filter id="spinner-gF01"><feGaussianBlur in="SourceGraphic" stdDeviation="1" result="y"/><feColorMatrix in="y" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="z"/><feBlend in="SourceGraphic" in2="z"/></filter></defs><g filter="url(#spinner-gF01)"><circle fill="#1F51FF" cx="5" cy="12" r="4"><animate attributeName="cx" calcMode="spline" dur="2s" values="5;8;5" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite"/></circle><circle fill="#1F51FF" cx="19" cy="12" r="4"><animate attributeName="cx" calcMode="spline" dur="2s" values="19;16;19" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>`;

    //         const svgIcon = `<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#999999">
    //         <!-- Background circle with white stroke -->
    //         <circle cx="50" cy="50" r="45" stroke="#ffffff" stroke-width="5" fill="none" />
            
    //         <!-- Foreground animated circle -->
    //         <circle cx="50" cy="50" r="45" stroke="#999999" stroke-width="5" fill="none" stroke-dasharray="283" stroke-dashoffset="75">
    //           <animateTransform
    //             attributeName="transform"
    //             type="rotate"
    //             values="0 50 50;360 50 50"
    //             dur="1s"
    //             repeatCount="indefinite" />
    //         </circle>
    //       </svg>`;
    //         // Create a span for the loading text
    //         const loadingText = document.createElement('span');
    //         loadingText.textContent = 'Loading';
    //         loadingText.style.marginLeft = '10px'; // Add some space between the SVG and the text

    //         innerDiv.innerHTML = svgIcon;
    //         innerDiv.appendChild(loadingText);
    //         outerDiv.appendChild(innerDiv);

    //         const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //         targetElement.appendChild(outerDiv);


    //         let dotCount = 0;
    //         loadingInterval = setInterval(() => {
    //             dotCount = (dotCount % 3) + 1;
    //             loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
    //         }, 500);

    //     }

    //     const newDiv = document.createElement('div');
    //     newDiv.id = "uniqueElementId6";
    //     const svgIcon = `<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#999999">
    //     <!-- Background circle with white stroke -->
    //     <circle cx="50" cy="50" r="45" stroke="#F6F6F6" stroke-width="5" fill="none" />
        
    //     <!-- Foreground animated circle -->
    //     <circle cx="50" cy="50" r="45" stroke="#999999" stroke-width="5" fill="none" stroke-dasharray="283" stroke-dashoffset="75">
    //       <animateTransform
    //         attributeName="transform"
    //         type="rotate"
    //         values="0 50 50;360 50 50"
    //         dur="1s"
    //         repeatCount="indefinite" />
    //     </circle>
    //   </svg>`;

    //     newDiv.innerHTML = '<div class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="px-2 py-1 text-lg font-semibold">The X Agent Summary</div><div class="flex justify-center items-center px-2 py-4 text-sm text-muted">' + svgIcon + '</div><div class="flex flex-col items-center pt-1"><button id="copyButton" class="rounded-lg font-semibold border bg-action-tertiary border-action-tertiary hover:bg-action-tertiary-hover hover:border-action-tertiary-hover active:border-action-tertiary-active disabled:border-action-tertiary disabled:text-action-tertiary-disabled disabled:hover:bg-action-tertiary disabled:active:border-action-tertiary px-4 py-2 text-sm w-full" disabled>Copy to clipboard</button></div></div>';
    //     newDiv.title = 'Summary: Loading...';

    //     const parentElement = document.querySelector('.sticky.top-0.hidden.h-full.flex-shrink-0.flex-grow.flex-col.sm\\:flex.sm\\:max-w-\\[330px\\].pt-3');
    //     parentElement.insertBefore(newDiv, parentElement.children[1]);

    //     // URLs for the APIs
    //     const url1 = 'https://content-analysis.onrender.com/api/label-text';
    //     const url2 = 'https://content-analysis.onrender.com/vision/gpt-4o';
    //     const url3 = 'https://content-analysis.onrender.com/vision/mixtral-8x7b';
    //     const url4 = 'https://content-analysis.onrender.com/vision/llama-3';
    //     const url5 = 'https://content-analysis.onrender.com/onchain/send-message';
    //     const url6 = 'https://content-analysis.onrender.com/vision/gpt-4o';

    //     // Data for the POST requests
    //     const data1 = JSON.stringify({ text_inputs: [text] });
    //     const sumarize = "Give me a brief and crisp summary of this text: " + "'" + text + "'"
    //     text = "Give me an estimate of authenticity of this post. Don't give any explanations, just a number from 1 to 100: " + "'" + text + "'"
    //     console.log('text', text);
    //     const data2 = JSON.stringify({ content: text });
    //     const data3 = JSON.stringify({ content: text });
    //     const data4 = JSON.stringify({ content: text });
    //     const data5 = JSON.stringify({ message: text });
    //     const data6 = JSON.stringify({ content: sumarize });

    //     // Fetch requests
    //     const fetch1 = fetch(url1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data1 });
    //     const fetch2 = fetch(url2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data2 });
    //     const fetch3 = fetch(url3, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data3 });
    //     const fetch4 = fetch(url4, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data4 });
    //     const fetch5 = fetch(url5, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data5 });
    //     const fetch6 = fetch(url6, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data6 });

    //     // Use Promise.all to wait for both fetch requests to complete
    //     Promise.all([fetch1, fetch2, fetch3, fetch4, fetch5, fetch6])
    //         .then(responses => Promise.all(responses.map(res => res.json())))
    //         .then(([data1, data2, data3, data4, data5, data6]) => {
    //             clearInterval(loadingInterval);
    //             document.getElementById('uniqueElementId0').remove();

    //             console.log('Data from API 1:', data1);
    //             console.log('Data from API 2:', data2.content);
    //             console.log('Data from API 3:', data3.content);
    //             console.log('Data from API 4:', data4.content);
    //             console.log('Data from API 5:', data5.response);
    //             console.log('Data from API 6:', data6.content);

    //             // Step 1: Create an array with all values
    //             const values = [data2.content, data3.content, data4.content, data5.response]
    //                 .map(Number) // Convert all values to numbers
    //                 .filter(val => !isNaN(val) && val <= 100); // Filter out NaN values and values greater than 100

    //             // Step 3: Calculate the average of the remaining values
    //             const average = values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
    //             console.log('Average:', average);

    //             // Check if the element already exists
    //             if (!document.getElementById("uniqueElementId0")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId0"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 let fillColor;

    //                 if (average > 70) {
    //                     fillColor = "#4CAF50"; // Green
    //                 } else if (average < 40) {
    //                     fillColor = "#F44336"; // Red
    //                 } else {
    //                     fillColor = "#FFEB3B"; // Yellow
    //                 }

    //                 const svgIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${fillColor}"/></svg>`;

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = 'GPT-4o: ' + data2.content + '%\n' + 'Mixtral-8x7b: ' + data3.content + '%\n' + 'Llama-3: ' + data4.content + '%\n' + 'Claude 3.5 Sonnet: ' + data5.response + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             globalData = data1;

    //             if (!document.getElementById("uniqueElementId1")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId1"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.topics.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.topics.label + ' ' + Math.round(globalData.topics.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId2")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId2"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group text-xl flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.sentiment.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.sentiment.label + ' ' + Math.round(globalData.sentiment.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId3")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId3"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.emotion.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.emotion.label + ' ' + Math.round(globalData.emotion.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId4")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId4"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 //const svgIcon = getEmojiForLabel(globalData.moderation.label);
    //                 const svgIcon = getIcon(globalData.moderation.label, globalData.moderation.score);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.moderation.label + ' ' + Math.round(globalData.moderation.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId5")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId5"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full pt-2 transition-colors text-action-purple text-faint";

    //                 // Create the button element
    //                 const button = document.createElement('button');
    //                 button.textContent = "Create Meme";  // Set button text as "Cast"

    //                 // Add inline styles for the button
    //                 button.style.backgroundColor = "#7e57c2"; // Purple background
    //                 button.style.color = "white";             // White text
    //                 button.style.padding = "6px 6px";        // Padding
    //                 button.style.fontSize = "11px";           // Font size
    //                 button.style.border = "none";             // Remove border
    //                 button.style.borderRadius = "8px";        // Rounded corners
    //                 button.style.cursor = "pointer";
    //                 button.style.width = "120px"; // Pointer cursor on hover

    //                 // Add hover effect by using mouse events
    //                 button.onmouseover = function () {
    //                     button.style.backgroundColor = "#6c4bab";  // Darker purple on hover
    //                 };
    //                 button.onmouseout = function () {
    //                     button.style.backgroundColor = "#7e57c2";  // Original color when not hovering
    //                 };

    //                 // Add click event to show an alert
    //                 button.onclick = function () {
    //                     // alert( "Button was clicked!" );

    //                     openPoup();

    //                     // if (provider) {
    //                     //      openPoup();
    //                     // } else {
    //                     //      connectWallet();
    //                     // }

    //                 };

    //                 innerDiv.appendChild(button);
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //                 // const targetElement = document.querySelector('.flex.flex-col.whitespace-pre-wrap.break-words.text-lg.leading-6.tracking-normal');
    //                 // targetElement.insertAdjacentElement('afterend', outerDiv);

    //             }



    //             const parentElement = document.getElementById('uniqueElementId6');
    //             // Modify the button element to include an ID for easy selection
    //             parentElement.innerHTML = '<div class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="px-2 py-1 text-lg font-semibold">The X Agent Summary</div><div class="px-2 py-1 text-sm text-muted">' + data6.content + '</div><div class="flex flex-col items-center pt-1"><button id="copyToClipboardButton" class="rounded-lg font-semibold border bg-action-tertiary border-action-tertiary hover:bg-action-tertiary-hover hover:border-action-tertiary-hover active:border-action-tertiary-active disabled:border-action-tertiary disabled:text-action-tertiary-disabled disabled:hover:bg-action-tertiary disabled:active:border-action-tertiary px-4 py-2 text-sm w-full">Copy to clipboard</button></div></div>';

    //             // Ensure the DOM has been updated before trying to attach the event listener
    //             document.getElementById('copyToClipboardButton').addEventListener('click', function () {
    //                 // Use the Clipboard API to copy text
    //                 navigator.clipboard.writeText(data6.content).then(function () {
    //                     console.log('Content copied to clipboard successfully!');
    //                 }).catch(function (error) {
    //                     console.error('Error copying text: ', error);
    //                 });
    //             });

    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }
}

function handleNewContent() {
    // Disconnect and reconnect observer to avoid infinite loops
    observer.disconnect();
    debouncedDoSomething();
    //observeDOMChanges();
}

function observeDOMChanges() {
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", debouncedDoSomething);
} else {
    debouncedDoSomething();
}

// Observe changes in the DOM
const observer = new MutationObserver(handleNewContent);
observeDOMChanges();

// Call listenCasts to initialize the listeners
//debouncedDoSomething();

// Testing metamask



},{"metamask-extension-provider":195,"web3":221}]},{},[223]);