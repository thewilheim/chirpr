import { createRef, useEffect, useState } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaLocationDot, FaRegImage } from "react-icons/fa6";
import { GoFileDirectoryFill } from "react-icons/go";
import { useCreateChirpMutation } from "../slices/chirpSlice";
import { IChirpSend, IUser } from "../config/applicatonConfig";
import { useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import { handleFileUpload } from "../utils";

function CreateChirp(props: { parent_id: number; userReplyingTo?: string }) {
  const imageRef = createRef<HTMLImageElement>();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { parent_id, userReplyingTo } = props;
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const [content, setContent] = useState("");
  const [create] = useCreateChirpMutation();
  console.log(uploadProgress)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let response;
    try {
      if (file) {
        response = await handleFileUpload(file, setUploadProgress);
      }
      await create({
        content: parent_id ? `@${userReplyingTo} ${content}` : content,
        media_url: response?.data.filePath || "",
        parent_id: parent_id || 0,
        user_id: userInfo.id,
      } as IChirpSend);
      setContent("");
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (file && imageRef.current) {
      const url = URL.createObjectURL(file);
      imageRef.current.style.backgroundImage = `url(${url})`;
    }
  }, [file, imageRef]);

  return (
    <>
      {showImageUpload && (
        <FileUpload
          setShowImageUpload={setShowImageUpload}
          showImageUpload={showImageUpload}
          file={file}
          setFile={setFile}
        />
      )}
      <article className="relative rounded-xl p-6 mb-4 text-sm">
      <div className="top-[30px] left-[30px] absolute w-10 h-10 rounded-full overflow-clip">
            <img src={`http://localhost:5042${userInfo.profile_picture_url}`} alt="" className="object-cover w-full h-full"/>
          </div>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full rounded-full p-4 pl-14 dark:bg-chirpr-600 placeholder:text-chirpr-200"
            placeholder={
              parent_id
                ? `replying to @${userReplyingTo}`
                : "Go on have a chirp"
            }
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <div className="flex flex-row justify-between items-center mt-4">
            <div className="flex flex-row sm:justify-between w-1/4">
              <p className="flex flex-row items-center cursor-pointer mr-4">
                <GoFileDirectoryFill className="mr-1" /> File
              </p>
              <p
                className="flex flex-row items-center cursor-pointer mr-4"
                onClick={() => setShowImageUpload(!showImageUpload)}
              >
                <FaRegImage className="mr-1" /> Image
              </p>
              <p className="flex flex-row items-center cursor-pointer mr-4">
                <FaLocationDot className="mr-1" /> Location
              </p>
              <p className="flex flex-row items-center cursor-pointer">
                <FaGlobeAmericas className="mr-1" /> Public
              </p>
            </div>
            <button className="p-2  px-8 bg-black rounded-full dark:bg-chirpr-700 dark:hover:bg-chirpr-600">
              Send
            </button>
          </div>
        </form>
      </article>
    </>
  );
}

export default CreateChirp;
