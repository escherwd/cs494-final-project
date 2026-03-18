import { Link, redirect, useLocation, useNavigate } from "react-router";
import type { HardcoverDocument } from "~/types";
import type { Route } from "./+types/book";
import { useEffect, useState } from "react";
import { BookCover } from "~/components/book";
import EmptyState from "~/components/empty_state";
import IconLoaderCircle from "~icons/lucide/loader-circle";
import IconPlus from "~icons/lucide/book-plus";
import IconCheck from "~icons/lucide/book-check";
import IconStar from "~icons/lucide/star";
import IconUsers from "~icons/lucide/users";
import IconBook from "~icons/lucide/book-open";

const query = `
query($slug: String!) {
  books(where: {slug: {_eq: $slug}}) {
    title
    id
    image {
      id
      url
      color
    }
    updated_at
    release_year
    reviews_count
    slug
    subtitle
    rating
    ratings_count
    lists_count
    users_read_count
    pages
    description
    contributions {
      author {
        id
        image {
          url
        }
        name
        slug
        bio
      }
    }
  }
}
`;

export default function BookPage({ params }: Route.ComponentProps) {
  const location = useLocation();

  const cachedBook: HardcoverDocument | undefined = location.state?.book;
  const [book, setBook] = useState<HardcoverDocument | undefined>(cachedBook);

  const navigate = useNavigate();

  useEffect(() => {

    // Check if book is added
    setBookIsInLibrary(window.localStorage.getItem(`book-${params.slug}`) != null)

    if (book) return;

    (async () => {
      const req = await fetch(import.meta.env.VITE_HARDCOVER_API_ROOT_URL, {
        method: "POST",
        body: JSON.stringify({
          query,
          variables: {
            slug: params.slug,
          },
        }),
        headers: {
          authorization: import.meta.env.VITE_HARDCOVER_API_TOKEN,
          "content-type": "application/json",
        },
      });
      const json = await req.json();
      const book = json.data?.books?.[0];
      if (!book) {
        await navigate("/404");
        return;
      }
      setBook(book);
    })();
  }, [book]);

  const [bookIsInLibrary, setBookIsInLibrary] = useState(false);

  const addToLibrary = () => {
    if (!book) return;
    // Add to list of book IDs
    const slugs = JSON.parse(window.localStorage.getItem("book-slugs") ?? "[]");
    window.localStorage.setItem("book-slugs", JSON.stringify([book.slug, ...slugs]));
    // Add book info
    window.localStorage.setItem(`book-${book.slug}`, JSON.stringify(book));
    // Update state
    setBookIsInLibrary(true);
  };

  const removeFromLibrary = () => {
    if (!book) return;
    // Add to list of book IDs
    const slugs: string[] = JSON.parse(
      window.localStorage.getItem("book-slugs") ?? "[]",
    );
    window.localStorage.setItem(
      "book-slugs",
      JSON.stringify(slugs.filter((slug) => slug != book.slug)),
    );
    // Add book info
    window.localStorage.removeItem(`book-${book.slug}`);
    // Update state
    setBookIsInLibrary(false);
  };

  if (!book) {
    return (
      <EmptyState text="Loading...">
        <IconLoaderCircle className="size-8 animate-spin" />
      </EmptyState>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex gap-8 items-end">
        <div className="w-48 flex-none">
          <BookCover book={book} />
        </div>
        <div>
          <div className="font-serif font-semibold text-4xl mb-3">
            {book.title}
          </div>
          <div className="mt-2 text-lg">
            {book.contributions.map((c) => (
              <span key={c.author.id} className="last:[&>span]:hidden">
                <Link
                  to={`/author/${c.author.slug}`}
                  className="hover:underline"
                >
                  {c.author.name}
                </Link>
                <span>, </span>
              </span>
            ))}
            &nbsp;–&nbsp;
            {book.release_year}
          </div>
          <div className="mt-2 line-clamp-4 text-gray-500">
            {book.description}
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-start gap-8">
        {bookIsInLibrary ? (
          <button
            onClick={() => removeFromLibrary()}
            className="app-button app-button-primary app-button-big w-48 flex-none bg-green-600!"
          >
            <IconCheck className="mr-2" />
            Added
          </button>
        ) : (
          <button
            onClick={() => addToLibrary()}
            className="app-button app-button-primary app-button-big w-48 flex-none"
          >
            <IconPlus className="mr-2" />
            Add To Library
          </button>
        )}

        <div className="grid grid-cols-3 flex-1 divide-x divide-gray-200 *:text-center *:py-2 *:flex *:items-center *:gap-2 *:justify-center text-gray-500 font-serif text-xl">
          <div>
            <IconStar className="size-4 -mb-2" />
            {book.rating ? (
              <>
                {book.rating.toFixed(1)}
                <span className="text-sm -ml-1.5 -mb-1.5">/5</span>
              </>
            ) : (
              <>N/A</>
            )}
          </div>
          <div>
            <IconUsers className="size-4 -mb-2" />
            {book.ratings_count} Reviews
          </div>
          <div>
            <IconBook className="size-4 -mb-2" />
            {book.users_read_count} Readers
          </div>
        </div>
      </div>
    </div>
  );
}
