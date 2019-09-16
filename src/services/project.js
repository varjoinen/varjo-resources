const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");
const { mapMongoAllocationToDomainModel } = require("./allocation");

const projectCollection = "projects";
const allocationCollection = "allocations"
const userCollection = "users";

const mapMongoProjectToDomainModel = (mongoProject) => {

    const project = {
        id: mongoProject._id,
        name: mongoProject.name,
        description: mongoProject.description,
        start: mongoProject.start,
        end: mongoProject.end,
    };

    const tags = [];

    for (let tag of mongoProject.tags) {
        tags.push({"key": tag.key, "value": tag.value});
    }

    project.tags = tags;

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
    return db
            .collection(projectCollection)
            .find({})
            .map(mongoProject => {
                return mapMongoProjectToDomainModel(mongoProject);
            })
            .toArray();
};

const getProject = async (id, db) => {
    const mongoProject = await db.collection(projectCollection).findOne({ _id: mongoHexIdToObjectId(id) });

    if (!mongoProject) {
        throw new ResourceNotFoundError(id, "Project");
    }

    return mapMongoProjectToDomainModel(mongoProject);
};


const createProject = async (data, db) => {
    const response = await db.collection(projectCollection).insertOne(data);

    return { id: response.insertedId }
};

const updateProject = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoProject = await db.collection(projectCollection).findOne(query);

    if (!mongoProject) {
        throw new ResourceNotFoundError(data.id, "Project");
    }

    await db.collection(projectCollection).updateOne(query, { $set: data });
};

const deleteProject = async (id, db) => {
    await db.collection(projectCollection).deleteOne({ _id: mongoHexIdToObjectId(id) });
};

const getProjectAllocations = async (id, db) => {
    const mongoAllocations = db.collection(allocationCollection).find({ projectId: id });

    const allocations = [];

    for await ( const mongoAllocation of mongoAllocations ) {
        const mongoUser = await db.collection(userCollection).findOne({ _id: mongoHexIdToObjectId(mongoAllocation.userId) });

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