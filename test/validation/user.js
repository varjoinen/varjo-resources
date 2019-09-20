const assert = require("assert");
const { user } = require("../../src/validation/user");

describe("validation/user", () => {
    describe("schema", () => {
        it("should pass with a full valid user", () => {

            const valid = {
                name: "Test project",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = user.validate(valid);
            
            assert.equal(error, null);
        });

        it("should pass with a minimal valid user", () => {

            const valid = {
                name: "Test project"
            }

            const { error } = user.validate(valid);
            
            assert.equal(error, null);
        });

        it("should fail validation with missing name", () => {

            const invalid = {
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = user.validate(invalid);
            
            assert.notEqual(error, null)
        });
    });
});