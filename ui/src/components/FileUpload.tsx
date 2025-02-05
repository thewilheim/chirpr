import { ChangeEvent, useEffect } from "react";

interface IFileUpload {
    showImageUpload: boolean;
    setShowImageUpload: (boolean: boolean) => void;
    file: File | null;
    setFile: (file: File | null) => void;
    title?: string,
    requirements?: string
    handleFileUpload?: () => void;
  }


function FileUpload({
  showImageUpload,
  setShowImageUpload,
  file,
  setFile,
  title,
  requirements,
  handleFileUpload
}: IFileUpload) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    scrollToTop();
    const handleWindowWheel = (event: WheelEvent) => {
      if (showImageUpload) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWindowWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWindowWheel);
    };
  }, [setFile, showImageUpload]);

  return (
    <div
      className="overflow-hidden absolute w-screen h-screen left-0 top-0 right-0 bg-chirpr-900/50 flex flex-col justify-center items-center z-20"
      onClick={() => setShowImageUpload(!showImageUpload)}
    >
      <div
        className="bg-chirpr-900 p-6 rounded-2xl w-1/3"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl mb-2">{title ?? 'Upload Image'}</h1>
        <p className="opacity-50 mb-6 text-sm">
            {requirements ?? 'Make sure the file format meets the requirements. It must be SVG, PNG, JPG or GIF (MAX. 800x400px)'}
        </p>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-chirpr-700 border-dashed rounded-lg cursor-pointer "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {file && (
          <div className=" border-2 border-chirpr-700 border-dashed mt-6 rounded-2xl p-6 ">
            {file?.name}
            <button className="ml-6" onClick={() => setFile(null)}>X</button>
          </div>
        )}
        <div className="flex flex-row justify-end gap-4 mt-4">
          <button
            className="py-4 px-8 bg-red-500 rounded-2xl text-red-800 hover:bg-red-900 hover:text-red-400"
            onClick={() => setShowImageUpload(!showImageUpload)}
          >
            Close
          </button>
          <button
            className="py-4 px-8 bg-blue-500 rounded-2xl text-blue-800 hover:bg-blue-900 hover:text-blue-400"
            onClick={() => {
                if(handleFileUpload !== undefined){
                    handleFileUpload();
                }
                setShowImageUpload(!showImageUpload)
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
