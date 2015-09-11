/*jslint browser:true */
/*global require */

var require = {
    baseUrl: "dev/js/",
    paths: {
        "domReady": '../../../bower_components/domReady/domReady',
        "socketio": '../../../node_modules/socket.io/node_modules/socket.io-client/socket.io'
/*        "underscore": '../../bower_components/underscore/underscore',
        "deferred": '../../bower_components/underscore.deferred/underscore.deferred',
        "text": '../../bower_components/requirejs-text/text',
        "screenfull": '../../bower_components/screenfull/dist/screenfull'
*/    },
    shim: {
/*        'underscore': {
            exports: '_'
        },
        'deferred': {
            exports: '_',
        },
        'screenfull': {
            exports: 'screenfull'
        }
*/    }
};