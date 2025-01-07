import { FaCircleUser } from "react-icons/fa6";
import { handleFileUpload } from "../utils";
import { useUpdateMutation } from "../slices/userApiSlice";
import { useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useAuth } from "../utils/Auth/useAuth";
import { setCredentials } from "../slices/authSlice";
import FileUpload from "./FileUpload";

interface IProfilePicture {
  profile_picture_url: string;
  editable: boolean;
  width: string;
  height: string;
}

function ProfilePicture({
  profile_picture_url,
  editable,
  width,
  height
}: IProfilePicture) {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateUser] = useUpdateMutation();
  const dispatch = useDispatch();
  console.log(uploadProgress)
  const handleUpdateProfilePic = async () => {
    try {
      const response = await handleFileUpload(file, setUploadProgress);
      const result = await updateUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
        profile_picture_url: `${import.meta.env.VITE_BLOB_URL}${response?.data.filePath}`,
      }).unwrap();
      if (result) {
        dispatch(setCredentials(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMouseOver = () => {
    if (editable) {
      setShowEdit(true);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setShowEdit(false);
    }
  };

  return (
    <>
      {showImageEditor && (
        <FileUpload
          file={file}
          setFile={setFile}
          setShowImageUpload={setShowImageEditor}
          showImageUpload={showImageEditor}
          title="Update profile picture"
          handleFileUpload={handleUpdateProfilePic}
        />
      )}
      <div
        className={`${width} ${height} rounded-full overflow-clip mb-4 relative hover: cursor-pointer`}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >

      {
      !profile_picture_url ?     <FaCircleUser className={`cursor-pointer ${width} ${height}`}/> : 
        <img
          src={`${profile_picture_url}`}
          alt=""
          className="object-cover w-full h-full"
        />}
        {showEdit && (
          <div
            className="absolute w-full h-full top-0 left-0 bg-chirpr-900/50 flex justify-center items-center"
            onClick={() => setShowImageEditor(!showImageEditor)}
          >
            <MdEditSquare size={24} />
          </div>
        )}
      </div>
    </>
  );
}

export default ProfilePicture;
