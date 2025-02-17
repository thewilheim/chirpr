import { useState } from 'react'
import { FaBell } from 'react-icons/fa';
import { useGetNotificationsQuery, useViewNotificationMutation } from '../../slices/notificationSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { INotification } from '../../config/applicatonConfig';
import Loader from '../../components/Loader';
import ProfilePicture from '../../components/ProfilePicture';

function NotificationPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const {data, isLoading} = useGetNotificationsQuery(userInfo.id);
  const [markAsViewed] = useViewNotificationMutation();

  const action_response = [
    "liked your chirp!",
    "followed you!",
    "commented on your chirp!"
  ]

  if(isLoading) return <Loader />

  console.log(data)
  return (
    <div className=''>
      <div className="px-4 border-b border-white/20">
        <h1 className="text-2xl mt-4">Notifications</h1>
        <NotificationFilters />
      </div>
      {data.length == 0 && <NoEventsIcon />}
      <div className='w-full bg-chirpr-500/20'>
      {data.map((noti: INotification) => {
        return(
          <div key={noti.id} className='flex flex-row justify-between items-center p-4'>
            <div className='flex flex-row items-center'>
            <ProfilePicture profile_picture_url={noti.sending_User.profile_picture_url} editable={false} width={'w-12'} height={'h-12 mb-0 mr-4'} />
            <p>{`${noti.sending_User.username} has ${action_response[noti.action_Type]}`}</p>
            </div>
            <button onClick={async () => {
              await markAsViewed(noti.id);
            }}>View</button>
        </div>
        )
      })}
      </div>
    </div>
  )
}

const NotificationFilters = () => {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <div className="flex flex-row w-full justify-around pt-6 font-bold text-white/50">
      <p
        onClick={() => setActiveTab("all")}
        className={`${activeTab === "all" ? "activeTab" : "cursor-pointer"}`}
      >
        All
      </p>
      <p
        onClick={() => setActiveTab("mentions")}
        className={`${activeTab === "mentions" ? "activeTab" : "cursor-pointer"}`}
      >
        Mentions
      </p>
    </div>
  );
};

const NoEventsIcon = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-4'>
      <div className='p-4 bg-chirpr-700 rounded-full w-24 h-24 flex justify-center items-center'>
        <FaBell size={64} className='text-chirpr-800'/>
      </div>
      <p className='mt-4 text-xl text-white/50'>No notifications yet!</p>
    </div>
  )
}

export default NotificationPage