const RestaurantModel = require('./restaurant.model');
const { createEmptyJson } = require("../services/query");

const addRestaurant = async (restaurant) => {
    return await RestaurantModel.create(restaurant);
};
const updateRestaurantById = async (id, restaurant) => {
    return await RestaurantModel.findByIdAndUpdate(id, restaurant, { new: true });
};

const getRestaurant = async (id) => {
    return await RestaurantModel.findById(id);
};
const addTableToRestaurant = async (restaurantId, tableData) => {
    return await RestaurantModel.findByIdAndUpdate(
        restaurantId,
        { $push: { Tables: tableData } },
        { new: true }
    );
};
const removeTableFromRestaurant = async (restaurantId, tableNumber) => {
    return await RestaurantModel.findByIdAndUpdate(
        restaurantId,
        { $pull: { Tables: { Number: tableNumber } } },
        { new: true }
    );
};
const updateTableStatus = async (restaurantId, tableNumber, newStatus) => {
    return await RestaurantModel.findOneAndUpdate(
        { _id: restaurantId, 'Tables.Number': tableNumber },
        { $set: { 'Tables.$.Status': newStatus } },
        { new: true }
    );
};
const updateRestaurantLocation = async (restaurantId, newLocation) => {
    return await RestaurantModel.findByIdAndUpdate(
        restaurantId,
        { $set: { Location: newLocation } },
        { new: true }
    );
};
const updateRestaurantAddress = async (restaurantId, newAddress) => {
    return await RestaurantModel.findByIdAndUpdate(
        restaurantId,
        { $set: { Address: newAddress } },
        { new: true }
    );
};
const replaceAllTables = async (subdomain, newTables) => {

    console.log(newTables);
    const restaurant = await RestaurantModel.findOne({ Subdomain: subdomain });
    if (restaurant) {
        return await RestaurantModel.findByIdAndUpdate(
            restaurant._id,
            { $set: { Tables: newTables } },
            { new: true }
        );
    }
    else
        throw Error("Restaurant not found!");
};
const replaceMenu = async (subdomain, newMenu) => {

    const query = { Subdomain: subdomain };
    const restaurant = await RestaurantModel.findOne(query);
    if (restaurant) {
        return await RestaurantModel.findByIdAndUpdate(
            restaurant._id,
            { $set: { Menu: newMenu } },
            { new: true }
        );
    }
    else
        throw Error("Restaurant not found!");
};
const getMenu = async (subdomain) => {
    const query = { Subdomain: subdomain };
    const restaurant = await RestaurantModel.findOne(query);
    if (restaurant) {
        return restaurant.Menu;
    }
    else
        throw Error("Restaurant not found!");
}
const schema = () => { return createEmptyJson(RestaurantModel.schema) };

module.exports = {
    schema,
    addRestaurant,
    updateRestaurantById,
    getRestaurant,
    addTableToRestaurant,
    removeTableFromRestaurant,
    updateTableStatus,
    updateRestaurantLocation,
    updateRestaurantAddress,
    replaceAllTables,
    replaceMenu,
    getMenu
};
