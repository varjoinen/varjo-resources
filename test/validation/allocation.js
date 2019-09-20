const assert = require("assert");
const { allocation } = require("../../src/validation/allocation");

describe("validation/allocation", () =>  {
    describe("schema", () => {
        it("should pass with a full valid allocation", () => {

            const valid = {
                allocation: 3.5,
                description: "Test allocation",
                userId: "5d7fab2d7243fe0011e59771",
                projectId: "5d7fab317243fe0011e59774",
                start: "2019-01-01",
                end: "2019-12-30",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = allocation.validate(valid);
            
            assert.equal(error, null);
        });

        it("should pass with a minimal valid allocation", () => {

            const valid = {
                allocation: 3.5,
            }

            const { error } = allocation.validate(valid);
            
            assert.equal(error, null);
        });

        it("should fail validation with missing allocation", () => {

            const invalid = {
                description: "Test allocation",
                userId: "5d7fab2d7243fe0011e59771",
                projectId: "5d7fab317243fe0011e59774",
                start: "2019-01-01",
                end: "2019-12-30",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = allocation.validate(invalid);
            
            assert.notEqual(error, null)
        });
    });
});