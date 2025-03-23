
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

// const getMenu = async (req, res) => {
//     const { restaurantId } = req.user;
//     const restaurant = await Restaurant.findOne(restaurantId);
//     res.status(StatusCodes.OK).json({ menu: restaurant.menu });
// }
const addMenuItem = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findById(restaurantId);
    restaurant.menu.push(req.body);
    await restaurant.save();
    res.status(StatusCodes.CREATED).json({
        msg: 'menu item added',
        menu: restaurant.menu
    });
}
const updateMenuItem = async (req, res) => {
    const { restaurantId } = req.user;
    const { menuItemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    const itemIndex = restaurant.menu.findIndex(item => item._id.toString() === menuItemId);
    restaurant.menu[itemIndex] = { ...restaurant.menu[itemIndex].toObject(), ...req.body };
    await restaurant.save();
    res.status(StatusCodes.OK).json({
        msg: 'menu item updated',
        menu: restaurant.menu
    });
}
const deleteMenuItem = async (req, res) => {
    const { restaurantId } = req.user;
    const { menuItemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    const updatedMenu = restaurant.menu.filter(item => item._id.toString() !== menuItemId);
    restaurant.menu = updatedMenu;
    await restaurant.save();
    res.status(StatusCodes.OK).json({
        msg: 'menu item deleted',
        menu: restaurant.menu
    });
}
const getMenu = async (req, res) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId).populate("menu.edibleId","-_id -restaurant");
    const menu = restaurant.menu;
    res.status(StatusCodes.OK).json({ menu });
}
const schema = () => { return createEmptyJson(Restaurant.schema) };

module.exports = {
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addTable,
    updateTable,
    deleteTable,
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};
