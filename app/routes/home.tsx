import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import type { HardcoverDocument } from "~/types";
import BookComponent from "~/components/book";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const slugs: string[] = JSON.parse(
    window.localStorage.getItem(`book-slugs`) ?? "[]",
  );

  const books = slugs
    .map((slug) =>
      JSON.parse(window.localStorage.getItem(`book-${slug}`) ?? "null"),
    )
    .filter((book) => book != null);

  return books as HardcoverDocument[];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const books = loaderData;

  const [filterAuthor, setFilterAuthor] = useState<string | undefined>(undefined)

  const authorChoices = useMemo(() => {
    return books.reduce(
      (acc, book) => {
        for (const author of book.contributions) {
          if (acc.find((a) => a.slug == author.author.slug)) continue;
          acc.push(author.author);
        }
        return acc;
      },
      [] as HardcoverDocument["contributions"][number]["author"][],
    );
  }, [books]);

  const filteredBooks = useMemo(() => {
    var all = books;

    if (filterAuthor)
      all = all.filter(b => b.contributions.find(c => c.author.slug == filterAuthor))

    return all

  }, [books, filterAuthor])

  return (
    <main>
      <div className="mb-8 mt-16 text-4xl font-semibold font-serif">
        My Library
      </div>
      <div className="flex gap-4">
        <aside className="flex-none w-56 px-4 bg-gray-50 rounded-lg min-h-64 flex flex-col divide-y divide-gray-200 *:py-3 text-gray-600">
          <div className="">Filters</div>
          <div>
            <small>Author</small>
            <select
              className="mt-2 block app-input w-full"
              name="author"
              id="author"
              onChange={(e) => setFilterAuthor(e.target.value == 'all' ? undefined : e.target.value)}
            >
              <option value="all">All</option>
              {authorChoices.map((author) => (
                <option key={author.slug} value={author.slug}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </aside>
        <div className="grid grid-cols-4">
          {filteredBooks.map((book) => (
            <BookComponent key={book.id} book={book} />
          ))}
        </div>
      </div>
    </main>
  );
}
