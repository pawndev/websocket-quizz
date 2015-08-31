/*jslint browser:true */
/*global require */

var require = {
    baseUrl: "../dev/js/",
    paths: {
        "utils": '../../../commons/utils',
        "domManager": '../../../commons/domManager/domManager',
        "domReady": '../../../bower_components/domReady/domReady'
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