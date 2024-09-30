import { collection, query, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth, storage } from "../../firebase/config";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import { deleteObject, ref } from "firebase/storage";

import { Plus } from 'phosphor-react'
import {
    Badge,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'keep-react'
import { FilePenLine, Trash2 } from "lucide-react";
import toast from "react-hot-toast";


interface Resource {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    url: string;
    userId: string;
    category: string;
}

const MyResources = () => {
    const [resources, loading, error] = useCollection(query(collection(db, "resources")));

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error.message}</p>;

    const userResources = resources?.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    } as Resource)).filter(resourceData => resourceData.userId === auth.currentUser?.uid) || [];

    /* const handleDeleteResource = async (resourceId: string, imageUrl: string) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este recurso?");
        if (confirmDelete) {
            try {
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef);
                await deleteDoc(doc(db, "resources", resourceId));
                alert("Recurso e imagen eliminados correctamente.");
            } catch (error) {
                console.error("Error al eliminar el recurso o la imagen:", error);
                alert("Hubo un problema al eliminar el recurso o la imagen.");
            }
        }
    }; */

    const handleDeleteResource = async (resourceId: string, imageUrl: string) => {
        toast((t) => (
            <div className="flex flex-col">
                <p className="text-gray-800">¿Estás seguro de que deseas eliminar este recurso?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="bg-red-600 text-white px-3 py-2 rounded"
                        onClick={async () => {
                            try {
                                const imageRef = ref(storage, imageUrl);
                                await deleteObject(imageRef);
                                await deleteDoc(doc(db, "resources", resourceId));
                                toast.dismiss(t.id);
                                toast.success("Recurso eliminado correctamente.");
                            } catch (error) {
                                console.error("Error al eliminar el recurso o la imagen:", error);
                                toast.error("Hubo un problema al eliminar el recurso.");
                            }
                        }}
                    >
                        Eliminar
                    </button>
                    <button
                        className="bg-indigo-600 text-gray-50 px-3 py-2 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
        });
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 pb-28 pt-4 gap-12 text-gray-800 md:px-8">
            <h1 className="text-center text-xl font-black md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">Mis Recursos</h1>
            <p className="text-center md:px-20 text-gray-700">
                Aquí puedes ver y gestionar todos los recursos que has creado.
            </p>
            <Table className="mt-6">
                <TableCaption className="bg-gray-900 border-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <h2 className="text-heading-6 font-semibold text-gray-100">Total Recursos</h2>
                            <Badge className="bg-indigo-600">{userResources.length}</Badge>
                        </div>
                        <div className="flex items-center gap-5">
                            <Link to={"/agregar-recurso"} className="flex items-center px-3 py-2 rounded-md bg-indigo-600 text-gray-50 hover:bg-indigo-700">
                                <Plus className="size-4 fill-metal-900" />
                                <span>Agregar nuevo recurso</span>
                            </Link>
                        </div>
                    </div>
                </TableCaption>
                <TableHeader>
                    <TableRow className="border">
                        <TableHead className="bg-gray-900 text-indigo-400">
                            <div className="w-[320px]">Nombre</div>
                        </TableHead>
                        <TableHead className="bg-gray-900 text-indigo-400">
                            <div className="w-[65px]">url</div>
                        </TableHead>
                        <TableHead className="bg-gray-900 text-indigo-400">
                            <div className="w-[100px]">Categoria</div>
                        </TableHead>
                       
                        <TableHead className="bg-gray-900 text-indigo-400">
                            <div className="w-[60px]">Accion</div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="border border-gray-400 shadow-lg">
                    {userResources.length > 0 ? (
                    userResources.map((resource) => (
                        <TableRow key={resource.id}>
                            <TableCell>{resource.name}</TableCell>
                            <TableCell>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.url}</a>
                            </TableCell>
                            <TableCell className="w-full">{resource.category}</TableCell>
                            
                            <TableCell className="flex items-center gap-2">
                                <Link to={`/editar-recurso/${resource.id}`} className="text-blue-600 hover:underline">
                                    <FilePenLine />
                                </Link>
                                <button
                                    onClick={() => handleDeleteResource(resource.id, resource.imageUrl)}
                                    className="text-red-600 hover:underline"
                                >
                                    <Trash2 />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))) : (
                        <tr className="w-full">
                            <td colSpan={3} className="text-center p-4">
                                <span className="pe-3">No tienes recursos creados.</span>
                            </td>
                        </tr>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default MyResources;
