// import { useSelector } from "@/store/hooks";
// import Link from "next/link";
// import { styled } from '@mui/material/styles';
// import { AppState } from "@/store/store";
// import Image from "next/image";

// export default function Logo() {
//   const customizer = useSelector((state: AppState) => state.customizer);
//   // const LinkStyled = styled(Link)(() => ({
//   //   height: customizer.TopbarHeight,
//   //   width: customizer.isCollapse ? "40px" : "180px",
//   //   overflow: "hidden",
//   //   display: "block",
      
//   // }));
//   const LinkStyled = styled(Link)(() => ({
//     height: customizer.TopbarHeight,
//     width: customizer.isCollapse ? "300px" : "300px",
//     //overflow: "hidden",
//     //display: "block",
//     // margin: "auto",
//     // justifyContent: "center",
//     // alignItems: "center", 
    
//   }));
  

//   if (customizer.activeDir === "ltr") {
//     return (
//       <LinkStyled href="/dashboard">
//         {customizer.activeMode === "dark" ? (
//           <Image
//             src="https://ums.lpu.in/lpuums/assets/login/img/logos/ums_logo1.svg"              //Logo Required 04-12-2024
//             alt="logo"
//             height={400}
//             width={175}
//             priority
//           />
//         ) : (
//           <Image
//            src="https://ums.lpu.in/lpuums/assets/login/img/logos/ums_logo1.svg"
//             alt="logo"
//             height={customizer.TopbarHeight}
//             width={175}
//             priority
//           />
//         )}
//       </LinkStyled>
//     );
//   }

//   return (
//     <LinkStyled href="/">
//       {customizer.activeMode === "dark" ? (
//         <Image
//           src="https://ums.lpu.in/lpuums/assets/login/img/logos/ums_logo1.svg"         //Logo Required 04-12-2024
//           alt="logo"
//           height={customizer.TopbarHeight}
//           width={175}
//           priority
//         />
//       ) : (
//         <Image
//           src="https://ums.lpu.in/lpuums/assets/login/img/logos/ums_logo1.svg"          //Logo Required 04-12-2024
//           alt="logo"
//           height={customizer.TopbarHeight}
//           width={175}
//           priority
//         />
//       )}
//     </LinkStyled>
//   );
// }

// import { useSelector } from "@/store/hooks";
// import Link from "next/link";
// import { styled } from '@mui/material/styles';
// import { AppState } from "@/store/store";
// import Image from "next/image";

// export default function Logo() {
//   const customizer = useSelector((state: AppState) => state.customizer);
//   const LinkStyled = styled(Link)(() => ({
//     height: customizer.TopbarHeight,
//     width: customizer.isCollapse ? "40px" : "180px",
//     overflow: "hidden",
//     display: "block",
  
//   }));
  // const LinkStyled = styled(Link)(() => ({
  //   height: customizer.TopbarHeight,
  //   width: customizer.isCollapse ? "40px" : "300px",
  //   overflow: "hidden",
  //   display: "block",
  //   margin: "auto",
  //   justifyContent: "center",
  //   alignItems: "center", 
    
  // }));
  

//   if (customizer.activeDir === "ltr") {
//     return (
//       <LinkStyled href="/">
//         {customizer.activeMode === "dark" ? (
//           <Image
//             src="/images/backgrounds/ums_logo1.png"              //Logo Required 04-12-2024
//             alt="logo"
//             height={400}
//             width={175} //275
//             priority
//           />
//         ) : (
//           <Image
//            src="/images/backgrounds/ums_logo0.png"
//             alt="logo"
//             height={customizer.TopbarHeight}
//             width={175} //245
//             priority
//           />
//         )}
//       </LinkStyled>
//     );
//   }

//   return (
//     <LinkStyled href="/">
//       {customizer.activeMode === "dark" ? (
//         <Image
//           src="/images/backgrounds/ums_logo1.png"         //Logo Required 04-12-2024
//           alt="logo"
//           height={customizer.TopbarHeight}
//           width={175}
//           priority
//         />
//       ) : (
//         <Image
//           src="/images/backgrounds/ums_logo0.png"          //Logo Required 04-12-2024
//           alt="logo"
//           height={customizer.TopbarHeight}
//           width={175}
//           priority
//         />
//       )}
//     </LinkStyled>
//   );
// }
// /logo/lpuums-logo.svg


import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from '@mui/material/styles';
import { AppState } from "@/store/store";
import Image from "next/image";
import { Box } from "@mui/material";

export default function Logo() {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,

    width: customizer.isCollapse && !customizer.isSidebarHover ? "40px" : "180px",
    overflow: "hidden",
    display: "block",


  }));



  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/dashboard">
        {customizer.activeMode === "dark" ? (

          <Image
            src="/images/backgrounds/ums_logo1.png"
            alt="logo"

            height={customizer.TopbarHeight}
            width={175}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 55px) 100vw, 55px"
          />
        ) : (
          <Image
            src="/images/backgrounds/ums_logo0.png"
            alt="logo"
            height={customizer.TopbarHeight}
            width={175}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 55px) 100vw, 55px"
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/dashboard">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/backgrounds/ums_logo1.png"             //Logo Required 04-12-2024
          alt="logo"
          height={customizer.TopbarHeight}
          width={175}
          priority
        />
      ) : (
        <Image
          src="/images/backgrounds/ums_logo0.png"        //Logo Required 04-12-2024
          alt="logo"
          height={customizer.TopbarHeight}
          width={175}
          priority
        />
      )}
    </LinkStyled>
  );
}

