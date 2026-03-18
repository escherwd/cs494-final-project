
// Books are called "Documents" in the Hardcover api
export type HardcoverDocument = {
    id: number
    // author_names: string[]
    contributions: {
        "author": {
            "id": number,
            "name": string,
            "slug": string
        }
    }[]
    // genres: string[]
    // tags: string[]
    slug: string
    title: string
    subtitle: string | undefined
    description: string
    image: {
        color: string | undefined
        height: number | undefined
        width: number | undefined
        url: string | undefined
    } | undefined
    release_year: number | undefined
    rating: number | undefined | null
    ratings_count: number
    reviews_count: number
    users_count: number
    users_read_count: number
    pages: number | undefined
}

export type HardcoverAuthor = {
    "image": {
        "color": string | undefined
        "url": string | undefined
    } | undefined,
    "bio": string | undefined
    "born_date": string | undefined
    "books_count": number
    "location": string | undefined
    "name": string
    "slug": string
    "users_count": number
    "id": number
    "contributions": {
        "book": HardcoverDocument
    }[]
}