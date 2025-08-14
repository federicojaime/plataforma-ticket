import { Spinner } from 'flowbite-react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
                <Spinner size="xl" aria-label="Loading" />
                <p className="mt-4 text-lg font-semibold text-gray-700">Cargando...</p>
            </div>
        </div>
    );
};

export default Loading;