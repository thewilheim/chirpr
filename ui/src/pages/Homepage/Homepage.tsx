import { GiNestBirds } from "react-icons/gi";
import { FaEnvelope, FaRegNewspaper } from "react-icons/fa";
import { formatViews } from "../../utils";
import { MdLogout, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetSuggestedFollowersQuery,
  useLogoutMutation,
} from "../../slices/userApiSlice";
import { IConversation, IUser } from "../../config/applicatonConfig";
import { FaCircleUser, FaRegMessage } from "react-icons/fa6";
import FollowButton from "../../components/FollowButton";
import "../../index.css";
import { useGetUserConversationsQuery } from "../../slices/messageSlice";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/ProfilePicture";
import { logout } from "../../slices/authSlice";
import { RootState } from "../../store";
import Loader from "../../components/Loader";
import { IoMdMenu } from "react-icons/io";
import { useState } from "react";
function Homepage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [toggleMobileDrawer, setToggleMobileDrawer] = useState(false);

  if (!userInfo) return <Loader />;
  return (
    <>
      <main className="flex flex-col md:flex-row text-chirpr-200 justify-center max-w-[1440px] mx-auto">
        <MobileHeader
          setToggleMobileDrawer={setToggleMobileDrawer}
          toggleMobileDrawer={toggleMobileDrawer}
        />
        {toggleMobileDrawer && (
          <MobileSideBar setToggleMobileDrawer={setToggleMobileDrawer} />
        )}
        <DesktopSideBar />
        <section className="flex flex-row md:border-2 md:border-chirpr-200/20 md:rounded-3xl md:mx-8 w-full md:bg-chirpr-900/30">
          <article className="flex flex-col border-chirpr-200/20 w-full">
            <Outlet />
          </article>
        </section>
        {/* <section>
        <div className="w-full">
            <Messages />
            <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
            <Terms />
          </div>
        </section> */}
        <MobileFooter />
      </main>
    </>
  );
}

const Navigation = () => {
  const path = location.pathname;
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav className="my-8">
      <ul>
        <li
          className={`li-style ${path === "/" ? "li-active" : ""}`}
          onClick={() => navigate("/")}
        >
          <FaRegNewspaper className="mr-5" /> Feed
        </li>
        <li
          className={`li-style ${path === "/messages" ? "li-active" : ""}`}
          onClick={() => {}}
        >
          <FaEnvelope className="mr-5" /> Notifications
        </li>
        <li className="li-style">
          <MdSettings className="mr-5" /> Settings
        </li>
        <li
          className="li-style text-red-700 hover:bg-red-200"
          onClick={async () => {
            await logoutUser("");
            dispatch(logout());
          }}
        >
          <MdLogout className="mr-5 " /> Logout
        </li>
      </ul>
    </nav>
  );
};

const MobileSideBar = ({
  setToggleMobileDrawer,
}: {
  setToggleMobileDrawer: (value: boolean) => void;
}) => {
  return (
    <section
      className="fixed top-0 left-0 h-screen w-screen bg-chirpr-900/80 z-50"
      onClick={() => setToggleMobileDrawer(false)}
    >
      <div className="fixed top-0 left-0 h-screen p-4 overflow-y-auto z-50 bg-chirpr-800">
        <UserProfileSnippit />
        <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
        <Navigation />
        <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
        <Suggestions />
      </div>
    </section>
  );
};

const MobileFooter = () => {
  return (
    <section className="sticky bottom-0 w-fill h-18 z-40 bg-chirpr-800 border-t-2 border-t-chirpr-500/30 p-4 md:hidden">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <GiNestBirds size={38} />{" "}
          <p className="ml-2 text-2xl font-bold">Chirpr</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-400 rounded-lg mr-4">
            Create account
          </button>
          <button className="px-4 py-2 bg-chirpr-700 rounded-lg">
            Sign in
          </button>
        </div>
      </div>
    </section>
  );
};
const MobileHeader = ({
  setToggleMobileDrawer,
  toggleMobileDrawer,
}: {
  setToggleMobileDrawer: (value: boolean) => void;
  toggleMobileDrawer: boolean;
}) => {
  return (
    <section className="sticky top-0 w-fill z-50 bg-chirpr-800 p-4 md:hidden">
      <div className="w-full flex flex-row items-center gap-2 sticky top-0px-3 ">
        <IoMdMenu
          size={34}
          onClick={() => setToggleMobileDrawer(!toggleMobileDrawer)}
        />
        <GiNestBirds size={42} className="flex-1 items-center" />
        <div className="w-11"></div>
      </div>
    </section>
  );
};

const DesktopSideBar = () => {
  return (
    <section className="hidden md:block">
      <UserProfileSnippit />
      <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
      <Navigation />
      <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
      <Suggestions />
    </section>
  );
};

const UserProfileSnippit = () => {
  const { userInfo: user } = useSelector((state: RootState) => state.auth);
  console.log(user);

  return (
    <div className="flex flex-col items-center text-center p-6">
      <h1 className="flex flex-row items-center text-2xl  mb-12">
        <GiNestBirds size={46} className="mr-2" />
        Chirpr
      </h1>
      <ProfilePicture
        profile_picture_url={user.profile_picture_url}
        editable={true}
        width={"w-[96px]"}
        height={"h-[96px]"}
      />
      <h2 className="text-xl tracking-wider">
        {user.first_name} {user.last_name}
      </h2>
      <p className="text-sm opacity-60">@{user.username}</p>
      <p className="mt-2 opacity-60">{user.bio}</p>
      <div className="flex flex-row w-full justify-between mt-6 text-sm text-chirpr-200/45 tracking-wide">
        <p>
          <strong className="text-chirpr-200">{400}</strong> <br />
          Chirps
        </p>
        <p>
          <strong className="text-chirpr-200">
            {formatViews(user.numberOfFollowing)}
          </strong>{" "}
          <br />
          Following
        </p>
        <p>
          <strong className="text-chirpr-200">
            {formatViews(user.numberOfFollowers)}
          </strong>{" "}
          <br />
          Followers
        </p>
      </div>
    </div>
  );
};
const Suggestions = () => {
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const { data: suggestedFollowers, isLoading } = useGetSuggestedFollowersQuery(
    userInfo.id
  );
  return (
    <div className="my-8">
      <h1 className="mb-6 text-2xl font-bold">Suggestions</h1>
      {isLoading ? (
        <>loading</>
      ) : (
        suggestedFollowers.map(
          (item: {
            id: number;
            username: string;
            profile_picture_url: string;
          }) => {
            return (
              <div
                className="flex flex-row justify-between items-center align-middle mb-4"
                key={item.id}
              >
                <div className="flex-row flex items-center">
                  <FaCircleUser size={45} className="mr-3" />
                  <p className="font-bold">{item.username}</p>
                </div>
                <FollowButton userToFollow={item.id} />
              </div>
            );
          }
        )
      )}
    </div>
  );
};

const Messages = () => {
  const { data: conversations, isLoading } = useGetUserConversationsQuery("");
  const navigate = useNavigate();
  if (!conversations) return <>Test</>;
  return (
    <section className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>
      <div>
        {!isLoading && conversations.length > 0 ? (
          conversations.map((convo: IConversation) => {
            return (
              <div className="flex flex-row items-center justify-between hover:bg-chirpr-700 p-2 rounded">
                <div
                  className="flex flex-row items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/messages/${convo.id}`)}
                >
                  <FaCircleUser size={44} />
                  <p>{convo.other_user.username}</p>
                </div>
                <Link to={`/messages/${convo.id}`}>
                  <FaRegMessage />
                </Link>
              </div>
            );
          })
        ) : (
          <>No Messages yet</>
        )}
      </div>
    </section>
  );
};

const Terms = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 p-6 opacity-50">
      <p>About</p>
      <p>Accessibility</p>
      <p>Help Center</p>
      <p>Privacy and Terms</p>
      <p>Advertising</p>
      <p>Business Services</p>
    </div>
  );
};

export default Homepage;
