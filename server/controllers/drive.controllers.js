const fs = require('fs').promises;
const path = require('path');
const { User } = require('../models/User');
const { default: mongoose } = require('mongoose');

const createResource = async (req, res) => {
    try {
        const { isFolder, resourceName, resourcePath } = req.body;
        const { _id } = req.user;

        if (!resourcePath) {
            return res.status(400).json({ message: 'Resource path is required.' });
        }

        let update = {
            $push: {
                userUploads: {
                    path: resourcePath + resourceName
                }
            }
        };

        if (!isFolder) {
            if (!resourceName) {
                return res.status(400).json({ message: 'Resource name is required for files.' });
            }

            const fileNameForCreation = `${_id}_${Date.now()}_${resourceName}`;
            const filePath = path.join('E:/!unknown/jwt-auth/server/uploads/', fileNameForCreation);

            await fs.writeFile(filePath, '');

            update.$push.userUploads = {
                path: resourcePath,
                fileName: resourceName,
                storageFilename: fileNameForCreation
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            update,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Resource created successfully.'
        })
    } catch (error) {
        console.error('Error in createResource:', error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getResults = async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query)
        const { _id } = req.user;

        const pipeline = [
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
                    _id: "$nextSegment",
                    isFile: { $first: "$isFile" },
                    path: { $first: "$path" },
                    fileName: { $first: "$fileName" },
                    storageFilename: { $first: "$storageFilename" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    path: 1,
                    fileName: 1
                }
            }
        ];

        const results = await User.aggregate(pipeline);

        console.log('Aggregation results:', JSON.stringify(results, null, 2));

        res.json({
            message: 'Search completed',
            results: results
        });
    } catch (error) {
        console.error('Error in getResults:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createResource, getResults };