import React, { useEffect, useState } from 'react';
import { domain } from '../lib/constants';
import Loader from './Loader';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useAppSelector } from '../store/hooks';
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const LayoutForFiles = ({ isList, pathUpdateForParent, queryInput, needToUpdate, isFetchDone }) => {
    const userData = useAppSelector(state => state.user.userData);
    const [query, setQuery] = useState('/');
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true)
    const [files, setFiles] = useState()

    const handleContextMenuClick = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${domain}/getResults?query=${queryInput}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userData.accessToken}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch files');
                }
                const data = await res.json();
                setResponse(data);
                setFiles(data.results[0]?.uniqueSegments || []);
                isFetchDone(true)
            } catch (error) {
                console.error('Error fetching files:', error);
                setError(error)
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [queryInput, needToUpdate, userData.accessToken]);

    const handleClick = (resource) => {
        const newQuery = (resource.type === 'folder' ? `${query}${resource.segment}/` : '');
        setQuery(newQuery);
        pathUpdateForParent(resource.type === 'folder' ? resource.segment : '');
    };

    if (loading) return <div>loading..</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    const scrollbarOptions = {
        suppressScrollX: true,
        wheelSpeed: 0.25,
        wheelPropagation: false,
        minScrollbarLength: 400
    };

    return (
        <div className='h-[80%] overflow-hidden' onContextMenu={handleContextMenuClick}>
            {response && response.results && response.results[0]?.uniqueSegments?.length > 0 ? (
                <PerfectScrollbar options={scrollbarOptions} className="h-full">
                    {isList ? (
                        <div className="pt-5">
                            <div className='border-b-[0.5px] border-white/25'>
                                <span className='text-sm font-semibold text-white'>
                                    Name
                                </span>
                            </div>
                            {files.map((resource, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(resource)}
                                    className="flex items-center p-4 shadow-md hover:shadow-lg transition duration-200 cursor-pointer border-b-[0.5px] border-white/25"
                                >
                                    {resource.segment && (
                                        resource.segment && resource.type === 'file' ? (
                                            <InsertDriveFileIcon className="h-6 w-6 mr-4" />
                                        ) : (
                                            <FolderIcon className="h-8 w-8 mr-4" />
                                        )
                                    )}
                                    <p className="text-sm font-semibold text-gray-300">{resource.segment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {files.map((resource, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(resource)}
                                    className="bg-[#1B1B1b] p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer border border-gray-700"
                                >
                                    {resource.type === 'file' ? (
                                        <InsertDriveFileIcon className="h-12 w-12 mb-2" />
                                    ) : (
                                        <FolderIcon className="h-12 w-12 mb-2" />
                                    )}
                                    <p className="text-sm text-gray-300">{resource.segment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </PerfectScrollbar>
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