/* eslint-disable react/prop-types */
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  errors = {},
  handleChange,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const error = errors[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="w-full">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={
                handleChange
                  ? handleChange(formData, setFormData, getControlItem.name)
                  : (event) =>
                      setFormData({
                        ...formData,
                        [getControlItem.name]: event.target.value,
                      })
              }
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

        break;
      case "select":
        element = (
          <div className="w-full">
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}>
              <SelectTrigger
                className={`w-full ${error ? "border-red-500" : ""}`}>
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

        break;
      case "textarea":
        element = (
          <div className="w-full">
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

        break;

      default:
        element = (
          <div className="w-full">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={
                handleChange
                  ? handleChange(formData, setFormData, getControlItem.name)
                  : (event) =>
                      setFormData({
                        ...formData,
                        [getControlItem.name]: event.target.value,
                      })
              }
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
