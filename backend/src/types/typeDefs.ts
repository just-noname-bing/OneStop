export default `#graphql 
    scalar Date

    enum Roles {
        DEFAULT
        MODERATOR
        ADMIN
    }


    type FieldError {
        field: String
        message: String
    }

    type UserResponse {
        data:User
        errors:[FieldError]
    }

    type User {
        id: String
        name: String
        role: Roles
        surname: String
        email: String
        verified: Boolean
        created_at: Date
        updated_at: Date
        # comments: [Comment]
    }

    # User queries
    type Query {
        userInfo: [User]
    }

    input RegisterInput {
        name:String
        surname:String
        email:String
        password:String
    }

    input LoginInput {
        email:String
        password:String
    }

    # User Mutations
    type Mutation {
        login(options: LoginInput): UserResponse
        register(options: RegisterInput): UserResponse
        logout: Boolean
    }

`;
