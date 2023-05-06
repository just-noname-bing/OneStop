import { Comment, Post } from "@prisma/client"
import { prisma } from "../utils/constants"
import IsAuth from "../utils/isAuth"
import { CommentInput, CommentInputSchema, CustomContext, MessageResponse, PostInput, updatePostCommentInput, updatePostCommentInputSchema } from "../types"
import ValidateSchema from "../utils/validateSchema"
import { PostInputSchema } from "../types"

const PostResolver = {
    Query: {
        async getPosts(): Promise<Post[]> {
            return await prisma.post.findMany({ include: { Comment: true } })
        },
        async getComments(): Promise<Comment[]> {
            return await prisma.comment.findMany()
        }
    },
    Mutation: {
        // Post
        // creation
        createPost: IsAuth(
            async (_p: any, { options }: PostInput, ctx: CustomContext): Promise<MessageResponse<Post>> => {
                const { text } = options
                const errors = await ValidateSchema(PostInputSchema, options)

                if (errors.length) {
                    return { errors }
                }

                const newPost = await prisma.post.create({
                    data: { text, author_id: ctx.user!.id }
                })

                if (!newPost) {
                    return { errors: [{ field: "text", message: "something went wrong" }] }
                }

                return { data: newPost }

            }, []),

        // update
        updatePost: IsAuth(
            async (_p: any, { options }: updatePostCommentInput, ctx: CustomContext): Promise<MessageResponse<Post>> => {
                // id, newText
                const { id, text } = options
                const errors = await ValidateSchema(updatePostCommentInputSchema, options)

                if (errors.length) {
                    return { errors }
                }

                //find users post
                const post = await prisma.post.findFirst({
                    where: {
                        id,
                        // if user has default role it will check authorId. else (ADMIN/MODERATOr) will update any message
                        ...(ctx.user!.role === "DEFAULT" ? { author_id: ctx.user!.id } : {})
                    }

                })


                if (!post) {
                    return {
                        errors: [{ field: "text", message: "post not found", }]
                    }
                }

                const newPost = await prisma.post.update({
                    where: { id: post.id },
                    data: { text }
                })

                // if (!newPost) {
                //     return {
                //         errors: [{ field: "text", message: "something went wrong", }]
                //     }
                // }

                return { data: newPost }

            }, []),

        // delete
        deletePost: IsAuth(async (_p: any, args: any, ctx: CustomContext): Promise<boolean> => {
            const { id } = args as { id: string }

            if (!id) {
                throw new Error("id is required")
            }

            //find users post
            const post = await prisma.post.findFirst({
                where: {
                    id,
                    ...(ctx.user!.role === "DEFAULT" ? { author_id: ctx.user!.id } : {})
                }

            })

            if (!post) {
                throw new Error("post not found")
            }

            await prisma.post.delete({ where: { id: post.id } })

            return true

        }, []),

        // Comment
        // creation
        createComment: IsAuth(
            async (_p: any, { options }: CommentInput, ctx: CustomContext): Promise<MessageResponse<Comment>> => {
                const { text, postId } = options
                const errors = await ValidateSchema(CommentInputSchema, options)

                if (errors.length) return { errors }

                const newComment = await prisma.comment.create({
                    data: {
                        text,
                        postId,
                        author_id: ctx.user!.id
                    }
                })

                if (!newComment) {
                    return { errors: [{ field: "text", message: "something went wrong" }] }
                }

                return { data: newComment }

            }, []),

        // update
        updateComment: IsAuth(
            async (_p: any, { options }: updatePostCommentInput, ctx: CustomContext) => {

                const { id, text } = options
                const errors = await ValidateSchema(updatePostCommentInputSchema, options)

                if (errors.length) {
                    return { errors }
                }

                //find users comment
                const comment = await prisma.comment.findFirst({
                    where: {
                        id,
                        ...(ctx.user!.role === "DEFAULT" ? { author_id: ctx.user!.id } : {})
                    }

                })


                if (!comment) {
                    return {
                        errors: [{ field: "text", message: "comment not found", }]
                    }
                }

                const newComment = await prisma.comment.update({
                    where: { id: comment.id },
                    data: { text }
                })

                return { data: newComment }
            }, []),

        // delete
        deleteComment: IsAuth(
            async (_p: any, args: any, ctx: CustomContext): Promise<boolean> => {
                const { id } = args as { id: string }

                if (!id) {
                    throw new Error("id is required")
                }

                //find users comment
                const comment = await prisma.comment.findFirst({
                    where: {
                        id,
                        ...(ctx.user!.role === "DEFAULT" ? { author_id: ctx.user!.id } : {})
                    }

                })

                if (!comment) {
                    throw new Error("comment not found")
                }

                await prisma.comment.delete({ where: { id: comment.id } })

                return true

            }, [])
    }
}

export default PostResolver
