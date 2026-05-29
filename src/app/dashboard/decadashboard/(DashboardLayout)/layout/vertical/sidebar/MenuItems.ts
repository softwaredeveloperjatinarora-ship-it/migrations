import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  bgcolor?: any;
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: 'screencast-2-line-duotone',
    href: "/dashboard/decadashboard",
    bgcolor: "primary",
  },
  {
    id: uniqueId(),
    title: "Initial Tasks",
    icon: 'chart-line-duotone',
    href: "/dashboard/decadashboard/StartupActivity/KitReceiving",
    bgcolor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Staff Attendance",
    icon: 'clipboard-check-line-duotone',
    href: "/dashboard/decadashboard/staffAttendance",
    bgcolor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Daily Activity",
    icon: 'notes-line-duotone',
    href: "/dashboard/decadashboard/dailyActivities",
    bgcolor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Exam Sheet Details",
    href: "/dashboard/decadashboard/ExamSheetDetail",
    icon: 'file-line-duotone',
    bgcolor: "secondary",
  },
   {
    id: uniqueId(),
    title: "Download Seating Plan",
    icon: 'download-line-duotone',  // string icon name only
    href: "/dashboard/decadashboard/downloadSeatingPlan",
    bgcolor: "secondary",
  },
];

export default Menuitems;