const assert = require("assert");
const chai = require("chai");
const expect = chai.expect
chai.use(require("chai-as-promised"));

const { mapMongoProjectToDomainModel,
        mapMongoProjectAllocationToDomainModel,
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        getProjectAllocations, } = require("../../src/services/project");

const { ResourceNotFoundError } = require("../../src/utils");

describe("services/project", () => {
    describe("mapMongoProjectToDomainModel", () => {
        it("should map with full details", () => {

            const input = {
                _id: "5d847b7679c4a60011d45f27",
                name: "Test project",
                description: "description",
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
                name: input.name,
                description: input.description,
                start: input.start,
                end: input.end,
                tags: input.tags,
            } ;

            const output = mapMongoProjectToDomainModel(input);
            
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
                description: undefined,
                start: undefined,
                end: undefined,
            };

            const output = mapMongoProjectToDomainModel(input);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("mapMongoProjectAllocationToDomainModel", () => {
        it("should map with full details", () => {

            const inputAllocation = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10.5,
                description: "Allocation",
                projectId: "6d847b7679c4a60011d45f26",
                userId: "7d847b7679c4a60011d45f25",
                start: "2019-01-01",
                end: "2020-01-01",
                tags: [
                    {
                        key: "key",
                        value: "value"
                    }
                ],
            };

            const inputUser = {
                _id: "7d847b7679c4a60011d45f25",
                name: "Project",
            };

            const expected = {
                id: inputAllocation._id,
                allocation: inputAllocation.allocation,
                description: inputAllocation.description,
                start: inputAllocation.start,
                end: inputAllocation.end,
                tags: inputAllocation.tags,
                user: {
                    id: inputUser._id,
                    name: inputUser.name
                },
                projectId: undefined,
                userId: undefined,
            }

            const output = mapMongoProjectAllocationToDomainModel(inputAllocation, inputUser);
            
            assert.deepEqual(output, expected);
        });

        it("should map with minimal details", () => {

            const inputAllocation = {
                _id: "5d847b7679c4a60011d45f27",
                allocation: 10.5,
            };

            const inputUser = {
                _id: "7d847b7679c4a60011d45f25",
                name: "Project",
            };

            const expected = {
                id: inputAllocation._id,
                allocation: inputAllocation.allocation,
                user: {
                    id: inputUser._id,
                    name: inputUser.name
                },
                projectId: undefined,
                userId: undefined,
                description: undefined,
                start: undefined,
                end: undefined,
            }

            const output = mapMongoProjectAllocationToDomainModel(inputAllocation, inputUser);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getProjects", () => {
        it("should return an empty array if no projects in database", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [];
                        },
                    };
                },
            };
            
            const output = await getProjects(mockDb);
            
            assert.deepEqual(output, []);
        });

        it("should return array of projects from database", async () => {
            const dbProjects = [
                {
                    _id: "6d847b7679c4a60011d45f26",
                    name: "Project 1",
                    description: "Description 1",
                    start: "2019-01-01",
                    end: "2019-02-01",
                    tags: [
                        {
                            key: "key 1",
                            value: "value 1"
                        }
                    ],
                },
                {
                    _id: "7d847b7679c4a60011d45f25",
                    name: "TProject 2",
                    description: "Description 2",
                    start: "2019-03-01",
                    end: "2019-04-01",
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
                            return dbProjects;
                        },
                    };
                },
            };

            const expected = [
                {
                    id: dbProjects[0]._id,
                    name: dbProjects[0].name,
                    description: dbProjects[0].description,
                    start: dbProjects[0].start,
                    end: dbProjects[0].end,
                    tags: dbProjects[0].tags,
                },
                {
                    id: dbProjects[1]._id,
                    name: dbProjects[1].name,
                    description: dbProjects[1].description,
                    start: dbProjects[1].start,
                    end: dbProjects[1].end,
                    tags: dbProjects[1].tags,
                },
            ]
            
            const output = await getProjects(mockDb);
            
            assert.deepEqual(output, expected);
        });
    });

    describe("getProject", () => {
        it("should throw an error if project is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(getProject("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should return project found from database", async () => {
            const dbProject= {
                _id: "6d847b7679c4a60011d45f26",
                name: "Project",
                description: "Description",
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
                            return dbProject;
                        },
                    };
                },
            };

            const expected = {
                id: dbProject._id,
                name: dbProject.name,
                description: dbProject.description,
                start: dbProject.start,
                end: dbProject.end,
                tags: dbProject.tags,
            };
            
            await expect(getProject("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("createProject", () => {
        it("should return id of created project", async () => {
            const input = {
                name: "Project",
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
            
            await expect(createProject(input, mockDb))
                .to.eventually.deep.equal(expected);
        });
    });

    describe("updateProject", () => {
        it("should throw an error if project is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(updateProject("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should update project if it exists", async () => {
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
            
            await expect(updateProject("6d847b7679c4a60011d45f26", {}, mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(updateCalled, true);
        });
    });

    describe("deleteProject", () => {
        it("should throw an error if project is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(deleteProject("6d847b7679c4a60011d45f26", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should delete project if it exists", async () => {
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
            
            await expect(deleteProject("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.be.fulfilled;
            
            assert.equal(deleteCalled, true);
        });
    });

    describe("getProjectAllocations", () => {
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
            
            await expect(getProjectAllocations("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal([]);
        });

        it("should throw an error if allocations's project is not found", async () => {
            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return [{ userId: "5d847b7679c4a60011d45f25" }];
                        },
                        findOne: (query) => {
                            return null;
                        },
                    };
                },
            };
            
            await expect(getProjectAllocations("6d847b7679c4a60011d45f24", mockDb))
                .to.be.rejectedWith(ResourceNotFoundError);
        });

        it("should return project's project allocations", async () => {
            const dbAllocations = [
                {
                    _id: "5d847b7679c4a60011d45f27",
                    allocation: 15,
                    description: "Allocation 1",
                    projectId: "6d847b7679c4a60011d45f26",
                    userId: "7d847b7679c4a60011d45f25",
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
                    projectId: "6d847b7679c4a60011d45f26",
                    userId: "7d847b7679c4a60011d45f25",
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

            const dbUser = {
                _id: "7d847b7679c4a60011d45f25",
                name: "User",
            };

            const mockDb = {
                collection: (coll) => {
                    return {
                        find: (query) => {
                            return dbAllocations
                        },
                        findOne: (query) => {
                            return dbUser;
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
                    user: {
                        id: dbUser._id,
                        name: dbUser.name
                    },
                    projectId: undefined,
                    userId: undefined,
                },
                {
                    id: dbAllocations[1]._id,
                    allocation: dbAllocations[1].allocation,
                    description: dbAllocations[1].description,
                    start: dbAllocations[1].start,
                    end: dbAllocations[1].end,
                    tags: dbAllocations[1].tags,
                    user: {
                        id: dbUser._id,
                        name: dbUser.name
                    },
                    projectId: undefined,
                    userId: undefined,
                }
            ]
            
            await expect(getProjectAllocations("6d847b7679c4a60011d45f26", mockDb))
                .to.eventually.deep.equal(expected);
        });
    });
});