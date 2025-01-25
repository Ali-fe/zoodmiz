const Restaurant = require('../../models/restaurant/restaurant.model');
const { getQuery } = require("../../services/query");

// Add a new restaurant
const httpAddRestaurant = async (req, res) => {
    try {
        const query = getQuery([], [req.body.Name], [req.body.Subdomain]);
        const existingRestaurant = await Restaurant.getRestaurants(query);
        if (existingRestaurant.length)
            return res.status(409).json({
                message: 'A restaurant with this name or subname already exists',
            });

        const newRestaurant = await Restaurant.addRestaurant(req.body);
        return res.status(201).json({
            message: 'Restaurant added successfully!',
            restaurant: newRestaurant
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add restaurant', error: error.message,
            model: Restaurant.schema()
        });
    }
};

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
    const { restaurantId } = req.params;
    try {
        const deletedRestaurant = await Restaurant.deleteRestaurantById(restaurantId);

        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant deleted successfully!',
            restaurant: deletedRestaurant
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
    }
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

// Get a restaurant by Subdomain
const httpGetRestaurantBySubdomain = async (req, res) => {
    const { subdomain } = req.params;

    try {
        const restaurant = await Restaurant.getRestaurantBySubdomain(subdomain);

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

// Get all restaurants
const httpGetRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.getRestaurants();

        res.status(200).json({
            message: 'Restaurants fetched successfully!',
            restaurants
        });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ message: 'Failed to get restaurants', error: error.message });
    }
};

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
    catch(error) {
        res.status(500).json({
            message: 'Failed to get menu',
             error: error.message
        });
    }
}
module.exports = {
    httpAddRestaurant,
    httpUpdateRestaurant,
    httpDeleteRestaurant,
    httpGetRestaurantById,
    httpGetRestaurantBySubdomain,
    httpGetRestaurants,
    httpReplaceAllTables,
    httpReplaceMenu,
    httpGetMenu
};
