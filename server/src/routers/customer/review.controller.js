const { StatusCodes } = require('http-status-codes');
const Review = require('../../models/review.model');
const Restaurant = require('../../models/restaurant.model');
const { NotFoundError } = require('../../errors/customErrors');

const getReviews = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant || restaurant.isActive === false) throw new NotFoundError('restaurant not found');
  const [reviews, summary] = await Promise.all([
    Review.find({ restaurant: restaurant._id }).sort({ createdAt: -1 }).limit(100)
      .populate('customer', 'name lastName'),
    Review.aggregate([
      { $match: { restaurant: restaurant._id } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
  ]);
  res.status(StatusCodes.OK).json({
    reviews: reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      customerName: `${review.customer?.name || ''} ${review.customer?.lastName || ''}`.trim()
    })),
    summary: { average: summary[0]?.average || 0, count: summary[0]?.count || 0 }
  });
};

const saveReview = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant || restaurant.isActive === false) throw new NotFoundError('restaurant not found');
  const review = await Review.findOneAndUpdate(
    { restaurant: restaurant._id, customer: req.user.customerId },
    { rating: req.body.rating, comment: req.body.comment || '' },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(StatusCodes.OK).json({ review });
};

module.exports = { getReviews, saveReview };
