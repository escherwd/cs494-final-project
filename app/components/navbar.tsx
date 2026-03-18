import { Link } from 'react-router';
import BookIcon from '~icons/lucide/book'

export default function AppNavbar() {
    return (
        <nav className="w-full">
            <div className="max-w-content-width mx-auto px-4 h-14 border-b border-gray-100 flex items-center justify-between">
                <Link to='/' className="font-serif text-lg font-semibold gap-2 -mx-3 app-button">
                    <BookIcon className='size-5 -mb-0.5' />
                    The Book Website
                </Link>
                <input className='app-input app-searchbar min-w-0 w-full max-w-64' type="text" placeholder='Search for Books...' />
            </div>
        </nav>
    );
}