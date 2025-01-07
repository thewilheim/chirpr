import { GiNestBirds } from "react-icons/gi";
import { useAuth } from "../../utils/Auth/useAuth";
import { FaEnvelope, FaRegNewspaper } from "react-icons/fa";
import { formatViews} from "../../utils";
import {  MdLogout, MdSettings } from "react-icons/md";
import {  useSelector } from "react-redux";
import { useGetSuggestedFollowersQuery} from "../../slices/userApiSlice";
import { IConversation, IUser } from "../../config/applicatonConfig";
import { FaCircleUser, FaRegMessage } from "react-icons/fa6";
import FollowButton from "../../components/FollowButton";
import "../../index.css"
import { useGetUserConversationsQuery } from "../../slices/messageSlice";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ProfilePicture from "../../components/ProfilePicture";

function Homepage() {
  return (
    <>
      <main className="flex flex-row text-chirpr-200">
        <section className="w-96">
          <UserProfileSnippit />
          <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
          <Navigation />
          <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
          <Suggestions />
        </section>
        <section className="flex flex-row border-2 border-chirpr-200/20 rounded-3xl mx-8 w-full bg-chirpr-900/30">
          <article className="flex flex-col border-r-2 border-chirpr-200/20 min-w-[75%]">
          <Outlet />
          </article>
          <div className="w-full">
          <Messages />
          <hr className="opacity-50 border-none h-[2px] bg-chirpr-200/40 rounded" />
          <Terms />
          </div>
        </section>
      </main>
    </>
  );
}

// const Stories = () => {
//   const user_stories = ["Will", "Stefan", "Kate", "Jim", "Pam","Dwight"];
//   return (
//     <div className="flex flex-row justify-evenly items-center p-6">
//       <div>
//       <button className="w-16 h-16 rounded-full border-dashed border-chirpr-500 border">
//         +
//       </button>
//       <p>Add story</p>
//       </div>
//       {user_stories.map((item) => {
//         return (
//           <div className="text-center">
//             <FaCircleUser size={60} />
//             {item}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

const Navigation = () => {
  const path = location.pathname;
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="my-8">
      <ul>
        <li
          className={`li-style ${path === "/" ? "li-active" : ""}`}
          onClick={() => navigate('/')}
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
        <li className="li-style text-red-700 hover:bg-red-200" onClick={() => {
          logoutUser()
        }}>
          <MdLogout className="mr-5 " /> Logout
        </li>
      </ul>
    </nav>
  );
};

const UserProfileSnippit = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center text-center p-6">
      <h1 className="flex flex-row items-center text-2xl  mb-12">
        <GiNestBirds size={46} className="mr-2" />
        Chirpr
      </h1>
      <ProfilePicture profile_picture_url={user.profile_picture_url} editable={true} width={"w-[96px]"} height={"h-[96px]"}  />
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
          <strong className="text-chirpr-200">{formatViews(user.numberOfFollowing)}</strong> <br />
          Following
        </p>
        <p>
          <strong className="text-chirpr-200">{formatViews(user.numberOfFollowers)}</strong> <br />
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
  const { data: conversations, isLoading } = useGetUserConversationsQuery('');
  const navigate = useNavigate();
  if(!conversations) return <>Test</>
  console.log(conversations)
  return(
    <section className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>
      <div>
        {!isLoading && conversations.length > 0 ? conversations.map((convo: IConversation) => {
          return(
            <div className="flex flex-row items-center justify-between hover:bg-chirpr-700 p-2 rounded">
              <div className="flex flex-row items-center gap-4 cursor-pointer" onClick={() => navigate(`/messages/${convo.id}`)}>
              <FaCircleUser size={44} />
              <p>{convo.other_user.username}</p>
              </div>
              <Link to={`/messages/${convo.id}`}><FaRegMessage /></Link>
            </div>
          )
        }): <>No Messages yet</>}
      </div>
    </section>
  )
}

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
  )
}

export default Homepage;
