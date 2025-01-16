const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    };
}
function getQuery(restaurant_ids, names, subdomains) {
    const query = {
        $or: [
            {_id : { $in: restaurant_ids }},
            {Name : { $in: names }},
            {Subdomain : { $in: subdomains }},
        ]
    };
    return query;
}

module.exports = {
    getPagination,
    getQuery
};