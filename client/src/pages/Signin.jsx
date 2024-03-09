import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  //submitting the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || email === "" || password === "") {
      return dispatch(signInFailure("All fields are required!"))
    }
    const formData = {
      email,
      password,
    };
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return dispatch(signInFailure(data.message))
      }
      dispatch(signInSuccess(data))
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex max-w-3xl p-3 mx-auto flex-col gap-5 md:flex-row md:items-center">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Label value={"Your email"} className="inline-block mb-1" />
              <TextInput
                type="email"
                placeholder="name@gmail.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label value={"Your password"} className="inline-block mb-1" />
              <TextInput
                type="password"
                value={password}
                placeholder="password..."
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="mt-2">
            <span>Don't have an account?</span>
            <Link to={"/signup"} className="text-blue-500 ml-2">
              Signup
            </Link>
          </div>
          {errorMessage && (
            <Alert color={"failure"} className="mt-4">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
