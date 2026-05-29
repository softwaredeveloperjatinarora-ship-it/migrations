// "use client";

// import React from "react";
// import { useSession } from "next-auth/react";

// const DutyLeaveEventRegistration = () => {
//   const { data: session, status } = useSession();
// console.log("Component Rendered");

//   if (status === "loading") {
//     return <p>Loading...</p>; // Optional loading state
//   }

//   return (
//     <>
//       {session?.user?.token ? (
//         <h1>Session found.  </h1>
//       ) : (
//         <h1>No session found</h1>
//       )}
//     </>
//   );
// };

// export default DutyLeaveEventRegistration;


"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const DutyLeaveEventRegistration = () => {
  const { data: session, status } = useSession();
  const [renderedOnce, setRenderedOnce] = useState(false);
    const [showUI, setShowUI] = useState(false);
  const [inputValue, setInputValue] = useState("");

    useEffect(() => {
    if (status === "authenticated") {
      setShowUI(true);
    } else {
      setShowUI(false);
    }
  }, [status]);

  const handleSubmit = () => {
    console.log("Input Value:", inputValue);
  };

  useEffect(() => {
    if (status === "authenticated" && !renderedOnce) {
      setRenderedOnce(true); // Mark as rendered once
    }
  }, [status, renderedOnce]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // If not authenticated, show login message
  if (status === "unauthenticated") {
    return <h1>No session found</h1>;
  }

  // Prevent re-rendering if already rendered once with session
  if (!renderedOnce) {
    return null; // Wait until session is set
  }

   if (!showUI) {
    return <h1>No session found</h1>;
  }
  
  return (
    <>
      <h1>Session found.</h1>
      <input
        type="text"
        placeholder="Enter something"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>
        Submit
      </button>
    </>
  );
};

export default DutyLeaveEventRegistration;
