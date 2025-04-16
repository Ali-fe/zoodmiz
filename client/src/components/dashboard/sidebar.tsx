
import SidebarLink from './sidebarlink';
import sidebarLinks from '../../data/sidebarlinks';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r p-4 shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4 text-blue-600 text-right">منو</h2>
      <nav className="space-y-2">
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.path} name={link.name} path={link.path} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
