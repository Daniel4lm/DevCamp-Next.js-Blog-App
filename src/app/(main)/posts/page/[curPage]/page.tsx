
// const {
    //     isLoading,
    //     isError,
    //     error,
    //     data: userPosts,
    //     isFetching,
    //     isPreviousData,
    // } = useQuery({
    //     queryKey: [`posts-tag-${tag}`, page],
    //     queryFn: async () => {
    //         const results = await getPosts(page, tag)
    //         setTotalCount(results.totalCount)
    //         setHasNextPage(page < results.totalPages - 1)
    //         return results.posts
    //     },
    //     keepPreviousData: true
    // })

async function PostPagination() {
    return (
        <div>Page pagination</div>
    )
}

export default PostPagination