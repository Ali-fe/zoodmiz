
const Restaurant = require('../../models/restaurant.fun');
const RestaurantModel = require('../../models/restaurant.model');
const { getQuery } = require("../../services/query");

// Update an existing restaurant
const httpUpdateRestaurant = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const updatedRestaurant = await Restaurant.updateRestaurantById(restaurantId, req.body);

        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant updated successfully!',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
    }
};

// Delete a restaurant
const httpDeleteRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findOneAndDelete(id);
    res.status(200).json({
        message: 'Restaurant deleted successfully!',
        restaurant: restaurant
    });
};

// Get a restaurant by ID
const httpGetRestaurantById = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const restaurant = await Restaurant.getRestaurantById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant fetched successfully!',
            restaurant
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to get restaurant', error: error.message });
    }
};

// Get restaurant
const httpGetRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById(id);
    res.status(200).json({
        restaurant
    });
};

// Get restaurant
const httpGetUserRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await RestaurantModel.findById(restaurantId);
    res.status(200).json({
        restaurant
    });
};

// get all restaurant 
const httpGetRestaurants = async (req, res) => {
    const restaurants = await RestaurantModel.find();
    res.status(200).json({
        restaurants
    });
}
const httpReplaceAllTables = async (req, res) => {
    try {
        const resraurant = await Restaurant.replaceAllTables(req.subdomain, req.body);

        res.status(201).json({
            message: 'Tables applied successfully!',
            tables: resraurant.Tables
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to apply tables', error: error.message });
    }
};

const httpReplaceMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.replaceMenu(req.subdomain, req.body);

        res.status(201).json({
            message: 'Menu applied successfully!',
            Menu: restaurant.Menu
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to apply menu', error: error.message });
    }
};
const httpGetMenu = async (req, res) => {
    try {

        const menu = await Restaurant.getMenu(req.subdomain);
        res.status(200).json({
            message: "Menu fetched successfully!",
            Menu: menu
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to get menu',
            error: error.message
        });
    }
}
module.exports = {
    httpUpdateRestaurant,
    httpDeleteRestaurant,
    httpGetRestaurant,
    httpGetUserRestaurant,
    httpGetRestaurants,
    httpReplaceAllTables,
    httpReplaceMenu,
    httpGetMenu
};
