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

    });
});