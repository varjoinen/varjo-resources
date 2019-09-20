const assert = require("assert");
const chai = require("chai");
const expect = chai.expect
chai.use(require("chai-as-promised"));

const { mapMongoUserToDomainModel,
        mapMongoUserAllocationToDomainModel,
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
        getUserAllocations, } = require("../../src/services/user");

const { ResourceNotFoundError } = require("../../src/utils");

describe("services/user", () => {
    describe("mapMongoUserToDomainModel", () => {
        it("should map with full details", () => {

            const input = {
                _id: "5d847b7679c4a60011d45f27",
                name: "Test project",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const expected = {
                id: input._id,
                name: input.name,
                tags: input.tags,
            } ;

            const output = mapMongoUserToDomainModel(input);
            
            assert.deepEqual(output, expected);
        });

        it("should map with minimal details", () => {

            const input = {
                _id: "5d847b7679c4a60011d45f27",
                name: "Test project",
            };

            const expected = {
                id: input._id,
                name: input.name,
            };

            const output = mapMongoUserToDomainModel(input);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("mapMongoUserAllocationToDomainModel", () => {
        it("should map with full details", () => {

            const inputAllocation = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10.5,
                description: "Allocation",
                userId: "6d847b7679c4a60011d45f26",
                projectId: "7d847b7679c4a60011d45f25",
                start: "2019-01-01",
                end: "2020-01-01",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const inputProject = {
                _id: "7d847b7679c4a60011d45f25",
                name: "Project",
                description: "Description",
                start: "2019-01-01",
                end: "2019-12-01"
            };

            const expected = {
                id: inputAllocation._id,
                allocation: inputAllocation.allocation,
                description: inputAllocation.description,
                start: inputAllocation.start,
                end: inputAllocation.end,
                tags: inputAllocation.tags,
                project: {
                    id: inputProject._id,
                    name: inputProject.name
                },
                userId: undefined,
                projectId: undefined,
            }

            const output = mapMongoUserAllocationToDomainModel(inputAllocation, inputProject);
            
            assert.deepEqual(output, expected);
        });

        it("should map with minimal details", () => {

            const inputAllocation = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10.5,
            };

            const inputProject = {
                _id: "7d847b7679c4a60011d45f25",
                name: "Project",
            };

            const expected = {
                id: inputAllocation._id,
                allocation: inputAllocation.allocation,
                project: {
                    id: inputProject._id,
                    name: inputProject.name
                },
                userId: undefined,
                projectId: undefined,
                description: undefined,
                start: undefined,
                end: undefined,
            }

            const output = mapMongoUserAllocationToDomainModel(inputAllocation, inputProject);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getUsers", () => {
        it("should return an empty array if no users in database", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [];
                        },
                    };
                },
            };
            
            const output = await getUsers(mockDb);
            
            assert.deepEqual(output, []);
        });

        it("should return array of users from database", async () => {
            const dbUsers = [
                {
                    _id: "6d847b7679c4a60011d45f26",
                    name: "User 1",
                    tags: [
                        {
                            key: "key 1",
                            value: "value 1"
                        }
                    ],
                },
                {
                    _id: "7d847b7679c4a60011d45f25",
                    name: "TUser 2",
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
                            return dbUsers;
                        },
                    };
                },
            };

            const expected = [
                {
                    id: dbUsers[0]._id,
                    name: dbUsers[0].name,
                    tags: dbUsers[0].tags,
                },
                {
                    id: dbUsers[1]._id,
                    name: dbUsers[1].name,
                    tags: dbUsers[1].tags,
                },
            ]
            
            const output = await getUsers(mockDb);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getUser", () => {
        it("should throw an error if user is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(getUser("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should return user found from database", async () => {
            const dbUser= {
                _id: "6d847b7679c4a60011d45f26",
                name: "User",
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
                            return dbUser;
                        },
                    };
                },
            };

            const expected = {
                id: dbUser._id,
                name: dbUser.name,
                tags: dbUser.tags,
            };
            
            await expect(getUser("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("createUser", () => {
        it("should return id of created user", async () => {
            const input = {
                name: "User",
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
            
            await expect(createUser(input, mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("updateUser", () => {
        it("should throw an error if user is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(updateUser("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should update user if it exists", async () => {
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
            
            await expect(updateUser("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(updateCalled, true);
        });
    });

    describe("deleteUser", () => {
        it("should throw an error if user is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(deleteUser("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should delete user if it exists", async () => {
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
            
            await expect(deleteUser("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(deleteCalled, true);
        });
    });

    describe("getUserAllocations", () => {
        it("should return an empty array if no allocations found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [];
                        },
                    };
                },
            };
            
            await expect(getUserAllocations("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal([]);
        });

        it("should throw an error if allocations's project is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [{ projectId: "5d847b7679c4a60011d45f25" }];
                        },
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(getUserAllocations("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should return user's project allocations", async () => {
            const dbAllocations = [
                {
                    _id: "5d847b7679c4a60011d45f27",
                    allocation: 15,
                    description: "Allocation 1",
                    userId: "6d847b7679c4a60011d45f26",
                    projectId: "7d847b7679c4a60011d45f25",
                    start: "2019-01-01",
                    end: "2020-01-01",
                    tags: [
                        {
                            key: "key 1",
                            value: "value 1"
                        }
                    ],
                },
                {
                    _id: "6d847b7679c4a60011d45f26",
                    allocation: 10.5,
                    description: "Allocation 2",
                    userId: "6d847b7679c4a60011d45f26",
                    projectId: "7d847b7679c4a60011d45f25",
                    start: "2019-01-01",
                    end: "2020-01-01",
                    tags: [
                        {
                            key: "key 2",
                            value: "value 2"
                        }
                    ],
                }
            ];

            const dbProject = {
                _id: "7d847b7679c4a60011d45f25",
                name: "Project",
                description: "Description",
                start: "2019-01-01",
                end: "2019-12-01"
            };

            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return dbAllocations
                        },
                        findOne: (query) => {
                            return dbProject;
                        },
                    };
                },
            };

            const expected = [
                {
                    id: dbAllocations[0]._id,
                    allocation: dbAllocations[0].allocation,
                    description: dbAllocations[0].description,
                    start: dbAllocations[0].start,
                    end: dbAllocations[0].end,
                    tags: dbAllocations[0].tags,
                    project: {
                        id: dbProject._id,
                        name: dbProject.name
                    },
                    userId: undefined,
                    projectId: undefined,
                },
                {
                    id: dbAllocations[1]._id,
                    allocation: dbAllocations[1].allocation,
                    description: dbAllocations[1].description,
                    start: dbAllocations[1].start,
                    end: dbAllocations[1].end,
                    tags: dbAllocations[1].tags,
                    project: {
                        id: dbProject._id,
                        name: dbProject.name
                    },
                    userId: undefined,
                    projectId: undefined,
                }
            ]
            
            await expect(getUserAllocations("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal(expected);
        });
    });
});