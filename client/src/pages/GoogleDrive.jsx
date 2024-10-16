import React from 'react';
import { Folder, File, Plus, Search, Settings, HelpCircle } from 'lucide-react';
import NavBarForGD from '../Components/NavBarForGD';
import LayoutForFiles from '../Components/LayoutForFiles';
import { useLocation } from 'react-router-dom';

const GoogleDrive = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  return (
    <div className="min-h-screen bg-[#1B1B1b] flex flex-col text-gray-300 font-product-sans">
      <header className="bg-[#1B1B1b]">
        <div className="max-w-7xl mr-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-center justify-between">
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
            <Settings className="h-6 w-6 text-gray-300  cursor-pointer hover:text-gray-100" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <NavBarForGD />
        <main className="flex-1 bg-[#131313] p-8 rounded-2xl m-2">
          <div className="text-2xl font-semibold text-gray-100 mb-4">My Drive</div>
          <div className='mt-2'>
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
          <LayoutForFiles queryInput={query} />
        </main>
      </div>
    </div>
  );
};

export default GoogleDrive;