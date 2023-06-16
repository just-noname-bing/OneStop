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
        title: String!
        transport_id: String!
        stop_id: String!
        trip_id: String!
        created_at: DateTime!
        updated_at: DateTime!
        author: User!
        stop: Stops!
        stop_time: Stop_times!
        trip: Trips!
        Comment: [Comment!]!
        route: Routes! # route / trasport where is accident 
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
        getPost(id: String): Post
        getComments: [Comment!]!
        getComment(id: String): Comment
    }

    input PostInput {
        text:String!
        title:String!
        transport_id:String!
        trip_id:String!
        stop_id:String!
    }

    input commentInput {
        postId:String!
        text:String!
    }

    input updatePostInput {
        id:String!
        text:String!
        title:String!
        transport_id:String!
        trip_id:String!
        stop_id:String!
    }

    input updateCommentInput {
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

    input searchPostInput {
        # title:String
        # text:String
        search_text_field:String
        transport_id:String
        created_at:DateTime
    }

    # Post mutation
    type Mutation {
        createPost(options: PostInput!): PostResponse
        updatePost(options: updatePostInput!): PostResponse
        deletePost(id: String!): Boolean
        postSearch(options: searchPostInput!): [Post]
        postSearchById(id:String!): Post
    }
    # Comment mutation
    type Mutation {
        createComment(options: commentInput!): CommentResponse
        updateComment(options: updateCommentInput!): CommentResponse
        deleteComment(id: String!): Boolean
        # commentSearch: [Comment] // not used
    }

    # User queries
    type Query {
        me: User # user or 401(not authenticated)
        getUsers: [User] # only for moderator/admin
    }

    input registerInput {
        name:String!
        surname:String!
        email:String!
        password:String!
    }

    input loginInput {
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

    input searchUserInput {
        # name:String
        # surname:String
        # email:String 
        search_text_field:String
        verified:Boolean 
        role:Roles 
        created_at:DateTime
    }


    # User Mutations
    type Mutation {
        login(options: loginInput!): UserResponse
        register(options: registerInput!): UserResponse
        logout(token:String!): Boolean
        deleteUser(id:String!): Boolean
        updateUser(id:String!, options:updateUserInput!): updateUserResponse 
        forgotPassword(email:String!): Boolean 
        userSearch(options:searchUserInput!): [User]
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
        posts:[Post]!
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
        Calendar: Calendar!
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

        getRoutesForStop(stop_id:String!): [CustomRoutesForStop]
    }

    type CustomRoutesForStop {
        Routes: Routes!
        Stop_times: [Stop_times]!
    }

    type Mutation {
        stopsSearch(stop_name:String!): [Stops]
        getTransportSchedule(stop_id:String!, transport_id:String!): [Stop_times]
        getTransportDirectionStops(transport_id:String!, order:String!): [Stop_times]
    }

`;
