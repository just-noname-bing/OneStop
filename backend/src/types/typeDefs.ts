export default `#graphql 
    scalar DateTime

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

    type updateUserResponse {
        data: User
        errors:[FieldError]
    }

    type User {
        id: String!
        name: String!
        role: Roles!
        surname: String!
        email: String!
        verified: Boolean!
        created_at: DateTime!
        updated_at: DateTime!
        Post: [Post!]!
        Comment: [Comment!]!
    }

    type Post {
        id: String!
        author_id: String!
        text: String!
        created_at: DateTime!
        updated_at: DateTime!
        author: User!
        Comment: [Comment!]!
    }

    type Comment {
        id: String!
        author_id: String!
        text: String!
        created_at: DateTime!
        updated_at: DateTime!
        author: User!
        Post: Post!
    }

    # Post & Comment queries
    type Query {
        getPosts: [Post!]!
        getComments: [Comment!]!
    }

    input PostInput {
        text:String!
    }

    input CommentInput {
        postId:String!
        text:String!
    }

    input updatePostCommentInput {
        id:String!
        text:String!
    }

    type PostResponse {
        data: Post
        errors:[FieldError]
    }

    type CommentResponse {
        data: Comment
        errors:[FieldError]
    }

    # Post mutation
    type Mutation {
        createPost(options: PostInput!): PostResponse
        updatePost(options: updatePostCommentInput!): PostResponse
        deletePost(id: String!): Boolean
    }
    # Comment mutation
    type Mutation {
        createComment(options: CommentInput!): CommentResponse
        updateComment(options: updatePostCommentInput!): CommentResponse
        deleteComment(id: String!): Boolean
    }

    # User queries
    type Query {
        me: User # user or 401(not authenticated)
        getUsers: [User] # only for moderator/admin
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


    input updateUserInput {
        name:String!
        surname:String!
        email:String! # for admin/moderator
        verified:Boolean! # for admin/moderator
        role:Roles! # for admin/moderator
    }

    # User Mutations
    type Mutation {
        login(options: LoginInput!): UserResponse
        register(options: RegisterInput!): UserResponse
        logout(token:String!): Boolean
        deleteUser(id:String!): Boolean
        updateUser(id:String!, options:updateUserInput!): updateUserResponse 
    }

    type Mutation {
        verifyConformationToken(token:String!): Boolean
    }



    # bus Fields

    type Routes {
        route_id: String!
        route_short_name: String!
        route_long_name: String!
        route_desc: String!
        route_type: String!
        route_url: String!
        route_color: String!
        route_text_color: String!
        route_sort_order: String!
        trips: [Trips]!
    }

    type Trips {
        route_id: String!
        service_id: String!
        trip_id: String!
        trip_headsign: String!
        direction_id: String!
        block_id: String!
        shape_id: String!
        wheelchair_accessible: String!
        shapesShape_id: String!
        shapesShape_dist_traveled: String!
        stop_times: [Stop_times]!
        route: Routes!
        Shapes: Shapes!
    }

    type Shapes {
        shape_id: String!
        shape_pt_lat: String!
        shape_pt_lon: String!
        shape_pt_sequence: String!
        shape_dist_traveled: String!
        trips: [Trips]!
    }

    type Stops {
        stop_id: String!
        stop_code: String!
        stop_name: String!
        stop_desc: String!
        stop_lat: String!
        stop_lon: String!
        stop_url: String!
        location_type: String!
        parent_station: String!
        stop_times: [Stop_times]!
    }

    type Stop_times {
        trip_id: String!
        arrival_time: String!
        departure_time: String!
        stop_id: String!
        stop_sequence: String!
        pickup_type: String!
        drop_off_type: String!
        stops: Stops!
        trips: Trips!
    }

    type Calendar {
        service_id: String!
        monday: String!
        tuesday: String!
        wednesday: String!
        thursday: String!
        friday: String!
        saturday: String!
        sunday: String!
        start_date: String!
        end_date: String!
        calendar_dates: [Calendar_dates]!
    }

    type Calendar_dates {
        service_id: String!
        date: String!
        exception_type: String!
        Calendar: Calendar!
    }

    # Bus Queries
    type Query {
        Routes: [Routes]!
        Trips: [Trips]!
        Shapes: [Shapes]!
        Stops: [Stops]!
        Stop_times: [Stop_times]!
        Calendar: [Calendar]!
        Calendar_dates:[Calendar_dates]!
    }

`;
