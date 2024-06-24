import { Navbar } from "../components/Navbar";
import {  useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { db, storage } from "../firebase-config";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDownloadURL, uploadBytes, ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { useAuth } from "../contexts/AuthContext";

export const AddMovie = () => {
  const titleRef = useRef();
  const releaseRef = useRef();
  const ratingRef = useRef();
  const genreRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  const {currentUser} = useAuth();

  async function onAddClick(e) {
    e.preventDefault();
    setError('');
    try {
      if (isImageUploading){
        return setError("Please wait for image to upload")
      }
      await addDoc(collection(db,"movies"),{title: titleRef.current.value, release: releaseRef.current.value, rating: ratingRef.current.value, genre: genreRef.current.value, image: url });
      navigate('/');
    } catch (err) {
      setError('Failed to add')
    }
  }

  const onImageChange = (e) => {
    if (e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }

  const onImageUpload = async (e) => {

    e.preventDefault();
    if(!image){
      return setError("Choose an image first")
    }

    setIsImageUploading(true)
    const imageRef = ref(storage, `images/${image.name}`);
    try{
      await uploadBytes(imageRef, image);
      const URL = await getDownloadURL(imageRef);
      setUrl(URL);
      setIsImageUploading(false);
    }catch(err){
      setIsImageUploading(false);
      setError("Failed to upload image");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <h3 className="text-2xl pt-6 text-gray-700 font-bold">
          Add Movie
        </h3>
        <br />
        <form>
          <div className="w-80">
            <label
              for="add-title"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Title
            </label>
            <input
            autoComplete="off"
              type="text"
              id="add-title"
              ref={titleRef}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div className="w-80">
            <label
              for="add-release"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Release Date
            </label>
            <input
              type="text"
              id="add-release"
              autoComplete="off"
              ref={releaseRef}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div>
            <label
              for="add-rating"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Rating
            </label>
            <input
              type="number"
              id="add-rating"
              min="0" max="5" step="0.1"
              ref={ratingRef}
              autoComplete="off"
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div>
            <label
              for="add-genre"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Genre
            </label>
            <input
              type="text"
              id="add-genre"
              autoComplete="off"
              ref={genreRef}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div className="mb-2">
            <label
              for="add-image"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Image
            </label>
            <input type="file" id="add-image" className="text-xs" onChange={(e) => onImageChange(e)}/>
            <button className="text-sm ml-4" onClick={(e) => onImageUpload(e)}>Upload</button>
          </div>
          { error &&
          <div className="flex justify-center items-center">
            <button disabled className=" block w-full bg-red-500 py-2 px-10 rounded-md mb-4 text-black font-bold">{error}</button>
          </div>
          } 
          <div className="flex justify-center items-center pb-2">
            <button
              type="submit"
              onClick={(e) => {
                onAddClick(e);
              }}
              className=" block w-full bg-amber-400 py-2 px-10 rounded-md cursor-pointer text-black font-bold hover:bg-amber-300"
            >
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
