import { useEffect, useState } from "react";
import { collection, query, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link,  useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { InputIcon, Input } from 'keep-react'
import { deleteObject, ref } from "firebase/storage";
import Spinner from "../../components/common/Spinner";
import { auth, db, storage } from "../../firebase/config";
import ResourceCard from "../../components/card/ResourceCard";
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

const ListResource = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "";
    const [resources, loading, error] = useCollection(query(collection(db, "resources")));

    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchUserNames = async () => {
            const userNameMap: { [key: string]: string } = {};
            if (resources?.docs) {
                for (const resourceDoc of resources.docs) {
                    const resourceData = resourceDoc.data() as Resource;
                    if (resourceData.userId) {
                        const userDoc = await getDoc(doc(db, "users", resourceData.userId));
                        if (userDoc.exists()) {
                            userNameMap[resourceData.userId] = userDoc.data().name || "Usuario Desconocido";
                        } else {
                            userNameMap[resourceData.userId] = "Usuario Desconocido";
                        }
                    } else {
                        userNameMap[resourceData.userId] = "Usuario Desconocido";
                    }
                }
                setUserNames(userNameMap);
            }
        };

        fetchUserNames();
    }, [resources]);



    if (loading) return <Spinner />;
    if (error) return <p>Error: {error.message}</p>;

    const filteredResources = resources?.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    } as Resource)).filter(resourceData => {
        const matchesSearch = resourceData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resourceData.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category ? resourceData.category === category : true;

        return matchesSearch && matchesCategory;
    }) || [];


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
        <div className="max-w-screen-xl mx-auto px-10 py-6">
            <h1 className="text-3xl text-gray-800 font-extrabold text-center md:text-5xl">
                Descubra, comparta y acceda a los <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">mejores recursos y herramientas</span>
            </h1>
            <p className="text-center md:px-10 mt-4 text-gray-700 max-w-4xl mx-auto">
                Encuentra generadores de código, paletas de colores, íconos y mucho más para mejorar tus proyectos de software. Únete a la comunidad
                y comparte tus propios recursos con el mundo.
            </p>
            <div className="lg:flex items-center justify-between my-10">
                <fieldset className="relative w-full lg:w-9/12 mb-6 md:mb-0">
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar recursos..."
                        className="ps-11 w-full text-gray-800 placeholder:text-gray-700 text-base py-5 bg-white shadow-md"
                    />
                    <InputIcon>
                        <Search size={19} color="#000" />
                    </InputIcon>
                </fieldset>
                <Link to={"/agregar-recurso"} className="bg-gray-900 shadow-lg text-white font-bold block rounded-md px-3 py-3 text-center mt-5 lg:mt-0">Agregar nuevo recurso</Link>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
                    {filteredResources.length > 0 ? (
                        filteredResources.map((resourceData) => (
                            <ResourceCard
                                key={resourceData.id}
                                resource={resourceData}
                                isOwner={resourceData.userId === auth.currentUser?.uid}
                                onDelete={() => handleDeleteResource(resourceData.id, resourceData.imageUrl)}
                                creatorName={userNames[resourceData.userId] || "Usuario Desconocido"}
                            />
                        ))
                    ) : (
                        <p className="text-center mt-5 w-full text-gray-800 font-black">No se encontraron recursos.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListResource;
