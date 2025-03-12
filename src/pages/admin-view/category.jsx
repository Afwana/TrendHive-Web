import AdminCategoryTile from "@/components/admin-view/category-tile";
import ImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addCategoryFormElements } from "@/config";
import {
  addNewCategory,
  deleteCategory,
  editCategory,
  fetchAllCategories,
} from "@/store/admin/category-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
};

function AdminCategory() {
  const [openCreateCategoriesDialog, setOpenCreateCategoriesDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { categoryList } = useSelector((state) => state.adminCategory);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editCategory({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllCategories());
            setFormData(initialFormData);
            setOpenCreateCategoriesDialog(false);
            setCurrentEditedId(null);
            toast.success("Category edited successfully");
          }
        })
      : dispatch(
          addNewCategory({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllCategories());
            setImageFile(null);
            setFormData(initialFormData);
            setOpenCreateCategoriesDialog(false);
            toast.success("Category added successfully");
          }
        });
  }

  function handleDelete(getCurrentCategoryId) {
    dispatch(deleteCategory(getCurrentCategoryId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCategories());
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
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => setOpenCreateCategoriesDialog(true)}>
          Add New Category
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categoryList && categoryList.length > 0
          ? categoryList.map((categoryItem, index) => (
              <AdminCategoryTile
                key={index}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateCategoriesDialog}
                setCurrentEditedId={setCurrentEditedId}
                category={categoryItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateCategoriesDialog}
        onOpenChange={() => {
          setOpenCreateCategoriesDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Category" : "Add New Category"}
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
              formControls={addCategoryFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminCategory;
