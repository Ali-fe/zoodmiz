const EdibleModel = require('./schema/edible.mongo');
const { createEmptyJson } = require("./../services/query");

const addEdible = async (edible) => {
    return await EdibleModel.create(edible);
};
const updateEdbileById = async (id, edible) => {
    return await EdibleModel.findByIdAndUpdate(id, edible, { new: true });
};
const deleteEdibleById = async (id) => {
    return await EdibleModel.findByIdAndDelete(id);
};
const getEdibles = async (query) => {
    return await EdibleModel.find(query);
};
const schema = () => { return createEmptyJson(EdibleModel.schema) };

module.exports = {
    schema,
    addEdible,
    updateEdbileById,
    deleteEdibleById,
    getEdibles
}