import { FaRegNewspaper, FaCircleUser } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import { MdForum, MdPermMedia, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { isAuthenticted } from "../utils";
import { IUser } from "../config/applicatonConfig";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useState } from "react";

const Navbar = () => {
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();

  const [showMenu, setShowMenu] = useState(false);

  const path = location.pathname

  async function handleLogout(): Promise<void> {
    try {
      setShowMenu(!setShowMenu)
      await logoutUser('');
      dispatch(logout());
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const LoggedIn = () => {
    return (
      <>
      <div className="md:hidden py-6 flex flex-row items-center">
        <button onClick={() => setShowMenu(!showMenu)}><FaCircleUser className="cursor-pointer" size={42}/></button>
        <h1 className="ml-3">{showMenu ? `Where to now ${userInfo.first_name.toLowerCase()}?`: `Hello ${userInfo.first_name.toLowerCase()}!`}</h1>
      </div>
      <div className={`${showMenu ? 'absolute h-screen w-screen top-[6rem] left-0 bg-chirpr-800 z-50' : 'hidden'} md:flex justify-start flex-col p-6`}>
        <div className="flex justify-center flex-col text-center items-center mb-6">
          <div className="w-24 h-24 my-2">
          <FaCircleUser className="cursor-pointer h-full w-full" />
          </div>
          <p className="my-2 font-bold">
            {userInfo.first_name + " " + userInfo.last_name}
          </p>
          <Link to={`/chirpr/${userInfo.id}`} className="">@{userInfo.username}</Link>
        </div>

        <nav className="font-bold">
          <ul>
            <li className={`li-style ${path === '/' ? 'li-active' : ''}`} onClick={() => {
              setShowMenu(!setShowMenu);
              navigate("/");
            }}>
              <FaRegNewspaper className="mr-5" /> Chirp Feed
            </li>
            <li className={`li-style ${path === '/messages' ? 'li-active' : ''}`} onClick={() => {
              setShowMenu(!setShowMenu);
              navigate("/messages")
            }}>
              <FaEnvelope className="mr-5" /> Messages
              <NotificationBubble number={50} />
            </li>
            <li className="li-style">
              <MdForum className="mr-5" /> Nests
            </li>
            <li className="li-style">
              <MdPermMedia className="mr-5" /> Media
            </li>
            <li className="li-style">
              <MdSettings className="mr-5" /> Settings
            </li>
          </ul>
        </nav>
        <button className="text-red-700" onClick={handleLogout}>
          Logout
        </button>
      </div>
      </>
    );
  };

  const NotLoggedIn = () => {
    return (
      <div className="p-6 md:w-42">
        <div className="items-center flex flex-col md:mt-24">
        <h1 className="text-3xl mb-6">Join and have a chirp</h1>
        <div className="flex flex-row">
          <button className="mr-6 bg-chirpr-700 hover:bg-chirpr-800 focus:ring-4 focus:outline-none focus:ring-chirpr-300 font-medium rounded-lg text-sm p-2 px-4 text-center  dark:hover:bg-chirpr-600 dark:focus:ring-chirpr-800 " onClick={() => navigate("/register")}>Sign up</button>
          <button className="bg-chirpr-700 hover:bg-chirpr-800 focus:ring-4 focus:outline-none focus:ring-chirpr-300 font-medium rounded-lg text-sm p-2 px-4 text-center dark:bg-chirpr-600 dark:hover:bg-chirpr-700 dark:focus:ring-chirpr-800" onClick={() => navigate("/login")}>Sign in</button>
        </div>
        </div>
      </div>
    );
  };

  return isAuthenticted() ? <LoggedIn /> : <NotLoggedIn />;
};

const NotificationBubble = (props: { number: number }) => {
  const { number } = props;
  if (!number) {
    return;
  }
  return (
    <div className="absolute right-3 min-h-6 min-w-8 rounded-full text-center font-normal text-sm p-[5px] bg-black text-white dark:bg-chirpr-100 dark:text-chirpr-900 dark:font-bold">
      {number}
    </div>
  );
};

export default Navbar;
