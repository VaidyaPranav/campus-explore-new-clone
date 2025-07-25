import './App.css'
import Firstif from './components/firstif';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login1 from './components/login1';
import Login2 from './components/login2';
import Field from './components/field';
import Friends from './components/friends';
import Addpost from './components/Addpost';
import Notifications from './components/Notifications';
import Profile from './components/profile';
import Chat from './components/chat';
import Frndsprofile from './components/frndsprofile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hodlogin" element={<Login/>} />
        <Route path="/" element={<Firstif/>} />
        <Route path="/facultylogin" element={<Login1/>} />
        <Route path="/studentlogin" element={<Login2/>} />
        <Route path="/JNTUHUCEJ" element={<Field/>} />
        <Route path='/Friends' element ={<Friends/>}></Route>
        <Route path ='/Addpost' element={<Addpost/>}></Route>
        <Route path ='/Notifications' element={<Notifications/>}></Route>
        <Route path ='/Profile' element={<Profile/>}></Route>
        <Route path = '/Livechat' element={<Chat/>}></Route>
        <Route path = '/profile/:email' element={<Frndsprofile/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
