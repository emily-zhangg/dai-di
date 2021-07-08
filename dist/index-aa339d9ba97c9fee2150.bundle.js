/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var createGameButton = document.getElementById("create-game");
var refreshInvitesButton = document.getElementById("refresh-invites");
var sendInvitesButton = document.getElementById("start-game");
var setPlayersDiv = document.getElementById("create");
var acceptInvitesDiv = document.getElementById("invitation");
var gameDiv = document.getElementById("game");
var gameStatus = document.getElementById("gameStatus");
var cardCombination = document.getElementById("combination");
var prevCards = document.getElementById("prevCards");
var newGameNavLink = document.getElementById("newGame");
var seeInvitesLink = document.getElementById("seeInvites");
var resumeGameLink = document.getElementById("resumeGame");
var cardsDiv = document.getElementById("cardsDiv");
resumeGameLink.addEventListener("click", function () {
  gameDiv.setAttribute("style", "display:block");
  acceptInvitesDiv.setAttribute("style", "display:none");
  setPlayersDiv.setAttribute("style", "display:none");
});

var cardStyle = function cardStyle(card) {
  if (card.getAttribute("class") === "cards clicked") {
    card.setAttribute("style", "border:0mm ");
    card.setAttribute("class", "cards");
  } else {
    card.setAttribute("style", "border:2px solid rgba(3, 123, 252) ");
    card.setAttribute("class", "cards clicked");
  }
};

var card1 = document.getElementById("card1");
var card2 = document.getElementById("card2");
var card3 = document.getElementById("card3");
var card4 = document.getElementById("card4");
var card5 = document.getElementById("card5");
var card6 = document.getElementById("card6");
var card7 = document.getElementById("card7");
var card8 = document.getElementById("card8");
var card9 = document.getElementById("card9");
var card10 = document.getElementById("card10");
var card11 = document.getElementById("card11");
var card12 = document.getElementById("card12");
var card13 = document.getElementById("card13");
card1.addEventListener("click", function () {
  cardStyle(card1);
});
card2.addEventListener("click", function () {
  cardStyle(card2);
});
card3.addEventListener("click", function () {
  cardStyle(card3);
});
card4.addEventListener("click", function () {
  cardStyle(card4);
});
card5.addEventListener("click", function () {
  cardStyle(card5);
});
card6.addEventListener("click", function () {
  cardStyle(card6);
});
card7.addEventListener("click", function () {
  cardStyle(card7);
});
card8.addEventListener("click", function () {
  cardStyle(card8);
});
card9.addEventListener("click", function () {
  cardStyle(card9);
});
card10.addEventListener("click", function () {
  cardStyle(card10);
});
card11.addEventListener("click", function () {
  cardStyle(card11);
});
card12.addEventListener("click", function () {
  cardStyle(card12);
});
card13.addEventListener("click", function () {
  cardStyle(card13);
});
var showCards = document.getElementById("showCards");
var refreshButton = document.getElementById("refresh");
var playCardsButton = document.getElementById("submit");
var skipButton = document.getElementById("skip");

var createGameHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
    var users, player1Element, _loop, _i;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setPlayersDiv.setAttribute("style", "display:block");
            createGameButton.setAttribute("style", "display:none");
            sendInvitesButton.setAttribute("style", "display:block");
            acceptInvitesDiv.setAttribute("styles", "display:none");
            gameDiv.setAttribute("style", "display:none");
            _context.next = 7;
            return axios.get("/create");

          case 7:
            users = _context.sent;
            console.log(users, "hi");
            player1Element = document.createElement("p");
            player1Element.innerHTML = "You are Player 1";
            setPlayersDiv.appendChild(player1Element);

            _loop = function _loop(_i) {
              var selectElement = document.createElement("select");
              setPlayersDiv.appendChild(selectElement);
              selectElement.setAttribute("id", "player".concat(_i + 2));
              var optionDefault = document.createElement("option");
              optionDefault.setAttribute("value", "");
              optionDefault.setAttribute("disabled", "");
              optionDefault.setAttribute("id", "Player".concat(_i + 2));
              optionDefault.setAttribute("selected", "");
              optionDefault.innerHTML = "Player".concat(_i + 2);
              selectElement.appendChild(optionDefault);
              users.data.forEach(function (user) {
                var option = document.createElement("option");
                option.setAttribute("value", user.id);
                option.innerHTML = user.name;
                selectElement.appendChild(option);
              });
            };

            for (_i = 0; _i < 3; _i++) {
              _loop(_i);
            }

          //on click will get all players name from db and create 4 drop downs

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createGameHandler() {
    return _ref.apply(this, arguments);
  };
}();

var fetchInvitesHandler = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
    var invites, invitations;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            acceptInvitesDiv.setAttribute("style", "display:block");
            gameDiv.setAttribute("style", "display:none");
            setPlayersDiv.setAttribute("style", "display:none");
            _context2.next = 5;
            return axios.get("/invites");

          case 5:
            invites = _context2.sent;
            console.log(invites);
            invitations = invites.data;
            invitations.forEach(function (invite) {
              if (invite.gameState === "pending") {
                console.log("one added");
                var inviteCard = document.createElement("div");
                var acceptInvite = document.createElement("button");
                acceptInvite.innerHTML = "Join Game";
                inviteCard.innerHTML = "You got a game invite. for game ".concat(invite.id);
                acceptInvite.setAttribute("id", invite.id);
                acceptInvite.setAttribute("class", "game-invite-button");
                acceptInvitesDiv.appendChild(inviteCard);
                inviteCard.appendChild(acceptInvite);
                acceptInvite.addEventListener("click", function () {
                  joinGame(invite.id);
                });
              }
            });

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchInvitesHandler() {
    return _ref2.apply(this, arguments);
  };
}();

newGameNavLink.addEventListener("click", createGameHandler);
createGameButton.addEventListener("click", createGameHandler);

var selectedOption = function selectedOption(sel) {
  console.log(sel);

  for (i = 0; i < sel.length; i++) {
    if (sel.option[i] === true) {
      console.log(sel.option[i].value);
      return sel.option[i].value;
    }
  }

  sel.forEach(function (option) {
    if (option.selected) {
      console.log(option.value);
      return option.value;
    }
  });
};

var sendInvitesHandler = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
    var player2, player2Id, player3, player3Id, player4, player4Id, data, sendInvites;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            player2 = document.getElementById("player2");
            player2Id = player2.value;
            player3 = document.getElementById("player3");
            player3Id = player3.value;
            player4 = document.getElementById("player4");
            player4Id = player4.value;
            console.log(document.cookie.split("=")[1]);
            console.log(player2Id, player3Id, player4Id);
            data = {
              player2Id: player2Id,
              player3Id: player3Id,
              player4Id: player4Id
            };
            console.log(data);
            _context3.next = 12;
            return axios.post("/invite", data);

          case 12:
            sendInvites = _context3.sent;
            setPlayersDiv.setAttribute("style", "display:none");
            fetchInvitesHandler();

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function sendInvitesHandler() {
    return _ref3.apply(this, arguments);
  };
}();

seeInvitesLink.addEventListener("click", fetchInvitesHandler);
sendInvitesButton.addEventListener("click", sendInvitesHandler);

var joinGame = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4(gameId) {
    var initGame, playerCardsHTML;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            gameDiv.setAttribute("style", "display:block");
            acceptInvitesDiv.setAttribute("style", "display:none");
            _context4.next = 4;
            return axios.post("/init", {
              gameId: gameId
            });

          case 4:
            initGame = _context4.sent;
            console.log(initGame);
            console.log(initGame.data.gameData.gameState);

            if (initGame.data.gameData.gameState === "pending") {
              gameStatus.innerHTML = "Waiting for ".concat(initGame.data.waitingForNumOfPlayers, " players");
            }

            if (initGame.data.gameData.gameState === "In Progress") {
              gameStatus.innerHTML = "Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ".concat(initGame.data.startingIndex + 1, " who has 3 of diamonds.<br>You are Player ").concat(initGame.data.playerNumber + 1);
              playerCardsHTML = document.querySelectorAll(".cards");
              playerCardsHTML.forEach(function (card, index) {
                card.setAttribute("src", "".concat(initGame.data.playerCards[index].link));
              });
            }

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function joinGame(_x) {
    return _ref4.apply(this, arguments);
  };
}();

refreshInvitesButton.addEventListener("click", fetchInvitesHandler);

var showPlayerCards = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
    var cards, playerCardsHTML;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return axios.get("/cards");

          case 2:
            cards = _context5.sent;
            console.log(cards);
            playerCardsHTML = document.querySelectorAll(".cards");
            playerCardsHTML.forEach(function (card, index) {
              if (index < cards.data.length) {
                card.setAttribute("src", "".concat(cards.data[index].link));
              } else {
                card.setAttribute("style", "display:none");
              }
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function showPlayerCards() {
    return _ref5.apply(this, arguments);
  };
}();

var displayCombination = function displayCombination(cards) {
  console.log(cards);
  var outputMessage = "";
  cards.forEach(function (card) {
    outputMessage += ", ".concat(card.name, " of ").concat(card.suit);
  });
  return outputMessage;
};

showCards.addEventListener("click", showPlayerCards);

var refreshGame = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6() {
    var previousRound, startingIndex, playerNumber, gameMessage;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return axios.get("/refresh");

          case 2:
            previousRound = _context6.sent;
            console.log(previousRound);
            startingIndex = document.cookie.split("; ").find(function (row) {
              return row.startsWith("startingPlayer=");
            }).split("=")[1];
            playerNumber = document.cookie.split("; ").find(function (row) {
              return row.startsWith("playerNumber=");
            }).split("=")[1];
            gameMessage = "Sequence to play: Player1 -> Player2 -> Player3 -> Player4, starting with Player ".concat(Number(startingIndex) + 1, " who has 3 of diamonds.<br>You are Player ").concat(playerNumber);

            if (previousRound.data[0].playerId === null && previousRound.data[0].skipCounter === null) {
              gameMessage += "<br>It is Player ".concat(Number(startingIndex) + 1, "'s turn");
            } else if (previousRound.data[0].skipCounter === 3) {
              gameMessage += "<br>It is your turn. As all previous players have skipped, you can put down a new combination";
            } else if (previousRound.data.length === 2) {
              cardCombination.innerHTML = "The combination is ".concat(previousRound.data[0].cardsPlayed.length, " cards, ").concat(previousRound.data[0].player, " has played his turn, it is the next player's turn");
              prevCards.innerHTML = "Last Combination played is".concat(displayCombination(previousRound.data[0].cardsPlayed), " ");
            } else {
              gameMessage += "The combination is ".concat(previousRound.data[1].cardsPlayed.length, " cards, ").concat(previousRound.data[0].player, " has played his turn, it is the next player's turn<br>Last Combination played is").concat(displayCombination(previousRound.data[1].cardsPlayed), " ");
            }

            gameStatus.innerHTML = gameMessage;

            if (previousRound.data[previousRound.data.length - 1].winner) {
              cardCombination.innerHTML = "The game has ended, and ".concat(previousRound.data[0].player, " has won the game");
            }

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function refreshGame() {
    return _ref6.apply(this, arguments);
  };
}();

refreshButton.addEventListener("click", refreshGame);
playCardsButton.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
  var cardsHTML, cardsPlayed, cardsRemaining, createRound;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("clicked");
          cardsHTML = document.querySelectorAll(".cards");
          cardsPlayed = [];
          cardsRemaining = [];
          console.log(cardsHTML);
          cardsHTML.forEach(function (card) {
            if (card.getAttribute("src")) {
              console.log(card.getAttribute("src"));
              var cardDescription = card.getAttribute("src").split("cards/")[1].split(".png")[0];
              var cardSuit = cardDescription.split("_")[2];
              var cardName = cardDescription.split("_")[0];
              var cardRank;

              switch (cardName) {
                case "ace":
                  cardRank = 1;
                  break;

                case "king":
                  cardRank = 13;
                  break;

                case "queen":
                  cardRank = 12;
                  break;

                case "jack":
                  cardRank = 11;
                  break;

                default:
                  cardRank = cardName;
              }

              if (card.getAttribute("class") === "cards clicked") {
                cardsDiv.removeChild(card);
                console.log("played", card);
                cardsPlayed.push({
                  name: cardName,
                  rank: cardRank,
                  suit: cardSuit,
                  link: card.getAttribute("src")
                });
              } else if (card.getAttribute("class") === "cards" && card.getAttribute("src")) {
                console.log("remained", card);
                cardsRemaining.push({
                  name: cardName,
                  rank: cardRank,
                  suit: cardSuit,
                  link: card.getAttribute("src")
                });
              }
            }
          }); //potential validation for if combination is valid

          _context7.next = 8;
          return axios.post("/playRound", {
            cardsPlayed: cardsPlayed,
            cardsRemaining: cardsRemaining
          });

        case 8:
          createRound = _context7.sent;
          showPlayerCards();
          refreshGame();

          if (cardsRemaining.length == 0) {
            cardCombination.innerHTML = "Congrats you have won the game";
          }

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7);
})));
skipButton.addEventListener("click", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
  var skipRound;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return axios.get("/skip");

        case 2:
          skipRound = _context8.sent;

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
})));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0My8uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0My8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Byb2plY3QzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdDMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9qZWN0My8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVHYW1lQnV0dG9uIiwiZG9jdW1lbnQiLCJyZWZyZXNoSW52aXRlc0J1dHRvbiIsInNlbmRJbnZpdGVzQnV0dG9uIiwic2V0UGxheWVyc0RpdiIsImFjY2VwdEludml0ZXNEaXYiLCJnYW1lRGl2IiwiZ2FtZVN0YXR1cyIsImNhcmRDb21iaW5hdGlvbiIsInByZXZDYXJkcyIsIm5ld0dhbWVOYXZMaW5rIiwic2VlSW52aXRlc0xpbmsiLCJyZXN1bWVHYW1lTGluayIsImNhcmRzRGl2IiwiY2FyZFN0eWxlIiwiY2FyZCIsImNhcmQxIiwiY2FyZDIiLCJjYXJkMyIsImNhcmQ0IiwiY2FyZDUiLCJjYXJkNiIsImNhcmQ3IiwiY2FyZDgiLCJjYXJkOSIsImNhcmQxMCIsImNhcmQxMSIsImNhcmQxMiIsImNhcmQxMyIsInNob3dDYXJkcyIsInJlZnJlc2hCdXR0b24iLCJwbGF5Q2FyZHNCdXR0b24iLCJza2lwQnV0dG9uIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJheGlvcyIsInVzZXJzIiwiY29uc29sZSIsInBsYXllcjFFbGVtZW50Iiwic2VsZWN0RWxlbWVudCIsImkiLCJvcHRpb25EZWZhdWx0Iiwib3B0aW9uIiwidXNlciIsImZldGNoSW52aXRlc0hhbmRsZXIiLCJpbnZpdGVzIiwiaW52aXRhdGlvbnMiLCJpbnZpdGUiLCJpbnZpdGVDYXJkIiwiYWNjZXB0SW52aXRlIiwiam9pbkdhbWUiLCJzZWxlY3RlZE9wdGlvbiIsInNlbCIsInNlbmRJbnZpdGVzSGFuZGxlciIsInBsYXllcjIiLCJwbGF5ZXIySWQiLCJwbGF5ZXIzIiwicGxheWVyM0lkIiwicGxheWVyNCIsInBsYXllcjRJZCIsImRhdGEiLCJzZW5kSW52aXRlcyIsImdhbWVJZCIsImluaXRHYW1lIiwicGxheWVyQ2FyZHNIVE1MIiwic2hvd1BsYXllckNhcmRzIiwiY2FyZHMiLCJpbmRleCIsImRpc3BsYXlDb21iaW5hdGlvbiIsIm91dHB1dE1lc3NhZ2UiLCJyZWZyZXNoR2FtZSIsInByZXZpb3VzUm91bmQiLCJzdGFydGluZ0luZGV4Iiwicm93IiwicGxheWVyTnVtYmVyIiwiZ2FtZU1lc3NhZ2UiLCJOdW1iZXIiLCJjYXJkc0hUTUwiLCJjYXJkc1BsYXllZCIsImNhcmRzUmVtYWluaW5nIiwiY2FyZERlc2NyaXB0aW9uIiwiY2FyZFN1aXQiLCJjYXJkTmFtZSIsImNhcmRSYW5rIiwibmFtZSIsInJhbmsiLCJzdWl0IiwibGluayIsImNyZWF0ZVJvdW5kIiwic2tpcFJvdW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxnSEFBK0M7Ozs7Ozs7Ozs7O0FDQS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLEtBQUs7QUFDTCxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLFdBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsY0FBYztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsa0JBQWtCO0FBQ25E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QkFBTyxDQUFQQTtBQUNBeUMsMkJBQVcsQ0FBWEEsS0FBaUI7QUFDZk0sc0JBQUksRUFEVztBQUVmQyxzQkFBSSxFQUZXO0FBR2ZDLHNCQUFJLEVBSFc7QUFJZkMsc0JBQUksRUFBRXZFLElBQUksQ0FBSkE7QUFKUyxpQkFBakI4RDtBQUhGLHFCQVNPLElBQ0w5RCxJQUFJLENBQUpBLHFDQUNBQSxJQUFJLENBQUpBLGFBRkssS0FFTEEsQ0FGSyxFQUdMO0FBQ0FxQix1QkFBTyxDQUFQQTtBQUNBMEMsOEJBQWMsQ0FBZEEsS0FBb0I7QUFDbEJLLHNCQUFJLEVBRGM7QUFFbEJDLHNCQUFJLEVBRmM7QUFHbEJDLHNCQUFJLEVBSGM7QUFJbEJDLHNCQUFJLEVBQUV2RSxJQUFJLENBQUpBO0FBSlksaUJBQXBCK0Q7QUFNRDtBQUNGO0FBckRxQyxXQU14Q0YsRUFOd0MsQ0F1RHhDOztBQXZEd0M7QUFBQSxpQkF3RGQsS0FBSyxDQUFMLG1CQUF5QjtBQUNqREMsdUJBQVcsRUFEc0M7QUFFakRDLDBCQUFjLEVBQWRBO0FBRmlELFdBQXpCLENBeERjOztBQUFBO0FBd0RsQ1MscUJBeERrQyxpQkF3RGxDQTtBQUlOdkIseUJBQWU7QUFDZksscUJBQVc7O0FBQ1gsY0FBSVMsY0FBYyxDQUFkQSxVQUFKLEdBQWdDO0FBQzlCdEUsMkJBQWUsQ0FBZkE7QUFDRDs7QUFoRXVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUExQ3VCO0FBa0VBQyxVQUFVLENBQVZBLDhJQUFxQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUNYRSxLQUFLLENBQUxBLElBRFcsT0FDWEEsQ0FEVzs7QUFBQTtBQUM3QnNELG1CQUQ2QixpQkFDN0JBOztBQUQ2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBckN4RCxLIiwiZmlsZSI6ImluZGV4LWFhMzM5ZDliYTk3YzlmZWUyMTUwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IGRlZmluZShcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICB0b1N0cmluZ1RhZ1N5bWJvbCxcbiAgICBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgKTtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBkZWZpbmUocHJvdG90eXBlLCBtZXRob2QsIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKTtcbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKTtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJjb25zdCBjcmVhdGVHYW1lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGUtZ2FtZVwiKTtcbmNvbnN0IHJlZnJlc2hJbnZpdGVzQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWZyZXNoLWludml0ZXNcIik7XG5jb25zdCBzZW5kSW52aXRlc0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtZ2FtZVwiKTtcbmNvbnN0IHNldFBsYXllcnNEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKTtcbmNvbnN0IGFjY2VwdEludml0ZXNEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImludml0YXRpb25cIik7XG5jb25zdCBnYW1lRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpO1xuY29uc3QgZ2FtZVN0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZVN0YXR1c1wiKTtcbmNvbnN0IGNhcmRDb21iaW5hdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tYmluYXRpb25cIik7XG5jb25zdCBwcmV2Q2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZDYXJkc1wiKTtcbmNvbnN0IG5ld0dhbWVOYXZMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdHYW1lXCIpO1xuY29uc3Qgc2VlSW52aXRlc0xpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlZUludml0ZXNcIik7XG5jb25zdCByZXN1bWVHYW1lTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdW1lR2FtZVwiKTtcbmNvbnN0IGNhcmRzRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkc0RpdlwiKTtcbnJlc3VtZUdhbWVMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGdhbWVEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBhY2NlcHRJbnZpdGVzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBzZXRQbGF5ZXJzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xufSk7XG5jb25zdCBjYXJkU3R5bGUgPSAoY2FyZCkgPT4ge1xuICBpZiAoY2FyZC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSA9PT0gXCJjYXJkcyBjbGlja2VkXCIpIHtcbiAgICBjYXJkLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiYm9yZGVyOjBtbSBcIik7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNhcmRzXCIpO1xuICB9IGVsc2Uge1xuICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJib3JkZXI6MnB4IHNvbGlkIHJnYmEoMywgMTIzLCAyNTIpIFwiKTtcbiAgICBjYXJkLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2FyZHMgY2xpY2tlZFwiKTtcbiAgfVxufTtcbmNvbnN0IGNhcmQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkMVwiKTtcbmNvbnN0IGNhcmQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkMlwiKTtcbmNvbnN0IGNhcmQzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkM1wiKTtcbmNvbnN0IGNhcmQ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkNFwiKTtcbmNvbnN0IGNhcmQ1ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkNVwiKTtcbmNvbnN0IGNhcmQ2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkNlwiKTtcbmNvbnN0IGNhcmQ3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkN1wiKTtcbmNvbnN0IGNhcmQ4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkOFwiKTtcbmNvbnN0IGNhcmQ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkOVwiKTtcbmNvbnN0IGNhcmQxMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDEwXCIpO1xuY29uc3QgY2FyZDExID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYXJkMTFcIik7XG5jb25zdCBjYXJkMTIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxMlwiKTtcbmNvbnN0IGNhcmQxMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDEzXCIpO1xuY2FyZDEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQxKTtcbn0pO1xuY2FyZDIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQyKTtcbn0pO1xuY2FyZDMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQzKTtcbn0pO1xuY2FyZDQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ0KTtcbn0pO1xuY2FyZDUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ1KTtcbn0pO1xuY2FyZDYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ2KTtcbn0pO1xuY2FyZDcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ3KTtcbn0pO1xuY2FyZDguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ4KTtcbn0pO1xuY2FyZDkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQ5KTtcbn0pO1xuY2FyZDEwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNhcmRTdHlsZShjYXJkMTApO1xufSk7XG5jYXJkMTEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY2FyZFN0eWxlKGNhcmQxMSk7XG59KTtcbmNhcmQxMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjYXJkU3R5bGUoY2FyZDEyKTtcbn0pO1xuY2FyZDEzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGNhcmRTdHlsZShjYXJkMTMpO1xufSk7XG5jb25zdCBzaG93Q2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dDYXJkc1wiKTtcbmNvbnN0IHJlZnJlc2hCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2hcIik7XG5jb25zdCBwbGF5Q2FyZHNCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdFwiKTtcbmNvbnN0IHNraXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNraXBcIik7XG5cbmNvbnN0IGNyZWF0ZUdhbWVIYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xuICBzZXRQbGF5ZXJzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpibG9ja1wiKTtcbiAgY3JlYXRlR2FtZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZVwiKTtcbiAgc2VuZEludml0ZXNCdXR0b24uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBhY2NlcHRJbnZpdGVzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlc1wiLCBcImRpc3BsYXk6bm9uZVwiKTtcbiAgZ2FtZURpdi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZVwiKTtcbiAgY29uc3QgdXNlcnMgPSBhd2FpdCBheGlvcy5nZXQoXCIvY3JlYXRlXCIpO1xuICBjb25zb2xlLmxvZyh1c2VycywgXCJoaVwiKTtcbiAgY29uc3QgcGxheWVyMUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgcGxheWVyMUVsZW1lbnQuaW5uZXJIVE1MID0gXCJZb3UgYXJlIFBsYXllciAxXCI7XG4gIHNldFBsYXllcnNEaXYuYXBwZW5kQ2hpbGQocGxheWVyMUVsZW1lbnQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuICAgIHNldFBsYXllcnNEaXYuYXBwZW5kQ2hpbGQoc2VsZWN0RWxlbWVudCk7XG4gICAgc2VsZWN0RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgcGxheWVyJHtpICsgMn1gKTtcbiAgICBjb25zdCBvcHRpb25EZWZhdWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICBvcHRpb25EZWZhdWx0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIFwiXCIpO1xuICAgIG9wdGlvbkRlZmF1bHQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgb3B0aW9uRGVmYXVsdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgUGxheWVyJHtpICsgMn1gKTtcbiAgICBvcHRpb25EZWZhdWx0LnNldEF0dHJpYnV0ZShcInNlbGVjdGVkXCIsIFwiXCIpO1xuICAgIG9wdGlvbkRlZmF1bHQuaW5uZXJIVE1MID0gYFBsYXllciR7aSArIDJ9YDtcbiAgICBzZWxlY3RFbGVtZW50LmFwcGVuZENoaWxkKG9wdGlvbkRlZmF1bHQpO1xuICAgIHVzZXJzLmRhdGEuZm9yRWFjaCgodXNlcikgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB1c2VyLmlkKTtcbiAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSB1c2VyLm5hbWU7XG4gICAgICBzZWxlY3RFbGVtZW50LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICAvL29uIGNsaWNrIHdpbGwgZ2V0IGFsbCBwbGF5ZXJzIG5hbWUgZnJvbSBkYiBhbmQgY3JlYXRlIDQgZHJvcCBkb3duc1xufTtcbmNvbnN0IGZldGNoSW52aXRlc0hhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gIGFjY2VwdEludml0ZXNEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBnYW1lRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBzZXRQbGF5ZXJzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBjb25zdCBpbnZpdGVzID0gYXdhaXQgYXhpb3MuZ2V0KFwiL2ludml0ZXNcIik7XG4gIGNvbnNvbGUubG9nKGludml0ZXMpO1xuICBjb25zdCBpbnZpdGF0aW9ucyA9IGludml0ZXMuZGF0YTtcbiAgaW52aXRhdGlvbnMuZm9yRWFjaCgoaW52aXRlKSA9PiB7XG4gICAgaWYgKGludml0ZS5nYW1lU3RhdGUgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm9uZSBhZGRlZFwiKTtcbiAgICAgIGNvbnN0IGludml0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29uc3QgYWNjZXB0SW52aXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgIGFjY2VwdEludml0ZS5pbm5lckhUTUwgPSBcIkpvaW4gR2FtZVwiO1xuICAgICAgaW52aXRlQ2FyZC5pbm5lckhUTUwgPSBgWW91IGdvdCBhIGdhbWUgaW52aXRlLiBmb3IgZ2FtZSAke2ludml0ZS5pZH1gO1xuICAgICAgYWNjZXB0SW52aXRlLnNldEF0dHJpYnV0ZShcImlkXCIsIGludml0ZS5pZCk7XG4gICAgICBhY2NlcHRJbnZpdGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJnYW1lLWludml0ZS1idXR0b25cIik7XG4gICAgICBhY2NlcHRJbnZpdGVzRGl2LmFwcGVuZENoaWxkKGludml0ZUNhcmQpO1xuICAgICAgaW52aXRlQ2FyZC5hcHBlbmRDaGlsZChhY2NlcHRJbnZpdGUpO1xuICAgICAgYWNjZXB0SW52aXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGpvaW5HYW1lKGludml0ZS5pZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbm5ld0dhbWVOYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGVHYW1lSGFuZGxlcik7XG5jcmVhdGVHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGVHYW1lSGFuZGxlcik7XG5jb25zdCBzZWxlY3RlZE9wdGlvbiA9IChzZWwpID0+IHtcbiAgY29uc29sZS5sb2coc2VsKTtcbiAgZm9yIChpID0gMDsgaSA8IHNlbC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzZWwub3B0aW9uW2ldID09PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhzZWwub3B0aW9uW2ldLnZhbHVlKTtcbiAgICAgIHJldHVybiBzZWwub3B0aW9uW2ldLnZhbHVlO1xuICAgIH1cbiAgfVxuICBzZWwuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgY29uc29sZS5sb2cob3B0aW9uLnZhbHVlKTtcbiAgICAgIHJldHVybiBvcHRpb24udmFsdWU7XG4gICAgfVxuICB9KTtcbn07XG5jb25zdCBzZW5kSW52aXRlc0hhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHBsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjJcIik7XG4gIGNvbnN0IHBsYXllcjJJZCA9IHBsYXllcjIudmFsdWU7XG4gIGNvbnN0IHBsYXllcjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjNcIik7XG4gIGNvbnN0IHBsYXllcjNJZCA9IHBsYXllcjMudmFsdWU7XG4gIGNvbnN0IHBsYXllcjQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllcjRcIik7XG4gIGNvbnN0IHBsYXllcjRJZCA9IHBsYXllcjQudmFsdWU7XG4gIGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIj1cIilbMV0pO1xuICBjb25zb2xlLmxvZyhwbGF5ZXIySWQsIHBsYXllcjNJZCwgcGxheWVyNElkKTtcbiAgY29uc3QgZGF0YSA9IHtcbiAgICBwbGF5ZXIySWQsXG4gICAgcGxheWVyM0lkLFxuICAgIHBsYXllcjRJZCxcbiAgfTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG4gIGNvbnN0IHNlbmRJbnZpdGVzID0gYXdhaXQgYXhpb3MucG9zdChcIi9pbnZpdGVcIiwgZGF0YSk7XG4gIHNldFBsYXllcnNEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmVcIik7XG4gIGZldGNoSW52aXRlc0hhbmRsZXIoKTtcbn07XG5zZWVJbnZpdGVzTGluay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmV0Y2hJbnZpdGVzSGFuZGxlcik7XG5zZW5kSW52aXRlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VuZEludml0ZXNIYW5kbGVyKTtcblxuY29uc3Qgam9pbkdhbWUgPSBhc3luYyAoZ2FtZUlkKSA9PiB7XG4gIGdhbWVEaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBhY2NlcHRJbnZpdGVzRGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBjb25zdCBpbml0R2FtZSA9IGF3YWl0IGF4aW9zLnBvc3QoXCIvaW5pdFwiLCB7IGdhbWVJZCB9KTtcbiAgY29uc29sZS5sb2coaW5pdEdhbWUpO1xuICBjb25zb2xlLmxvZyhpbml0R2FtZS5kYXRhLmdhbWVEYXRhLmdhbWVTdGF0ZSk7XG4gIGlmIChpbml0R2FtZS5kYXRhLmdhbWVEYXRhLmdhbWVTdGF0ZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICBnYW1lU3RhdHVzLmlubmVySFRNTCA9IGBXYWl0aW5nIGZvciAke2luaXRHYW1lLmRhdGEud2FpdGluZ0Zvck51bU9mUGxheWVyc30gcGxheWVyc2A7XG4gIH1cbiAgaWYgKGluaXRHYW1lLmRhdGEuZ2FtZURhdGEuZ2FtZVN0YXRlID09PSBcIkluIFByb2dyZXNzXCIpIHtcbiAgICBnYW1lU3RhdHVzLmlubmVySFRNTCA9IGBTZXF1ZW5jZSB0byBwbGF5OiBQbGF5ZXIxIC0+IFBsYXllcjIgLT4gUGxheWVyMyAtPiBQbGF5ZXI0LCBzdGFydGluZyB3aXRoIFBsYXllciAke1xuICAgICAgaW5pdEdhbWUuZGF0YS5zdGFydGluZ0luZGV4ICsgMVxuICAgIH0gd2hvIGhhcyAzIG9mIGRpYW1vbmRzLjxicj5Zb3UgYXJlIFBsYXllciAke1xuICAgICAgaW5pdEdhbWUuZGF0YS5wbGF5ZXJOdW1iZXIgKyAxXG4gICAgfWA7XG4gICAgY29uc3QgcGxheWVyQ2FyZHNIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkc1wiKTtcbiAgICBwbGF5ZXJDYXJkc0hUTUwuZm9yRWFjaCgoY2FyZCwgaW5kZXgpID0+IHtcbiAgICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGAke2luaXRHYW1lLmRhdGEucGxheWVyQ2FyZHNbaW5kZXhdLmxpbmt9YCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbnJlZnJlc2hJbnZpdGVzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmZXRjaEludml0ZXNIYW5kbGVyKTtcbmNvbnN0IHNob3dQbGF5ZXJDYXJkcyA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FyZHMgPSBhd2FpdCBheGlvcy5nZXQoXCIvY2FyZHNcIik7XG4gIGNvbnNvbGUubG9nKGNhcmRzKTtcbiAgY29uc3QgcGxheWVyQ2FyZHNIVE1MID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkc1wiKTtcbiAgcGxheWVyQ2FyZHNIVE1MLmZvckVhY2goKGNhcmQsIGluZGV4KSA9PiB7XG4gICAgaWYgKGluZGV4IDwgY2FyZHMuZGF0YS5sZW5ndGgpIHtcbiAgICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGAke2NhcmRzLmRhdGFbaW5kZXhdLmxpbmt9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcmQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmVcIik7XG4gICAgfVxuICB9KTtcbn07XG5jb25zdCBkaXNwbGF5Q29tYmluYXRpb24gPSAoY2FyZHMpID0+IHtcbiAgY29uc29sZS5sb2coY2FyZHMpO1xuICBsZXQgb3V0cHV0TWVzc2FnZSA9IFwiXCI7XG4gIGNhcmRzLmZvckVhY2goKGNhcmQpID0+IHtcbiAgICBvdXRwdXRNZXNzYWdlICs9IGAsICR7Y2FyZC5uYW1lfSBvZiAke2NhcmQuc3VpdH1gO1xuICB9KTtcbiAgcmV0dXJuIG91dHB1dE1lc3NhZ2U7XG59O1xuc2hvd0NhcmRzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzaG93UGxheWVyQ2FyZHMpO1xuY29uc3QgcmVmcmVzaEdhbWUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHByZXZpb3VzUm91bmQgPSBhd2FpdCBheGlvcy5nZXQoXCIvcmVmcmVzaFwiKTtcbiAgY29uc29sZS5sb2cocHJldmlvdXNSb3VuZCk7XG4gIGNvbnN0IHN0YXJ0aW5nSW5kZXggPSBkb2N1bWVudC5jb29raWVcbiAgICAuc3BsaXQoXCI7IFwiKVxuICAgIC5maW5kKChyb3cpID0+IHJvdy5zdGFydHNXaXRoKFwic3RhcnRpbmdQbGF5ZXI9XCIpKVxuICAgIC5zcGxpdChcIj1cIilbMV07XG4gIGNvbnN0IHBsYXllck51bWJlciA9IGRvY3VtZW50LmNvb2tpZVxuICAgIC5zcGxpdChcIjsgXCIpXG4gICAgLmZpbmQoKHJvdykgPT4gcm93LnN0YXJ0c1dpdGgoXCJwbGF5ZXJOdW1iZXI9XCIpKVxuICAgIC5zcGxpdChcIj1cIilbMV07XG4gIGxldCBnYW1lTWVzc2FnZSA9IGBTZXF1ZW5jZSB0byBwbGF5OiBQbGF5ZXIxIC0+IFBsYXllcjIgLT4gUGxheWVyMyAtPiBQbGF5ZXI0LCBzdGFydGluZyB3aXRoIFBsYXllciAke1xuICAgIE51bWJlcihzdGFydGluZ0luZGV4KSArIDFcbiAgfSB3aG8gaGFzIDMgb2YgZGlhbW9uZHMuPGJyPllvdSBhcmUgUGxheWVyICR7cGxheWVyTnVtYmVyfWA7XG4gIGlmIChcbiAgICBwcmV2aW91c1JvdW5kLmRhdGFbMF0ucGxheWVySWQgPT09IG51bGwgJiZcbiAgICBwcmV2aW91c1JvdW5kLmRhdGFbMF0uc2tpcENvdW50ZXIgPT09IG51bGxcbiAgKSB7XG4gICAgZ2FtZU1lc3NhZ2UgKz0gYDxicj5JdCBpcyBQbGF5ZXIgJHtOdW1iZXIoc3RhcnRpbmdJbmRleCkgKyAxfSdzIHR1cm5gO1xuICB9IGVsc2UgaWYgKHByZXZpb3VzUm91bmQuZGF0YVswXS5za2lwQ291bnRlciA9PT0gMykge1xuICAgIGdhbWVNZXNzYWdlICs9IGA8YnI+SXQgaXMgeW91ciB0dXJuLiBBcyBhbGwgcHJldmlvdXMgcGxheWVycyBoYXZlIHNraXBwZWQsIHlvdSBjYW4gcHV0IGRvd24gYSBuZXcgY29tYmluYXRpb25gO1xuICB9IGVsc2UgaWYgKHByZXZpb3VzUm91bmQuZGF0YS5sZW5ndGggPT09IDIpIHtcbiAgICBjYXJkQ29tYmluYXRpb24uaW5uZXJIVE1MID0gYFRoZSBjb21iaW5hdGlvbiBpcyAke3ByZXZpb3VzUm91bmQuZGF0YVswXS5jYXJkc1BsYXllZC5sZW5ndGh9IGNhcmRzLCAke3ByZXZpb3VzUm91bmQuZGF0YVswXS5wbGF5ZXJ9IGhhcyBwbGF5ZWQgaGlzIHR1cm4sIGl0IGlzIHRoZSBuZXh0IHBsYXllcidzIHR1cm5gO1xuICAgIHByZXZDYXJkcy5pbm5lckhUTUwgPSBgTGFzdCBDb21iaW5hdGlvbiBwbGF5ZWQgaXMke2Rpc3BsYXlDb21iaW5hdGlvbihcbiAgICAgIHByZXZpb3VzUm91bmQuZGF0YVswXS5jYXJkc1BsYXllZFxuICAgICl9IGA7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZU1lc3NhZ2UgKz0gYFRoZSBjb21iaW5hdGlvbiBpcyAke1xuICAgICAgcHJldmlvdXNSb3VuZC5kYXRhWzFdLmNhcmRzUGxheWVkLmxlbmd0aFxuICAgIH0gY2FyZHMsICR7XG4gICAgICBwcmV2aW91c1JvdW5kLmRhdGFbMF0ucGxheWVyXG4gICAgfSBoYXMgcGxheWVkIGhpcyB0dXJuLCBpdCBpcyB0aGUgbmV4dCBwbGF5ZXIncyB0dXJuPGJyPkxhc3QgQ29tYmluYXRpb24gcGxheWVkIGlzJHtkaXNwbGF5Q29tYmluYXRpb24oXG4gICAgICBwcmV2aW91c1JvdW5kLmRhdGFbMV0uY2FyZHNQbGF5ZWRcbiAgICApfSBgO1xuICB9XG4gIGdhbWVTdGF0dXMuaW5uZXJIVE1MID0gZ2FtZU1lc3NhZ2U7XG4gIGlmIChwcmV2aW91c1JvdW5kLmRhdGFbcHJldmlvdXNSb3VuZC5kYXRhLmxlbmd0aCAtIDFdLndpbm5lcikge1xuICAgIGNhcmRDb21iaW5hdGlvbi5pbm5lckhUTUwgPSBgVGhlIGdhbWUgaGFzIGVuZGVkLCBhbmQgJHtwcmV2aW91c1JvdW5kLmRhdGFbMF0ucGxheWVyfSBoYXMgd29uIHRoZSBnYW1lYDtcbiAgfVxufTtcbnJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlZnJlc2hHYW1lKTtcbnBsYXlDYXJkc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gIGNvbnN0IGNhcmRzSFRNTCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHNcIik7XG4gIGNvbnN0IGNhcmRzUGxheWVkID0gW107XG4gIGNvbnN0IGNhcmRzUmVtYWluaW5nID0gW107XG4gIGNvbnNvbGUubG9nKGNhcmRzSFRNTCk7XG4gIGNhcmRzSFRNTC5mb3JFYWNoKChjYXJkKSA9PiB7XG4gICAgaWYgKGNhcmQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSB7XG4gICAgICBjb25zb2xlLmxvZyhjYXJkLmdldEF0dHJpYnV0ZShcInNyY1wiKSk7XG4gICAgICBjb25zdCBjYXJkRGVzY3JpcHRpb24gPSBjYXJkXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJzcmNcIilcbiAgICAgICAgLnNwbGl0KFwiY2FyZHMvXCIpWzFdXG4gICAgICAgIC5zcGxpdChcIi5wbmdcIilbMF07XG4gICAgICBjb25zdCBjYXJkU3VpdCA9IGNhcmREZXNjcmlwdGlvbi5zcGxpdChcIl9cIilbMl07XG4gICAgICBjb25zdCBjYXJkTmFtZSA9IGNhcmREZXNjcmlwdGlvbi5zcGxpdChcIl9cIilbMF07XG4gICAgICBsZXQgY2FyZFJhbms7XG4gICAgICBzd2l0Y2ggKGNhcmROYW1lKSB7XG4gICAgICAgIGNhc2UgXCJhY2VcIjpcbiAgICAgICAgICBjYXJkUmFuayA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJraW5nXCI6XG4gICAgICAgICAgY2FyZFJhbmsgPSAxMztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInF1ZWVuXCI6XG4gICAgICAgICAgY2FyZFJhbmsgPSAxMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImphY2tcIjpcbiAgICAgICAgICBjYXJkUmFuayA9IDExO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNhcmRSYW5rID0gY2FyZE5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoY2FyZC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSA9PT0gXCJjYXJkcyBjbGlja2VkXCIpIHtcbiAgICAgICAgY2FyZHNEaXYucmVtb3ZlQ2hpbGQoY2FyZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVkXCIsIGNhcmQpO1xuICAgICAgICBjYXJkc1BsYXllZC5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBjYXJkTmFtZSxcbiAgICAgICAgICByYW5rOiBjYXJkUmFuayxcbiAgICAgICAgICBzdWl0OiBjYXJkU3VpdCxcbiAgICAgICAgICBsaW5rOiBjYXJkLmdldEF0dHJpYnV0ZShcInNyY1wiKSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBjYXJkLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpID09PSBcImNhcmRzXCIgJiZcbiAgICAgICAgY2FyZC5nZXRBdHRyaWJ1dGUoXCJzcmNcIilcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlbWFpbmVkXCIsIGNhcmQpO1xuICAgICAgICBjYXJkc1JlbWFpbmluZy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBjYXJkTmFtZSxcbiAgICAgICAgICByYW5rOiBjYXJkUmFuayxcbiAgICAgICAgICBzdWl0OiBjYXJkU3VpdCxcbiAgICAgICAgICBsaW5rOiBjYXJkLmdldEF0dHJpYnV0ZShcInNyY1wiKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy9wb3RlbnRpYWwgdmFsaWRhdGlvbiBmb3IgaWYgY29tYmluYXRpb24gaXMgdmFsaWRcbiAgY29uc3QgY3JlYXRlUm91bmQgPSBhd2FpdCBheGlvcy5wb3N0KFwiL3BsYXlSb3VuZFwiLCB7XG4gICAgY2FyZHNQbGF5ZWQsXG4gICAgY2FyZHNSZW1haW5pbmcsXG4gIH0pO1xuICBzaG93UGxheWVyQ2FyZHMoKTtcbiAgcmVmcmVzaEdhbWUoKTtcbiAgaWYgKGNhcmRzUmVtYWluaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgY2FyZENvbWJpbmF0aW9uLmlubmVySFRNTCA9IFwiQ29uZ3JhdHMgeW91IGhhdmUgd29uIHRoZSBnYW1lXCI7XG4gIH1cbn0pO1xuc2tpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBza2lwUm91bmQgPSBhd2FpdCBheGlvcy5nZXQoXCIvc2tpcFwiKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==