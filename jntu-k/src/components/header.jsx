import "../App.css"
import { IoIosChatbubbles } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
let Header = () => {
  const location = useLocation();
  const { name, email , role ,department } = location.state || {};

    return<>

      <nav className="custom-navbar shadow-sm py-3">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <ul className="nav me-auto flex-wrap">
            <li className="nav-item"><Link state={{ name, email , role ,department }} to="/JNTUHUCEJ" className="nav-link text-white ">Home <FaHome />
</Link></li>
            <li className="nav-item"><Link state={{ name, email , role ,department }}to ="/Friends" className="nav-link text-white">Explore <FaUserFriends /></Link></li>
            <li className="nav-item"><Link state={{ name, email , role ,department }} to="/Addpost" className="nav-link text-white">Post <MdAddBox /></Link></li>

            <li className="nav-item"><Link state={{ name, email , role ,department }} to="/Livechat" className="nav-link text-white">Live Chat <IoIosChatbubbles /></Link></li>
            <li className="nav-item"><Link state={{ name, email , role ,department }} to="/Profile" className="nav-link text-white">Profile <MdAccountCircle />
</Link></li>
           </ul>
          
        </div>
      </nav>
    </>
}
export default Header;