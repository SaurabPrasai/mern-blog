import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import {useDispatch,useSelector} from 'react-redux'
import OAuth from "../components/OAuth";


export default function Signup() {
  const [formData, setFormData] = useState({});
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch()

  // mange form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // checking form validation
    if (!formData.username || !formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields!"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
       return dispatch(signInFailure(data.message))
      }
      dispatch(signInSuccess(data))
      navigate("/signin")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to={"/"}
            className=" whitespace-nowrap text-4xl font-bold dark:text-white  "
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Saurab's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a MERN project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your username" className="inline-block mb-1" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your email" className="inline-block mb-1" />
              <TextInput
                type="email"
                placeholder="name@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your password" className="inline-block mb-1" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone={"purpleToPink"} type="submit" disabled={loading}>
              {
                loading?<><Spinner size={'sm'}/> <span className="ml-1">Loading...</span> </>:"Sign Up"
              }
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/signin"} className="text-blue-500">
             Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert color={"failure"} className="mt-5">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
