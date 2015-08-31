define(['../utils'], function (utils) {

    var DomNode = function (node) {
        this._node = node;
        this._instructions = [];
        this._alive = true;
    }

    // reference to "native" dom object
    DomNode.prototype._node = null;

    // virtual node should be destroyed ?
    DomNode.prototype.alive = false;

    // for of instructions for a node
    DomNode.prototype._instructions = [];

    DomNode.prototype._addInstructions = function (type, payload) {

        if (KNOWN_INSTRUCTIONS.indexOf(type) === -1)
            return;

        var i=0, len = this._instructions.length;
        while (i<len) {
            if (this._instructions[i].type === type && this._instructions[i].actions.key === payload.key) {
                break;
            }
            i++;
        }

        if (i<len && this._instructions[i].type === type && this._instructions[i].actions.key === payload.key) {
            this._instructions.splice(i,1);
        }
        this._instructions.push({type: type, actions: payload});
    }

    DomNode.prototype.refreshDom = function () {
        this._instructions.forEach(function (instruction, id) {
            switch(instruction.type) {
                case 'prop':
                    this._node[instruction.actions.key] = instruction.actions.value;
                case 'attr':
                    this._node.setAttribute(instruction.actions.key, instruction.actions.value);
            }
        }, this);

        this._instructions = [];
    };

    DomNode.prototype.destroy = function () {
        this.alive = false;
    };

    DomNode.prototype.getValue = function (attr, key) {
        return this;
    };   

    DomNode.prototype.attr = function (attr, value) {
        this._addInstructions('attr', {key: attr, value: value});
    };

    DomNode.prototype.prop = function (prop, value) {
        this._addInstructions('prop', {key: prop, value: value});
    };
    
    var domManagerNodes = [],
        KNOWN_INSTRUCTIONS = ['prop', 'attr']
        ;
        

    var domManager = {
        _refreshDom: function () {

            var forgettableNodes = [];

            domManagerNodes.forEach(function (node, id) {
                if (!node.alive) {
                    forgettableNodes.push(id);
                } else {
                    node.refreshDom();
                }
            }, this);

            forgettableNodes.forEach(function () {
                delete domManagerNodes[id];
            });

        },
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
            var that = this;
            requestAnimationFrame(function () {
                that._refreshDom();
                that.run();
            });
        }
    };

    return domManager;

});