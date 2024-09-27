import { SidebarItem } from "../../components/SidebarItem";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex px-20 py-5 overflow-y-scroll h-[90vh] ">
            {children}
    </div>
  );
}

