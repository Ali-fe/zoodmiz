
const User = require('./user.model');

const createUser = async (user) => {
    return await User.create(user);
};
const updatUser = async (id, user) => {
    return await User.findByIdAndUpdate(id, user, { new: true });
};
const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
const getUser = async (query) => {
    return await User.find(query);
};

module.exports ={
    createUser,
    updatUser,
    deleteUser,
    getUser
}