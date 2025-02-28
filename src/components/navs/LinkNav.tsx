import Link from 'next/link'

interface LinkNavProps {
    href: string;
    name: string;
}

const LinkNav = ({href, name}: LinkNavProps) => {
    return (
        <li>
            <Link
                href={href}
                className="block text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition-all 
                                       hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
                {name}
            </Link>
        </li>
    )
}

export default LinkNav;