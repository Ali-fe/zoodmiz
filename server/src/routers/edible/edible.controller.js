
const Edible = require('../../models/edible.fun');
const Restaurant = require('../../models/restaurant.fun');

const httpAddEdible = async (req, res) => {
    try {
        const query = { Subdomain: req.subdomain };
        const restaurant = await Restaurant.getRestaurants(query);
        if (restaurant.length == 0)
            return res.status(404).json({
                message: 'Restaurant with this subdomain not found',
            });
        req.body.Restaurant = restaurant[0]._id;
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
        const edible_query = { Restaurant: restaurant[0]._id };
        const edibles = await Edible.getEdibles(edible_query);
        return res.status(200).json({
            message: 'Edibles fetched successfully!',
            edibles
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get edibles', error: error.message });
    }
};
const httpDeleteEdible = async (req, res) => {
    const { edibleId } = req.params;
    try {
        const deletedEdible = await Edible.deleteEdibleById(edibleId);
        if (!deletedEdible) {
            return res.status(404).json({ message: 'Edible not found' });
        }
        res.status(200).json({
            message: 'Edible deleted successfully!',
            edible: deletedEdible
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete edible', error: error.message });
    }
}
// Update an existing edible
const httpUpdateEdible = async (req, res) => {
    const { edibleId } = req.params;

    try {
        const updatedEdible = await Edible.updateEdibleById(edibleId, req.body);

        if (!updatedEdible) {
            return res.status(404).json({ message: 'Edible not found' });
        }

        res.status(200).json({
            message: 'Edible updated successfully!',
            edible: updatedEdible
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update edible', error: error.message });
    }
};
module.exports = {
    httpGetEdibles,
    httpAddEdible,
    httpUpdateEdible,
    httpDeleteEdible,
};
