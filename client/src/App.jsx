import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import GoogleDrive from './pages/GoogleDrive';
import BackendLess from './pages/BackendLess';
import AuthWrapper from './Components/AuthWrapper';
import Drive from './pages/Drive';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<AuthWrapper children={<Dashboard />} />} />
        <Route path='/profile' element={<AuthWrapper children={<Profile />} />} />
        <Route path='/google-drive' element={<AuthWrapper children={<GoogleDrive />} />} />
        <Route path='/backendless' element={<AuthWrapper children={<BackendLess />} />} />
        <Route path='/drive' element={<AuthWrapper children={<Drive />} />} />
      </Routes>
    </div>
  )
}

export default App;