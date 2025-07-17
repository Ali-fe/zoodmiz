const Kavenegar = require('./kavenegar');
const api = Kavenegar.kavenegarApi({apikey: process.env.KavenegarAPIKey});

const sentCodeMessage = (code , to) => { 
    const text="ثبت سفارش در زودمیز";
    api.Send({ message: `${text}\n کد ورود:${code}`
         , sender: "2000660110" ,
          receptor: to });
}
module.exports = {
    sentCodeMessage
}