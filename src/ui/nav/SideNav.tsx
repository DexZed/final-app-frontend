import { ReactNode } from "react";
import { Link } from "react-router";

type Props = {children:ReactNode};

function SideNav({children}: Props) {
  const links = (
    <>
    <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/dashboard/profile"}>Profile Page</Link>
      </li>
      <li>
        <Link to={"/dashboard/donationRequest"}>Add Donation</Link>
      </li>
      <li>
        <a>Navbar Item 3</a>
      </li>
    </>
  );
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar for small screens */}
          <div className="navbar bg-base-300 w-full lg:hidden">
            <div className="flex-1 px-2">Welcome</div>
            <div className="flex-none">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                {links}
              </ul>
            </div>
          </div>
          {/* Page content here */}
         {children}
        </div>
        {/* Drawer for large screens */}
        <div className="drawer-side lg:block hidden">
          <ul className="menu bg-base-200 min-h-full w-56 p-4">
            {/* Sidebar content here */}
            {links}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideNav;
