import { useSelector } from "react-redux";
import { IUser } from "../config/applicatonConfig";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../slices/userApiSlice";
import { useState } from "react";

function FollowButton(props: {
  isFollowingUser?: boolean;
  userToFollow: number;
  chirp_id?: number
  style?: string
}) {
  const { isFollowingUser, userToFollow, style } = props;
  const [followingUser, setFollowingUser] = useState(isFollowingUser || false)
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const { id: current_user_id } = userInfo;
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleFollowUser = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    try {
      await followUser({
        followerId: current_user_id,
        followedId: userToFollow
      });
      setFollowingUser(!followingUser)
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollowUser = async (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    try {
      await unfollowUser({
        followerId: current_user_id,
        followedId: userToFollow,
      });
      setFollowingUser(!followingUser)
    } catch (error) {
      console.log(error);
    }
  };


  return (
      <button
        onClick={isFollowingUser ? handleUnfollowUser : handleFollowUser}
        className={`${style || 'ml-6 z-10 text-sm self-start mt-0.5 px-4 py-2 rounded-full bg-chirpr-900/50 hover:bg-chirpr-900 '}${
          followingUser
            ? "text-red-400 hover:text-red-600"
            : "text-blue-400 hover:text-blue-600"
        }`}
      >
        {followingUser ? "unfollow" : "follow"}
      </button>
  );
}

export default FollowButton;
