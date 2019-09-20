const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");
const { mapMongoAllocationToDomainModel } = require("./allocation");

const { find, findOne, insertOne, deleteOne, updateOne } = require("../db");

const { userCollection, allocationCollection, projectCollection } = require("../constants");

const mapMongoProjectToDomainModel = (mongoProject) => {

    const project = {
        id: mongoProject._id,
        name: mongoProject.name,
        description: mongoProject.description,
        start: mongoProject.start,
        end: mongoProject.end,
    };

    if ("tags" in mongoProject) {
        const tags = [];

        for (let tag of mongoProject.tags) {
            tags.push({"key": tag.key, "value": tag.value});
        }

        project.tags = tags;
    }

    return project;
};

const mapMongoProjectAllocationToDomainModel = (mongoAllocation, mongoUser) => {
    const allocation = mapMongoAllocationToDomainModel(mongoAllocation);

    allocation.projectId = undefined;
    allocation.userId = undefined;

    allocation.user = {
        id: mongoUser._id,
        name: mongoUser.name
    };

    return allocation;
};

const getProjects = async (db) => {
    // TODO: pagination
    const mongoProjects = await find(db, projectCollection, {});

    const projects = [];

    await mongoProjects.forEach((mongoProject) => {
        projects.push(mapMongoProjectToDomainModel(mongoProject));
    });

    return projects;
};

const getProject = async (id, db) => {
    const mongoProject = await findOne(db, projectCollection, { _id: mongoHexIdToObjectId(id) });

    if (!mongoProject) {
        throw new ResourceNotFoundError(id, "Project");
    }

    return mapMongoProjectToDomainModel(mongoProject);
};


const createProject = async (data, db) => {
    const response = await insertOne(db, projectCollection, data);

    return { id: response.insertedId }
};

const updateProject = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoProject = await findOne(db, projectCollection, query);

    if (!mongoProject) {
        throw new ResourceNotFoundError(data.id, "Project");
    }

    await updateOne(db, projectCollection, query, data);
};

const deleteProject = async (id, db) => {
    await deleteOne(db, projectCollection, { _id: mongoHexIdToObjectId(id) });
};

const getProjectAllocations = async (id, db) => {
    const mongoAllocations = await find(db, allocationCollection, { projectId: id });

    const allocations = [];

    for await ( const mongoAllocation of mongoAllocations ) {
        const mongoUser = await findOne(db, userCollection, { _id: mongoHexIdToObjectId(mongoAllocation.userId) });

        if (!mongoUser) {
            throw new ResourceNotFoundError(mongoAllocation.userId, "User");
        }

        allocations.push(mapMongoProjectAllocationToDomainModel(mongoAllocation, mongoUser));
    }

    return allocations;
};

module.exports = {
    getProjects: getProjects,
    getProject: getProject,
    createProject: createProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
    getProjectAllocations: getProjectAllocations,
};