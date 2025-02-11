import { GiNestBirds } from "react-icons/gi";
import { FaBell, FaEnvelope, FaRegNewspaper } from "react-icons/fa";
import { formatViews } from "../../utils";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  useGetSuggestedFollowersQuery,
} from "../../slices/userApiSlice";
import { IUser } from "../../config/applicatonConfig";
import { FaCircleUser } from "react-icons/fa6";
import FollowButton from "../../components/FollowButton";
import "../../index.css";
import { Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/ProfilePicture";
import { RootState } from "../../store";
import Loader from "../../components/Loader";
import { IoMdMenu } from "react-icons/io";
import { useState } from "react";

function Homepage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [toggleMobileDrawer, setToggleMobileDrawer] = useState(false);

  if (!userInfo) return <Loader />;
  return (
      <main className="flex text-chirpr-200 h-full">
        <section className="flex flex-col md:flex-row md:mx-auto w-full md:w-auto">
          <section className="sticky top-0 w-fill z-50 bg-chirpr-800 p-4 md:hidden">
            <div className="w-full flex flex-row items-center gap-2 sticky top-0 px-3 ">
              <IoMdMenu
                size={34}
                onClick={() => setToggleMobileDrawer(!toggleMobileDrawer)}
              />
              <GiNestBirds size={42} className="flex-1 items-center" />
              <div className="w-12"></div>
            </div>
          </section>
          <section
            className={`${
              toggleMobileDrawer ? "block" : "hidden"
            } md:block  md:fixed md:left-0 md:p-4 md:h-full md:border-r  md:border-r-white/20 2xl:block 2xl:static 2xl:border-0 2xl:w-[300px] `}
          >
            <UserProfileSnippit />
            <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded md:hidden 2xl:block" />
            <Navigation />
            <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded md:hidden 2xl:block" />
            <Suggestions />
          </section>
          <section
            className={`flex-row md:border-l md:border-r md:border-white/20 md:mx-16 md:w-[800px] h-full ${
              toggleMobileDrawer ? "hidden" : "flex"
            }`}
          >
            <article className="flex flex-col border-chirpr-200/20 w-full min-h-screen">
              <Outlet />
            </article>
          </section>
          <section
            className={`hidden 2xl:block 2xl:static 2xl:border-0 2xl:w-[300px]`}
          ></section>
        </section>
      </main>
  );
}

const UserProfileSnippit = () => {
  const { userInfo: user } = useSelector((state: RootState) => state.auth);
  console.log(user);

  return (
    <div className="flex flex-col items-center text-center p-6 md:hidden 2xl:flex">
      <h1 className="md:flex flex-row items-center text-2xl  mb-12 hidden">
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
  const navigate = useNavigate();
  return (
    <div className="my-8 md:hidden 2xl:block">
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
                className="flex flex-row justify-between items-center mb-4"
                key={item.id}
              >
                <div className="flex-row flex items-center">
                  <FaCircleUser size={45} className="mr-3" />
                  <p
                    className="font-bold overflow-hidden text-ellipsis max-w-28 cursor-pointer"
                    onClick={() => navigate(`/profile/${item.id}`)}
                  >
                    {item.username}
                  </p>
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

const Navigation = () => {
  const path = location.pathname;
  const navigate = useNavigate();

  return (
    <nav className="my-8">
      <ul>
        <li
          className={`li-style ${path === "/" ? "li-active" : ""}`}
          onClick={() => navigate("/")}
        >
          <FaRegNewspaper className="mr-5 md:size-6 md:mr-0 2xl:mr-5" />{" "}
          <p className="md:hidden 2xl:block">Feed</p>
        </li>
        <li
          className={`li-style ${path === "/notifications" ? "li-active" : ""}`}
          onClick={() => {
            navigate("/notifications");
          }}
        >
          <FaBell className="mr-5 md:size-6 md:mr-0 2xl:mr-5" />{" "}
          <p className="md:hidden 2xl:block">Notifications</p>
        </li>
        <li
          className={`li-style ${path === "/messages" ? "li-active" : ""}`}
          onClick={() => {
            navigate("/messages");
          }}
        >
          <FaEnvelope className="mr-5 md:size-6 md:mr-0 2xl:mr-5" />{" "}
          <p className="md:hidden 2xl:block">Messages</p>
        </li>
        <li
          className={`li-style ${path === "/settings" ? "li-active" : ""}`}
          onClick={() => {
            navigate("/settings");
          }}
        >
          <MdSettings className="mr-5 md:size-6 md:mr-0 2xl:mr-5" />{" "}
          <p className="md:hidden 2xl:block">Settings</p>
        </li>
      </ul>
    </nav>
  );
};

export default Homepage;
