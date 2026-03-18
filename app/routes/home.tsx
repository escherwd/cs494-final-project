import { useMemo, useState } from "react";
import type { Route } from "./+types/home";
import type { HardcoverDocument } from "~/types";
import BookComponent from "~/components/book";
import EmptyState from "~/components/empty_state";
import IconNoBooks from "~icons/lucide/book-heart"
import IconNoFilterResults from "~icons/lucide/filter-x"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Library" },
    { name: "description", content: "Browse your personal library." },
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

  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState<string | undefined>(undefined);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterLength, setFilterLength] = useState<
    "all" | "short" | "medium" | "long"
  >("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "title" | "year-desc" | "year-asc" | "rating-desc" | "pages-desc"
  >("title");

  const authorChoices = useMemo(() => {
    return books.reduce(
      (acc, book) => {
        for (const author of book.contributions) {
          if (acc.find((a) => a.slug === author.author.slug)) continue;
          acc.push(author.author);
        }
        return acc;
      },
      [] as HardcoverDocument["contributions"][number]["author"][],
    );
  }, [books]);

  const yearChoices = useMemo(() => {
    return Array.from(
      new Set(
        books
          .map((book) => book.release_year)
          .filter((year): year is number => year !== undefined),
      ),
    ).sort((a, b) => b - a);
  }, [books]);

  const filteredBooks = useMemo(() => {
    let all = [...books];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      all = all.filter((book) => {
        const inTitle = book.title.toLowerCase().includes(q);
        const inSubtitle = book.subtitle?.toLowerCase().includes(q) ?? false;
        const inDescription = book.description?.toLowerCase().includes(q) ?? false;
        const inAuthor = book.contributions.some((c) =>
          c.author.name.toLowerCase().includes(q),
        );

        return inTitle || inSubtitle || inDescription || inAuthor;
      });
    }

    if (filterAuthor) {
      all = all.filter((book) =>
        book.contributions.some((c) => c.author.slug === filterAuthor),
      );
    }

    if (filterRating !== "all") {
      const minRating = Number(filterRating);
      all = all.filter(
        (book) => book.rating !== null && book.rating !== undefined && book.rating >= minRating,
      );
    }

    if (filterLength === "short") {
      all = all.filter(
        (book) => book.pages !== undefined && book.pages < 300,
      );
    }

    if (filterLength === "medium") {
      all = all.filter(
        (book) => book.pages !== undefined && book.pages >= 300 && book.pages <= 499,
      );
    }

    if (filterLength === "long") {
      all = all.filter(
        (book) => book.pages !== undefined && book.pages >= 500,
      );
    }

    if (filterYear !== "all") {
      const selectedYear = Number(filterYear);
      all = all.filter((book) => book.release_year === selectedYear);
    }

    switch (sortBy) {
      case "title":
        all.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year-desc":
        all.sort((a, b) => (b.release_year ?? 0) - (a.release_year ?? 0));
        break;
      case "year-asc":
        all.sort((a, b) => (a.release_year ?? 0) - (b.release_year ?? 0));
        break;
      case "rating-desc":
        all.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "pages-desc":
        all.sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0));
        break;
    }

    return all;
  }, [
    books,
    search,
    filterAuthor,
    filterRating,
    filterLength,
    filterYear,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setFilterAuthor(undefined);
    setFilterRating("all");
    setFilterLength("all");
    setFilterYear("all");
    setSortBy("title");
  };

  return (
    <main className="pt-16">
      <div className=" text-4xl font-semibold font-serif">
        My Library
      </div>
      <div className="text-lg mt-2 text-gray-500">
        {books.length} books
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <aside className="flex-none w-full sm:w-72 px-4 bg-gray-50 rounded-lg min-h-64 flex flex-col divide-y divide-gray-200 text-gray-600">
          <div className="py-3">
            <div className="flex items-center justify-between">
              <span>Filters</span>
              <button
                type="button"
                onClick={clearFilters}
                className="app-button text-sm"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="py-3">
            <label htmlFor="search" className="block text-sm font-medium">
              Search
            </label>
            <input
              id="search"
              type="text"
              className="mt-2 block app-input w-full"
              placeholder="Title, subtitle, description, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="py-3">
            <label htmlFor="author" className="block text-sm font-medium">
              Author
            </label>
            <select
              className="mt-2 block app-input w-full"
              name="author"
              id="author"
              value={filterAuthor ?? "all"}
              onChange={(e) =>
                setFilterAuthor(e.target.value === "all" ? undefined : e.target.value)
              }
            >
              <option value="all">All</option>
              {authorChoices.map((author) => (
                <option key={author.slug} value={author.slug}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="py-3">
            <label htmlFor="year" className="block text-sm font-medium">
              Release Year
            </label>
            <select
              className="mt-2 block app-input w-full"
              id="year"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">All</option>
              {yearChoices.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="py-3">
            <label htmlFor="rating" className="block text-sm font-medium">
              Minimum Rating
            </label>
            <select
              className="mt-2 block app-input w-full"
              id="rating"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>

          <div className="py-3">
            <label htmlFor="length" className="block text-sm font-medium">
              Length
            </label>
            <select
              className="mt-2 block app-input w-full"
              id="length"
              value={filterLength}
              onChange={(e) =>
                setFilterLength(
                  e.target.value as "all" | "short" | "medium" | "long",
                )
              }
            >
              <option value="all">All</option>
              <option value="short">Short (&lt; 300 pages)</option>
              <option value="medium">Medium (300–499 pages)</option>
              <option value="long">Long (500+ pages)</option>
            </select>
          </div>

          <div className="py-3">
            <label htmlFor="sort" className="block text-sm font-medium">
              Sort By
            </label>
            <select
              className="mt-2 block app-input w-full"
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "title"
                    | "year-desc"
                    | "year-asc"
                    | "rating-desc"
                    | "pages-desc",
                )
              }
            >
              <option value="title">Title (A–Z)</option>
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="pages-desc">Longest Books</option>
            </select>
          </div>

          <div className="py-3 text-sm text-gray-400">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </aside>

        <div className="flex-1">
          {filteredBooks.length === 0 ? (books.length === 0 ?
            (
              <EmptyState text="Your library is empty.">
                <IconNoBooks className="size-8" />
              </EmptyState>
            ) : (
              <EmptyState text="No books match your filter.">
                <IconNoFilterResults className="size-8" />
              </EmptyState>
            )
          ) : (
            <div className="grid grid-cols-3">
              {filteredBooks.map((book) => (
                <BookComponent key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}