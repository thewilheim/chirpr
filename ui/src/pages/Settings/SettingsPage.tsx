import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../slices/apiSlice";
import { FaArrowRight, FaLock, FaPaintBrush, FaUser } from "react-icons/fa";
import { logout } from "../../slices/authSlice";
import { MdLogout } from "react-icons/md";
import { useLogoutMutation } from "../../slices/userApiSlice";

function SettingsPage() {
  const user = useSelector(selectCurrentUser);
  const settings = [
    { title: "Account", path: "/settings/account", icon: <FaUser /> },
    {
      title: "Privacy and sercurity",
      path: "/settings/privacy-and-security",
      icon: <FaLock />,
    },
    {
      title: "Appearance",
      path: "/settings/appearance",
      icon: <FaPaintBrush />,
    },
  ];

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();

  return (
    <div>
      <div className="p-4 border-b border-white/20">
        <h1 className="text-2xl">Settings</h1>
      </div>
      <section className="flex flex-col justify-center items-center py-6 border-b border-white/20 border-t md:border-t-0">
        <img
          src={user.profile_picture_url}
          alt=""
          className="w-28 h-28 rounded-full"
        />
        <h2 className="text-4xl py-1 font-bold">{user.username}</h2>
        <p className="text-white/70 text-lg">@{user.username}</p>
      </section>
      <section className="flex flex-col justify-center items-center border-b border-b-white/20 text-xl py-2">
        {settings.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-row justify-between items-center w-full p-4 hover:bg-white/10"
            >
              <div className="flex flex-row items-center gap-4">
                {item.icon}
                <p>{item.title}</p>
              </div>
              <FaArrowRight />
            </div>
          );
        })}
      </section>
      <p
        className=" text-red-700 hover:bg-red-200 text-xl flex flex-row p-4 items-center cursor-pointer"
        onClick={async () => {
          await logoutUser("");
          dispatch(logout());
        }}
      >
        <MdLogout className="mr-5" /> <p>Logout</p>
      </p>
    </div>
  );
}

export default SettingsPage;
