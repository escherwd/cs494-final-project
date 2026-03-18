import { Link } from "react-router";
import type { HardcoverDocument } from "~/types";

export function BookCover({ book }: { book: HardcoverDocument }) {
  return (
    <div
      className="aspect-[1/1.6] bg-gray-800 overflow-hidden rounded-md flex items-center justify-center"
      style={{ backgroundColor: book.image.color }}
    >
      {book.image.url ? (
        <img
          src={book.image.url}
          alt={book.title}
          className="size-full object-fill"
        />
      ) : (
        <div className="text-white/80 m-4 flex flex-col gap-2 items-center text-center">
          <span className="text-xl font-serif font-medium">{book.title}</span>
          <span className="text-sm">{book.contributions.map(c => c.author.name).join(", ")}</span>
        </div>
      )}
    </div>
  );
}

export default function BookComponent({ book }: { book: HardcoverDocument }) {
  return (
    <Link
      to={`/book/${book.slug}`}
      state={{ book }}
      className="px-2 pt-2 pb-4 hover:bg-gray-100 overflow-hidden rounded-lg"
    >
      <BookCover book={book} />
      <div className="mt-3">
        <div className="line-clamp-2">{book.title}</div>
        <div className="text-sm text-gray-500 mt-1">
          {book.contributions.slice(0,3).map(c => c.author.name).join(", ")}
        </div>
      </div>
    </Link>
  );
}
