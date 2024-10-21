import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FolderIcon from '@mui/icons-material/Folder';

const buttonStyles = {
    color: 'white',
    fontWeight: 'bold',
    transition: 'opacity 0.3s, background-color 0.3s',
    '&:hover': { backgroundColor: 'gray' },
    textTransform: 'none'
};

export default function BreadCrumb({ receiveNewValues, notifyAbove }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getFullPath = (index) => {
        const basePath = '/';
        const pathElements = receiveNewValues.slice(1, index + 1);
        const fullPath = basePath + pathElements.join('/') + '/';
        receiveNewValues.splice(index + 1)
        return fullPath;
    };

    const renderBreadcrumbs = () => {
        const length = receiveNewValues.length;

        if (length === 0) return null;
        if (length <= 3) {
            return receiveNewValues.map((item, index) => (
                <Button key={index} sx={buttonStyles} onClick={() => {
                    const fullPath = getFullPath(index);
                    notifyAbove(fullPath);
                }}>
                    {item}
                    <div key="separator1" className='text-white/50 font-bold'>{`>`}</div>,
                </Button>
            ));
        }

        return [
            <Button
                key="ellipsis"
                sx={{
                    ...buttonStyles,
                    opacity: 0.5,
                }}
                onClick={handleClick}
            >
                ...
            </Button>,
            <div key="separator1" className='text-white/50 font-bold'>{`>`}</div>,
            <Button
                onClick={() => {
                    const fullPath = getFullPath(length - 2);
                    notifyAbove(fullPath);
                }}
                key="penultimate"
                sx={{
                    ...buttonStyles,
                    opacity: 0.5,
                }}
            >
                {receiveNewValues[length - 2]}
            </Button>,
            <div key="separator2" className='text-white/50 font-bold'>{`>`}</div>,
            <Button
                onClick={() => {
                    const fullPath = getFullPath(length - 1);
                    notifyAbove(fullPath);
                }}
                key="last"
                sx={buttonStyles}
            >
                {receiveNewValues[length - 1]}
            </Button>
        ];
    };

    const getHiddenItems = () => {
        const length = receiveNewValues.length;
        if (length <= 3) return [];

        return receiveNewValues.slice(0, -2);
    };

    return (
        <>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {getHiddenItems().map((elem, index) => (
                    <MenuItem key={index} onClick={() => {
                        handleClose();
                        const fullPath = getFullPath(index);
                        notifyAbove(fullPath);
                    }}>
                        <FolderIcon className='h-8 w-8 mr-4' />{elem}
                    </MenuItem>
                ))}
            </Menu>
            <Breadcrumbs aria-label="breadcrumbs">
                {renderBreadcrumbs()}
            </Breadcrumbs>
        </>
    );
}
