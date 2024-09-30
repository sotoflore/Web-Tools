import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryLinkProps{
    category: string;
    isActive: boolean;
    toggleSidebar: () => void;
}

const CategoryLink = ({ category, isActive, toggleSidebar }: CategoryLinkProps) => {
    
    const handleClickClose = () => {
        toggleSidebar(); 
    };

    return (
        <Link
            onClick={handleClickClose}
            to={`recursos?category=${category}`}
            className={`flex items-center w-11/12 gap-2 text-gray-300 hover:bg-gray-700 rounded ps-2 py-2 ${isActive ? "bg-indigo-500 text-gray-50" : "text-gray-50"} rounded-md`}
        >
            <CircleCheckBig className="w-[20px] text-gray-400" />
            <span className="font-medium text-sm">{category}</span>
        </Link>
    );
};

export default CategoryLink;
