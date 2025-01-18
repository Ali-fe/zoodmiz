const Edible = require('../models/edible.model');
const Restaurant = require('../models/restaurant.model');

const httpAddEdible = async (req, res) => {
    try {
        const query = { subdomain: req.subdomain };
        const restaurant = await Restaurant.getRestaurants(query);
        if (restaurant.length == 0)
            return res.status(404).json({
                message: 'Restaurant with this subdomain not found',
            });

        const newEdible = await Edible.addEdible(req.body);
        return res.status(201).json({
            message: 'Edible added successfully!',
            edible: newEdible
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add edible', error: error.message,
            model: Edible.schema()
        });
    }
};
const httpGetEdibles = async (req, res) => {
    try {
        const res_query = { Subdomain: req.subdomain };
        const restaurant = await Restaurant.getRestaurants(res_query);
        if (restaurant.length == 0)
            return res.status(404).json({
                message: 'Restaurant with this subdomain not found',
            });
        const edible_query = { _id: restaurant[0]._id };
        const edibles = await Edible.getEdibles(edible_query);
        return res.status(200).json({
            message: 'Edibles fetched successfully!',
            edibles
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get edibles', error: error.message });
    }
};
module.exports = {
    httpGetEdibles,
    httpAddEdible,

    /*httpUpdateEdible,
    httpDeleteEdible,
    httpGetEdibles,*/
};
