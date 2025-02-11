import { useState } from 'react'
import { FaBell } from 'react-icons/fa';

function NotificationPage() {
  const events = []
  return (
    <div className=''>
      <div className="px-4 border-b border-white/20">
        <h1 className="text-2xl mt-4">Notifications</h1>
        <NotificationFilters />
      </div>
      <div className='flex flex-col justify-center items-center h-full'>
      {events.length == 0 && <NoEventsIcon />}
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
    <div className='flex flex-col justify-center items-center'>
      <div className='p-4 bg-chirpr-700 rounded-full w-24 h-24 flex justify-center items-center'>
        <FaBell size={64} className='text-chirpr-800'/>
      </div>
      <p className='mt-4 text-xl text-white/50'>No notifications yet!</p>
    </div>
  )
}

export default NotificationPage