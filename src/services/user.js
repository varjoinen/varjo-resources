const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");
const { mapMongoAllocationToDomainModel } = require("./allocation");

const { find, findOne, insertOne, deleteOne, updateOne } = require("../db");

const { userCollection, allocationCollection, projectCollection } = require("../constants");

const mapMongoUserToDomainModel = (mongoUser) => {

    const user = {
        id: mongoUser._id,
        name: mongoUser.name,
    };

    if ("tags" in mongoUser) {
        const tags = [];

        for (let tag of mongoUser.tags) {
            tags.push({"key": tag.key, "value": tag.value});
        }

        user.tags = tags;
    }

    return user;
};

const mapMongoUserAllocationToDomainModel = (mongoAllocation, mongoProject) => {
    const allocation = mapMongoAllocationToDomainModel(mongoAllocation);

    allocation.projectId = undefined;
    allocation.userId = undefined;

    allocation.project = {
        id: mongoProject._id,
        name: mongoProject.name
    };

    return allocation;
};

const getUsers = async (db, tagFilter) => {
    let query = {}

    if ( tagFilter ) {
        query = {
            tags: tagFilter,
        }
    }

    // TODO: pagination
    const mongoUsers = await find(db, userCollection, query);

    const users = [];

    await mongoUsers.forEach((mongoUser) => {
        users.push(mapMongoUserToDomainModel(mongoUser));
    });

    return users;
};

const getUser = async (id, db) => {
    const mongoUser = await findOne(db, userCollection, { _id: mongoHexIdToObjectId(id) });

    if (!mongoUser) {
        throw new ResourceNotFoundError(id, "User");
    }

    return mapMongoUserToDomainModel(mongoUser);
};


const createUser = async (data, db) => {
    const response = await insertOne(db, userCollection, data);

    return { id: response.insertedId }
};

const updateUser = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoUser = await findOne(db, userCollection, query);

    if (!mongoUser) {
        throw new ResourceNotFoundError(data.id, "User");
    }

    await updateOne(db, userCollection, query, data);
};

const deleteUser = async (id, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoUser = await findOne(db, userCollection, query);

    if (!mongoUser) {
        throw new ResourceNotFoundError(id, "User");
    }

    await deleteOne(db, userCollection, query);
};

const getUserAllocations = async (id, db) => {
    const mongoAllocations = await find(db, allocationCollection, { userId: id });

    const allocations = [];

    for await ( const mongoAllocation of mongoAllocations ) {
        const mongoProject = await findOne(db, projectCollection, { _id: mongoHexIdToObjectId(mongoAllocation.projectId) });

        if (!mongoProject) {
            throw new ResourceNotFoundError(mongoAllocation.projectId, "Project");
        }

        allocations.push(mapMongoUserAllocationToDomainModel(mongoAllocation, mongoProject));
    }

    return allocations;
};

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserAllocations: getUserAllocations,
    mapMongoUserToDomainModel: mapMongoUserToDomainModel,
    mapMongoUserAllocationToDomainModel: mapMongoUserAllocationToDomainModel,
};