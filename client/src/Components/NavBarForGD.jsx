import React from 'react'
import { Folder, File, Plus } from 'lucide-react';
const NavBarForGD = () => {
    return (
        <>
        <nav className="w-60 ml-2 bg-[#1B1B1b] shadow-md border-none">
            <div className="py-4">
                <button className="flex items-center justify-center py-4 px-4 ml-4 bg-[#3c4043] hover:bg-slate-600 text-white text-sm rounded-2xl shadow-sm transition duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    New
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
        </>
    )
}

export default NavBarForGD