import React, { useState } from 'react';
import { Folder, File, Plus, Search, Settings, HelpCircle } from 'lucide-react';
import LayoutForFiles from '../Components/LayoutForFiles';
import GridViewIcon from '@mui/icons-material/GridView';
import MenuIcon from '@mui/icons-material/Menu';
import { domain } from '../lib/constants';
import { useAppSelector } from '../store/hooks';
import axios from 'axios';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BreadCrumb from '../Components/BreadCrumb';

const GoogleDrive = () => {
  const userData = useAppSelector(state => state.user.userData);

  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateInput = (value) => {
    const regex = /^(?!.*\/\/)(?!\/)(?!.*\/$)[a-zA-Z0-9/]*$/;
    return regex.test(value);
  };

  const [isList, setIsList] = useState(true);
  const [path, setPath] = useState('/');
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false)

  const [open, setOpen] = useState(false)

  const [arrayForBreadCrumb, setArrayForBreadCrumb] = useState(['My Drive'])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReceivedDataFromClick = (fileName) => {
    if (fileName) {
      setArrayForBreadCrumb((prevArray => [...prevArray, fileName]))
      setPath(prevPath => `${prevPath}${fileName}/`);
      setNeedToUpdate(true);
    }
  };

  const handleCreateNewFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadFile(file);
      }
    };
    input.click();
  };

  const handleCreateNewFolder = () => {
    uploadFolder(inputValue)
  }

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('individualFile', file);
    formData.append('resourcePath', path);
    try {
      const result = await fetch(`${domain}/createFile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`,
        },
        body: formData,
      });

      if (!result.ok) {
        console.log(result);
        alert('Upload failure');
        throw new Error('Upload failed');
      }

      await result.json();
      setNeedToUpdate(true);
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  const uploadFolder = async (folderName) => {
    try {
      const res2 = await axios.post(`${domain}/createFolder`, { resourcePath: folderName, fromLocation: path }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`
        }
      })
      console.log(res2.data.message)
      setNeedToUpdate(true)
      handleClose()
    } catch (error) {
      // if()
      if (error.response.status === 409) setIsDuplicate(true)
      console.error('Error creating folders:', error)
    }
  }

  const handleDataAboutFetch = () => {
    setNeedToUpdate(false)
  }

  const handleClickFromBreadCrumb = (value) => {
    if (value === '//') setPath('/')
    else setPath(value)
    setNeedToUpdate(true);
  }

  return (
    <div className="min-h-screen bg-[#1B1B1b] flex flex-col text-gray-300 font-product-sans">
      <header className="bg-[#1B1B1b]">
        <div className="max-w-7xl mr-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-center justify-between mb-2">
          <div className="flex items-start">
            <img src="/drive_logo.png" alt="Google Drive" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl pt-1 text-[#C5C7C4]">Drive</h1>
          </div>
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in Drive"
                className="w-full px-12 py-2 h-12 bg-[#282A2C] border border-none rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-200"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-8 text-gray-200" />
            </div>
          </div>
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-gray-300 mr-4 cursor-pointer hover:text-gray-100" />
            <Settings className="h-6 w-6 text-gray-300 cursor-pointer hover:text-gray-100" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-60 ml-2 bg-[#1B1B1b] shadow-md border-none">
          <div className="py-4">
            <button className="flex items-center justify-center py-4 px-4 ml-4 bg-[#3c4043] hover:bg-slate-600 text-white text-sm rounded-2xl shadow-sm transition duration-200" onClick={handleCreateNewFile}>
              <Plus className="h-5 w-5 mr-2" />
              Add New File
            </button>
          </div>
          <div className="py-4">
            <button className="flex items-center justify-center py-4 px-4 ml-4 bg-[#3c4043] hover:bg-slate-600 text-white text-sm rounded-2xl shadow-sm transition duration-200" onClick={handleClickOpen}>
              <Plus className="h-5 w-5 mr-2" />
              Add New Folder
            </button>
          </div>
          <ul className="space-y-2 p-2">
            <li className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <Folder className="h-5 w-5 mr-3 text-blue-400" />
              My Drive
            </li>
            <li className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <Folder className="h-5 w-5 mr-3 text-yellow-400" />
              Shared with me
            </li>
            <li className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer">
              <File className="h-5 w-5 mr-3 text-green-400" />
              Recent
            </li>
          </ul>
        </nav>
        <main className="flex-1 h-[530px] bg-[#131313] pr-8 pl-8 rounded-2xl ml-2 mr-2 mb-4 overflow-hidden">
          <div className='flex justify-between mt-3'>
            <BreadCrumb receiveNewValues={arrayForBreadCrumb} notifyAbove={handleClickFromBreadCrumb} />
            <span>
              <button onClick={() => setIsList(true)} className={`border border-purple-200 rounded-l-2xl w-auto px-2 py-1 ${isList ? 'bg-cyan-900' : ''}`}>
                <span hidden={!isList}>✓</span>
                <MenuIcon />
              </button>
              <button onClick={() => setIsList(false)} className={`border border-purple-200 rounded-r-2xl w-auto px-2 py-1 ${!isList ? 'bg-cyan-900' : ''}`}>
                <span hidden={isList}>✓</span>
                <GridViewIcon />
              </button>
            </span>
          </div>
          <div className='mt-2 mb-2'>
            <select className='mr-3 w-auto text-center bg-transparent border rounded-md border-white/50 py-[3.5px] text-slate-200 text-sm font-semibold' >
              <option value="">Type</option>
            </select>
            <select className='mx-3 w-auto bg-transparent border rounded-md border-white/50 py-[3.5px] text-slate-200 text-sm font-semibold'>
              <option value="">People</option>
            </select>
            <select className='mx-3 w-auto bg-transparent border rounded-md border-white/50 py-[3.5px] text-slate-200 text-sm font-semibold'>
              <option value="">Modified</option>
            </select>
          </div>
          <LayoutForFiles
            queryInput={path}
            isList={isList}
            pathUpdateForParent={handleReceivedDataFromClick}
            needToUpdate={needToUpdate}
            isFetchDone={handleDataAboutFetch}
          />
        </main>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Folder Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create folder write the folder name below,
            pro tip : you can create branching folder as such folder1/folder2/folderN
            and do not include / at start or back
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Folder Name"
            fullWidth
            variant="standard"
            error={isDuplicate}
            helperText={isDuplicate ? 'Folder already exists.' : ''}
            onChange={((e) => {
              setIsDuplicate(false)
              const value = e.target.value
              if (validateInput(value)) {
                setInputValue(value)
                setIsValid(true)
              } else {
                setIsValid(false)
              }
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!isValid || isDuplicate} onClick={handleCreateNewFolder} type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoogleDrive;
