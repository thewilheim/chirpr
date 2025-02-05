import { formatViews } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProfileQuery } from "../../slices/userApiSlice";
import { useGetChirpByUserIdQuery } from "../../slices/chirpSlice";
import Chirp from "../../components/Chirp";
import { useCreateConversationMutation } from "../../slices/messageSlice";
import { useSelector } from "react-redux";
import { IUser } from "../../config/applicatonConfig";
import FollowButton from "../../components/FollowButton";
import { MdArrowBackIosNew, MdEditSquare } from "react-icons/md";
import { useState } from "react";
import EditProfileModal from "../../components/EditProfileModal";
import ProfilePicture from "../../components/ProfilePicture";
import { selectCurrentToken } from "../../slices/apiSlice";

function ProfilePage() {
  const { id: user_id } = useParams();
  const [createConversation] = useCreateConversationMutation();
  const navigate = useNavigate();
  if (!user_id) throw console.error("no id found");
  const [toggleEditModal, setToggleEditModal] = useState(false);

  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );

  const { data: user, isLoading: loadingUser } = useGetProfileQuery(user_id);
  const { data: chirps, isLoading: loadingChirps } =
    useGetChirpByUserIdQuery(user_id);

  const isSelf = userInfo ? userInfo.id === Number(user_id) : false;
  const isAuthenticated = useSelector(selectCurrentToken);

  const handleCreateConversation = async () => {
    const response = await createConversation({
      user_one_id: 0,
      user_two_id: user?.id,
    });
    console.log(response);
    navigate(`/messages/${response.data.id}`);
  };

  const handleEditModal = () => {
    setToggleEditModal(!toggleEditModal);
  };

  if (!user) return <>No user found</>;

  return (
    <>
      {loadingUser ? (
        <>Loading user...</>
      ) : (
        <div className="flex flex-col">
          {toggleEditModal && (
            <EditProfileModal setToggleEditModal={setToggleEditModal} />
          )}
          <div className="h-44 lg:h-72 bg-chirpr-400 rounded-tl-2xl p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-chirpr-700 items-center rounded-full shadow shadow-chirpr-900"
            >
              <MdArrowBackIosNew />
            </button>
          </div>
          <div className="relative p-8  ">
            <div className="absolute -top-12 left-6 rounded-full bg-chirpr-800 border-2 border-chirpr-800 border-b-2 border-b-black/0  overflow-clip w-28 h-28">
              <ProfilePicture
                profile_picture_url={user.profile_picture_url}
                editable={false}
                width={"w-full"}
                height={"h-full"}
              />
            </div>
            <div className="mt-12">
              <div className="flex flex-row justify-start items-center gap-4">
                <h1 className="text-4xl">{user?.username}</h1>
                {!isSelf && isAuthenticated && (
                  <button
                    onClick={handleCreateConversation}
                    className="bg-chirpr-600 text-white px-4 py-2 rounded-lg"
                  >
                    Message
                  </button>
                )}
                {!isSelf && isAuthenticated && (
                  <FollowButton
                    userToFollow={Number(user_id)}
                    style={"bg-chirpr-600 text-white px-4 py-2 rounded-lg "}
                  />
                )}
                {isSelf && isAuthenticated && (
                  <MdEditSquare
                    size={22}
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={handleEditModal}
                  />
                )}
              </div>
              <p className="my-2">@{user?.username}</p>
              <div className="flex flex-row justify-between w-60">
                <p>{formatViews(user?.numberOfFollowers || 0)} followers</p>
                <p>{formatViews(user?.numberOfFollowing || 0)} following</p>
                {/* Todo implement number of chirps */}
                <p>{formatViews(chirps?.length || 0)} chirps</p>
              </div>
              <p className="mt-4">{user?.bio}</p>
            </div>
          </div>
          <div className="p-8">
            {loadingChirps ? (
              <>loading chirps...</>
            ) : (
              chirps?.map((chirp) => (
                <Chirp chirpData={{ ...chirp, user }} key={chirp.id} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
