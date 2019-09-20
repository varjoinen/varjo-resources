const assert = require("assert");
const chai = require("chai");
const expect = chai.expect
chai.use(require("chai-as-promised"));

const { mapMongoAllocationToDomainModel,
        getAllocations,
        getAllocation,
        createAllocation,
        updateAllocation,
        deleteAllocation,
        getAllocationAllocations, } = require("../../src/services/allocation");

const { ResourceNotFoundError } = require("../../src/utils");

describe("services/allocation", () => {
    describe("mapMongoAllocationToDomainModel", () => {
        it("should map with full details", () => {

            const input = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10.5,
                description: "description",
                userId: "6d847b7679c4a60011d45f26",
                projectId: "7d847b7679c4a60011d45f25",
                start: "2019-01-01",
                end: "2019-12-20",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const expected = {
                id: input._id,
                allocation: input.allocation,
                description: input.description,
                projectId: input.projectId,
                userId: input.userId,
                start: input.start,
                end: input.end,
                tags: input.tags,
            } ;

            const output = mapMongoAllocationToDomainModel(input);
            
            assert.deepEqual(output, expected);
        });

        it("should map with minimal details", () => {

            const input = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10,
            };

            const expected = {
                id: input._id,
                allocation: input.allocation,
                description: undefined,
                projectId: undefined,
                userId: undefined,
                start: undefined,
                end: undefined,
            };

            const output = mapMongoAllocationToDomainModel(input);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getAllocations", () => {
        it("should return an empty array if no allocations in database", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [];
                        },
                    };
                },
            };
            
            const output = await getAllocations(mockDb);
            
            assert.deepEqual(output, []);
        });

        it("should return array of allocations from database", async () => {
            const dbAllocations = [
                {
                    _id: "5d847b7679c4a60011d45f27",
                    allocation: 10.5,
                    description: "description 1",
                    userId: "6d847b7679c4a60011d45f26",
                    projectId: "7d847b7679c4a60011d45f25",
                    start: "2019-01-01",
                    end: "2019-12-20",
                    tags: [
                        {
                            key: "key 1",
                            value: "value 1"
                        }
                    ],
                },
                {
                    _id: "4d847b7679c4a60011d45f27",
                    allocation: 10.5,
                    description: "description 1",
                    userId: "6d847b7679c4a60011d45f26",
                    projectId: "7d847b7679c4a60011d45f25",
                    start: "2019-01-01",
                    end: "2019-12-20",
                    tags: [
                        {
                            key: "key 2",
                            value: "value 2"
                        }
                    ],
                }
            ];

            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return dbAllocations;
                        },
                    };
                },
            };

            const expected = [
                {
                    id: dbAllocations[0]._id,
                    allocation: dbAllocations[0].allocation,
                    description: dbAllocations[0].description,
                    projectId: dbAllocations[0].projectId,
                    userId: dbAllocations[0].userId,
                    start: dbAllocations[0].start,
                    end: dbAllocations[0].end,
                    tags: dbAllocations[0].tags,
                },
                {
                    id: dbAllocations[1]._id,
                    allocation: dbAllocations[1].allocation,
                    description: dbAllocations[1].description,
                    projectId: dbAllocations[1].projectId,
                    userId: dbAllocations[1].userId,
                    start: dbAllocations[1].start,
                    end: dbAllocations[1].end,
                    tags: dbAllocations[1].tags,
                },
            ]
            
            const output = await getAllocations(mockDb);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getAllocation", () => {
        it("should throw an error if allocation is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(getAllocation("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should return allocation found from database", async () => {
            const dbAllocation= {
                _id: "6d847b7679c4a60011d45f26",
                allocation: 10,
                description: "Description",
                projectId: "7d847b7679c4a60011d45f25",
                userId: "8d847b7679c4a60011d45f24",
                start: "2019-01-01",
                end: "2020-01-01",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return dbAllocation;
                        },
                    };
                },
            };

            const expected = {
                id: dbAllocation._id,
                allocation: dbAllocation.allocation,
                description: dbAllocation.description,
                projectId: dbAllocation.projectId,
                userId: dbAllocation.userId,
                start: dbAllocation.start,
                end: dbAllocation.end,
                tags: dbAllocation.tags,
            };
            
            await expect(getAllocation("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("createAllocation", () => {
        it("should return id of created allocation", async () => {
            const input = {
                allocation: 10,
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const dbResponse= {
                insertedId: "6d847b7679c4a60011d45f26",
            };

            const mockDb = {
                collection: (coll) => {
                    return {
                        insertOne: (data) => {
                            return dbResponse;
                        },
                    };
                },
            };

            const expected = {
                id: dbResponse.insertedId,
            };
            
            await expect(createAllocation(input, mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("updateAllocation", () => {
        it("should throw an error if allocation is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(updateAllocation("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should update allocation if it exists", async () => {
            let updateCalled = false;

            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return {};
                        },
                        updateOne: (query, update) => {
                            updateCalled = true;
                            return {};
                        }
                    };
                },
            };
            
            await expect(updateAllocation("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(updateCalled, true);
        });
    });

    describe("deleteAllocation", () => {
        it("should throw an error if allocation is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(deleteAllocation("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should delete allocation if it exists", async () => {
            let deleteCalled = false;

            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return {};
                        },
                        deleteOne: (query, update) => {
                            deleteCalled = true;
                            return {};
                        }
                    };
                },
            };
            
            await expect(deleteAllocation("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(deleteCalled, true);
        });
    });
});