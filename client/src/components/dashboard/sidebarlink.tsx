import { Link } from 'react-router-dom'; // یا next/link اگه تو Next هستی

type SidebarLinkProps = {
  name: string;
  path: string;
};

const SidebarLink = ({ name, path }: SidebarLinkProps) => {
  return (
    <Link
      to={path}
      className="block px-4 py-2 rounded-md hover:bg-blue-100 text-right text-gray-700"
    >
      {name}
    </Link>
  );
};

export default SidebarLink;
