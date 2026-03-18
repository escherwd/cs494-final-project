import { Link, useLocation, useNavigate } from "react-router";
import type { HardcoverDocument } from "~/types";
import type { Route } from "./+types/book";
import { useEffect, useState } from "react";
import { BookCover } from "~/components/book";
import EmptyState from "~/components/empty_state";
import IconLoaderCircle from "~icons/lucide/loader-circle";

export default function BookPage({ params }: Route.ComponentProps) {
  const location = useLocation();

  const cachedBook: HardcoverDocument | undefined = location.state?.book;
  const [book, setBook] = useState<HardcoverDocument | undefined>(cachedBook);

  const navigate = useNavigate();

  useEffect(() => {
    if (book) return;

    (async () => {
      const req = await fetch(import.meta.env.VITE_HARDCOVER_API_ROOT_URL, {
        method: "POST",
        body: `{
	        "query": "query FindBook{books(where:{slug:{_eq:\\"${params.slug}\\"}}){title id image{id url color}updated_at release_year reviews_count slug subtitle rating ratings_count lists_count pages description taggings{tag{count id slug tag}} contributions{author{id image{url}name slug bio}}}} ",
	        "variables": {}
        }`,
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
                <Link to={`/author/${c.author.slug}`} className="hover:underline">{c.author.name}</Link>
                <span>, </span>
              </span>
            ))}
          </div>
          <div className="mt-2 line-clamp-4 text-gray-500">
            {book.description}
          </div>
        </div>
      </div>
    </div>
  );
}
