import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteReturnRequest,
  fetchAllReturnRequests,
  updateReturnStatus,
} from "@/store/admin/return-slice";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import CommonForm from "./../../components/common/form";
import { updateOrderStatus } from "./../../store/admin/order-slice/index";

function AdminReturn() {
  const [keyword, setKeyword] = useState("");
  const [formData, setFormData] = useState({
    returnId: "",
    orderId: "",
    status: "",
  });
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);

  const { returnList } = useSelector((state) => state.adminReturn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllReturnRequests());
  }, [dispatch]);

  const filteredReturns = returnList?.filter((item) => {
    const searchValue = keyword.toLowerCase();
    return (
      item?._id.toLowerCase().includes(searchValue) ||
      item?.orderId.toLowerCase().includes(searchValue) ||
      item?.status.toLowerCase().includes(searchValue)
    );
  });

  const handleDeleteReturn = async (id) => {
    try {
      await dispatch(deleteReturnRequest(id)).unwrap();
      toast.success("Return request deleted successfully!");
      dispatch(fetchAllReturnRequests());
    } catch (error) {
      toast.error("Error deleting return requests: ", error);
    }
  };

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { returnId, orderId, status } = formData;
    Promise.all([
      dispatch(updateOrderStatus({ id: orderId, orderStatus: status })),
      dispatch(updateReturnStatus({ id: returnId, status: status })),
    ])
      .then(([orderResponse, returnResponse]) => {
        const orderSuccess = orderResponse?.payload?.success;
        const returnSuccess = returnResponse?.payload?.success;

        if (orderSuccess && returnSuccess) {
          dispatch(fetchAllReturnRequests());
          setFormData({
            orderId: "",
            status: "",
          });
          setOpenUpdateStatus(false);
          toast.success("Order and Return status updated successfully!");
        } else {
          toast.error("Error updating statuses.");
        }
      })
      .catch(() => {
        toast.error("An error occurred while updating statuses.");
      });
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Return Requests</CardTitle>
        <CardDescription>
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className=""
            placeholder="Search Return Requests..."
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Return ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Reason for return</TableHead>
              <TableHead>Status</TableHead>
              <TableHead> </TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns && filteredReturns.length > 0
              ? filteredReturns.map((item) => (
                  <TableRow key={item?._id}>
                    <TableCell>{item?._id}</TableCell>
                    <TableCell>{item?.createdAt.split("T")[0]}</TableCell>
                    <TableCell>{item?.orderId}</TableCell>
                    <TableCell>{item?.reason}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          item?.status === "Pending"
                            ? "bg-yellow-500"
                            : item?.status === "Confirmed"
                            ? "bg-orange-500"
                            : item?.status === "In Process"
                            ? "bg-cyan-500"
                            : item?.status === "Shipped"
                            ? "bg-blue-500"
                            : item?.status === "Delivered"
                            ? "bg-green-500"
                            : item?.status === "Cancelled"
                            ? "bg-red-500"
                            : item?.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}>
                        {item?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item?.reviewValue}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openUpdateStatus}
                        onOpenChange={() => {
                          setOpenUpdateStatus(false);
                        }}>
                        <Button
                          onClick={() => {
                            setOpenUpdateStatus(true);
                            setFormData({
                              returnId: item?._id,
                              orderId: item?.orderId,
                              status: item?.status,
                            });
                          }}>
                          Update Status
                        </Button>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogTitle>Update Order Status</DialogTitle>
                          <div className="py-5">
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
                              buttonText={"Update Status"}
                              onSubmit={handleUpdateStatus}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <Trash2
                        size={22}
                        color="red"
                        onClick={() => handleDeleteReturn(item?._id)}
                      />
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

export default AdminReturn;
