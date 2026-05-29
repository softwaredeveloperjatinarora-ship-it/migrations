


// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Box from "@mui/material/Box";
// import { getsliderAction } from "../../../actions/homeAction/sliderimage/getsliderAction";
// import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
// import { useSession } from "next-auth/react";
// import DashboardCard from "../../shared/DashboardCard";
// import Link from "next/link";

// type SliderItem = {
//   title: string;
//   link: string;
//   imageName: string;
//   bGroundImage: string | null;
//   uri: string | null;
// };

// const DEFAULT_IMAGE = "/images/landingpage/t4.jpg";
// const DEFAULT_LINK = "#"; // You can set a default link or keep it as "#"

// const Slidershow = () => {
//   const { data: session } = useSession();
//   const [sliderdata, setSliderData] = useState<SliderItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const isDataFetched = useRef(false);
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const intervalRef = useRef<NodeJS.Timeout>(null);

//   useEffect(() => {
//     const fetchSliderData = async () => {
//       if (isDataFetched.current) return;

//       try {
//         setLoading(true);

//         const response = await getsliderAction();
//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");

//         if (response.status === "success") {
//           const apiData = response.ApiData;
//           const ApiDatadec = decryptDataforResponse(apiData, splitValue[1]);
//           const parsedData: SliderItem[] = JSON.parse(ApiDatadec);
//           setSliderData(parsedData);
//         } else {
//           setError(response.message);
//           // Set default image when API fails
//           setSliderData([{
//             title: "Default Image",
//             link: DEFAULT_LINK,
//             imageName: DEFAULT_IMAGE,
//             bGroundImage: null,
//             uri: null
//           }]);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//         // Set default image when error occurs
//         setSliderData([{
//           title: "Default Image",
//           link: DEFAULT_LINK,
//           imageName: DEFAULT_IMAGE,
//           bGroundImage: null,
//           uri: null
//         }]);
//       } finally {
//         setLoading(false);
//         isDataFetched.current = true;
//       }
//     };

//     fetchSliderData();
//   }, [session]);

//   // Auto slide effect (pauses on hover)
//   useEffect(() => {
//     if (sliderdata.length > 1 && !isHovered) {
//       intervalRef.current = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % sliderdata.length);
//       }, 5000);
//     } else if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [sliderdata.length, currentSlide, isHovered]);

//   const goToSlide = (index: number) => {
//     if (index < 0 || index >= sliderdata.length) return;
//     setCurrentSlide(index);
//     // Reset the auto-slide timer when user manually changes slide
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     if (sliderdata.length > 1 && !isHovered) {
//       intervalRef.current = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % sliderdata.length);
//       }, 5000);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   // Don't show error message since we're showing default image
//   // if (error) return <div>Error: {error}</div>;
//   // if (sliderdata.length === 0) return <div>No slides to display</div>;

//   return (
//     <DashboardCard>
//       <Box
//         sx={{
//           overflow: "hidden",
//           position: "relative",
//           width: "100%",
//           borderRadius: "8px",
//           height: { lg: "310px", md: "310px", sm: "100px", xs: "100px" },
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <Box
//           ref={sliderRef}
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             transition: "transform 0.5s ease",
//             width: `${sliderdata.length * 100}%`,
//             height: "100%",
//             transform: `translateX(-${currentSlide * (100 / sliderdata.length)}%)`,
//           }}
//         >
//           {sliderdata.map((item, index) => (
//             <Box
//               key={index}
//               sx={{
//                 flex: `0 0 ${100 / sliderdata.length}%`,
//                 width: "100%",
//                 height: "100%",
//                 position: "relative",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 overflow: "hidden",
//               }}
//             >
//               <Link
//                 href={item.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ display: "block", width: "100%", height: "100%" }}
//               >
//                 <Image
//                   src={item.imageName}
//                   alt={item.title}
//                   layout="responsive"
//                   objectFit="cover"
//                   width={680}
//                   height={400}
//                   priority={index === 0}
//                   onError={(e) => {
//                     // If the image fails to load, show the default image
//                     const target = e.target as HTMLImageElement;
//                     target.src = DEFAULT_IMAGE;
//                   }}
//                 />
//               </Link>
//             </Box>
//           ))}
//         </Box>

//         {/* Dots navigation - only shown when multiple images exist */}
//         {sliderdata.length > 1 && (
//           <Box
//             sx={{
//               position: "absolute",
//               top: "16px",
//               right: "16px",
//               display: "flex",
//               gap: "6px",
//               zIndex: 1,
//               padding: "4px 8px",
//               borderRadius: "12px",
//               backdropFilter: "blur(2px)",
//             }}
//           >
//             {sliderdata.map((_, index) => (
//               <Box
//                 key={index}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToSlide(index);
//                 }}
//                 sx={{
//                   width: "10px",
//                   height: "10px",
//                   borderRadius: "50%",
//                   backgroundColor: index === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     backgroundColor: "#ffffff",
//                     transform: "scale(1.2)",
//                   },
//                 }}
//               />
//             ))}
//           </Box>
//         )}
//       </Box>
//     </DashboardCard>
//   );
// };

// export default Slidershow;





"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { getsliderAction } from "../../../actions/homeAction/sliderimage/getsliderAction";
import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import DashboardCard from "../../shared/DashboardCard";
import Link from "next/link";
import { Card } from "@mui/material";

type SliderItem = {
  title: string;
  link: string;
  imageName: string;
  bGroundImage: string | null;
  uri: string | null;
};

const DEFAULT_IMAGE = "/images/landingpage/t4.jpg";
const DEFAULT_LINK = "#"; // You can set a default link or keep it as "#"

const Slidershow = () => {
  const { data: session } = useSession();
  const [sliderdata, setSliderData] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isDataFetched = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const fetchSliderData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);

        const response = await getsliderAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");

        if (response.status === "success") {
          const apiData = response.ApiData;
          const ApiDatadec = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData: SliderItem[] = JSON.parse(ApiDatadec);
          setSliderData(parsedData);
        } else {
          setError(response.message);
          // Set default image when API fails
          setSliderData([{
            title: "Default Image",
            link: DEFAULT_LINK,
            imageName: DEFAULT_IMAGE,
            bGroundImage: null,
            uri: null
          }]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        // Set default image when error occurs
        setSliderData([{
          title: "Default Image",
          link: DEFAULT_LINK,
          imageName: DEFAULT_IMAGE,
          bGroundImage: null,
          uri: null
        }]);
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchSliderData();
  }, [session]);

  // Auto slide effect (pauses on hover)
  useEffect(() => {
    if (sliderdata.length > 1 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderdata.length);
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sliderdata.length, currentSlide, isHovered]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= sliderdata.length) return;
    setCurrentSlide(index);
    // Reset the auto-slide timer when user manually changes slide
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (sliderdata.length > 1 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderdata.length);
      }, 5000);
    }
  };

  if (loading) return <div>Loading...</div>;
  // Don't show error message since we're showing default image
  // if (error) return <div>Error: {error}</div>;
  // if (sliderdata.length === 0) return <div>No slides to display</div>;

  return (
    <Card >
      <Box
        sx={{
          //  border:"1px solid black",
          overflow: "hidden",
          position: "relative",
          // width: "100%",
           width: {lg:"100%",xs:"310 px",sm:"100%",md:"100%"},
          //  margin:{lg:0,xs:"-20px 0px -15px px",sm:0,md:0},
          margin:{lg:0,xs:"-20px",md:0,sm:0},
          borderRadius: "8px",
          height: { lg: "305px", md: "310px", sm: "290px", },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          ref={sliderRef}
          sx={{
            
            display: "flex",
            flexDirection: "row",
            transition: "transform 0.5s ease",
            width: `${sliderdata.length * 100}%`,
            height: "100%",
            transform: `translateX(-${currentSlide * (100 / sliderdata.length)}%)`,
          }}
        >
          {sliderdata.map((item, index) => (
            <Box
              key={index}
              sx={{
                  
                flex: `0 0 ${100 / sliderdata.length}%`,
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", width: "100%", height: "100%" }}
              >
                <Image
                  src={item.imageName}
                  alt={item.title}
                  layout="responsive"
                  objectFit="cover"
                  width={680}
                  height={400}
                  priority={index === 0}
                  onError={(e) => {
                    // If the image fails to load, show the default image
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
              </Link>
            </Box>
          ))}
        </Box>

        {/* Dots navigation - only shown when multiple images exist */}
        {sliderdata.length > 1 && (
          <Box
            sx={{
            
              position: "absolute",
              top: {lg:"16px",xs:"5px"},
              right: {lg:"16px",xs:"5px"},
              display: "flex",
              gap: "6px",
              zIndex: 1,
              padding: "4px 8px",
              borderRadius: "12px",
              backdropFilter: "blur(2px)",
            }}
          >
            {sliderdata.map((_, index) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                sx={{
                  width: {lg:"10px",xs:"7px"},
                  height: {lg:"10px",xs:"7px"},
                  borderRadius: "50%",
                  backgroundColor: index === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    transform: "scale(1.2)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default Slidershow;