const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");
const { mapMongoAllocationToDomainModel } = require("./allocation");

const userCollection = "users";
const allocationCollection = "allocations";
const projectCollection = "projects";

const mapMongoUserToDomainModel = (mongoUser) => {

    const user = {
        id: mongoUser._id,
        name: mongoUser.name,
    };

    const tags = [];

    for (let tag of mongoUser.tags) {
        tags.push({"key": tag.key, "value": tag.value});
    }

    user.tags = tags;

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

const getUsers = async (db) => {
    // TODO: pagination
    const mongoUsers = db.collection(userCollection).find({});

    const users = [];

    await mongoUsers.forEach((mongoUser) => {
        users.push(mapMongoUserToDomainModel(mongoUser));
    });

    return users;
};

const getUser = async (id, db) => {
    const mongoUser = await db.collection(userCollection).findOne({ _id: mongoHexIdToObjectId(id) });

    if (!mongoUser) {
        throw new ResourceNotFoundError(id, "User");
    }

    return mapMongoUserToDomainModel(mongoUser);
};


const createUser = async (data, db) => {
    const response = await db.collection(userCollection).insertOne(data);

    return { id: response.insertedId }
};

const updateUser = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoUser = await db.collection(userCollection).findOne(query);

    if (!mongoUser) {
        throw new ResourceNotFoundError(data.id, "User");
    }

    await db.collection(userCollection).updateOne(query, { $set: data });
};

const deleteUser = async (id, db) => {
    await db.collection(userCollection).deleteOne({ _id: mongoHexIdToObjectId(id) });
};

const getUserAllocations = async (id, db) => {
    const mongoAllocations = db.collection(allocationCollection).find({ userId: id });

    const allocations = [];

    for await ( const mongoAllocation of mongoAllocations ) {
        const mongoProject = await db.collection(projectCollection).findOne({ _id: mongoHexIdToObjectId(mongoAllocation.projectId) });

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
};