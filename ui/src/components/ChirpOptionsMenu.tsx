import { useDeleteChirpMutation } from "../slices/chirpSlice"

function ChirpOptionsMenu({id}:{id: number}) {

  const [deleteChirp] = useDeleteChirpMutation();

  const handleDelete = async () => {
    try {
      await deleteChirp(id);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='absolute top-12 bg-chirpr-800 rounded-xl z-30'>
        <p className='p-4 hover:bg-red-500 hover:rounded-xl 'onClick={handleDelete}>Delete</p>
        <div className='absolute h-5 w-5 -top-2 left-0 right-0 m-auto bg-chirpr-800 rotate-45 -z-10' ></div>
    </div>
  )
}

export default ChirpOptionsMenu