define(['../utils'], function (utils) {

    var DomNode = function (node) {
        this._node = node;
    }

    // reference to "native" dom object
    DomNode.prototype._node = null;

    // virtual node should be destroyed ?
    DomNode.prototype.alive = false;

    // for of instructions for a node
    DomNode.prototype._instructions = [];

    DomNode.prototype._addInstructions = function (type, payload) {
        this._instructions.push({type: type})
    }

    DomNode.prototype.getNode = function () {
        return this._node;
    }

    DomNode.prototype.attr = function (attr, value) {

    }

    DomNode.prototype.prop = function (prop, value) {

    }

    
    var domManagerNodes = [],
        KNOWN_INSTRUCTION = ['prop']
        ;
        

    var domManager = {
        query: function (selector) {
            var node;
            if (typeof selector === 'string') {
                node = document.querySelector(selector);
            } else {
                node = selector;
            }
            domManagerNodes.push(new DomNode(node));
            return domManagerNodes[domManagerNodes.length - 1];
        },
        queryAll: function (selector) {
            var results = [],
                nodes = utils.toArray(document.querySelector(selector));
            nodes.forEach(function (node) {
                results.push(this.query(node));
            });
            return results;
        },
        run: function () {

        }
    };

    return domManager;

});