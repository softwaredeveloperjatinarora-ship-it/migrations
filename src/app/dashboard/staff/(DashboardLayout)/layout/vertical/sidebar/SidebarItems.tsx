
import { usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from '@/store/hooks';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { AppState, menuState} from '@/store/store'
import { toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
interface SidebarItemsProps {
  onCloseSidebar: () => void;  // callback to close the sidebar drawer
}
const SidebarItems = ({ onCloseSidebar }: SidebarItemsProps) => {
  const  pathname  = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
 
  const menu = useSelector((state: menuState) => state.menu); // fetch menu store in redux
  
 

  return (
    
    <Box sx={{ px: "20px" }}>
     
      {/* <MenuComponent onDataFetched={handleMenuData} /> */}
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menu.menuData.map((item:any) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => {
                  onCloseSidebar(); // <-- call the drawer close callback here as well
                }}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} hideMenu={hideMenu} onClick={() => console.log()} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;

