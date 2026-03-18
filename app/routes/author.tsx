import { redirect } from "react-router";
import type { Route } from "./+types/author";
import type { HardcoverAuthor } from "~/types";
import BookComponent from "~/components/book";

const query = `
query($slug: String!) {
  authors(where: {slug: {_eq: $slug}}) {
    image {
      color
      url
    }
    bio
    born_date
    books_count
    location
    name
    slug
    state
    title
    users_count
    id
    contributions(
      where: {contributable_type: {_eq: "Book"}}
      limit: 15
      order_by: {book: {users_read_count: desc}}
    ) {
      book {
        id
        image {
          url
          color
        }
        rating
        ratings_count
        release_year
        reviews_count
        slug
        subtitle
        title
        description
        users_read_count
        contributions {
          author {
            id
            name
            slug
          }
        }
      }
      contributable_type
    }
  }
}

`;

export async function loader({ params }: Route.LoaderArgs) {

  const { slug } = params;

  const res = await fetch(import.meta.env.VITE_HARDCOVER_API_ROOT_URL, {
    method: "POST",
    headers: {
      authorization: import.meta.env.VITE_HARDCOVER_API_TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        slug,
      },
    }),
  });

  const json = await res.json();
  const author = json?.data.authors?.[0];

  if (!author) throw redirect("/404");

  return author;
}

export default function AuthorPage({ loaderData }: Route.ComponentProps) {
  const author = loaderData as unknown as HardcoverAuthor;

  return (
    <main className="flex flex-col items-center pt-16">
      <div className="size-42 bg-gray-100 rounded-full overflow-hidden">
        {author.image?.url && (
          <img
            src={author.image.url}
            className="object-cover size-full"
            alt="Author profile photo"
          />
        )}
      </div>
      <div className="mt-8 text-3xl font-serif font-semibold">
        {author.name}
      </div>
      <div className="mt-4 max-w-md text text-gray-500 text-center">
        {author.bio}
      </div>
      <div className="mt-12 w-full">
        <div className="font-serif font-semibold text-xl">Popular Books</div>
        <div className="mt-6 grid grid-cols-5">
          {author.contributions?.map((contribution) => (
            <BookComponent key={contribution.book.id} book={contribution.book} />
          ))}
        </div>
      </div>
    </main>
  );
}
