import AdminBrandTile from "@/components/admin-view/brand-tile";
import ImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addBrandFormElements } from "@/config";
import {
  addNewBrand,
  deleteBrand,
  editBrand,
  fetchAllBrands,
} from "@/store/admin/brand-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
};

function AdminBrands() {
  const [openCreateBrandsDialog, setOpenCreateBrandsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { brandList } = useSelector((state) => state.adminBrand);
  const dispatch = useDispatch();
  console.log(uploadedImageUrl);

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      console.log("Editing brand...");

      dispatch(
        editBrand({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");

        if (data?.payload?.success) {
          dispatch(fetchAllBrands());
          setFormData(initialFormData);
          setOpenCreateBrandsDialog(false);
          setCurrentEditedId(null);
          toast.success("Brand edited successfully");
        }
      });
    } else {
      dispatch(
        addNewBrand({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        console.log(data);

        if (data?.payload?.success) {
          dispatch(fetchAllBrands());
          setImageFile(null);
          setFormData(initialFormData);
          setOpenCreateBrandsDialog(false);
          toast.success("Brand added successfully");
          console.log(openCreateBrandsDialog);
        }
      });
    }
  }

  function handleDelete(getCurrentBrandId) {
    dispatch(deleteBrand(getCurrentBrandId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllBrands());
      }
    });
  }

  function isFormValid() {
    const requiredFields = ["title"];

    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  }

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  console.log(formData, "BrandList");
  console.log("brand page");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between">
        <h2 className="text-2xl font-bold">Brands</h2>
        <Button onClick={() => setOpenCreateBrandsDialog(true)}>
          Add New Brand
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {brandList && brandList.length > 0
          ? brandList.map((brandItem, index) => (
              <AdminBrandTile
                key={index}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateBrandsDialog}
                setCurrentEditedId={setCurrentEditedId}
                brand={brandItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateBrandsDialog}
        onOpenChange={() => {
          setOpenCreateBrandsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Brand" : "Add New Brand"}
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
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addBrandFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminBrands;
