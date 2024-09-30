import { Link } from "react-router-dom";

const Hero = () => {

    return (
        <section className="pb-16 pt-8">
            <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 rounded-2xl">
                <div className="py-10 sm:py-16 lg:py-24 2xl:pl-1">
                    <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-8 2xl:gap-x-20">
                        <div>
                            <h1 className="text-3xl font-bold leading-tight text-gray-100 sm:text-4xl lg:text-6xl">
                                Descubre y comparte
                                <div className="relative inline-flex">
                                    <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4f46e5]" />
                                    <h1 className="relative text-4xl font-bold text-gray-100 sm:text-6xl lg:text-7xl">recursos.</h1>
                                </div>
                            </h1>
                            <p className="mt-4 text-base text-gray-50">
                                Descubre y comparte recursos relacionados con el desarrollo de software.
                                Regístrate para agregar herramientas de desarrollo, generadores de código, paletas de colores, bibliotecas y más.
                            </p>

                            <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                                <Link to={"/recursos"} className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-lg text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-800" role="button">
                                    Get started
                                </Link>
                            </div>
                        </div>

                        <div className="relative px-12">
                            <svg className="absolute inset-x-0 bottom-0 left-1/2 -translate-x-1/2 -mb-48 lg:-mb-72 text-yellow-300 w-[460px] h-[460px] sm:w-[600px] sm:h-[600px]" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3" />
                            </svg>
                            <img className="relative w-full max-w-xs mx-auto -mb-60 lg:-mb-64" src="https://cdn.rareblocks.xyz/collection/celebration/images/cta/8/iphone-mockup.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;