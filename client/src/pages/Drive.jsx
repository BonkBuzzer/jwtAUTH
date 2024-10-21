import React from 'react'
import { useFetchData } from '../hooks/useFetchData'
import { domain } from '../lib/constants'
import Loader from '../Components/Loader'
import { File, Folder } from 'lucide-react'

const Drive = () => {
    // //! resource path gives the path that from where the resource is being created
    // const { error, loading, response } = useFetchData(`${domain}/createFolder`, 'post', { resourcePath: 'd/r/f/g/h/j/k/l/o/p/i/u', fromLocation: '/x/' })
    // if (error) {
    //     return <div>{error.response.data}</div>
    // }
    // if (loading) return <Loader />
    return (
        // <div>{response?.message}</div>
        <></>
    )
    // const { error, loading, response } = useFetchData(`${domain}/getResults`, 'get')
    // if (error) {
    //     return <div>{error.response.data}</div>
    // }
    // if (loading) return <Loader />
    // return (
    //     <div>
    //         {response?.results.map((resource) => (
    //             <span key={resource._id}>
    //                 {resource.fileName || resource.folderName} {resource.fileName ? <File /> : <Folder />}
    //             </span>
    //         ))}
    //     </div>
    // )
}

export default Drive