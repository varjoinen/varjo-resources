const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");

const { find, findOne, insertOne, deleteOne, updateOne } = require("../db");

const { allocationCollection } = require("../constants");

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

    if ("tags" in mongoAllocation) {
        const tags = [];

        for (let tag of mongoAllocation.tags) {
            tags.push({"key": tag.key, "value": tag.value});
        }

        allocation.tags = tags;
    }

    return allocation;
};

const getAllocations = async (db, tagFilter) => {
    let query = {}

    if ( tagFilter ) {
        query = {
            tags: tagFilter,
        }
    }

    // TODO: pagination
    const mongoAllocations = await find(db, allocationCollection, query);

    const allocations = [];

    await mongoAllocations.forEach((mongoAllocation) => {
        allocations.push(mapMongoAllocationToDomainModel(mongoAllocation));
    });

    return allocations;
};

const getAllocation = async (id, db) => {
    const mongoAllocation = await findOne(db, allocationCollection, { _id: mongoHexIdToObjectId(id) });

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(id, "Allocation");
    }

    return mapMongoAllocationToDomainModel(mongoAllocation);
};


const createAllocation = async (data, db) => {
    const response = await insertOne(db, allocationCollection, data);

    return { id: response.insertedId }
};

const updateAllocation = async (id, data, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoAllocation = await findOne(db, allocationCollection, query);

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(data.id, "Allocation");
    }

    await updateOne(db, allocationCollection, query, data);
};

const deleteAllocation = async (id, db) => {
    const query = { _id: mongoHexIdToObjectId(id) }

    const mongoAllocation = await findOne(db, allocationCollection, query);

    if (!mongoAllocation) {
        throw new ResourceNotFoundError(id, "Project");
    }

    await deleteOne(db, allocationCollection, query);
};

module.exports = {
    getAllocations: getAllocations,
    getAllocation: getAllocation,
    createAllocation: createAllocation,
    updateAllocation: updateAllocation,
    deleteAllocation: deleteAllocation,
    mapMongoAllocationToDomainModel,
};