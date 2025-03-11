/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminBrandTile({
  brand,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={brand?.image}
            alt={brand?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{brand?.title}</h2>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(brand?._id);
              setFormData(brand);
            }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(brand?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminBrandTile;
