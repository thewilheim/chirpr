import { IChirp } from "../config/applicatonConfig";
import { FaComment, FaEye, FaHeart } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatViews } from "../utils";
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import ChirpOptionsMenu from "./ChirpOptionsMenu";
import { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../slices/apiSlice";
import { RootState } from "../store";
import { useViewChirpMutation } from "../slices/chirpSlice";

function Chirp(props: { chirpData: IChirp }) {
  const authenticated = useSelector(selectCurrentToken)
  const { userInfo } = useSelector((state:RootState) => state.auth)

  const { chirpData } = props;
  const {
    id: chirpId,
    content,
    createdAt,
    numberOfLikes,
    user,
    media_url,
    user_id,
    hasLikedChirp,
    numberOfReplies,
    numberOfViews
  } = chirpData;

  const isOwnPost = userInfo ? userInfo.id === user_id : false;

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [optionsMenu, setOptionsMenu] = useState(false);
  const [viewChirp] = useViewChirpMutation();

  return (
    <article
      className="flex justify-start flex-col dark:bg-chirpr-800 p-4 md:p-6 overflow-clip cursor-pointer border-b-2 border-b-chirpr-500/30 md:border-t-2 md:border-b-0 md:border-white/10"
      onClick={async () => {
        if (pathname !== `/chirp/${chirpId}`){
          await viewChirp({chirpId, userId: userInfo.id})
          navigate(`/chirp/${chirpId}`)
        };
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row mb-2">
          <ProfilePicture profile_picture_url={user.profile_picture_url} editable={false} width={"w-14"} height={"h-14"} />
          <div className="flex flex-col ml-6 relative">
            <Link
              to={`/profile/${user.id}`}
              className="hover:text-chipr-500 dark:hover:text-chirpr-900 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              @{user.username}
            </Link>
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
      <p className="mb-4 ml-2 text-lg">{content}</p>
      <div className="flex gap-4 flex-wrap overflow-clip">
      {media_url && <img src={`${media_url}`} alt="" width={242} height={356} className=" rounded-2xl"/>}
      </div>
      <div className="flex flex-row mt-6">
        <p className="flex flex-row justify-center items-center align-middle">
          <FaEye size={20} className="mr-2" /> {formatViews(numberOfViews)}
        </p>
        {authenticated ? (
          <LikeButton
            numberOfLikes={numberOfLikes}
            chirpToLike={chirpId}
            hasLikedChirp={hasLikedChirp}
            chirpOwnerId={user_id}
          />
        ) : (
          <p className="mx-6 flex flex-row justify-center items-center align-middle min-w-24">
            {" "}
            <FaHeart size={20} className="mr-2" />
            {formatViews(numberOfLikes)}
          </p>
        )}
        <p className="flex flex-row justify-center items-center align-middle">
          <FaComment size={20} className="mr-2" /> {formatViews(numberOfReplies)}
        </p>
      </div>
    </article>
  );
}

export default Chirp;
