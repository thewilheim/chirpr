import { useSelector } from "react-redux";
import { IUser } from "../config/applicatonConfig";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../slices/userApiSlice";
import { useState } from "react";
import { useSendNotificationMutation } from "../slices/notificationSlice";

function FollowButton(props: {
  isFollowingUser?: boolean;
  userToFollow: number;
  chirp_id?: number;
  style?: string;
}) {
  const { isFollowingUser, userToFollow, style } = props;
  const [followingUser, setFollowingUser] = useState(isFollowingUser || false);
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: IUser } }) => state.auth
  );
  const { id: current_user_id } = userInfo;
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [sendNotification] = useSendNotificationMutation();

  const handleFollowUser = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    try {
      await followUser({
        followerId: current_user_id,
        followedId: userToFollow,
      });
      await sendNotification({
        action_Type: 1,
        sending_User_Id: current_user_id,
        recieving_User_Id: userToFollow,
        has_Viewed: false,
      });
      setFollowingUser(!followingUser);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollowUser = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    try {
      await unfollowUser({
        followerId: current_user_id,
        followedId: userToFollow,
      });
      setFollowingUser(!followingUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={isFollowingUser ? handleUnfollowUser : handleFollowUser}
      className={`${
        style ||
        "ml-6 z-10 text-sm self-start mt-0.5 px-4 py-2 rounded-full bg-chirpr-900/50 hover:bg-chirpr-900 "
      }${
        followingUser
          ? "text-red-400 hover:text-red-600"
          : "text-blue-400 hover:text-blue-600"
      }`}
    >
      {followingUser ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
