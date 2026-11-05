
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
const NOTIFICATION_CATEGORY = {
    ORDER: 'order',
    EDIBLE: 'edible',
    TABLE: 'table'
}
const NOTIFICATION_ACTION = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    RESERVE: 'reserve'
}
const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
}
module.exports = {
    ORDER_STATUS,
    TABLE_STATUS,
    USER_ROLE,
    PERMISSIONS,
    NOTIFICATION_CATEGORY,
    NOTIFICATION_ACTION,
    RESERVATION_STATUS
}
