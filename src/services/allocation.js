const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");

const collection = "allocations";

const mapMongoAllocationToDomainModel = (mongoAllocation) => {

    const allocation = {
        id: mongoAllocation._id,
        allocation: mongoAllocation.allocation,
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

const updateAllocation = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoAllocation = await db.collection(collection).findOne(query);

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(data.id, "Allocation");
    }

    await db.collection(collection).updateOne(query, { $set: data });
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
    mapMongoAllocationToDomainModel,
};