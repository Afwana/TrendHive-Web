/* eslint-disable react/prop-types */
import { Dialog, DialogContent } from "../ui/dialog";
import layoutImage from "../../assets/layout.jpg";
import logo from "../../assets/Auth-Logo.png";
import CommonForm from "./../common/form";
import { forgetPasswordControls, loginFormControls } from "@/config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, resetPassword } from "@/store/auth-slice";
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

const forgetInitialState = {
  phoneNumber: "",
  newPassword: "",
};

const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\d+$/;
  return regex.test(phoneNumber);
};

const validatePassword = (password) => {
  // At least one uppercase, one lowercase, one digit, one special char, min 8 chars
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

function AuthModal({ open, setOpen, redirectPath }) {
  const [register, setRegister] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [loginFormData, setLoginFormData] = useState(loginInitialState);
  const [registerFormData, setRegisterFormData] =
    useState(registerInitialState);
  const [forgetFormData, setForgetFormData] = useState(forgetInitialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = (formData, isForgetPassword = false) => {
    const newErrors = {};

    // Phone number validation for all forms
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only digits";
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    }

    // Password validation (except for forget password where we might not need it)
    if (!isForgetPassword) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long";
      }
    }

    // For forget password form, validate newPassword
    if (isForgetPassword && !formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (isForgetPassword && !validatePassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long";
    }

    // For register form, validate username
    if (register && !formData.userName) {
      newErrors.userName = "Username is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function onSubmit(event) {
    event.preventDefault();

    let isValid;
    if (forgetPassword) {
      isValid = validateForm(forgetFormData, true);
    } else if (register) {
      isValid = validateForm(registerFormData);
    } else {
      isValid = validateForm(loginFormData);
    }

    if (!isValid) return;
    {
      forgetPassword
        ? dispatch(resetPassword(forgetFormData)).then((data) => {
            if (data?.payload?.success) {
              toast.success(data?.payload?.message);
              setForgetPassword(false);
            } else {
              toast.error(data?.payload?.message);
            }
          })
        : register
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
    setErrors({});
  }

  const handleFormDataChange = (formData, setFormData, field) => (e) => {
    // For phone number field, only allow digits
    if (field === "phoneNumber") {
      const value = e.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw] min-[2560px]:max-w-[50vw] overflow-hidden h-[550px] min-[2560px]:h-[700px]">
        <div className="grid grid-cols-2 gap-5 w-full h-full overflow-hidden">
          <div className="hidden lg:flex items-center justify-center bg-black w-full">
            <img src={layoutImage} alt="auth-image" className="w-full h-full" />
          </div>
          <div className="flex flex-col gap-5 w-full p-10">
            <img src={logo} alt="auth-image" className="" />
            {forgetPassword ? (
              <CommonForm
                formControls={forgetPasswordControls}
                buttonText={"Change Password"}
                formData={forgetFormData}
                setFormData={setForgetFormData}
                onSubmit={onSubmit}
                errors={errors}
                handleChange={handleFormDataChange}
              />
            ) : (
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
                      errors={errors}
                      handleChange={handleFormDataChange}
                    />
                  ) : (
                    <CommonForm
                      formControls={loginFormControls}
                      buttonText={"Sign In"}
                      formData={loginFormData}
                      setFormData={setLoginFormData}
                      onSubmit={onSubmit}
                      errors={errors}
                      handleChange={handleFormDataChange}
                    />
                  )}
                </div>
                <p
                  className="text-sm text-center font-semibold hover:underline"
                  onClick={() => setForgetPassword(true)}>
                  Forget password?!
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
