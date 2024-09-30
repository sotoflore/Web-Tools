import { FormEvent, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase/config";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../types/category";
import { Button } from "keep-react";
import { Globe, ImagePlay, LetterText, Save } from "lucide-react";
import InputField from "../../components/form/InputField";
import { Textarea } from 'keep-react'
import toast from "react-hot-toast";

const EditResource = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResource = async () => {
            const docRef = doc(db, "resources", id!);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.userId !== auth.currentUser?.uid) {
                    navigate("/recursos");
                } else {
                    setName(data.name);
                    setUrl(data.url);
                    setDescription(data.description);
                    setCategory(data.category);
                }
            }
        };
        fetchResource();
    }, [id, navigate]);

    const countWords = (text: string) => {
        return text.trim().split(/\s+/).length;
    };

    const handleEditResource = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const docRef = doc(db, "resources", id!);
        let imageUrl = "";

        if (image) {
            const imageRef = ref(storage, `resources/${image.name}`);
            await uploadBytes(imageRef, image);
            imageUrl = await getDownloadURL(imageRef);
        }

        if (countWords(description) < 10) {
            setError("La descripción debe tener al menos 30 palabras.");
            return;
        }

        await updateDoc(docRef, {
            name,
            url,
            description,
            category,
            ...(image && { imageUrl }),
        });
        toast.success("Cambios realizados exitosamente!");
        navigate("/recursos");
    };

    return (
        <section className="flex flex-col items-center px-5 md:px-0 mt-12">
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form onSubmit={handleEditResource} className="w-full md:w-1/2 p-4 bg-white border border-gray-200 rounded-lg shadow " >
                <InputField
                    type="text"
                    placeholder="nombre del recurso..."
                    Icon={LetterText}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputField
                    type="url"
                    placeholder="Url del recurso..."
                    Icon={Globe}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <InputField
                    type="file"
                    placeholder="Url del recurso..."
                    Icon={ImagePlay}
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                {/* <textarea
                    className="border p-2 w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea> */}

                <fieldset className="space-y-1.5">
                    <Textarea
                        placeholder="Escribe una descripcion..."
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-base"
                    />
                    <p className="text-body-4 font-normal text-gray-400">La descripcion debe tener al menos 30 palabras.</p>
                </fieldset>
                
                <select
                    className="border p-2 w-full my-4"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="" disabled={true}>Selecciona una categoría</option>
                    {categories.map((option) => (
                        <option key={option.value} value={option.value}>{option.value}</option>
                    ))}
                </select>
                <Button className="bg-indigo-600 text-gray-50 hover:bg-indigo-700">
                    <Save size={20} className="mr-1.5" />
                    Guardar cambios
                </Button>
            </form>
            
        </section>
    );
};

export default EditResource;
