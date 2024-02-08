import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {Button, Label, TextInput} from "flowbite-react"
export default function Signin() {
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
          <form action="" className="flex flex-col gap-5">
            <div>
              <Label value={"Your email"} className="inline-block mb-1"/>
              <TextInput 
              type="email"
              placeholder="name@gmail.com"
              id="email"
              />
            </div>
            <div>
              <Label value={"Your password"} className="inline-block mb-1"/>
              <TextInput 
              type="password"
              placeholder="password..."
              id="password"
              />
            </div>
            <Button gradientDuoTone={"purpleToPink"}>Sign In</Button>
          </form>
            <div className="mt-2">
              <span>Have an account?</span>
              <Link to={'/signup'} className="text-blue-500 ml-2">Signup</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
