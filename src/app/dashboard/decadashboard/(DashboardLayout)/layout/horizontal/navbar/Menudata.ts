// import { uniqueId } from 'lodash';

// const Menuitems = [
//   {
//     id: uniqueId(),
//     title: 'Sample Page',
//     icon: 'screencast-2-line-duotone',
//     href: '/',
//     bgcolor: "primary",
//   },
//   {
//     id: uniqueId(),
//     title: 'Menu Level',
//     icon: 'double-alt-arrow-down-bold-duotone',
//     href: '/menulevel/',
//     bgcolor: "secondary",
//     children: [
//       {
//         id: uniqueId(),
//         title: 'Level 1',
//         href: '/l1',
//       },
//       {
//         id: uniqueId(),
//         title: 'Level 1.1',
//         href: '/l1.1',
//         children: [
//           {
//             id: uniqueId(),
//             title: 'Level 2',
  
//             href: '/l2',
//           },
//           {
//             id: uniqueId(),
//             title: 'Level 2.1',
  
//             href: '/l2.1',
//             children: [
//               {
//                 id: uniqueId(),
//                 title: 'Level 3',
      
//                 href: '/l3',
//               },
//               {
//                 id: uniqueId(),
//                 title: 'Level 3.1',
      
//                 href: '/l3.1',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
// export default Menuitems;
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: 'screencast-2-line-duotone',
    href: '/dashboards/',
    bgcolor: "primary",
    children: [
      // {
      //   id: uniqueId(),
      //   title: 'Dashboard 1',
      //   href: '/dashboards/dashboard1',
      //   chip: 'New',
      //   chipColor: 'secondary',
      // },
      {
        id: uniqueId(),
        title: 'Dashboard 1',
        href: '/dashboards/dashboard2',
      },
      {
        id: uniqueId(),
        title: 'Dashboard 2',
        href: '/dashboards/dashboard1',
        chip: 'New',
        chipColor: 'secondary',
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Frontend Pages",
    icon: 'feed-line-duotone',
    href: "/frontend-pages/homepage",
    bgcolor: "error",
    children: [
      {
        id: uniqueId(),
        title: "Homepage",
        href: "/frontend-pages/homepage",
      },
      {
        id: uniqueId(),
        title: "About Us",
        href: "/frontend-pages/about",
      },
      {
        id: uniqueId(),
        title: "Blog",
        href: "/frontend-pages/blog",
      },
      {
        id: uniqueId(),
        title: "Blog Details",
        href: "/frontend-pages/blog-detail",
      },
      {
        id: uniqueId(),
        title: "Contact",
        href: "/frontend-pages/contact",
      },
      {
        id: uniqueId(),
        title: "Portfolio",
        href: "/frontend-pages/portfolio",
      },
      {
        id: uniqueId(),
        title: "Pricing",
        href: "/frontend-pages/pricing",
      },
    ]
  },
  {
    id: uniqueId(),
    title: 'Apps',
    icon: 'clapperboard-text-line-duotone',
    href: '/apps/',
    bgcolor: "secondary",
    children: [
      {
        id: uniqueId(),
        title: 'Contacts',
        href: '/apps/contacts',
      },
      {
        id: uniqueId(),
        title: 'Chats',
        href: '/apps/chats',
      },
      {
        id: uniqueId(),
        title: 'Notes',
        href: '/apps/notes',
      },
      {
        id: uniqueId(),
        title: 'Calendar',
        href: '/apps/calendar',
      },
      {
        id: uniqueId(),
        title: 'Email',
        href: '/apps/email',
      },
      {
        id: uniqueId(),
        title: 'Tickets',
        href: '/apps/tickets',
      },
      {
        id: uniqueId(),
        title: "Kanban",
        icon: 'notes-line-duotone',
        bgcolor: "secondary",
        href: "/apps/kanban",
      },

      {
        id: uniqueId(),
        title: "Invoice",
        icon: 'checklist-minimalistic-line-duotone',
        bgcolor: "warning",
        href: "/apps/invoice/list",
        children: [
          {
            id: uniqueId(),
            title: "List",
            href: "/apps/invoice/list",
          },
          {
            id: uniqueId(),
            title: "Details",
            href: "/apps/invoice/detail/PineappleInc",
          },
          {
            id: uniqueId(),
            title: "Create",
            href: "/apps/invoice/create",
          },
          {
            id: uniqueId(),
            title: "Edit",
            href: "/apps/invoice/edit/PineappleInc",
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'User Profile',
        href: '/user-profile',
        children: [
          {
            id: uniqueId(),
            title: 'Profile',
            href: '/apps/user-profile/profile',
          },
          {
            id: uniqueId(),
            title: 'Followers',
            href: '/apps/user-profile/followers',
          },
          {
            id: uniqueId(),
            title: 'Friends',
            href: '/apps/user-profile/friends',
          },
          {
            id: uniqueId(),
            title: 'Gallery',
            href: '/apps/user-profile/gallery',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Ecommerce',
        href: '/apps/ecommerce/',
        children: [
          {
            id: uniqueId(),
            title: "Shop",
            href: "/apps/ecommerce/shop",
          },
          {
            id: uniqueId(),
            title: "Shop V2",
            href: "/apps/ecommerce/shop2",
          },
          {
            id: uniqueId(),
            title: "Detail",
            href: "/apps/ecommerce/detail/1",
          },
          {
            id: uniqueId(),
            title: "Detail V2",
            href: "/apps/ecommerce/detail2/1",
          },
          {
            id: uniqueId(),
            title: "List",
            href: "/apps/ecommerce/list",
          },
          {
            id: uniqueId(),
            title: "Checkout",
            href: "/apps/ecommerce/checkout",
          },
          {
            id: uniqueId(),
            title: "Add Product",
            href: "/apps/ecommerce/add-product",
          },
          {
            id: uniqueId(),
            title: "Edit Product",
            href: "/apps/ecommerce/edit-product",
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Blog',
        href: '/apps/blog/',
        children: [
          {
            id: uniqueId(),
            title: 'Posts',
            href: '/apps/blog/post',
          },
          {
            id: uniqueId(),
            title: 'Detail',
            href: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
          },
        ],
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Pages',
    icon: 'folder-with-files-line-duotone',
    href: '/ui-components/',
    bgcolor: "success",
    children: [
      {
        id: uniqueId(),
        title: 'Roll Base Access',
        href: '/theme-pages/casl',
      },
      {
        id: uniqueId(),
        title: 'Pricing',
        href: '/theme-pages/pricing',
      },
      {
        id: uniqueId(),
        title: 'Account Setting',
        href: '/theme-pages/account-settings',
      },
      {
        id: uniqueId(),
        title: 'FAQ',
        href: '/theme-pages/faq',
      },
      {
        id: uniqueId(),
        title: 'Widgets',
        icon: 'folder-with-files-line-duotone',
        href: '/widgets/cards',
        children: [
          {
            id: uniqueId(),
            title: 'Cards',
            href: '/widgets/cards',
          },
          {
            id: uniqueId(),
            title: 'Banners',
            href: '/widgets/banners',
          },
          {
            id: uniqueId(),
            title: 'Charts',
            href: '/widgets/charts',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Ui',
        href: '/ui-components/alert',
        children: [
          {
            id: uniqueId(),
            title: 'Alert',
            href: '/ui-components/alert',
          },
          {
            id: uniqueId(),
            title: 'Accordion',
            href: '/ui-components/accordion',
          },
          {
            id: uniqueId(),
            title: 'Avatar',
            href: '/ui-components/avatar',
          },
          {
            id: uniqueId(),
            title: 'Chip',
            href: '/ui-components/chip',
          },
          {
            id: uniqueId(),
            title: 'Dialog',
            href: '/ui-components/dialog',
          },
          {
            id: uniqueId(),
            title: 'List',
            href: '/ui-components/list',
          },
          {
            id: uniqueId(),
            title: 'Popover',
            href: '/ui-components/popover',
          },
          {
            id: uniqueId(),
            title: 'Rating',
            href: '/ui-components/rating',
          },
          {
            id: uniqueId(),
            title: 'Tabs',
            href: '/ui-components/tabs',
          },
          {
            id: uniqueId(),
            title: 'Tooltip',
            href: '/ui-components/tooltip',
          },
          {
            id: uniqueId(),
            title: 'Transfer List',
            href: '/ui-components/transfer-list',
          },
          {
            id: uniqueId(),
            title: 'Typography',
            href: '/ui-components/typography',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Charts',
        href: '/charts/',
        children: [
          {
            id: uniqueId(),
            title: 'Line',
            href: '/charts/line',
          },
          {
            id: uniqueId(),
            title: 'Gredient',
            href: '/charts/gradient',
          },
          {
            id: uniqueId(),
            title: 'Area',
            href: '/charts/area',
          },
          {
            id: uniqueId(),
            title: 'Candlestick',
            href: '/charts/candlestick',
          },
          {
            id: uniqueId(),
            title: 'Column',
            href: '/charts/column',
          },
          {
            id: uniqueId(),
            title: 'Doughtnut & Pie',
            href: '/charts/doughnut',
          },
          {
            id: uniqueId(),
            title: 'RadialBar & Radar',
            href: '/charts/radialbar',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Auth',
        href: '/400',
        children: [
          {
            id: uniqueId(),
            title: 'Error',
            href: '/400',
          },
          {
            id: uniqueId(),
            title: 'Maintenance',
            href: '/auth/maintenance',
          },
          {
            id: uniqueId(),
            title: 'Login',
            href: '/auth/auth1/login',
            children: [
              {
                id: uniqueId(),
                title: 'Side Login',
                href: '/auth/auth1/login',
              },
              {
                id: uniqueId(),
                title: 'Boxed Login',
                href: '/auth/auth2/login',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Register',
            href: '/auth/auth1/register',
            children: [
              {
                id: uniqueId(),
                title: 'Side Register',
                href: '/auth/auth1/register',
              },
              {
                id: uniqueId(),
                title: 'Boxed Register',
                href: '/auth/auth2/register',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Forgot Password',
            href: '/auth/auth1/forgot-password',
            children: [
              {
                id: uniqueId(),
                title: 'Side Forgot Password',
                href: '/auth/auth1/forgot-password',
              },
              {
                id: uniqueId(),
                title: 'Boxed Forgot Password',
                href: '/auth/auth2/forgot-password',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Two Steps',
            href: '/auth/auth1/two-steps',
            children: [
              {
                id: uniqueId(),
                title: 'Side Two Steps',
                href: '/auth/auth1/two-steps',
              },
              {
                id: uniqueId(),
                title: 'Boxed Two Steps',
                href: '/auth/auth2/two-steps',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Forms',
    icon: 'file-line-duotone',
    href: '/forms/form-elements/autocomplete',
    bgcolor: "warning",
    children: [
      {
        id: uniqueId(),
        title: 'Form Elements',
        href: '/forms/form-elements/autocomplete',
        children: [
          {
            id: uniqueId(),
            title: 'Autocomplete',
            href: '/forms/form-elements/autocomplete',
          },
          {
            id: uniqueId(),
            title: 'Button',
            href: '/forms/form-elements/button',
          },
          {
            id: uniqueId(),
            title: 'Radio',
            href: '/forms/form-elements/radio',
          },
          {
            id: uniqueId(),
            title: 'Date Time',
            href: '/forms/form-elements/date-time',
          },
          {
            id: uniqueId(),
            title: 'Slider',
            href: '/forms/form-elements/slider',
          },
          {
            id: uniqueId(),
            title: 'Switch',
            href: '/forms/form-elements/switch',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Form Layout',
        href: '/forms/form-layout',
      },
      {
        id: uniqueId(),
        title: 'Form Horizontal',
        href: '/forms/form-horizontal',
      },
      {
        id: uniqueId(),
        title: 'Form Vertical',
        href: '/forms/form-vertical',
      },
      {
        id: uniqueId(),
        title: 'Form Custom',
        href: '/forms/form-custom',
      },
      {
        id: uniqueId(),
        title: 'Form Wizard',
        href: '/forms/form-wizard',
      },
      {
        id: uniqueId(),
        title: 'Form Validation',
        href: '/forms/form-validation',
      },
      {
        id: uniqueId(),
        title: 'Tiptap Editor',
        href: "/forms/form-tiptap",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Tables',
    icon: 'layers-minimalistic-line-duotone',
    href: '/tables/',
    bgcolor: "error",
    children: [
      {
        id: uniqueId(),
        title: 'Basic',
        href: '/tables/basic',
      },
      {
        id: uniqueId(),
        title: 'Collapsible',
        href: '/tables/collapsible',
      },
      {
        id: uniqueId(),
        title: 'Enhanced',
        href: '/tables/enhanced',
      },
      {
        id: uniqueId(),
        title: 'Fixed Header',
        href: '/tables/fixed-header',
      },
      {
        id: uniqueId(),
        title: 'Pagination',
        href: '/tables/pagination',
      },
      {
        id: uniqueId(),
        title: 'Search',
        href: '/tables/search',
      },
      {
        id: uniqueId(),
        title: "React Table",
        href: "/react-tables/basic",
        children: [
          {
            id: uniqueId(),
            title: "Basic",
            href: "/react-tables/basic",
          },
          {
            id: uniqueId(),
            title: "Dense",
            href: "/react-tables/dense",
          },
          {
            id: uniqueId(),
            title: "Filter",
            href: "/react-tables/filter",
          },
          {
            id: uniqueId(),
            title: "Row Selection",
            href: "/react-tables/row-selection",
          },
          {
            id: uniqueId(),
            title: "Pagination",
            href: "/react-tables/pagination",
          },
          {
            id: uniqueId(),
            title: "Sorting",
            href: "/react-tables/sorting",
          },
          {
            id: uniqueId(),
            title: "Column Visibility",
            href: "/react-tables/column-visiblity",
          },
          {
            id: uniqueId(),
            title: "Drag n Drop",
            href: "/react-tables/drag-n-drop",
          },
          {
            id: uniqueId(),
            title: "Editable",
            href: "/react-tables/editable",
          },
          {
            id: uniqueId(),
            title: "Empty",
            href: "/react-tables/empty",
          },
          {
            id: uniqueId(),
            title: "Expand",
            href: "/react-tables/expanding",
          },
          {
            id: uniqueId(),
            title: "Sticky",
            href: "/react-tables/sticky",
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "MuiCharts",
    icon: "chart-linear",
    href: "/muicharts/barcharts",
    children: [
      {
        id: uniqueId(),
        title: "Bar Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/barcharts",
      },
      {
        id: uniqueId(),
        title: "Line Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/linecharts/line",
        children: [
          {
            id: uniqueId(),
            title: "Lines",
            icon: "solar:stop-circle-line-duotone",
            href: "/muicharts/linecharts/line",
          },
          {
            id: uniqueId(),
            title: "Area",
            icon: "solar:stop-circle-line-duotone",
            href: "/muicharts/linecharts/area",
          },
        ],
      },
      {
        id: uniqueId(),
        title: "Pie Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/piecharts",
      },
      {
        id: uniqueId(),
        title: "Scatter Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/scattercharts",
      },
      {
        id: uniqueId(),
        title: "Sparkline Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/sparklinecharts",
      },
      {
        id: uniqueId(),
        title: "Gauge Charts",
        icon: "solar:stop-circle-line-duotone",
        href: "/muicharts/gaugecharts",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "TreeView",
    icon: "benzene-ring-broken",
    href: "/mui-trees/simpletree/simpletree-items",
    children: [
      {
        id: uniqueId(),
        title: "Items",
        icon: "solar:stop-circle-line-duotone",
        href: "/mui-trees/simpletree/simpletree-items",
      },
      {
        id: uniqueId(),
        title: "Selection",
        icon: "solar:stop-circle-line-duotone",
        href: "/mui-trees/simpletree/simpletree-selection",
      },
      {
        id: uniqueId(),
        title: "Expansion",
        icon: "solar:stop-circle-line-duotone",
        href: "/mui-trees/simpletree/simpletree-expansion",
      },
      {
        id: uniqueId(),
        title: "Customization",
        icon: "solar:stop-circle-line-duotone",
        href: "/mui-trees/simpletree/simpletree-customization",
      },
      {
        id: uniqueId(),
        title: "Focus",
        icon: "solar:stop-circle-line-duotone",
        href: "/mui-trees/simpletree/simpletree-focus",
      },
    ],
  }
];
export default Menuitems;
