
const Restaurant = require('../../models/restaurant.model');
const {StatusCodes} = require ('http-status-codes');

const getRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findById(restaurantId);
    res.status(StatusCodes.OK).json({ restaurant });
}
const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, req.body, { new: true });

    res.status(StatusCodes.OK).json({
        msg: 'restaurant updated',
        restaurant
    });

}
const deleteRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findOneAndDelete(restaurantId);
    res.status(StatusCodes.OK).json({
        msg: 'restaurant deleted',
        restaurant: restaurant
    });
}
const replaceTables = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: { tables: req.body } },
        { new: true }
    )
    res.status(StatusCodes.CREATED).json({
        msg: 'tables applied',
        tables: restaurant.tables
    });
}
const getMenu = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findOne(restaurantId);
    res.status(StatusCodes.OK).json({ menu: restaurant.menu });
}
const replaceMenu = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: { menu: req.body } },
        { new: true }
    );
    res.status(StatusCodes.CREATED).json({
        message: 'menu applied',
        menu: restaurant.menu
    });
}
const schema = () => { return createEmptyJson(Restaurant.schema) };

module.exports = {
    getRestaurant,
    updateRestaurant,
    deleteRestaurant
};
