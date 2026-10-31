const { StatusCodes } = require('http-status-codes');
const Edible = require('../../models/edible.model');
const {handleImageUpload,getFileList, deleteFile } = require('../../services/file');
const Restaurant = require('../../models/restaurant.model');
const { NotFoundError } = require('../../errors/customErrors');
const { NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../../utils/constants');
const createNotification = require('../../services/notification');

const uploadImage = async (req, res) => {
    const result = handleImageUpload(req);
    return res.status(StatusCodes.OK).json({ 
      msg: result.message,
      url: result.url 
    });
};
const getImages= async(req,res)=>{
  const files = getFileList(req);
    return res.status(StatusCodes.OK).json({ 
      images: files
    });
}
const deleteImages = async(req,res)=>{
  const deleted = deleteFile(req);
  if(deleted){
    return res.status(StatusCodes.OK).json({ 
      msg:"file deleted"
    });
  }
}
const getEdibles = async (req, res) => {
    const { restaurantId } = req.user;
    const edibles = await Edible.find({ restaurant: restaurantId });
    return res.status(StatusCodes.OK).json({ edibles });
};

const addEdible = async (req, res) => {
    const { restaurantId } = req.user;
    req.body.restaurant = restaurantId;
    const edible = await Edible.create(req.body);
    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.EDIBLE,
        action: NOTIFICATION_ACTION.CREATE,
        title: 'خوراکی اضافه شد',
        message: `«${edible.name}» به خوراکی‌ها اضافه شد`
    });
    return res.status(201).json({
        msg: 'Edible added successfully',
        edible
    });
};
const getEdible = async (req, res) => {
    const { edibleId } = req.params;
    const edible = await Edible.findById(edibleId);
    res.status(200).json({
        msg: 'Edible Found successfully',
        edible
    });
};
const updateEdible = async (req, res) => {
    const { restaurantId } = req.user;
    const { edibleId } = req.params;
    const existingEdible = await Edible.findOne({ _id: edibleId, restaurant: restaurantId });
    if (!existingEdible) throw new NotFoundError(`no edible by id ${edibleId}`);

    const edible = await Edible.findByIdAndUpdate(edibleId, req.body, { new: true });

    let title = 'خوراکی ویرایش شد';
    let message = `«${edible.name}» ویرایش شد`;
    if (typeof req.body.menu === 'boolean' && req.body.menu !== existingEdible.menu) {
        title = req.body.menu ? 'خوراکی به منو اضافه شد' : 'خوراکی از منو حذف شد';
        message = req.body.menu
            ? `«${edible.name}» به منو اضافه شد`
            : `«${edible.name}» از منو حذف شد`;
    } else if (typeof req.body.price === 'number' && req.body.price !== existingEdible.price) {
        title = 'قیمت خوراکی تغییر کرد';
    } else if (typeof req.body.discount === 'number' && req.body.discount !== existingEdible.discount) {
        title = 'تخفیف خوراکی تغییر کرد';
    }

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.EDIBLE,
        action: NOTIFICATION_ACTION.UPDATE,
        title,
        message
    });

    res.status(200).json({
        msg: 'Edible updated successfully',
        edible
    });
};

const deleteEdible = async (req, res) => {
    const { restaurantId } = req.user;
    const { edibleId } = req.params;
    const edible = await Edible.findOneAndDelete({ _id: edibleId, restaurant: restaurantId });
    if (!edible) throw new NotFoundError(`no edible by id ${edibleId}`);

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.EDIBLE,
        action: NOTIFICATION_ACTION.DELETE,
        title: 'خوراکی حذف شد',
        message: `«${edible.name}» حذف شد`
    });

    res.status(200).json({
        msg: 'Edible  deleted successfully'
    });
}
const getMenu = async (req, res) => {
    const { restaurantId } = req.params;
    const menu = await Edible.find({restaurant : restaurantId , menu: true},"-__v -restaurant");
    const resraurant = await Restaurant.findById(restaurantId,"-__v -restaurant");
    res.status(StatusCodes.OK).json({ menu ,resraurant});
}
const schema = () => { return createEmptyJson(Edible.schema) };
module.exports = {
    getEdibles,
    getEdible,
    addEdible,
    updateEdible,
    deleteEdible,
    schema,
    uploadImage,
    getImages,
    deleteImages,
    getMenu
};
