import { Link } from "react-router-dom";
import { categories } from "../../types/category";
import CategoryLink from "./CategoryLink";
import LogoIcon from "../../icons/logo.svg";
import { CircleCheckBig } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    currentCategory: string;
}

const Sidebar = ({ isOpen, toggleSidebar, currentCategory }: SidebarProps) => {
    return (
        <aside
            className={`fixed inset-0 bg-gray-950 text-white z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 w-64 flex flex-col h-screen p-4`}
        >
            <Link to={"/"} className='flex items-center gap-1 mb-4'>
                <img src={LogoIcon} className="w-11 bg-white rounded-full" />
                <h2 className="text-3xl font-semibold text-indigo-500">eb-Tools</h2>
            </Link>
            <nav className="flex-grow overflow-y-auto">
                <ul>
                    <li>
                        <Link to={"/recursos"} className='flex items-center gap-2 text-gray-50 hover:bg-gray-700 rounded ps-2 py-2 w-11/12'>
                            <CircleCheckBig className="w-[20px] text-gray-400" />
                            <span>Todos</span>
                        </Link>
                    </li>                  
                    {
                        categories.map((category) => (
                            <li className="mb-2 flex" key={category.value}>
                                <CategoryLink
                                    category={category.value}
                                    isActive={currentCategory === category.value}
                                    toggleSidebar={toggleSidebar} 
                                />
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <footer className="text-gray-400 pt-2">&copy; {new Date().getFullYear()}. Web-Tools</footer>
            <button
                className="absolute top-4 right-4 md:hidden text-gray-300"
                onClick={toggleSidebar}
            >
                ✕
            </button>
        </aside>
    );
};
export default Sidebar;