/* eslint-disable react/prop-types */
import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

function AdminOrderDetailsView({ orderDetails }) {
  const initialFormData = {
    status: orderDetails?.orderStatus,
  };

  const initialPayment = {
    payment: orderDetails?.paymentStatus,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [paymentData, setPaymentData] = useState(initialPayment);
  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      }
    });
  }

  function handleUpdatePayment(event) {
    event.preventDefault();
    const { payment } = paymentData;

    dispatch(
      updatePaymentStatus({ id: orderDetails?._id, paymentStatus: payment })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setPaymentData(initialPayment);
        toast.success(data?.payload?.message);
      }
    });
  }

  return (
    <>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] overflow-y-auto">
        <DialogTitle>Order Details</DialogTitle>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>&#8377; {orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment method</p>
              <Label>
                {orderDetails?.paymentStatus === "Paid Online"
                  ? "Online"
                  : orderDetails?.paymentMethod}
              </Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 ${
                    orderDetails?.paymentStatus === "Pending"
                      ? "bg-yellow-500"
                      : orderDetails?.paymentStatus === "Partially Paid"
                      ? "bg-orange-500"
                      : orderDetails?.paymentStatus === "Paid Online"
                      ? "bg-cyan-500"
                      : orderDetails?.paymentStatus === "Cash On Delivery"
                      ? "bg-blue-500"
                      : orderDetails?.paymentStatus === "Paid"
                      ? "bg-green-500"
                      : orderDetails?.paymentStatus === "Not Paid"
                      ? "bg-red-500"
                      : "bg-black"
                  }`}>
                  {orderDetails?.paymentStatus}
                </Badge>
              </Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-3 ${
                    orderDetails?.orderStatus === "Pending"
                      ? "bg-yellow-500"
                      : orderDetails?.orderStatus === "Confirmed"
                      ? "bg-orange-500"
                      : orderDetails?.orderStatus === "In Process"
                      ? "bg-cyan-500"
                      : orderDetails?.orderStatus === "Shipped"
                      ? "bg-blue-500"
                      : orderDetails?.orderStatus === "Delivered"
                      ? "bg-green-500"
                      : orderDetails?.orderStatus === "Cancelled"
                      ? "bg-red-500"
                      : orderDetails?.orderStatus === "Rejected"
                      ? "bg-red-600"
                      : "bg-black"
                  }`}>
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>
              <ul className="grid gap-3">
                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                  ? orderDetails?.cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between">
                        <span>Title: {item.title}</span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: &#8377; {item.price}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Shipping Info</div>
              <div className="grid gap-0.5 text-muted-foreground">
                <span>{orderDetails?.addressInfo?.name}</span>
                <span>{orderDetails?.addressInfo?.address}</span>
                <span>
                  {orderDetails?.addressInfo?.city},{" "}
                  {orderDetails?.addressInfo?.state},
                </span>
                <span>{orderDetails?.addressInfo?.country},</span>
                <span>{orderDetails?.addressInfo?.pincode}</span>
                <span>{orderDetails?.addressInfo?.phone}</span>
                <span>{orderDetails?.addressInfo?.notes}</span>
              </div>
            </div>
          </div>

          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "Pending", label: "Pending" },
                    { id: "Confirmed", label: "Confirmed" },
                    { id: "In Process", label: "In Process" },
                    { id: "Shipped", label: "Shipped" },
                    { id: "Delivered", label: "Delivered" },
                    { id: "Cancelled", label: "Cancelled" },
                    { id: "Rejected", label: "Rejected" },
                    { id: "Returned", label: "Returned" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>
          <div>
            <CommonForm
              formControls={[
                {
                  label: "Paymnet Status",
                  name: "payment",
                  componentType: "select",
                  options: [
                    { id: "Pending", label: "Pending" },
                    { id: "Not Paid", label: "Not Paid" },
                    { id: "Partially Paid", label: "Partially Paid" },
                    { id: "Paid Online", label: "Paid Online" },
                    { id: "Cash On Delivery", label: "Cash On Delivery" },
                    { id: "Paid", label: "Paid" },
                  ],
                },
              ]}
              formData={paymentData}
              setFormData={setPaymentData}
              buttonText={"Update Payment Status"}
              onSubmit={handleUpdatePayment}
            />
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default AdminOrderDetailsView;
