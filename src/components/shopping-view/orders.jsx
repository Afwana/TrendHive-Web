import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import {
  createReturnOrder,
  resetReturnDetails,
} from "@/store/shop/return-slice";
import { DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleReturnDetails = async (id) => {
    const formData = {
      orderId: id,
      reason: reason,
    };
    try {
      const response = await dispatch(createReturnOrder(formData)).unwrap();

      if (response?.whatsappLink) {
        window.open(response?.whatsappLink, "_blank");
      }

      toast.success("Return request sent to whatsapp successfully");
      setReason("");
      setOpenReturnDialog(false);
    } catch (error) {
      console.error("Failed to update return:", error);
      toast.error("Error updating return");
    }
  };

  const handleCancelReturn = () => {
    setReason("");
    setOpenReturnDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "Pending"
                            ? "bg-yellow-500"
                            : orderItem?.orderStatus === "Confirmed"
                            ? "bg-orange-500"
                            : orderItem?.orderStatus === "In Process"
                            ? "bg-cyan-500"
                            : orderItem?.orderStatus === "Shipped"
                            ? "bg-blue-500"
                            : orderItem?.orderStatus === "Delivered"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "Cancelled"
                            ? "bg-red-500"
                            : orderItem?.orderStatus === "Rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}>
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>&#8377; {orderItem?.totalAmount}</TableCell>
                    <TableCell className="flex gap-3">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}>
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }>
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                      {orderItem?.orderStatus === "Delivered" && (
                        <Dialog
                          open={openReturnDialog}
                          onOpenChange={() => {
                            setOpenReturnDialog(false);
                            dispatch(resetReturnDetails());
                          }}>
                          <Button onClick={() => setOpenReturnDialog(true)}>
                            Return
                          </Button>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogTitle>Return Order</DialogTitle>
                            <Textarea
                              value={reason}
                              name="reason"
                              placeholder="reason for return"
                              label="Reason for Return"
                              onChange={(e) => setReason(e.target.value)}
                              className="mt-5"
                            />

                            <div className="flex justify-end gap-4 items-center mt-10">
                              <Button
                                onClick={() =>
                                  handleReturnDetails(orderItem?._id)
                                }>
                                Continue
                              </Button>
                              <Button onClick={() => handleCancelReturn()}>
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
