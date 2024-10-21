const oldQuery = [
    { $match: { _id: new mongoose.Types.ObjectId(_id) } },
    { $unwind: "$userUploads" },
    {
        $match: {
            "userUploads.path": { $regex: `^${query}`, $options: "i" }
        }
    },
    {
        $project: {
            path: "$userUploads.path",
            fileName: "$userUploads.fileName",
            storageFilename: "$userUploads.storageFilename",
            nextSegment: {
                $arrayElemAt: [
                    { $split: [{ $substr: ["$userUploads.path", { $strLenCP: query }, -1] }, "/"] },
                    0
                ]
            },
            isFile: { $ne: [{ $indexOfCP: ["$userUploads.path", "/", { $add: [{ $strLenCP: query }, 1] }] }, -1] }
        }
    },
    {
        $group: {
            _id: { path: "$nextSegment", fileName: "$fileName" },
            isFile: { $first: "$isFile" },
            storageFilename: { $first: "$storageFilename" }
        }
    },
    {
        $project: {
            _id: 0,
            folderName: "$_id.path",
            fileName: "$_id.fileName"
        }
    }
];