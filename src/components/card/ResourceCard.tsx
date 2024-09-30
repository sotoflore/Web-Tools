import { Link } from "react-router-dom";
import { CircleUser, ExternalLink, FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from 'keep-react'

interface Resource {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    url: string;
    userId: string;
    category: string;
}

interface CardProps {
    resource: Resource;
    isOwner: boolean;
    onDelete: () => void;
    creatorName: string;
}

const ResourceCard = ({ resource, isOwner, onDelete,creatorName }: CardProps) => {
    return (
        <div className="border p-3 bg-white rounded-xl border-gray-200 h-full flex flex-col">

            <img src={resource.imageUrl} alt={resource.name} className="w-full h-48 object-cover rounded-lg" />
            <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-bold mt-2">{resource.name}</h2>
                <div className="flex items-center gap-2 my-1">
                    <Badge className="bg-indigo-200 text-indigo-600">{resource.category}</Badge>
                    <Badge className="bg-indigo-200 text-indigo-600">Gratis</Badge>
                </div>
                <p className="text-gray-600 text-xs mt-1 mb-2">
                    <span className="mb-1 block font-bold">Agregado por:</span>
                    <span className="flex items-center gap-1">
                        <CircleUser className="w-6 text-gray-900" />
                        <span className="font-semibold text-gray-800">{creatorName}</span>
                    </span>
                </p>
                <p className="mb-4 text-sm flex-grow">{resource.description}</p>
                <a
                    href={resource.url}
                    className="bg-indigo-600 py-1 text-sm font-semibold text-white w-full flex items-center justify-center gap-1 rounded mt-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>Open Website</span>
                    <ExternalLink className="w-4" />
                </a>

                {isOwner && (
                    <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center gap-1">
                            <Link to={`/editar-recurso/${resource.id}`} className="text-yellow-500 block">
                                <FilePenLine />
                            </Link>
                            <button onClick={onDelete} className="text-red-500 block">
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceCard;
