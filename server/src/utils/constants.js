
const ORDER_STATUS = {
    PENDING: 1,
    PROCESSING: 2,
    COMPLETED: 3,
    CANCELLED: 4,
}
const TABLE_STATUS = {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    OCCUPIED: 'occupied',
}
const USER_ROLE = {
    SYSTEMADMIN: 'systemAdmin',
    ADMIN: 'admin',
    WATER: 'waiter'
}
module.exports = {
    ORDER_STATUS,
    TABLE_STATUS,
    USER_ROLE,
}
