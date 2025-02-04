import { useState } from "react";
import { useUpdateMutation } from "../slices/userApiSlice";
import { handleFileUpload } from "../utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slices/apiSlice";

function EditProfileModal({
  setToggleEditModal,
}: {
  setToggleEditModal: (val: boolean) => void;
}) {
  const user  = useSelector(selectCurrentUser)
  const [username, setUsername] = useState(user.username);
  const [profileUrl, setProfileUrl] = useState(user.profile_picture_url);
  const [bio, setBio] = useState(user.bio);
  const [update] = useUpdateMutation();

  const handleImageChange = async (e) => {
    try {
        if(e.target.files){
            const image_url = await handleFileUpload(e.target.files[0])
            setProfileUrl(image_url?.data.filePath);
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
        await update({
            id: user.id,
            username,
            profile_picture_url: profileUrl,
            bio
        })
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div
      className="absolute top-0 left-0 w-screen h-screen bg-chirpr-900/60 z-40"
      onClick={(e) => {
        e.stopPropagation();
        setToggleEditModal(false);
      }}
    >
      <div
        className="bg-chirpr-700 rounded-xl absolute inset-0 w-1/2 h-[60%] m-auto z-50"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ModalHeader
          username={username || user.username}
          profile_picture_url={`${profileUrl}` || user.profile_picture_url}
        />
        <form className="w-full h-full p-8" onSubmit={(e) => {
            e.preventDefault()
            handleSubmit();
            }}>
          <div className="flex flex-row justify-between items-center">
            <label htmlFor="username" className="mr-6 w-1/4">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username" 
              className="p-2 rounded w-full mx-5 text-black"
              placeholder={`@${username}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-row justify-between items-center my-4">
            <label htmlFor="profilePicture" className="mr-4 w-1/4">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              id="profilePicture"
              className="p-2 rounded mx-5 w-full"
              onChange={(e) => {
                if (e.target.files) {
                  handleImageChange(e);
                }
              }}
            />
          </div>
          <div className="flex flex-col h-44">
            <label htmlFor="bio" className="mr-4 mb-2">
              Bio
            </label>
            <textarea
              className="rounded h-full p-3 text-black"
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="p-3 shadow bg-chirpr-600 rounded-lg mr-4 hover:bg-chirpr-800 " onClick={() => setToggleEditModal(false)}>
              Cancel
            </button>
            <button className="p-3 shadow bg-chirpr-800 rounded-lg hover:bg-chirpr-900">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

const ModalHeader = ({
  username,
  profile_picture_url,
}: {
  username: string;
  profile_picture_url: string;
}) => {
  return (
    <div>
      <div className="h-44 w-full bg-chirpr-400 rounded-tl-2xl rounded-tr-2xl p-4"></div>
      <div className="relative p-8">
        <div className="absolute -top-12 left-6 rounded-full bg-chirpr-800 border-2 border-chirpr-800 border-b-2 border-b-black/0 overflow-clip w-28 h-28">
          <img
            src={profile_picture_url}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-12">
          <div className="flex flex-row justify-start items-center gap-4">
            <h1 className="text-3xl">@{username}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
