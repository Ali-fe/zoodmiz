
const Edible = require('../../models/edible.model');

const getEdibles = async (req, res) => {
    const { restaurantId } = req.user;
    const edibles = await Edible.find({ restaurant: restaurantId });
    return res.status(200).json({ edibles });
};

const addEdible = async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    const edible = await Edible.create(req.body);
    return res.status(201).json({
        msg: 'edible added',
        edible
    });
};

const deleteEdible = async (req, res) => {
    const { id } = req.params;
    const edible = await Edible.findByIdAndDelete(id);
    res.status(200).json({
        msg: 'edible deleted',
        edible
    });
}
const updateEdible = async (req, res) => {
    const { id } = req.params;
    const edible = await Edible.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
        msg: 'edible updated',
        edible
    });
};
const schema = () => { return createEmptyJson(EdibleModel.schema) };
module.exports = {
    getEdibles,
    addEdible,
    updateEdible,
    deleteEdible,
    schema
};
