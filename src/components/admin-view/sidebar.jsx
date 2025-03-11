import {
  ChartNoAxesCombined,
  ChevronRight,
  LayoutDashboard,
  MessageCircleCode,
  Shapes,
  ShoppingBasket,
  ShoppingCart,
  Undo2,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useState } from "react";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
  {
    id: "catalogue",
    label: "Catalogue",
    icon: <Shapes />,
    items: [
      {
        id: "categories",
        label: "Categories",
        path: "/admin/categories",
        icon: <ChevronRight />,
      },
      {
        id: "brands",
        label: "Brands",
        path: "/admin/brands",
        icon: <ChevronRight />,
      },
      {
        id: "footer",
        label: "Footer",
        path: "/admin/footer",
        icon: <ChevronRight />,
      },
    ],
  },
  {
    id: "return",
    label: "Return",
    path: "/admin/return",
    icon: <Undo2 />,
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    icon: <MessageCircleCode />,
  },
];

// eslint-disable-next-line react/prop-types
function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({ catalogue: false });

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <Fragment key={menuItem.id}>
          {menuItem.items ? (
            // Grouped Section
            <div>
              <div
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [menuItem.id]: !prev[menuItem.id],
                  }))
                }
                className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </div>
              {expanded[menuItem.id] &&
                menuItem.items.map((subItem) => (
                  <div
                    key={subItem.id}
                    onClick={() => {
                      navigate(subItem.path);
                      setOpen && setOpen(false);
                    }}
                    className="ml-5 flex cursor-pointer text-lg items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    {subItem.icon}
                    <span>{subItem.label}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div
              onClick={() => {
                navigate(menuItem.path);
                setOpen && setOpen(false);
              }}
              className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </div>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

// eslint-disable-next-line react/prop-types
function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2">
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
