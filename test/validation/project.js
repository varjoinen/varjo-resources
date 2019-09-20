const assert = require("assert");
const { project } = require("../../src/validation/project");

describe("validation/project", () => {
    describe("schema", () => {
        it("should pass with a full valid project", () => {

            const valid = {
                name: "Test project",
                description: "Test allocation",
                start: "2019-01-01",
                end: "2019-12-30",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = project.validate(valid);
            
            assert.equal(error, null);
        });

        it("should pass with a minimal valid project", () => {

            const valid = {
                name: "Test project"
            }

            const { error } = project.validate(valid);
            
            assert.equal(error, null);
        });

        it("should fail validation with missing name", () => {

            const invalid = {
                description: "Test allocation",
                start: "2019-01-01",
                end: "2019-12-30",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            }

            const { error } = project.validate(invalid);
            
            assert.notEqual(error, null)
        });
    });
});