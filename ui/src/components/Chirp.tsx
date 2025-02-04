import { IChirp } from "../config/applicatonConfig";
import { FaComment, FaEye, FaHeart } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TextPlaceholder } from "../utils/Skeletons";
import { formatViews } from "../utils";
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import ChirpOptionsMenu from "./ChirpOptionsMenu";
import { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../slices/apiSlice";

function Chirp(props: { chirpData: IChirp }) {
  const authenticated = useSelector(selectCurrentToken)

  const { chirpData } = props;
  const {
    id: chirpId,
    content,
    createdAt,
    numberOfLikes,
    numberOfRechirps,
    user,
    media_url,
    user_id,
    hasLikedChirp,
  } = chirpData;

  const {user: userInfo} = useSelector(selectCurrentUser)
  const isOwnPost = userInfo ? userInfo.id === user_id : false;

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [optionsMenu, setOptionsMenu] = useState(false);

  return (
    <article
      className="flex justify-start flex-col rounded-xl dark:bg-chirpr-800 shadow p-6 mb-4 overflow-clip cursor-pointer"
      onClick={() => {
        if (pathname !== `/chirp/${chirpId}`) navigate(`/chirp/${chirpId}`);
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row mb-2">
          <ProfilePicture profile_picture_url={user.profile_picture_url} editable={false} width={"w-14"} height={"h-14"} />
          <div className="flex flex-col ml-6 relative">
            <Link
              to={`/chirpr/${user_id}`}
              className="hover:text-chipr-500 dark:hover:text-chirpr-900 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              @{user.username}
            </Link>
            {(authenticated && isOwnPost) && <p className="absolute text-xs -right-8 top-0 bg-blue-600 p-1 px-2 rounded-2xl">you</p>}
            <p className="text-sm ">{moment(createdAt).fromNow()}</p>
          </div>
        </div>
        {authenticated && isOwnPost && (
          <button
            className="w-12 h-12 flex justify-center items-center relative"
            onClick={(e) => {
              e.stopPropagation();
              setOptionsMenu(!optionsMenu);
            }}
          >
            <BsThreeDotsVertical size={24} className="rotate-90" />
            {optionsMenu && <ChirpOptionsMenu id={chirpId} />}
          </button>
        )}
      </div>
      <p className="mb-4 ml-2 text-lg">{content ?? <TextPlaceholder />}</p>
      <div className="flex gap-4 flex-wrap overflow-clip">
      {media_url && <img src={`${media_url}`} alt="" width={242} height={356} className=" rounded-2xl"/>}
      </div>
      <div className="flex flex-row mt-6">
        <p className="flex flex-row justify-center items-center align-middle">
          <FaEye size={20} className="mr-2" /> {formatViews(numberOfRechirps)}
        </p>
        {authenticated ? (
          <LikeButton
            numberOfLikes={numberOfLikes}
            chirpToLike={chirpId}
            hasLikedChirp={hasLikedChirp}
          />
        ) : (
          <p className="mx-6 flex flex-row justify-center items-center align-middle min-w-24">
            {" "}
            <FaHeart size={20} className="mr-2" />
            {formatViews(numberOfLikes)}
          </p>
        )}
        <p className="flex flex-row justify-center items-center align-middle">
          <FaComment size={20} className="mr-2" /> {formatViews(numberOfRechirps)}
        </p>
      </div>
    </article>
  );
}

export default Chirp;
