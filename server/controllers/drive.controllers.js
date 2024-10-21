const fs = require('fs').promises;
const path = require('path');
const { User } = require('../models/User');
const { default: mongoose } = require('mongoose');

const createFolder = async (req, res) => {
    try {
        let { resourcePath, fromLocation } = req.body;
        const { _id } = req.user;
        let newFolderName = fromLocation + resourcePath
        if (!resourcePath) {
            return res.status(400).json({ message: 'Resource path is required.' });
        }
        const pipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(_id) }
            },
            {
                $unwind: "$userUploads"
            },
            {
                $match: {
                    "userUploads.path": {
                        $regex: `^${newFolderName
                            }`, $options: "i"
                    }
                }
            },
            {
                $project: {
                    similarPath: "$userUploads.path",
                    fileName: "$userUploads.fileName",
                    _id: 0
                }
            }
        ]
        let pipelineAns = await User.aggregate(pipeline)
        console.log(pipelineAns)
        if (pipelineAns && pipelineAns.length > 0) {
            return res.status(409).json({ message: 'Similar data found, cannot create a folder' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    userUploads: {
                        path: fromLocation ? (fromLocation + resourcePath) : resourcePath
                    }
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Resource created successfully.'
        })
    } catch (error) {
        console.error('Error in createFolder:', error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const createFile = async (req, res) => {
    try {
        const { resourcePath } = req.body;
        const { _id } = req.user;

        if (!req.file) {
            return res.status(400).json({ message: 'File is required.' });
        }

        if (!resourcePath) {
            return res.status(400).json({ message: 'Resource path is required.' });
        }

        const update = {
            $push: {
                userUploads: {
                    path: resourcePath,
                    fileName: req.file.originalname,
                    storageFilename: req.file.filename
                }
            }
        };

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            update,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Resource created successfully.',
            userMedia: updatedUser.userUploads
        });
    } catch (error) {
        console.error('Error in createFolder:', error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getResults = async (req, res) => {
    try {
        const { query } = req.query;
        const { _id } = req.user;
        const numberOfSlashes = (query.match(/\//g) || []).length - 1;
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
                    segments: { $split: ["$userUploads.path", "/"] },
                    fileName: "$userUploads.fileName"
                }
            },
            {
                $project: {
                    desiredSegment: { $arrayElemAt: ["$segments", numberOfSlashes + 1] },
                    fileName: 1
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueSegments: {
                        $addToSet: {
                            segment: {
                                $cond: [
                                    { $ne: ["$desiredSegment", ""] },
                                    "$desiredSegment",
                                    "$fileName"
                                ]
                            },
                            type: {
                                $cond: [
                                    { $ne: ["$desiredSegment", ""] },
                                    "folder",
                                    "file"
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    uniqueSegments: {
                        $filter: {
                            input: "$uniqueSegments",
                            as: "item",
                            cond: { $ne: ["$$item.segment", ""] }
                        }
                    }
                }
            }
        ]
        let results = await User.aggregate(pipeline)

        res.json({
            message: 'Search completed',
            results
        });
    } catch (error) {
        console.error('Error in getResults:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createFolder, getResults, createFile };