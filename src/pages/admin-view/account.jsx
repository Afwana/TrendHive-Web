import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdminPassword,
  updateAdminProfile,
} from "@/store/admin/profile-slice";
import { toast } from "sonner";

export default function AdminAccount() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.adminProfile);
  const { user } = useSelector((state) => state.auth);

  const [isEdit, setIsEdit] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    selectId: user?.id,
    userName: user?.userName,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
  });

  const [passwordData, setPasswordData] = useState({
    selectId: user?.id,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = () => {
    dispatch(updateAdminProfile(formData));
    setIsEdit(false);
  };

  const handlePasswordSubmit = () => {
    const { newPassword, confirmPassword } = passwordData;

    if (!/^[A-Za-z0-9]{6,}$/.test(newPassword)) {
      toast.warning(
        "New password must be at least 6 characters long and contain only letters and numbers."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passowrd do not match!!");
      return;
    }

    dispatch(updateAdminPassword(passwordData));
  };

  return (
    <div className="grid gap-10">
      <div>
        <Card className="p-4">
          <div className="grid gap-3">
            <div>
              <div className="pb-[16px] text-2xl font-medium">
                Admin Details
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div>
                  <Input
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    disabled={!isEdit}
                    placeholder={"Full name"}
                    label="Full Name"
                  />
                </div>
                <div>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder={"Contact No."}
                    label="Contact Number"
                    disabled={!isEdit}
                    required={true}
                  />
                </div>
                <div>
                  <Input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder={"Role"}
                    readOnly={true}
                    required={true}
                    label="Role"
                  />
                </div>
              </div>
            </div>
            <div>
              {isEdit ? (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    className="w-40"
                    onClick={handleProfileSubmit}
                    disabled={isLoading}>
                    Save
                  </Button>
                  <Button className="w-40" onClick={() => setIsEdit(false)}>
                    Discard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <Button className="w-40" onClick={() => setIsEdit(true)}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div>
        <Card className="p-4">
          <div className="grid gap-3">
            <div>
              <div className="pb-[16px] text-2xl font-medium">
                Change Password
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="relative w-full flex justify-end">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder={"Current Password"}
                    label="Current Password"
                  />
                  <Button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 z-10">
                    {showCurrentPassword ? (
                      <EyeOff className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <Eye className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </Button>
                </div>
                <div className="relative w-full flex justify-end">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder={"New Password"}
                    label={"New Password"}
                  />
                  <Button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 z-10">
                    {showNewPassword ? (
                      <EyeOff className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <Eye className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </Button>
                </div>
                <div className="relative w-full flex justify-end">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder={"Confirm Password"}
                    label="Confirm Password"
                  />
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 z-10">
                    {showConfirmPassword ? (
                      <EyeOff className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <Eye className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-end">
                <Button
                  className="w-1/4"
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}>
                  {isLoading ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
