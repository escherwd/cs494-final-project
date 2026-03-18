import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import BookComponent from "~/components/book";
import EmptyState from "~/components/empty_state";
import type { HardcoverDocument } from "~/types";
import IconSearch from "~icons/lucide/search";
import IconLoaderCircle from "~icons/lucide/loader-circle";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q");

  const [results, setResults] = useState<HardcoverDocument[] | null>(null);

  useEffect(() => {
    (async () => {
      setResults(null);
      const req = await fetch(import.meta.env.VITE_HARDCOVER_API_ROOT_URL, {
        method: "POST",
        body: `{
	        "query": "query SearchTest{search(query:\\"${query}\\",query_type:\\"Book\\",per_page:15){results}}",
	        "variables": {}
        }`,
        headers: {
          authorization: import.meta.env.VITE_HARDCOVER_API_TOKEN,
          "content-type": "application/json",
        },
      });
      const json = await req.json();
      setResults(
        json.data?.search?.results?.hits?.map((h: any) => h.document) ?? null,
      );
    })();
  }, [query]);

  if (!query || query.length < 3)
    return (
      <EmptyState text="Search something to get started">
        <IconSearch className="size-8" />
      </EmptyState>
    );

  return (
    <main>
      <div className="pt-16 text-4xl font-serif font-semibold">
        Results for "{query}"
      </div>
      {results ? (
        <div className="mt-8 grid grid-cols-5">
          {results?.map((book) => (
            <BookComponent key={book.id} book={book} />
          ))}
        </div>
      ) : (
        (
          <EmptyState text="Searching...">
            <IconLoaderCircle className="size-8 animate-spin" />
          </EmptyState>
        )

      )}
    </main>
  );
}
