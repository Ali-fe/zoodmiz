const { StatusCodes } = require('http-status-codes');
const SMS = require('../../utils/sms');   
const Otp = require('../../models/otp.model');
const Customer = require('../../models/customer.model');
const { createJWT } = require('../../utils/tokenUtils');

const requestOtp = async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  await Otp.findOneAndUpdate(
    { phone },
    { code, expiresAt: new Date(Date.now() + 2 * 60 * 1000) },
    { upsert: true }
  );
  const customer= req.customer;
  if(process.env.NODE_ENV =='development')
      console.log(`otp code: ${code} to ${phone}`);
  else 
      SMS.SentCode(code, phone);
  
  res.status(StatusCodes.OK).json(
    { msg : 'OTP sent' ,
      isNew : customer? false : true,
      customer : customer}
    );
};

const login = async (req, res) => {
  const { phone , name, lastName } = req.body;

  let customer = await Customer.findOne({ phone });
  if (!customer) {
    customer = await Customer.create({ phone, name: name, lastName: lastName });
  }
  const customerToken = createJWT({ customerId: customer._id, phone: customer.phone });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('customerToken', customerToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    path: '/api/customer'
  });
  
  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    user: {
      _id: customer._id,
      name: customer.name,
      lastName: customer.lastName,
      phone: customer.phone
    }
  });
};
const logout = async (req,res) =>{
  res.cookie('customerToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    path: '/api/customer'
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

const userInfo = async (req,res) =>{
  const customer = await Customer.findById(req.customerId);
  res.status(StatusCodes.OK).json({
    msg: 'user info',
    user: customer
  });
}

const updateUser = async (req,res)=>{
  const customerId = req.customerId;
  const { name, lastName } = req.body;
  const customer = await Customer.findByIdAndUpdate(customerId,
    { name: name, lastName: lastName || '' }
  );
  res.status(StatusCodes.OK).json({
    msg : 'user updated',
    user : {
      _id: customer._id,
      name: customer.name,
      lastName: customer.lastName,
      phone: customer.phone
    }
  });
}

module.exports = {
  requestOtp,
  login,
  logout,
  userInfo,
  updateUser
};
