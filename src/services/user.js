const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");

const collection = "users";

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

const replaceMongoUser = (mongoUser, user) => {
    // TODO: implement
    mongoUser.name = user.name;
};

const updateMongoUser = (mongoUser, user) => {
    // TODO: update
    mongoUser.name = user.name;
};

const getUsers = async (db) => {
    // TODO: pagination
    const mongoUsers = db.collection(collection).find({});

    const users = [];

    await mongoUsers.forEach((mongoUser) => {
        users.push(mapMongoUserToDomainModel(mongoUser));
    });

    return users;
};

const getUser = async (id, db) => {
    const mongoUser = await db.collection(collection).findOne({ _id: mongoHexIdToObjectId(id) });

    if (!mongoUser) {
        throw new ResourceNotFoundError(id, "User");
    }

    return mapMongoUserToDomainModel(mongoUser);
};


const createUser = async (data, db) => {
    const response = await db.collection(collection).insertOne(data);

    return { id: response.insertedId }
};

// TODO
const updateUser = async (data, replace, db) => {
    const resp = await db.collection(collection).findOne({ _id: id });

    if (!mongoUser) {
        throw new ResourceNotFoundError(data.id, "User");
    }

    let updatedUser;
    if (replace) {
        updatedUser = replaceMongoUser(mongoUser, data);
    } else {
        updatedUser = updateMongoUser(mongoUser, data);
    }

    await updatedUser.save();

    return mapMongoUserToDomainModel(updatedUser);
};

const deleteUser = async (id, db) => {
    await db.collection(collection).deleteOne({ _id: mongoHexIdToObjectId(id) });
};

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
};