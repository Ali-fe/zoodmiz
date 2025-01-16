const restaurantModel = require('../models/restaurant.model');
const { getQuery} = require("./../services/query");
// Add a new restaurant
const addRestaurant = async (req, res) => {
    try {
        const query = getQuery([], [req.body.Name], [req.body.Subdomain]);
        const existingRestaurant = await restaurantModel.getRestaurants(query);
        if (existingRestaurant.length)
            return res.status(409).json({
                message: 'A restaurant with this name or subname already exists',
            });

        const newRestaurant = await restaurantModel.addRestaurant(req.body);
        return res.status(201).json({
            message: 'Restaurant added successfully!',
            restaurant: newRestaurant
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to add restaurant', error: error.message
        });
    }
};

// Update an existing restaurant
const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const updatedRestaurant = await restaurantModel.updateRestaurantById(restaurantId, req.body);

        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant updated successfully!',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
    }
};

// Delete a restaurant
const deleteRestaurant = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const deletedRestaurant = await restaurantModel.deleteRestaurantById(restaurantId);

        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant deleted successfully!',
            restaurant: deletedRestaurant
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
    }
};

// Get a restaurant by ID
const getRestaurantById = async (req, res) => {
    const { restaurantId } = req.params;

    try {
        const restaurant = await restaurantModel.getRestaurantById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant fetched successfully!',
            restaurant
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get restaurant', error: error.message });
    }
};

// Get a restaurant by Subdomain
const getRestaurantBySubdomain = async (req, res) => {
    const { subdomain } = req.params;

    try {
        const restaurant = await restaurantModel.getRestaurantBySubdomain(subdomain);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant fetched successfully!',
            restaurant
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get restaurant', error: error.message });
    }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.getRestaurants();

        res.status(200).json({
            message: 'Restaurants fetched successfully!',
            restaurants
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get restaurants', error: error.message });
    }
};

module.exports = {
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    getRestaurantBySubdomain,
    getAllRestaurants
};
