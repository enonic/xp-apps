var graphQl = require('/lib/graphql');

exports.typeResolverMap = {
    principalType: null,
    userStoreType: null
};

exports.UserItemType = graphQl.createInterfaceType({
    name: 'UserItem',
    description: 'User item is a base entity for every principal or user store',
    typeResolver: function(source) {
        return source.principalType
            ? exports.typeResolverMap.principalType
            : exports.typeResolverMap.userStoreType;
    },
    fields: {
        key: {
            type: graphQl.GraphQLString
        },
        displayName: {
            type: graphQl.GraphQLString
        },
        description: {
            type: graphQl.GraphQLString
        },
        modifiedTime: {
            type: graphQl.GraphQLString
        }
    }
});
