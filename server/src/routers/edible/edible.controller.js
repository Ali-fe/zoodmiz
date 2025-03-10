
const { StatusCodes } = require('http-status-codes');
const Edible = require('../../models/edible.model');

const getEdibles = async (req, res) => {
    const { restaurantId } = req.user;
    const edibles = await Edible.find({ restaurant: restaurantId });
    return res.status(StatusCodes.OK).json({ edibles });
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
const updateEdible = async (req, res) => {
    const { edibleId } = req.params;
    const edible = await Edible.findByIdAndUpdate(edibleId, req.body, { new: true });
    res.status(200).json({
        msg: 'edible updated',
        edible
    });
};
const deleteEdible = async (req, res) => {
    const { edibleId } = req.params;
    const edible = await Edible.findByIdAndDelete(edibleId);
    res.status(200).json({
        msg: 'edible deleted'
    });
}

const schema = () => { return createEmptyJson(EdibleModel.schema) };
module.exports = {
    getEdibles,
    addEdible,
    updateEdible,
    deleteEdible,
    schema
};
