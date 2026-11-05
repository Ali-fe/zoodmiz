/* eslint-disable no-console */
// seed demo data: node ./src/scripts/seed.js [--reset]
// --reset removes only the documents this script created (matched by name/email).
require('dotenv').config();
const mongoose = require('mongoose');
const { mongoConnect, mongoDisconnect } = require('../services/mongo');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const Edible = require('../models/edible.model');
const Table = require('../models/table.model');
const Order = require('../models/order.model');
const { hashPassword } = require('../utils/passwordUtils');
const { ORDER_STATUS, TABLE_STATUS, USER_ROLE } = require('../utils/constants');

const DEMO_PASSWORD = 'zoodmiz1234';

const restaurants = [
    {
        name: 'کبابی شاندیز',
        phone: '09121110001',
        description: 'کباب و چلو سنتی با گوشت گوسفندی، از ساعت ۱۱ تا ۲۳.',
        image: '/photos/menu.webp',
        address: { city: 'تهران', street: 'خیابان پاسداران، پلاک ۴۵', buildingNumber: 45, postalCode: 3314567890 },
        location: { lat: 35.7609, lng: 51.4290 },
        owner: { name: 'مهسا', lastName: 'کریمی', email: 'demo.shandiz@zoodmiz.ir', phone: '09121110001' },
        tables: [2, 4, 4, 6, 8],
        edibles: [
            { name: 'چلو کباب کوبیده', type: 'غذای ایرانی', price: 285000, discount: 0, description: 'دو سیخ کوبیده گوسفندی با برنج ایرانی و کره' },
            { name: 'چلو جوجه کباب زعفرانی', type: 'غذای ایرانی', price: 310000, discount: 10, description: 'ران مرغ خوابانده در زعفران و لیمو' },
            { name: 'چلو برگ', type: 'غذای ایرانی', price: 420000, discount: 0, description: 'دو سیخ برگ گوسفندی با برنج زعفرانی' },
            { name: 'شیشلیک', type: 'غذای ایرانی', price: 520000, discount: 5, description: 'شیشلیک دنده کبابی مشکی' },
            { name: 'زیتون پرورده', type: 'پیش غذا', price: 85000, discount: 0, description: 'زیتون با سیر، گردو و ریحان' },
            { name: 'ماست و خيار', type: 'پیش غذا', price: 65000, discount: 0, description: 'ماست محلی با خيار و نعنا داغ' },
            { name: 'حلیم بادمجان', type: 'پیش غذا', price: 95000, discount: 0, description: 'حلیم بادمجان با گردو و رب انار' },
            { name: 'بستنی سنتی زعفرانی', type: 'دسر', price: 75000, discount: 0, description: 'بستنی زعفرانی با گلاب و خلال بادام' },
            { name: 'شربت بیدخشب', type: 'نوشیدنی', price: 45000, discount: 0, description: 'شربت سنتی خنک با گل یخ' },
            { name: 'نوشابه گازدار', type: 'نوشیدنی', price: 35000, discount: 0, description: 'نوشابه خانواده ۲۰۰ سی‌سی' },
            { name: 'دوغ محلی', type: 'نوشیدنی', price: 40000, discount: 0, description: 'دوغ گازدار محلی با نعنا' },
            { name: 'کته ماشک', type: 'غذای ایرانی', price: 210000, discount: 15, description: 'کته ماش با مرغ ریش‌ریش' }
        ]
    },
    {
        name: 'پیتزا ونیز',
        phone: '09121110002',
        description: 'پیتزا ایتالیایی تنوری، پاستا و فست‌فود؛ ارسال رایگان بالای ۳۰۰ هزار تومان.',
        image: '/photos/qrcode.webp',
        address: { city: 'تهران', street: 'میدان ونک، خیابان شریعتی، پلاک ۱۲', buildingNumber: 12, postalCode: 3314512345 },
        location: { lat: 35.7188, lng: 51.4006 },
        owner: { name: 'امیر', lastName: 'صادقی', email: 'demo.venezia@zoodmiz.ir', phone: '09121110002' },
        tables: [2, 2, 4, 6],
        edibles: [
            { name: 'پیتزا پپرونی بزرگ', type: 'فست فود', price: 320000, discount: 0, description: 'موزارلا، پپرونی فلفلی و سس گوجه خانگی' },
            { name: 'پیتزا چهارپنیر', type: 'فست فود', price: 345000, discount: 10, description: 'موزارلا، پارمزان، گودا و فتا' },
            { name: 'پیتزا مارگاریتا', type: 'فست فود', price: 265000, discount: 0, description: 'رب گوجه، ریحان تازه و موزارلا' },
            { name: 'برگر دوبل چدار', type: 'فست فود', price: 295000, discount: 5, description: 'دو لایه گوشت ۹۰ گرمی با پنیر چدار' },
            { name: 'اسموشی', type: 'فست فود', price: 210000, discount: 0, description: 'برگر قارچ و پنیر با سس مخصوص' },
            { name: 'پاستا آلفردو مرغ', type: 'فست فود', price: 245000, discount: 0, description: 'فتوچینه با سس خامه‌ای و تکه‌های مرغ' },
            { name: 'سیب‌زمینی سرخ‌کرده', type: 'پیش غذا', price: 95000, discount: 0, description: 'سرخ‌کردنی با ادویه و پنیر پارمزان' },
            { name: 'بال سوخاری', type: 'پیش غذا', price: 175000, discount: 20, description: 'هفت عدد بال مرغ با سس باربیکیو' },
            { name: 'سالاد سزار', type: 'پیش غذا', price: 165000, discount: 0, description: 'کاهو، مرغ گریل، خرده نان و سس سزار' },
            { name: 'تیرامیسو', type: 'دسر', price: 135000, discount: 0, description: 'دسر قهوه ایتالیایی با پودر کاکائو' },
            { name: 'نوشابه خانواده', type: 'نوشیدنی', price: 45000, discount: 0, description: 'نوشابه ۱.۵ لیتری' },
            { name: 'آب پرتقال تازه', type: 'نوشیدنی', price: 75000, discount: 0, description: 'آب پرتقال طبیعی بدون شکر' }
        ]
    },
    {
        name: 'سرای سپاهان',
        phone: '09121110003',
        description: 'غذای اصیل اصفهانی در فضایی سنتی؛ منظرخانه و موسیقی زنده.',
        image: '/photos/reslocation.webp',
        address: { city: 'تهران', street: 'میدان تجریش، خیابان جمشیدیه، پلاک ۸', buildingNumber: 8, postalCode: 3314598765 },
        location: { lat: 35.7978, lng: 51.4317 },
        owner: { name: 'رضا', lastName: 'موسوی', email: 'demo.saraye@zoodmiz.ir', phone: '09121110003' },
        tables: [4, 4, 6, 8],
        edibles: [
            { name: 'بریانی', type: 'غذای ایرانی', price: 245000, discount: 0, description: 'کباب بریانی سنتی اصفهان با سبزی خوردن' },
            { name: 'تاس‌کباب', type: 'غذای ایرانی', price: 285000, discount: 0, description: 'گوشت و استух با آلو و زردآلو' },
            { name: 'ترینه', type: 'غذای ایرانی', price: 235000, discount: 10, description: 'ترینه مرغ با نان سنگک' },
            { name: 'آبگوشت پشت‌خیاری', type: 'غذای ایرانی', price: 215000, discount: 0, description: 'آبگوشت سنتی با گوشت گوسفندی و تخم‌مرغ' },
            { name: 'قورمه سبزی', type: 'غذای ایرانی', price: 225000, discount: 5, description: 'قورمه سبزی با لوبیا قرمز و فلفل سیاه' },
            { name: 'باقالی پلو با ماهی', type: 'غذای ایرانی', price: 315000, discount: 0, description: 'باقرلا با ماهی شوریده گریل‌شده' },
            { name: 'بورانی اسفناج', type: 'پیش غذا', price: 75000, discount: 0, description: 'اسفناج با سیر و ماست محلی' },
            { name: 'کشک بادمجان', type: 'پیش غذا', price: 95000, discount: 0, description: 'کشک و نعنا داغ با گردو' },
            { name: 'سکنجبین', type: 'نوشیدنی', price: 55000, discount: 0, description: 'شربت سنتی خنک با نعنا' },
            { name: 'سوهان عسلی', type: 'دسر', price: 185000, discount: 0, description: 'سوهان گز‌دار مخصوص اصفهان' }
        ]
    },
    {
        name: 'برگرخانه بی‌آر‌سی',
        phone: '09121110004',
        description: 'برگر دست‌ساز گوشت ۱۰۰٪ گوساله، بیرون‌بر و رزرو میز.',
        image: '/photos/orders.webp',
        address: { city: 'کرج', street: 'میدان طالقانی، خیابان شهید رجایی، پلاک ۲۲', buildingNumber: 22, postalCode: 3314555555 },
        location: { lat: 35.8327, lng: 50.9915 },
        owner: { name: 'سینا', lastName: 'رضایی', email: 'demo.brc@zoodmiz.ir', phone: '09121110004' },
        tables: [2, 4, 6],
        edibles: [
            { name: 'کلاسیک برگر', type: 'فست فود', price: 255000, discount: 0, description: 'گوشت ۱۵۰ گرمی، کاهو، گوجه و سس مخصوص' },
            { name: 'چیزبرگر دونلایه', type: 'فست فود', price: 315000, discount: 10, description: 'دو لایه گوشت و چهار ورق پنیر' },
            { name: 'برگر قارچ و پنیر', type: 'فست فود', price: 285000, discount: 0, description: 'قارچ سوته با پنیر گودا' },
            { name: 'توستر مرغ', type: 'فست فود', price: 175000, discount: 0, description: 'نان تست با فیله مرغ و سس سیریچا' },
            { name: 'هات‌داگ', type: 'فست فود', price: 165000, discount: 0, description: 'سوسیس با پنیر و فلفل دلمه' },
            { name: 'رینگ پنیر', type: 'پیش غذا', price: 125000, discount: 0, description: 'هفت حلقه پیاز با پنیر و سس چدر' },
            { name: 'ناچز', type: 'پیش غذا', price: 145000, discount: 5, description: 'چیپس ذرت با پنیر و گوشت چرخ‌کرده' },
            { name: 'میلک‌شیک شکلات', type: 'نوشیدنی', price: 115000, discount: 0, description: 'بستنی شکلاتی و شربت شکلات' },
            { name: 'براونی', type: 'دسر', price: 135000, discount: 0, description: 'براونی شکلاتی گرم با بستنی وانیلی' }
        ]
    },
    {
        name: 'رستوران بام همدان',
        phone: '09181110005',
        description: 'رستوران سنتی با غذاهای محلی همدان و چشم‌انداز شهر.',
        image: '/photos/modernres.webp',
        address: { city: 'همدان', street: 'بلوار بوعلی، خیابان شریعتی، پلاک ۳', buildingNumber: 3, postalCode: 6314577777 },
        location: { lat: 34.7983, lng: 48.5146 },
        owner: { name: 'فاطمه', lastName: 'احمدی', email: 'demo.bam@zoodmiz.ir', phone: '09181110005' },
        tables: [2, 4, 4, 6],
        edibles: [
            { name: 'کباب سلطانی', type: 'غذای ایرانی', price: 385000, discount: 0, description: 'یک سیخ برگ و یک سیخ کوبیده با چلو زعفرانی' },
            { name: 'دلمه برگ مو', type: 'غذای ایرانی', price: 195000, discount: 10, description: 'دلمه ترش محلی با برنج و گوشت' },
            { name: 'آش رشته همدانی', type: 'غذای ایرانی', price: 125000, discount: 0, description: 'آش غلیظ با کشک و نعنا داغ' },
            { name: 'خورشت کرفس', type: 'غذای ایرانی', price: 215000, discount: 0, description: 'خورشت سبزی با گوشت گوسفندی' },
            { name: 'زاغ‌ور', type: 'غذای ایرانی', price: 265000, discount: 5, description: 'غذای محلی همدان با گردو و رب انار' },
            { name: 'سالاد فصل', type: 'پیش غذا', price: 95000, discount: 0, description: 'کاهو، خيار، گوجه و ذرت با آبلیمو' },
            { name: 'پنیر و خامه محلی', type: 'پیش غذا', price: 85000, discount: 0, description: 'پنیر لیقوان با خامه محلی و گردو' },
            { name: 'فرنی', type: 'دسر', price: 65000, discount: 0, description: 'فرنی با دارچین و خلال پسته' },
            { name: 'چای زعفرانی', type: 'نوشیدنی', price: 35000, discount: 0, description: 'دمنوش چای با زعفران و نبات' }
        ]
    }
];

const customers = [
    { name: 'علی', lastName: 'مرادی', phone: '09121000101' },
    { name: 'مریم', lastName: 'نوروزی', phone: '09121000102' },
    { name: 'حسین', lastName: 'تقوی', phone: '09121000103' },
    { name: 'نگار', lastName: 'شریفی', phone: '09121000104' },
    { name: 'سعید', lastName: 'قاسمی', phone: '09121000105' },
    { name: 'لیلا', lastName: 'بهرامی', phone: '09121000106' }
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[randomInt(0, list.length - 1)];

// orders spread over the last 70 days so the dashboard charts have real history
const buildOrders = (edibles, tables) => {
    const orders = [];
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    for (let dayOffset = 70; dayOffset >= 0; dayOffset--) {
        const ordersInDay = dayOffset < 2 ? randomInt(2, 4) : randomInt(1, 5);
        for (let i = 0; i < ordersInDay; i++) {
            const createdAt = new Date(now - dayOffset * day - randomInt(0, 8) * 60 * 60 * 1000);
            const customer = pick(customers);
            const itemCount = randomInt(1, 3);
            const chosen = [];
            while (chosen.length < itemCount) {
                const edible = pick(edibles);
                if (!chosen.some((e) => e._id.equals(edible._id))) chosen.push(edible);
            }
            const items = chosen.map((edible) => ({
                edible: edible._id,
                name: edible.name,
                quantity: randomInt(1, 3),
                price: edible.price,
                discount: edible.discount || 0
            }));
            const isToday = dayOffset < 2;
            orders.push({
                table: pick(tables).numeral,
                customerName: `${customer.name} ${customer.lastName}`,
                customerPhone: customer.phone,
                createdAt,
                status: isToday
                    ? pick([ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.DELIVERED])
                    : pick([ORDER_STATUS.DELIVERED, ORDER_STATUS.DELIVERED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED]),
                items
            });
        }
    }
    return orders;
};

const resetDemoData = async () => {
    const existingRestaurants = await Restaurant.find({ name: { $in: restaurants.map((r) => r.name) } });
    const ids = existingRestaurants.map((r) => r._id);
    await Order.deleteMany({ restaurant: { $in: ids } });
    await Edible.deleteMany({ restaurant: { $in: ids } });
    await Table.deleteMany({ restaurant: { $in: ids } });
    await User.deleteMany({ restaurant: { $in: ids } });
    await Restaurant.deleteMany({ _id: { $in: ids } });
    console.log(`removed ${ids.length} demo restaurants with their edibles, tables and orders`);
};

const seed = async () => {
    await mongoConnect();
    const isReset = process.argv.includes('--reset');
    if (isReset) await resetDemoData();

    const password = await hashPassword(DEMO_PASSWORD);
    let orderTotal = 0;

    for (const item of restaurants) {
        const existing = await Restaurant.findOne({ name: item.name });
        if (existing && !isReset) {
            console.log(`skip ${item.name} (already exists, use --reset to rewrite it)`);
            continue;
        }

        const restaurant = await Restaurant.create({
            name: item.name,
            phone: item.phone,
            description: item.description,
            image: item.image,
            address: item.address,
            location: item.location,
            isActive: true
        });

        await User.create({
            name: item.owner.name,
            lastName: item.owner.lastName,
            email: item.owner.email,
            phone: item.owner.phone,
            password,
            role: USER_ROLE.ADMIN,
            restaurant: restaurant._id
        });

        const edibles = await Edible.insertMany(
            item.edibles.map((edible) => ({
                ...edible,
                restaurant: restaurant._id,
                imageURL: item.image,
                menu: true
            }))
        );

        const tables = await Table.insertMany(
            item.tables.map((capacity, index) => ({
                restaurant: restaurant._id,
                numeral: index + 1,
                capacity,
                status: TABLE_STATUS.AVAILABLE,
                menuUrl: `http://localhost:5173/restaurants/menu/${restaurant._id}/${index + 1}`
            }))
        );

        const orders = await Order.insertMany(
            buildOrders(edibles, tables).map((order) => ({ ...order, restaurant: restaurant._id }))
        );
        orderTotal += orders.length;
        console.log(`${item.name}: ${edibles.length} edibles, ${tables.length} tables, ${orders.length} orders`);
    }

    console.log(`seed finished. ${orderTotal} orders created.`);
    console.log(`login with any demo owner email (see seed.js) and password ${DEMO_PASSWORD}`);
    await mongoDisconnect();
    await mongoose.disconnect();
};

seed().catch(async (err) => {
    console.error('seed failed:', err.message);
    process.exit(1);
});
