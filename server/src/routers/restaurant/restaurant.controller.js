const Restaurant = require('../../models/restaurant.model');
const Table = require('../../models/table.model');
const { StatusCodes } = require('http-status-codes');

// Get base URL from environment or default to production
const getBaseUrl = () => {
    return process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5173' 
        : 'https://www.zoodmiz.ir';
};

const getRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const restaurant = await Restaurant.findById(restaurantId);
    res.status(StatusCodes.OK).json({ restaurant: restaurant.toJSON() });
}
const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.user;
    const obj = { ...req.body }
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

const getTables = async (req,res)=>{
    const { restaurantId } = req.user;
    const tables = await Table.find({ restaurant: restaurantId });
    return res.status(StatusCodes.OK).json({ tables });
}
const addTable = async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    req.body.menuUrl=`${getBaseUrl()}/restaurants/menu/${restaurantId}/${req.body.numeral}`; 
    const table = await Table.create(req.body);
    return res.status(201).json({
        msg: 'Table added successfully',
        table
    });
};
const updateTable = async (req, res) => {
    const { restaurantId } = req.user;
    const { tableId } = req.params;
    req.body.menuUrl=`${getBaseUrl()}/restaurants/menu/${restaurantId}/${req.body.numeral}`; 
    const table = await Table.findByIdAndUpdate(tableId,req.body);
    res.status(StatusCodes.OK).json({
        msg: 'table updated',
        tables: table
    });
};
const deleteTable = async (req, res) => {
    const { tableId } = req.params;
    const table = await Table.findByIdAndDelete(tableId);
    res.status(200).json({
        msg: 'table  deleted successfully'
    });
};

// // const getMenu = async (req, res) => {
// //     const { restaurantId } = req.user;
// //     const restaurant = await Restaurant.findOne(restaurantId);
// //     res.status(StatusCodes.OK).json({ menu: restaurant.menu });
// // }
// const addMenuItem = async (req, res) => {
//     const { restaurantId } = req.user;
//     const restaurant = await Restaurant.findById(restaurantId);
//     restaurant.menu.push(req.body);
//     await restaurant.save();
//     res.status(StatusCodes.CREATED).json({
//         msg: 'menu item added',
//         menuItem : restaurant.menu.map(item => {if(item.edibleId === req.body.edibleId) return item;})
//     });
// }
// const updateMenuItem = async (req, res) => {
//     const { restaurantId } = req.user;
//     const { menuItemId } = req.params;
//     const restaurant = await Restaurant.findById(restaurantId);
//     const itemIndex = restaurant.menu.findIndex(item => item._id.toString() === menuItemId);
//     restaurant.menu[itemIndex] = { ...restaurant.menu[itemIndex].toObject(), ...req.body };
//     await restaurant.save();
//     res.status(StatusCodes.OK).json({
//         msg: 'menu item updated',
//         menu: restaurant.menu
//     });
// }
// const deleteMenuItem = async (req, res) => {
//     const { restaurantId } = req.user;
//     const { menuItemId } = req.params;
//     const restaurant = await Restaurant.findById(restaurantId);
//     const updatedMenu = restaurant.menu.filter(item => item._id.toString() !== menuItemId);
//     restaurant.menu = updatedMenu;
//     await restaurant.save();
//     res.status(StatusCodes.OK).json({
//         msg: 'menu item deleted',
//         menu: restaurant.menu
//     });
// }
// const getMenuItems = async (req, res) => {
//     const { restaurantId } = req.user;
//     const restaurant = await Restaurant.findById(restaurantId);
//     res.status(StatusCodes.OK).json({ menu: restaurant.menu });
// }

const schema = () => { return createEmptyJson(Restaurant.schema) };

module.exports = {
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getTables,
    addTable,
    updateTable,
    deleteTable,
};
