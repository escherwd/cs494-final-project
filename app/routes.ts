import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/search", "routes/search.tsx"),
  route("/popular", "routes/popular.tsx"),
  route("/book/:slug", "routes/book.tsx"),
  route("/author/:slug", "routes/author.tsx"),
] satisfies RouteConfig;
