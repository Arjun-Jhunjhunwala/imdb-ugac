import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoc,  doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDownloadURL, uploadBytes, ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { db } from "../firebase-config";
import { Navbar } from "../components/Navbar";
import { storage } from "../firebase-config";

export const EditMovie = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [release, setRelease] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);


  useEffect(() => {
    async function getDetails() {
      try {
        const docSnap = await getDoc(doc(db, "movies", id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setRelease(data.release);
          setGenre(data.genre);
          setRating(data.rating);
          setUrl(data.image);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        setError("Movie not found");
      }
    }
    getDetails();
  }, [id]);

  async function onEditClick(e) {
    setError('');
    e.preventDefault();
    try {
      if (isImageUploading){
        return setError("Please wait for image to upload")
      }
      if (image){
        await updateDoc(doc(db, "movies", id), {title,release,genre,rating,image: url});
      }
      else{
        await updateDoc(doc(db, "movies", id), {title,release,genre,rating});
      }
      navigate('/');
    } catch (err) {
      setError("Failed to update");
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
        <h3 className="text-2xl pt-6 text-gray-700 font-bold">Edit Movie</h3>
        <br />
        <form onSubmit={onEditClick}>
          <div className="w-80">
            <label
              for="add-title"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Title
            </label>
            <input
              type="text"
              id="add-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            />
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
              value={release}
              onChange={(e) => setRelease(e.target.value)}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            />
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
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            />
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
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            />
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
          {error && (
            <div className="flex justify-center items-center">
              <button
                disabled
                className=" block w-full bg-red-500 py-2 px-10 rounded-md mb-4 text-black font-bold"
              >
                {error}
              </button>
            </div>
          )}
          <div className="flex justify-center items-center pb-2">
            <button
              type="submit"
              className=" block w-full bg-amber-400 py-2 px-10 rounded-md cursor-pointer text-black font-bold hover:bg-amber-300"
            >
              Confirm Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
