const RestaurantModel = require('./restaurant.mongo');

/* return await RestaurantModel.findOneAndUpdate({
       Name: restaurant.Name,
       Subdomain: restaurant.Subdomain
     }, restaurant, {
       upsert: true,
     });*/

// Add a new restaurant
const addRestaurant = async (restaurant) => {
    return await RestaurantModel.create(restaurant);
};

// Update an existing restaurant by ID
const updateRestaurantById = async (id, data) => {
    return await RestaurantModel.findByIdAndUpdate(id, data, { new: true });
};

// Delete a restaurant by ID
const deleteRestaurantById = async (id) => {
    return await RestaurantModel.findByIdAndDelete(id);
};

// Get a restaurant by query
const getRestaurants = async (query) => {
    return await RestaurantModel.find(query);
};


module.exports = {
    addRestaurant,
    updateRestaurantById,
    deleteRestaurantById,
    getRestaurants,
};
