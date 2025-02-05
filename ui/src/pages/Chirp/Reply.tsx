import { useGetChirpByIdQuery, useGetRepliesQuery } from '../../slices/chirpSlice'
import { useNavigate, useParams } from 'react-router-dom';
import Chirp from '../../components/Chirp';
import { IChirp } from '../../config/applicatonConfig';
import CreateChirp from '../../components/CreateChirp';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../slices/apiSlice';

function ReplyingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectCurrentToken)

  const { data:chirpData, isLoading:loadingChirp } = useGetChirpByIdQuery(id || '');
  const { data: replyData, isLoading:loadingReplies} = useGetRepliesQuery(id || '');

  if(!replyData) return
  if(!chirpData) return

  return (
    loadingChirp ? <>loading</>:
    <div className='md:p-6'>
      <div className="flex flex-row justify-between mb-5">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate(-1)}>Go back</h1>
        <div className="flex flex-row">
          <p className="">viewing @{chirpData.user.username}'s chirp</p>
        </div>
      </div>
      <Chirp chirpData={chirpData} />
      {isAuthenticated && <CreateChirp parent_id={chirpData.id} userReplyingTo={chirpData?.user.username} />}
      <section>
        {loadingReplies ? <>loading</> : (
          replyData.map((item: IChirp) => {
            return <Chirp chirpData={item} />
          })
        )}
      </section>
    </div>
  )
}

export default ReplyingPage