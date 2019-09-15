const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");

const collection = "allocations";

const mapMongoAllocationToDomainModel = (mongoAllocation) => {

    const allocation = {
        id: mongoAllocation._id,
        allocation: mongoAllocation.allocation,
        name: mongoAllocation.name,
        description: mongoAllocation.description,
        userId: mongoAllocation.userId,
        projectId: mongoAllocation.projectId,
        start: mongoAllocation.start,
        end: mongoAllocation.end,
    };

    const tags = [];

    for (let tag of mongoAllocation.tags) {
        tags.push({"key": tag.key, "value": tag.value});
    }

    allocation.tags = tags;

    return allocation;
};

const replaceMongoAllocation = (mongoAllocation, allocation) => {
    // TODO: implement
    mongoAllocation.name = allocation.name;
};

const updateMongoAllocation = (mongoAllocation, allocation) => {
    // TODO: update
    mongoAllocation.name = allocation.name;
};

const getAllocations = async (db) => {
    // TODO: pagination
    const mongoAllocations = db.collection(collection).find({});

    const allocations = [];

    await mongoAllocations.forEach((mongoAllocation) => {
        allocations.push(mapMongoAllocationToDomainModel(mongoAllocation));
    });

    return allocations;
};

const getAllocation = async (id, db) => {
    const mongoAllocation = await db.collection(collection).findOne({ _id: mongoHexIdToObjectId(id) });

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(id, "Allocation");
    }

    return mapMongoAllocationToDomainModel(mongoAllocation);
};


const createAllocation = async (data, db) => {
    const response = await db.collection(collection).insertOne(data);

    return { id: response.insertedId }
};

// TODO
const updateAllocation = async (data, replace, db) => {
    const resp = await db.collection(collection).findOne({ _id: id });

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(data.id, "Allocation");
    }

    let updatedAllocation;
    if (replace) {
        updatedAllocation = replaceMongoAllocation(mongoAllocation, data);
    } else {
        updatedAllocation = updateMongoAllocation(mongoAllocation, data);
    }

    await updatedAllocation.save();

    return mapMongoAllocationToDomainModel(updatedAllocation);
};

const deleteAllocation = async (id, db) => {
    await db.collection(collection).deleteOne({ _id: mongoHexIdToObjectId(id) });
};

module.exports = {
    getAllocations: getAllocations,
    getAllocation: getAllocation,
    createAllocation: createAllocation,
    updateAllocation: updateAllocation,
    deleteAllocation: deleteAllocation,
};