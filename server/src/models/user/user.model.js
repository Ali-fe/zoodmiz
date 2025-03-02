
const UseModel = require('./user.mongo');

const createUser = async (user) => {
    return await UseModel.create(user);
};
const updatUser = async (id, user) => {
    return await UseModel.findByIdAndUpdate(id, user, { new: true });
};
const deleteUser = async (id) => {
    return await UseModel.findByIdAndDelete(id);
};
const getUser = async (query) => {
    return await UseModel.find(query);
};

module.exports ={
    createUser,
    updatUser,
    deleteUser,
    getUser
}