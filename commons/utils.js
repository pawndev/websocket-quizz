(function () {
    
    var utils = {
        toArray: function (obj) {
            return Array.prototype.slice.apply(obj);
        },
        after: function (delay, callback) {
            setTimeout(callback, delay);
        },
        bind: function (fn, scope) {
            var that = this;
            return function () {
                fn.apply(scope, that.toArray(arguments));
            }
        }
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = utils;
    } else {
        define(utils);
    }

})();