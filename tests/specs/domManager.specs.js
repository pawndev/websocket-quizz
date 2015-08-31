define(['./../../commons/domManager/domManager'], function (dm) {

    describe("domManager", function () {

        it('should have function query', function () {
            expect(typeof dm.query).toEqual('function');
        });

        it('select dom node', function () {
            var domObj = dm.query('body');
            expect(domObj).not.toBe(undefined);
            expect(domObj._node.tagName.toLowerCase()).toEqual('body');
        });

        it('should be wrapped into a custom object', function () {
            var domObj = dm.query('body');

            expect(typeof domObj.prop).toEqual('function');
            expect(typeof domObj.attr).toEqual('function');
            expect(typeof domObj.refreshDom).toEqual('function');
        });

        describe('change the value of a property', function () {
            var domObj;

            beforeEach(function () {
                domObj = dm.query('body');
                domObj._node.id = "";
                domObj.prop('id', "test");
            });

            it("should not change immediatly the value of a given property", function () {
                expect(domObj._instructions.length).toEqual(1);
                expect(domObj._instructions[0].type).toEqual('prop');
                expect(typeof domObj._instructions[0].actions).toBe('object');
                expect(domObj._instructions[0].actions.key).toEqual('id');
                expect(domObj._instructions[0].actions.value).toEqual('test');
                expect(domObj._node.id).toEqual('');
            });

            it("should not duplicate instructions for the same property", function () {
               domObj.prop('id', "toto");
               expect(domObj._instructions.length).toEqual(1);
               expect(domObj._instructions[0].actions.key).toEqual('id');
               expect(domObj._instructions[0].actions.value).toEqual('toto');
            });

            it("should change the value of a given property (after refresh)", function () {
                domObj.refreshDom();
                expect(domObj._node.id).toEqual('test');
            });

            it("should clear instrunctions", function () {
                domObj.refreshDom();
                expect(domObj._instructions.length).toEqual(0);
            });

        });

        describe('change the value of an attribute', function () {
            var domObj;

            beforeEach(function () { 
                domObj = dm.query('body');
                domObj._node.setAttribute('data-test', "");
                domObj.attr('data-test', "test");
            });

            it("should not duplicate instructions for the same attribute", function () {
               domObj.attr('data-test', "toto");
               expect(domObj._instructions.length).toEqual(1);
               expect(domObj._instructions[0].actions.key).toEqual('data-test');
               expect(domObj._instructions[0].actions.value).toEqual('toto');
            });

            it("should not change immediatly the value of a given attribute", function () {
                expect(domObj._instructions.length).toEqual(1);
                expect(domObj._instructions[0].type).toEqual('attr');
                expect(typeof domObj._instructions[0].actions).toBe('object');
                expect(domObj._instructions[0].actions.key).toEqual('data-test');
                expect(domObj._instructions[0].actions.value).toEqual('test');
                expect(domObj._node.getAttribute('data-test')).toEqual('');
            });

            it("should change the value of a given attribute (after refresh)", function () {
                domObj.refreshDom();
                expect(domObj._node.getAttribute('data-test')).toEqual('test');
            });

            it("should clear instrunctions", function () {
                domObj.refreshDom();
                expect(domObj._instructions.length).toEqual(0);
            });

        });

    });
});