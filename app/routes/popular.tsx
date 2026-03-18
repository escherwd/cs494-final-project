import { redirect } from "react-router";
import type { Route } from "../+types/root";
import type { HardcoverDocument } from "~/types";
import BookComponent from "~/components/book";

const query = `
query {
  books(limit: 25, order_by: {users_read_count: desc}) {
    contributions {
      author {
        name
        slug
        id
      }
    }
    description
    id
    image {
      color
      url
    }
    pages
    rating
    ratings_count
    release_date
    release_year
    slug
    subtitle
    title
    users_read_count
  }
}`;

export async function loader() {
  const res = await fetch(import.meta.env.VITE_HARDCOVER_API_ROOT_URL, {
    method: "POST",
    headers: {
      authorization: import.meta.env.VITE_HARDCOVER_API_TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {},
    }),
  });

  const json = await res.json();
  const books = json?.data?.books;

  if (!books) throw redirect("/404");

  return books;
}

export default function TrendingPage({ loaderData }: Route.ComponentProps) {
  const books = loaderData as unknown as HardcoverDocument[];

  return (
    <main className="pt-16">
      <div className="text-4xl font-serif font-semibold">
        Popular Books
      </div>
      <div className="text-lg mt-2 text-gray-500">
        Top 25 of All Time
      </div>

      <div className="mt-8 grid grid-cols-3 sm:grid-cols-5">
        {books.map((book) => (
          <BookComponent key={book.id} book={book} />
        ))}
      </div>
    </main>
  );
}
