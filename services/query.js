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
function createEmptyJson(schema) {
    const emptyJson = {};
    Object.keys(schema.paths).forEach((path) => {
        if (path === '_id' || path === '__v') return;

        const schemaType = schema.paths[path].instance;
        const nestedSchema = schema.paths[path].schema;
        const enumValues = schema.paths[path].options.enum;
        
        if (nestedSchema) {
            emptyJson[path] = createEmptyJson(nestedSchema);
        }
        else if (enumValues) {
            emptyJson[path] = enumValues; 
        } else {

            if (schemaType === 'String') {
                emptyJson[path] = '';
            } else if (schemaType === 'Number') {
                emptyJson[path] = 0;
            } else if (schemaType === 'Boolean') {
                emptyJson[path] = false;
            } else if (schemaType === 'Array') {
                emptyJson[path] = [];
            } else {
                emptyJson[path] = null;
            }
        }
    });
    return emptyJson;
}
function getQuery(restaurant_ids, names, subdomains) {
    const query = {
        $or: [
            { _id: { $in: restaurant_ids } },
            { Name: { $in: names } },
            { Subdomain: { $in: subdomains } },
        ]
    };
    return query;
}

module.exports = {
    getPagination,
    getQuery,
    createEmptyJson
};