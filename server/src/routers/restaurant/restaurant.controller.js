const Restaurant = require('../../models/restaurant.model');
const Table = require('../../models/table.model');
const { NotFoundError } = require('../../errors/customErrors');
const { TABLE_STATUS, NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../../utils/constants');
const createNotification = require('../../services/notification');
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
const getRestaurants = async (req,res)=>{
    const restaurants= await Restaurant.find({});
    res.status(StatusCodes.OK).json({ restaurants });
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
    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.TABLE,
        action: NOTIFICATION_ACTION.CREATE,
        title: 'میز اضافه شد',
        message: `میز ${table.numeral} اضافه شد`
    });
    return res.status(201).json({
        msg: 'Table added successfully',
        table
    });
};
const updateTable = async (req, res) => {
    const { restaurantId } = req.user;
    const { tableId } = req.params;
    const existingTable = await Table.findOne({ _id: tableId, restaurant: restaurantId });
    if (!existingTable) throw new NotFoundError(`no table by id ${tableId}`);

    const numeral = req.body.numeral ?? existingTable.numeral;
    req.body.menuUrl = `${getBaseUrl()}/restaurants/menu/${restaurantId}/${numeral}`;
    const table = await Table.findByIdAndUpdate(tableId, req.body, { new: true });

    const previousStatus = existingTable.status;
    const nextStatus = req.body.status;
    let action = NOTIFICATION_ACTION.UPDATE;
    let title = 'میز ویرایش شد';
    let message = `میز ${numeral} ویرایش شد`;

    if (nextStatus && nextStatus !== previousStatus) {
        if (nextStatus === TABLE_STATUS.RESERVED) {
            action = NOTIFICATION_ACTION.RESERVE;
            title = 'میزی رزرو شد';
            message = `میز ${numeral} رزرو شد`;
        } else if (previousStatus === TABLE_STATUS.RESERVED && nextStatus === TABLE_STATUS.AVAILABLE) {
            title = 'رزرو میز لغو شد';
            message = `رزرو میز ${numeral} لغو شد`;
        } else if (nextStatus === TABLE_STATUS.OCCUPIED) {
            title = 'میز اشغال شد';
            message = `میز ${numeral} اشغال شد`;
        } else if (nextStatus === TABLE_STATUS.AVAILABLE) {
            title = 'میز آزاد شد';
            message = `میز ${numeral} آزاد شد`;
        }
    }

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.TABLE,
        action,
        title,
        message
    });

    res.status(StatusCodes.OK).json({
        msg: 'table updated',
        tables: table
    });
};
const deleteTable = async (req, res) => {
    const { restaurantId } = req.user;
    const { tableId } = req.params;
    const table = await Table.findOneAndDelete({ _id: tableId, restaurant: restaurantId });
    if (!table) throw new NotFoundError(`no table by id ${tableId}`);

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.TABLE,
        action: NOTIFICATION_ACTION.DELETE,
        title: 'میز حذف شد',
        message: `میز ${table.numeral} حذف شد`
    });

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
    getRestaurants,
    getTables,
    addTable,
    updateTable,
    deleteTable,
};
