import { useState } from "react";
import {
  useLikeChirpMutation,
  useUnlikeChirpMutation,
} from "../slices/chirpSlice";
import { useSelector } from "react-redux";
import { IUser } from "../config/applicatonConfig";
import { FaHeart } from "react-icons/fa6";
import { formatViews } from "../utils";

function LikeButton(props: {
  hasLikedChirp: boolean;
  numberOfLikes: number;
  chirpToLike: number;
}) {
  const { hasLikedChirp, numberOfLikes, chirpToLike } = props;

  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );

  const { id: current_user_id } = userInfo;

  const [likeChirp] = useLikeChirpMutation();
  const [unlikeChirp] = useUnlikeChirpMutation();
  const [likes, setLikes] = useState(numberOfLikes);

  const handleLikeChirp = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    try {
      await likeChirp({ user_id: current_user_id, chirp_id: chirpToLike });
      setLikes(likes + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlikeChirp = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    try {
      await unlikeChirp({ user_id: current_user_id, chirp_id: chirpToLike });
      setLikes(likes - 1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <p
      className={`cursor-pointer hover:text-pink-300 ${
        hasLikedChirp ? "text-pink-500 hover:text-pink-700" : ""
      } mx-6 flex flex-row justify-center items-center align-middle min-w-24`}
      onClick={hasLikedChirp ? handleUnlikeChirp : handleLikeChirp}
    >
          <FaHeart size={20} className="mr-2" /> {" "}
          {formatViews(likes)}
    </p>
  );
}

export default LikeButton;
