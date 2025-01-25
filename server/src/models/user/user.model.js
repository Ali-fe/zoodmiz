const UseModel = require('./user.mongo');

const addUser = async (user) => {
    return await UseModel.create(user);
};
const updatUserById = async (id, user) => {
    return await UseModel.findByIdAndUpdate(id, user, { new: true });
};
const deleteUserById = async (id) => {
    return await UseModel.findByIdAndDelete(id);
};
const getUser = async (query) => {
    return await UseModel.find(query);
};