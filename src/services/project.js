const { mongoHexIdToObjectId, ResourceNotFoundError } = require("../utils");

const collection = "projects";

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

const replaceMongoProject = (mongoProject, project) => {
    // TODO: implement
    mongoProject.name = project.name;
};

const updateMongoProject = (mongoProject, project) => {
    // TODO: update
    mongoProject.name = project.name;
};

const getProjects = async (db) => {
    // TODO: pagination
    const mongoProjects = db.collection(collection).find({});

    const projects = [];

    await mongoProjects.forEach((mongoProject) => {
        projects.push(mapMongoProjectToDomainModel(mongoProject));
    });

    return projects;
};

const getProject = async (id, db) => {
    const mongoProject = await db.collection(collection).findOne({ _id: mongoHexIdToObjectId(id) });

    if (!mongoProject) {
        throw new ResourceNotFoundError(id, "Project");
    }

    return mapMongoProjectToDomainModel(mongoProject);
};


const createProject = async (data, db) => {
    const response = await db.collection(collection).insertOne(data);

    return { id: response.insertedId }
};

// TODO
const updateProject = async (data, replace, db) => {
    const resp = await db.collection(collection).findOne({ _id: id });

    if (!mongoProject) {
        throw new ResourceNotFoundError(data.id, "Project");
    }

    let updatedProject;
    if (replace) {
        updatedProject = replaceMongoProject(mongoProject, data);
    } else {
        updatedProject = updateMongoProject(mongoProject, data);
    }

    await updatedProject.save();

    return mapMongoProjectToDomainModel(updatedProject);
};

const deleteProject = async (id, db) => {
    await db.collection(collection).deleteOne({ _id: mongoHexIdToObjectId(id) });
};

module.exports = {
    getProjects: getProjects,
    getProject: getProject,
    createProject: createProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
};