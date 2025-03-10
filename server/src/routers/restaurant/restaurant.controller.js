
const Restaurant = require('../../models/restaurant.model');
const { StatusCodes } = require('http-status-codes');

const getRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findById(restaurantId);
    res.status(StatusCodes.OK).json({ restaurant: restaurant.toJSON() });
}
const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const obj = { ...req.body }
    delete obj.tables;
    delete obj.menu;

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, req.body, { new: true });

    res.status(StatusCodes.OK).json({
        msg: 'restaurant updated',
        restaurant: restaurant.toJSON()
    });

}
const deleteRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findOneAndDelete(restaurantId);
    res.status(StatusCodes.OK).json({
        msg: 'restaurant deleted',
        restaurant: restaurant.toJSON()
    });
}
/*
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
}*/
const addTable = async (req, res) => {

    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findById(restaurantId);
    restaurant.tables.push(req.body);
    await restaurant.save();
    res.status(StatusCodes.CREATED).json({
        msg: 'table added',
        tables: restaurant.tables
    });
};
const updateTable = async (req, res) => {
    const { restaurantId } = req.user;
    const { tableId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    const tableIndex = restaurant.tables.findIndex(table => table._id.toString() === tableId);
    restaurant.tables[tableIndex] = { ...restaurant.tables[tableIndex].toObject(), ...req.body };
    await restaurant.save();

    res.status(StatusCodes.OK).json({
        msg: 'table updated',
        tables: restaurant.tables
    });
};
const deleteTable = async (req, res) => {
    const { restaurantId } = req.user;
    const { tableId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    const updatedTables = restaurant.tables.filter(table => table._id.toString() !== tableId);
    restaurant.tables = updatedTables;
    await restaurant.save();
    res.status(StatusCodes.OK).json({
        msg: 'table deleted',
        tables: restaurant.tables
    });
};

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
    deleteRestaurant,
    addTable,
    updateTable,
    deleteTable
};
