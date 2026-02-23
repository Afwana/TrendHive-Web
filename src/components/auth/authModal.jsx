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
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    /^[A-Za-z\d@$!%*?&]{8,}$/;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = (formData, isForgetPassword = false) => {
    const newErrors = {};

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only digits";
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    }

    if (!isForgetPassword) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must be at least 8 characters long";
      }
    }

    if (isForgetPassword && !formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (isForgetPassword && !validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

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

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    if (forgetPassword) {
      dispatch(resetPassword(forgetFormData)).then((data) => {
        setIsSubmitting(false);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setForgetPassword(false);
          setForgetFormData(forgetInitialState);
          setLoginFormData({
            ...loginInitialState,
            phoneNumber: forgetFormData.phoneNumber,
          });
        } else {
          toast.error(data?.payload?.message);
        }
      });
    } else if (register) {
      dispatch(registerUser(registerFormData)).then((data) => {
        setIsSubmitting(false);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setRegister(false);
          setLoginFormData({
            ...loginInitialState,
            phoneNumber: registerFormData.phoneNumber,
          });
          setRegisterFormData(registerInitialState);
          setErrors({});
          setTimeout(() => {
            const passwordInput = document.querySelector(
              'input[name="password"]',
            );
            if (passwordInput) passwordInput.focus();
          }, 100);
        } else {
          toast.error(data?.payload?.message);
        }
      });
    } else {
      dispatch(loginUser(loginFormData)).then((data) => {
        setIsSubmitting(false);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          setLoginFormData(loginInitialState);
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
    setRegister(false);
    setForgetPassword(false);
    setLoginFormData(loginInitialState);
    setRegisterFormData(registerInitialState);
    setForgetFormData(forgetInitialState);
    setIsSubmitting(false);
  }

  const handleFormDataChange = (formData, setFormData, field) => (e) => {
    if (field === "phoneNumber") {
      const value = e.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSwitchToLogin = () => {
    setRegister(false);
    setForgetPassword(false);
    setErrors({});
  };

  const handleSwitchToRegister = () => {
    setRegister(true);
    setForgetPassword(false);
    setErrors({});
  };

  const handleSwitchToForgetPassword = () => {
    setForgetPassword(true);
    setRegister(false);
    setErrors({});
    if (loginFormData.phoneNumber) {
      setForgetFormData({
        ...forgetInitialState,
        phoneNumber: loginFormData.phoneNumber,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw] min-[2560px]:max-w-[50vw] overflow-x-hidden h-[550px] min-[2560px]:h-[700px]">
        <div className="grid grid-cols-2 gap-5 w-full h-full overflow-x-hidden">
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
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="mx-auto w-full max-w-md">
                  <div className="text-center mb-5">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      {register ? "Create Account" : "Sign in to your account"}
                    </h1>
                    {register ? (
                      <p className="mt-2 flex items-center justify-center cursor-pointer">
                        Already have an account
                        <div
                          className="font-medium ml-2 text-primary underline"
                          onClick={handleSwitchToLogin}
                        >
                          Sign in
                        </div>
                      </p>
                    ) : (
                      <p className="mt-2 flex items-center justify-center cursor-pointer">
                        Don&#39;t have an account
                        <div
                          className="font-medium ml-2 text-primary underline"
                          onClick={handleSwitchToRegister}
                        >
                          Sign up
                        </div>
                      </p>
                    )}
                  </div>
                  {register ? (
                    <CommonForm
                      formControls={registerFormControls}
                      buttonText={
                        isSubmitting ? "Creating Account..." : "Sign Up"
                      }
                      formData={registerFormData}
                      setFormData={setRegisterFormData}
                      onSubmit={onSubmit}
                      errors={errors}
                      handleChange={handleFormDataChange}
                      isBtnDisabled={isSubmitting}
                    />
                  ) : (
                    <CommonForm
                      formControls={loginFormControls}
                      buttonText={isSubmitting ? "Signing In..." : "Sign In"}
                      formData={loginFormData}
                      setFormData={setLoginFormData}
                      onSubmit={onSubmit}
                      errors={errors}
                      handleChange={handleFormDataChange}
                      isBtnDisabled={isSubmitting}
                    />
                  )}
                </div>
                <p
                  className="text-sm text-center font-semibold hover:underline"
                  onClick={handleSwitchToForgetPassword}
                >
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
