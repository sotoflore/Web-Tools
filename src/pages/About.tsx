import { Link } from "react-router-dom";

const About = () => {
    return (
        <section className="flex items-center mt-12 md:mt-44">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
                    Acerca de WebTools
                </h2>
                <p className="mt-6 text-center text-gray-800 text-lg md:px-32">
                    WebTools es una plataforma diseñada para que desarrolladores web descubran,
                    compartan y accedan a los mejores recursos de desarrollo. Desde generadores
                    de código, paletas de colores, iconos, hasta herramientas avanzadas que te
                    ayudarán a llevar tus proyectos al siguiente nivel. Nuestra misión es simplificar
                    y mejorar la experiencia de desarrollo web, ofreciendo herramientas y recursos
                    curados por la comunidad de programadores.
                </p>
                <div className="mt-16 text-center">
                    <Link to={"/recursos"} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-indigo-500">
                        Explorar Recursos
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default About;
