/* eslint-disable react/prop-types */
import { Dialog, DialogContent } from "../ui/dialog";
import layoutImage from "../../assets/layout.jpg";
import logo from "../../assets/Auth-Logo.png";
import CommonForm from "./../common/form";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/store/auth-slice";
import { toast } from "sonner";
import { registerFormControls } from "./../../config/index";
import { useNavigate } from "react-router-dom";

const loginInitialState = {
  phoneNumber: "",
  password: "",
};

const registerInitialState = {
  userName: "",
  phoneNumber: "",
  password: "",
};

function AuthModal({ open, setOpen, redirectPath = "/shop/home" }) {
  const [register, setRegister] = useState(false);
  const [loginFormData, setLoginFormData] = useState(loginInitialState);
  const [registerFormData, setRegisterFormData] =
    useState(registerInitialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    {
      register
        ? dispatch(registerUser(registerFormData)).then((data) => {
            if (data?.payload?.success) {
              toast.success(data?.payload?.message);
              setRegister(false);
              navigate(redirectPath);
            } else {
              toast.error(data?.payload?.message);
            }
          })
        : dispatch(loginUser(loginFormData)).then((data) => {
            if (data?.payload?.success) {
              toast.success(data?.payload?.message);
              handleDialogClose();
              navigate(redirectPath);
            } else {
              toast.error(data?.payload?.message);
            }
          });
    }
  }

  function handleDialogClose() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw] min-[2560px]:max-w-[50vw] overflow-hidden h-[550px] min-[2560px]:h-[700px]">
        <div className="grid grid-cols-2 gap-5 w-full h-full overflow-hidden">
          <div className="hidden lg:flex items-center justify-center bg-black w-full">
            <img src={layoutImage} alt="auth-image" className="w-full h-full" />
          </div>
          <div className="flex flex-col gap-5 w-full p-10">
            <img src={logo} alt="auth-image" className="" />
            <div className="flex flex-col gap-2">
              <div className="mx-auto w-full max-w-md">
                <div className="text-center mb-5">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Sign in to your account
                  </h1>
                  {register ? (
                    <p className="mt-2 flex items-center justify-center cursor-pointer">
                      Already have an account
                      <div
                        className="font-medium ml-2 text-primary underline"
                        onClick={() => setRegister(false)}>
                        Login
                      </div>
                    </p>
                  ) : (
                    <p className="mt-2 flex items-center justify-center cursor-pointer">
                      Don&#39;t have an account
                      <div
                        className="font-medium ml-2 text-primary underline"
                        onClick={() => setRegister(true)}>
                        Register
                      </div>
                    </p>
                  )}
                </div>
                {register ? (
                  <CommonForm
                    formControls={registerFormControls}
                    buttonText={"Sign Up"}
                    formData={registerFormData}
                    setFormData={setRegisterFormData}
                    onSubmit={onSubmit}
                  />
                ) : (
                  <CommonForm
                    formControls={loginFormControls}
                    buttonText={"Sign In"}
                    formData={loginFormData}
                    setFormData={setLoginFormData}
                    onSubmit={onSubmit}
                  />
                )}
              </div>
              <p className="text-sm text-center font-semibold">
                Forget password?!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
