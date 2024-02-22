import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProcess, setImageFileUploadingProcess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const fileRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    // giving unique name to each file
    const fileName = new Date().getTime() + imageFile.name;
    // refrencing to the storage location and storing file name
    const storageRef = ref(storage, fileName);
    // actual uploadation of image to the storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProcess(Math.floor(progress));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadingProcess(null)
        setImageFile(null)
        setImageFileUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadError(null)
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          id=""
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => fileRef.current.click()}
        >
          {imageFileUploadingProcess && <CircularProgressbar value={imageFileUploadingProcess||0}
          text={`${imageFileUploadingProcess}%`}
          strokeWidth={5}
          styles={{
            root:{
              width:'100%',
              height:"100%",
              position:'absolute',
              top:0,
              left:0
            },
            path:{
              stroke:`rgba(2,152,199,${imageFileUploadingProcess/100})`
            }
          }}
          />}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${imageFileUploadingProcess && imageFileUploadingProcess<100 && 'opacity-60'}
            `}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
