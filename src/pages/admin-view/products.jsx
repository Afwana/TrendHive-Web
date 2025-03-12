import AddMoreImages from "@/components/admin-view/AddMoreImages";
import ImageUpload from "@/components/admin-view/image-upload";
import { useDynamicProductFormElements } from "@/components/admin-view/product-add-form";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  thumbnail: null,
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  size: "",
  colours: "",
  quality: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [additionalProductImages, setAdditionalProductImages] = useState([]);

  const addProductFormElements = useDynamicProductFormElements();

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const lowercaseFormData = {
    ...formData,
    size: formData?.size?.toLowerCase(),
    colours: formData?.colours?.toLowerCase(),
  };

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: lowercaseFormData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...lowercaseFormData,
            thumbnail: uploadedImageUrl,
            images: additionalProductImages,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast.success("Product added successfully");
            setAdditionalProductImages([]);
          }
        });
  }

  const handleAdditionalImagesUpdate = (imageUrls) => {
    setAdditionalProductImages(imageUrls);
    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
  };

  const handleDialogClose = () => {
    setOpenDetailsDialog(false);
  };

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, index) => (
              <AdminProductTile
                key={index}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
            <DialogTrigger asChild>
              <div className="flex justify-end items-center mt-4">
                <Button>Add More Images</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <AddMoreImages
                onImagesUpload={handleAdditionalImagesUpdate}
                onClose={handleDialogClose}
                currentImages={additionalProductImages}
              />
            </DialogContent>
          </Dialog>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
