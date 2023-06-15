import { Comment, Post } from "@prisma/client";
import {
    COMMENT_INPUT_SCHEMA,
    CommentInput,
    CustomContext,
    MessageResponse,
    POST_INPUT_SCHEMA,
    PostInput,
    SearchPostInput,
    UPDATE_COMMENT_INPUT_SCHEMA,
    UPDATE_POST_INPUT_SCHEMA,
    UpdateCommentInput,
    UpdatePostInput,
} from "../types";
import { prisma } from "../utils/constants";
import IsAuth from "../utils/isAuth";
import validateSchema from "../utils/validateSchema";

const PostResolver = {
    Query: {
        async getPosts(): Promise<Post[]> {
            return await prisma.post.findMany({
                include: { Comment: true, route: true, author: true },
            });
        },
        async getComments(): Promise<Comment[]> {
            return await prisma.comment.findMany();
        },
        async getPost(_p: any, args: { id: string }): Promise<Post | null> {
            const { id } = args;
            return await prisma.post.findFirst({
                where: { id },
                include: {
                    Comment: { include: { author: true } },
                    author: true,
                    route: true,
                },
            });
        },
        async getComment(
            _p: any,
            args: { id: string }
        ): Promise<Comment | null> {
            const { id } = args;
            return await prisma.comment.findFirst({
                where: { id },
                include: { author: true, Post: { include: { author: true } } },
            });
        },
    },
    Mutation: {
        // Post
        // creation
        createPost: IsAuth(
            async (
                _p: any,
                { options }: PostInput,
                ctx: CustomContext
            ): Promise<MessageResponse<Post>> => {
                const { text, transport_id, title, stop_id, trip_id } = options;
                const errors = await validateSchema(POST_INPUT_SCHEMA, options);

                if (errors.length) {
                    return { errors };
                }

                // validate if transport exists
                const transport_exists = await prisma.routes.findFirst({
                    where: {
                        route_id: transport_id,
                    },
                });

                if (!transport_exists) {
                    return {
                        errors: [
                            { field: "text", message: "transport not exist" },
                        ],
                    };
                }

                const new_post = await prisma.post.create({
                    data: {
                        title,
                        text,
                        transport_id,
                        stop_id,
                        trip_id,
                        author_id: ctx.user.id,
                    },
                });

                if (!new_post) {
                    return {
                        errors: [
                            { field: "text", message: "something went wrong" },
                        ],
                    };
                }

                return { data: new_post };
            },
            []
        ),

        // update
        updatePost: IsAuth(
            async (
                _p: any,
                { options }: UpdatePostInput,
                ctx: CustomContext
            ): Promise<MessageResponse<Post>> => {
                // id, newText
                const { id, text, transport_id, title } = options;
                const errors = await validateSchema(
                    UPDATE_POST_INPUT_SCHEMA,
                    options
                );

                if (errors.length) {
                    return { errors };
                }

                //find users post
                const post = await prisma.post.findFirst({
                    where: {
                        id,
                        // if user has default role it will check authorId. else (ADMIN/MODERATOr) will update any message
                        ...(ctx.user.role === "DEFAULT"
                            ? { author_id: ctx.user.id }
                            : {}),
                    },
                });

                if (!post) {
                    return {
                        errors: [{ field: "text", message: "post not found" }],
                    };
                }

                //validate if transport exists
                const transport_exists = await prisma.routes.findFirst({
                    where: {
                        route_id: transport_id,
                    },
                });

                if (!transport_exists) {
                    return {
                        errors: [
                            { field: "text", message: "transport not exist" },
                        ],
                    };
                }

                const new_post = await prisma.post.update({
                    where: { id: post.id },
                    data: { text, title, transport_id },
                });

                // if (!newPost) {
                //     return {
                //         errors: [{ field: "text", message: "something went wrong", }]
                //     }
                // }

                return { data: new_post };
            },
            []
        ),

        // delete
        deletePost: IsAuth(
            async (
                _p: any,
                args: any,
                ctx: CustomContext
            ): Promise<boolean> => {
                const { id } = args as { id: string };

                if (!id) {
                    throw new Error("id is required");
                }

                //find users post
                const post = await prisma.post.findFirst({
                    where: {
                        id,
                        ...(ctx.user.role === "DEFAULT"
                            ? { author_id: ctx.user.id }
                            : {}),
                    },
                });

                if (!post) {
                    throw new Error("post not found");
                }

                await prisma.post.delete({ where: { id: post.id } });

                return true;
            },
            []
        ),

        // post search
        postSearch: async (
            _p: any,
            { options }: SearchPostInput,
            _ctx: any
        ) => {
            // search_text
            const { search_text_field, transport_id, created_at } = options;
            return await prisma.post.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    title: {
                                        contains: search_text_field,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    text: {
                                        contains: search_text_field,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        },
                        { transport_id },
                        { created_at: { lte: created_at } },
                    ],
                },
            });
        },

        // Comment
        // creation
        createComment: IsAuth(
            async (
                _p: any,
                { options }: CommentInput,
                ctx: CustomContext
            ): Promise<MessageResponse<Comment>> => {
                const { text, postId } = options;
                const errors = await validateSchema(
                    COMMENT_INPUT_SCHEMA,
                    options
                );

                if (errors.length) return { errors };

                const newComment = await prisma.comment.create({
                    data: {
                        text,
                        postId,
                        author_id: ctx.user.id,
                    },
                });

                if (!newComment) {
                    return {
                        errors: [
                            { field: "text", message: "something went wrong" },
                        ],
                    };
                }

                return { data: newComment };
            },
            []
        ),

        // update
        updateComment: IsAuth(
            async (
                _p: any,
                { options }: UpdateCommentInput,
                ctx: CustomContext
            ) => {
                const { id, text } = options;
                const errors = await validateSchema(
                    UPDATE_COMMENT_INPUT_SCHEMA,
                    options
                );

                if (errors.length) {
                    return { errors };
                }

                //find users comment
                const comment = await prisma.comment.findFirst({
                    where: {
                        id,
                        ...(ctx.user.role === "DEFAULT"
                            ? { author_id: ctx.user.id }
                            : {}),
                    },
                });

                if (!comment) {
                    return {
                        errors: [
                            { field: "text", message: "comment not found" },
                        ],
                    };
                }

                const newComment = await prisma.comment.update({
                    where: { id: comment.id },
                    data: { text },
                });

                return { data: newComment };
            },
            []
        ),

        // delete
        deleteComment: IsAuth(
            async (
                _p: any,
                args: any,
                ctx: CustomContext
            ): Promise<boolean> => {
                const { id } = args as { id: string };

                if (!id) {
                    throw new Error("id is required");
                }

                //find users comment
                const comment = await prisma.comment.findFirst({
                    where: {
                        id,
                        ...(ctx.user.role === "DEFAULT"
                            ? { author_id: ctx.user.id }
                            : {}),
                    },
                });

                if (!comment) {
                    throw new Error("comment not found");
                }

                await prisma.comment.delete({ where: { id: comment.id } });

                return true;
            },
            []
        ),
    },
};

export default PostResolver;
