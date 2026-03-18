
// Books are called "Documents" in the Hardcover api
export type HardcoverDocument = {
    id: string
    author_names: string[]
    genres: string[]
    tags: string[]
    slug: string
    title: string
    subtitle: string | undefined
    description: string
    image: {
        color: string | undefined
        height: number | undefined
        width: number | undefined
        url: string | undefined
    }
    release_year: string | undefined
    rating: number
    ratings_count: number
    reviews_count: number
    users_count: number
    users_read_count: number
    pages: number | undefined
}