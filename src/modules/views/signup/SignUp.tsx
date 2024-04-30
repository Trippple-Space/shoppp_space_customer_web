"use client";

import Icon from "@/modules/lib/components/icon/Icon";
import Image from "@/modules/lib/components/image/Image";
import Input from "@/modules/lib/components/input/Input";
import InputAlert from "@/modules/lib/components/input/input-alert/InputAlert";
import { useSignUpView } from "@/modules/lib/utility/hooks/use-signup";
import { paths } from "@/modules/lib/utility/paths";
import { cx } from "@/modules/lib/utility/utility";
import Link from "next/link";
import React from "react";

const SignUp = () => {
  const { formHandler } = useSignUpView();

  return (
    <>
      <div className="text-right w-full l:w-80p mt-53 mx-25 hidden l:block">
        <span>Do you want to sell? </span>
        <Link href={paths.vendor_signup} className="text-green-700 pointer">
          Join now
        </Link>
      </div>
      <div className=" mx-25 flex-col flex h-full items-center j-content-center">
        <div className="l:hidden w-full">
          <Image
            className="w-79 h-21 l:mt-20 mt-20 l:mb-50 mb-30 a-self-left"
            src="asoebi-logo-colored.png"
            alt="logo"
            type="logo"
          />
        </div>

        <div className="signup w-full l:w-80p mx-auto mb-50 h-100p l:h-fit flex flex-col">
          <div className="w-full">
            <div className="font-inter">
              <h3 className="text-center text-24 l:text-32 weight-500 mb-10 text-grey-900">
                Create your account
              </h3>
              <p className="text-center text-14 l:text-16 text-grey-700">
                Please enter your details.
              </p>
            </div>

            <form
              onSubmit={formHandler.handleSubmit}
              className="form block w-100p mt-36 l:mt-50"
            >
              <Input
                label="Full name"
                id="fullname"
                name="fullname"
                placeholder="Firstname Lastname"
                handleChange={formHandler.handleChange}
                handleBlur={formHandler.handleBlur}
                inputClass={cx({
                  "border-red":
                    formHandler.touched.fullname && formHandler.errors.fullname,
                })}
                after={
                  <InputAlert 
                    hasError={!!(formHandler.touched.fullname && formHandler.errors.fullname)} 
                    errorMessage={formHandler.errors.fullname}
                  />
                }
              />

              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                className="l:mt-30 mt-18"
                placeholder="Enter your email"
                handleChange={formHandler.handleChange}
                handleBlur={formHandler.handleBlur}
                inputClass={cx({
                  "border-red":
                    formHandler.touched.email && formHandler.errors.email,
                })}
                after={
                  <div
                    className={cx(
                      "notice text-12 h-0 @one:flex gap-5 j-content-end w-full mt-12 text-danger",
                      {
                        "hidden!": !(
                          formHandler.touched.email && formHandler.errors.email
                        ),
                      }
                    )}
                  >
                    <Icon name="alert-circle" className="w-14 a-self-center" />
                    <span className="a-self-center">
                      {formHandler.errors.email}
                    </span>
                  </div>
                }
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="********"
                className="l:mt-30 mt-18"
                handleChange={formHandler.handleChange}
                handleBlur={formHandler.handleBlur}
                inputClass={cx({
                  "border-red":
                    formHandler.touched.password && formHandler.errors.password,
                })}
                after={
                  <div
                    className={cx(
                      "notice text-12 h-0 flex gap-5 j-content-end w-full mt-12 text-danger",
                      {
                        "hidden!": !(
                          formHandler.touched.password &&
                          formHandler.errors.password
                        ),
                      }
                    )}
                  >
                    <Icon name="alert-circle" className="w-14 a-self-center" />
                    <span className="a-self-center">
                      {formHandler.errors.password}
                    </span>
                  </div>
                }
              />

              <div className={cx("flex space-between w-full mt-18 @lo:text-grey-700 text-14 l:text-14", {
                'text-red': formHandler.touched.acceptTerms && formHandler.errors.acceptTerms
              })}>
                <label className="pointer content-center flex">
                  <Input
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    className="accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 "
                    inputClass="accent-#0B9378 w-14 l:w-20 h-14 l:h-20 mr-5 l:mr-10 "
                    handleChange={formHandler.handleChange}
                    handleBlur={formHandler.handleBlur}
                  />
                  <span className="l:text-16 text-12">{ (formHandler.touched.acceptTerms && formHandler.errors.acceptTerms) || 'I agree to all Terms, Privacy policy and Fees'}</span>
                </label>
              </div>

              <button className="btn btn-primary l:btn-lg btn-lg font-inter mt-30 text-14">
                Sign up
              </button>

              <div className="l:text-14 text-12 text-grey-800 mt-30 mx-auto w-fit">
                <span>Already have an account? </span>
                <Link href={paths.login} className="text-green-800 mt-30">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
