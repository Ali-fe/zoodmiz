
const ORDER_STATUS = {
    PENDING: 1,
    PROCESSING: 2,
    COMPLETED: 3,
    DELIVERED :4,
    CANCELLED: 5,
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
const PERMISSIONS = {
    ORDER: 'order',
    ALL: 'all'
}
module.exports = {
    ORDER_STATUS,
    TABLE_STATUS,
    USER_ROLE,
    PERMISSIONS
}
