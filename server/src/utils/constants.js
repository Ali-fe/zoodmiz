
const ORDER_STATUS = {
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERED :'delivered',
    CANCELLED: 'cancelled',
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
