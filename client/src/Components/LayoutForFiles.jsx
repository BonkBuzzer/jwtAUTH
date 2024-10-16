import React from 'react';
import { File, Folder } from 'lucide-react';
import { useFetchData } from '../hooks/useFetchData';
import { domain } from '../lib/constants';
import Loader from './Loader'

const LayoutForFiles = ({ queryInput }) => {
    const handleContextMenuClick = (event) => {
        event.preventDefault();
        console.log('beep boop');
    };

    const { error, loading, response } = useFetchData(`${domain}/getResults`, 'get', { query: queryInput });

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <div className='h-[97%]' onContextMenu={handleContextMenuClick}>
            {response && response.results && response.results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {response.results.map((resource, index) => (
                        <div key={index} className="bg-[#1B1B1b] p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer border border-gray-700">
                            {resource.fileName ? (
                                <File className="h-12 w-12 text-green-400 mb-2" />
                            ) : (
                                <Folder className="h-12 w-12 text-blue-400 mb-2" />
                            )}
                            <p className="text-sm text-gray-300">{resource.name || resource.fileName}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="text-white flex justify-center text-center">
                    <span>
                        <img src="/empty_state_empty_folder.svg" className='w-72 h-72' alt="" />
                        <div className='text-xl'>Drop files here</div>
                        <div>or use the "New" button</div>
                    </span>
                </span>
            )}
        </div>
    );
};

export default LayoutForFiles;