import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  deleteReview,
  getAllReviewsForAdmin,
} from "@/store/admin/review-slice";
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

function AdminReviews() {
  const [keyword, setKeyword] = useState("");

  const { reviewList } = useSelector((state) => state.adminReviews);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReviewsForAdmin());
  }, [dispatch]);

  const filteredReviews = reviewList?.filter((review) => {
    const searchValue = keyword.toLowerCase();
    return (
      review?._id.toLowerCase().includes(searchValue) ||
      review?.productId.toLowerCase().includes(searchValue) ||
      review?.userId.toLowerCase().includes(searchValue) ||
      review?.userName.toLowerCase().includes(searchValue)
    );
  });

  const handleDeleteReview = async (id) => {
    try {
      await dispatch(deleteReview(id)).unwrap();
      toast.success("Review deleted successfully!");
      dispatch(getAllReviewsForAdmin());
    } catch (error) {
      toast.error("Error deleting review: ", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Reviews</CardTitle>
        <CardDescription>
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className=""
            placeholder="Search Reviews..."
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Review ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Review Value</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews && filteredReviews.length > 0
              ? filteredReviews.map((item) => (
                  <TableRow key={item?._id}>
                    <TableCell>{item?._id}</TableCell>
                    <TableCell>{item?.userId}</TableCell>
                    <TableCell>{item?.userName}</TableCell>
                    <TableCell>{item?.productId}</TableCell>
                    <TableCell>{item?.reviewMessage}</TableCell>
                    <TableCell>{item?.reviewValue}</TableCell>
                    <TableCell className="text-right">
                      <Trash2
                        size={22}
                        color="red"
                        onClick={() => handleDeleteReview(item?._id)}
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

export default AdminReviews;
