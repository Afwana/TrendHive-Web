import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Input } from "@/components/ui/input";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { orderList, orderDetails, searchedOrder } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(searchedOrder, "searched");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const filteredOrders = orderList?.filter((order) => {
    const searchValue = keyword.toLowerCase();
    return (
      order?._id.toLowerCase().includes(searchValue) ||
      order?.orderStatus.toLowerCase().includes(searchValue) ||
      order?.orderDate.split("T")[0].includes(searchValue)
    );
  });

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Orders</CardTitle>
        <CardDescription>
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className=""
            placeholder="Orders..."
          />
        </CardDescription>
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
            {filteredOrders && filteredOrders.length > 0
              ? filteredOrders.map((orderItem) => (
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
                    <TableCell>
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
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
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

export default AdminOrdersView;
