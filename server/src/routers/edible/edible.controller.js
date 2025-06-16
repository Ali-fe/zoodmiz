const { StatusCodes } = require('http-status-codes');
const Edible = require('../../models/edible.model');
const {handleImageUpload,getFileList, deleteFile } = require('../../services/file');

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
    const { edibleId } = req.params;
    const edible = await Edible.findByIdAndUpdate(edibleId, req.body, { new: true });
    res.status(200).json({
        msg: 'Edible updated successfully',
        edible
    });
};

const deleteEdible = async (req, res) => {
    const { edibleId } = req.params;
    const edible = await Edible.findByIdAndDelete(edibleId);
    res.status(200).json({
        msg: 'Edible  deleted successfully'
    });
}
const getMenu = async (req, res) => {
    const { restaurantId } = req.params;
    const menu = await Edible.find({restaurant : restaurantId , menu: true},"-__v -restaurant");
    res.status(StatusCodes.OK).json({ menu });
}
const schema = () => { return createEmptyJson(EdibleModel.schema) };
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
