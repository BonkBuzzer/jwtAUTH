import { useState } from "react";
import { domain } from '../lib/constants';
import { useAppSelector } from "../store/hooks";

const UploadFile = () => {
    const [files, setFiles] = useState([]);
    const userData = useAppSelector(state => state.user.userData);

    const handleFileChange = (event) => {
        console.log(event.target.file)
        const selectedFiles = Array.from(event.target.file);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        files.forEach(file => {
            formData.append('individualFile', file);
        });

        try {
            const result = await fetch(`${domain}/createFile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`,
                },
                body: formData,
            });

            if (!result.ok) {
                throw new Error('Upload failed');
            }

            const data = await result.json();
            console.log('Upload successful:', data);
        } catch (err) {
            console.error('Error uploading files:', err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid place-content-center mt-20">
                    <input
                        type="file"
                        name="individualFile"
                        id="individualFile"
                        onChange={handleFileChange}
                        required
                    />
                    <button type="submit">TAP ME!</button>
                </div>
            </form>
        </>
    );
};

export default UploadFile;
