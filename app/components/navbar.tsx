import _ from "lodash";
import { useRef } from "react";
import { Link, useNavigate, useNavigation } from "react-router";
import BookIcon from "~icons/lucide/book";
import IconTrending from "~icons/lucide/trending-up";
import IconLibrary from "~icons/lucide/library";
import IconSpinner from "~icons/lucide/loader-circle";

export default function AppNavbar() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const navigate = useNavigate();

  const performSearch = useRef(
    _.debounce((q: string) => {
      navigate(`/search?q=${q}`);
    }, 250),
  );

  return (
    <nav className="w-full">
      <div className="max-w-content-width mx-auto px-4 h-14 border-b border-gray-100 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-serif text-lg font-semibold gap-2 -mx-3 app-button"
        >
          {isNavigating ? (
            <IconSpinner className="animate-spin size-5 -mb-0.5" />
          ) : (
            <BookIcon className="size-5 -mb-0.5" />
          )}
          The Book Website
        </Link>
        <div className="flex-1" />
        <Link className="app-button" to="/">
          <IconLibrary className="mr-2" />
          Library
        </Link>
        <Link className="app-button" to="/popular">
          <IconTrending className="mr-2" />
          Popular
        </Link>
        <input
          onChange={(e) => performSearch.current(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && performSearch.current(e.currentTarget.value)
          }
          className="app-input app-searchbar min-w-0 w-full max-w-64"
          type="text"
          placeholder="Search for Books..."
        />
      </div>
    </nav>
  );
}
