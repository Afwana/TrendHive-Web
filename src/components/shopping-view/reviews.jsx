import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getUserReviews } from "@/store/shop/review-slice";

function Reviews() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userReviews } = useSelector((state) => state.shopReview);

  useEffect(() => {
    dispatch(getUserReviews(user?.id));
  }, [dispatch, user?.id]);

  console.log(userReviews, "reviews");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Review Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userReviews && userReviews.length > 0
              ? userReviews.map((item) => (
                  <TableRow key={item?.productId}>
                    <TableCell>{item?.productId}</TableCell>
                    <TableCell>{item?.reviewMessage}</TableCell>
                    <TableCell>{item?.reviewValue}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Reviews;
