import { useLocation } from "react-router";
import type { HardcoverDocument } from "~/types";

export default function BookPage() {

    const location = useLocation()

    const book: HardcoverDocument | undefined = location.state?.book

    return (
        <div>
            This is the book page for {book?.title}
        </div>
    );
}