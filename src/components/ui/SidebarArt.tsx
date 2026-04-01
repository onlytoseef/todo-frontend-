import Image from 'next/image';
import sidebarImage from '../../Images/sidebar.png';

export default function SidebarArt() {
  return (
    <div className="sidebar-art" aria-hidden="true">
      <Image src={sidebarImage} alt="" className="sidebar-art-image" priority />
    </div>
  );
}
