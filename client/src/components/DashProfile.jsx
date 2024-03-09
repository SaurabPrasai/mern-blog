import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export default function DashProfile() {
  const { currentUser,error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProcess, setImageFileUploadingProcess] =
    useState(null);
  const [showModel, setShowModel] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
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
        setImageFileUploadingProcess(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadError(null);
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setUserUpdateSuccess(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUserUpdateSuccess("No Changes Made");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUserUpdateSuccess(data.message);
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateSuccess("User data update sucessfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  // delete user
  const handleDeleteUser = async() => {
    setShowModel(false)
    try {
      dispatch(deleteUserStart());
      const response=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE"
      })
      const data=await response.json();
      if(!response.ok){
          dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
     dispatch(deleteUserFailure(error.message)) 
    }

  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          {imageFileUploadingProcess && (
            <CircularProgressbar
              value={imageFileUploadingProcess || 0}
              text={`${imageFileUploadingProcess}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(2,152,199,${imageFileUploadingProcess / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${
              imageFileUploadingProcess &&
              imageFileUploadingProcess < 100 &&
              "opacity-60"
            }
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {userUpdateSuccess && (
        <Alert color={"success"} className="mt-5">
          {userUpdateSuccess}
        </Alert>
      )}
      {
        error && <Alert color={"failure"} className="mt-5">
            {error}
        </Alert>
      }
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg mb-5 text-gray-500 dark:text-gray-200">
              Are you sure you want to delete your account?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={()=>setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
