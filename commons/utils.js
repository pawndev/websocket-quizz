(function () {
    
    var utils = {
        toArray: function (obj) {
            return Array.prototype.slice.apply(obj);
        }
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = utils;
    } else {
        define(utils);
    }

})();