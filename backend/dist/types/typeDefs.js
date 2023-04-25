"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `#graphql 
    scalar Date

    enum Roles {
        DEFAULT
        MODERATOR
        ADMIN
    }

    type Tokens {
        accessToken:String!
        refreshToken:String!
    }


    type FieldError {
        field: String!
        message: String!
    }

    # send tokens or erros to client   
    type UserResponse {
        data: Tokens
        errors:[FieldError]
    }

    type User {
        id: String!
        name: String!
        role: Roles!
        surname: String!
        email: String!
        verified: Boolean!
        created_at: Date!
        updated_at: Date!
        # comments: [Comment]
    }

    # User queries
    type Query {
        me: User # user or 401(not authenticated)
    }

    input RegisterInput {
        name:String!
        surname:String!
        email:String!
        password:String!
    }

    input LoginInput {
        email:String!
        password:String!
    }

    # User Mutations
    type Mutation {
        login(options: LoginInput!): UserResponse
        register(options: RegisterInput!): UserResponse
        logout: Boolean
    }

    type Mutation {
        verifyConformationToken(token:String!): Boolean
    }
`;
//# sourceMappingURL=typeDefs.js.map