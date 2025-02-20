import React, { FC } from 'react'
import Input from "@/modules/lib/components/input/Input";
import InputAlert from "@/modules/lib/components/input/input-alert/InputAlert";
import { useSignUpView } from '@/modules/lib/utility/hooks/use-signup';
import { cx } from '@/modules/lib/utility/utility';
import Icon from '@/modules/lib/components/icon/Icon';
import { ICustomerSignUpStep } from './SignUp';

const CustomerSignUpDetails1: FC<ICustomerSignUpStep> = ({setCurrentStep}) => {
     const { formHandler } = useSignUpView();
  return (
    <>
          <div className="w-full">
            <div className="font-inter mb-30">
              <h3 className="text-center text-20  weight-500 mb-10 text-grey-900">
                Welcome to aseoebi.africa
              </h3>
              <p className="text-center text-14  text-grey-700">
                Enter your details to start stress-free shopping.
              </p>
            </div>

            <form
              onSubmit={formHandler.handleSubmit}
              className=""
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
                inputClass={cx('',{
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
  <div
    className="btn text-center bg-green weight-500 text-16 l:btn-lg btn-lg font-inter mt-30 text-14"
    onClick={() => {
      if (!formHandler.errors.fullname && !formHandler.errors.email) {
        setCurrentStep(2);
      }
    }}
  >
    Continue
  </div>
  </form>
          </div>
      </>
  )
}

export default CustomerSignUpDetails1