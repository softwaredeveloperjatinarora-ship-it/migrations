// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { Snackbar, Alert } from '@mui/material'; // Import Snackbar and Alert components

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";
// const REGISTER_URL = "http://172.18.12.25/Socket/pool/SalesTeam/add";

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string, type: 'private' | 'broadcast' }[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [userId] = useState("John123");
//   const socketRef = useRef<WebSocket | null>(null);
//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);

//   // Snackbar state
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');

//   const handleCloseAlert = () => {
//     setOpenAlert(false);
//   };

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//     };
//   }, []);

//   const handleVisibilityChange = () => {
//     if (!document.hidden) {
//       resetTitle();
//     }
//   };

//   const getCurrentTime = () => {
//     return new Date().toLocaleTimeString();
//   };

//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body,
//         icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount(prev => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages(prev => [...prev, { text, type }]);
//   };

//   const connectWebSocket = () => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setAlertMessage('Connected to WebSocket');
//       setAlertSeverity('success');
//       setOpenAlert(true);
//       setIsConnected(true);

//       socket.send(JSON.stringify({ type: 'user', userId, message: `Hello from ${userId}!` }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);

//         if (message.type === "user" && message.userId === userId) {
//           addMessage(message.message, "private");
//         } else if (message.type === "broadcast") {
//           addMessage(message.message, "broadcast");
//         }

//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification("New Message", message.message);

//       } catch (error) {
//         console.error("Error parsing message:", error);
//         setAlertMessage("Error parsing WebSocket message");
//         setAlertSeverity('error');
//         setOpenAlert(true);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setAlertMessage("WebSocket error occurred");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     };

//     socket.onclose = () => {
//       setAlertMessage("Disconnected. Reconnecting...");
//       setAlertSeverity('warning');
//       setOpenAlert(true);
//       setIsConnected(false);

//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error("Failed to register user:", error);
//       setAlertMessage("Failed to register user");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     }
//   };

//   return (
//     <div className="p-6 font-sans">
//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: "100%" }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       <div className="text-2xl mb-4 font-bold">Real-Time Messages</div>

//       <div className="flex items-center mb-4 text-lg">
//         <div
//           className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
//         />
//         {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//       </div>

//       <div className="border rounded-lg p-4 h-[400px] overflow-y-auto bg-gray-100" id="messages">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-3 p-2 rounded-md max-w-[70%] ${msg.type === 'private' ? 'bg-green-100 ml-auto text-right' : 'bg-blue-100'}`}
//           >
//             <div>{msg.text}</div>
//             <div className="text-xs text-gray-500 mt-1">{getCurrentTime()}</div>
//           </div>
//         ))}
//       </div>

//       <audio ref={notificationSoundRef} src="https://notificationsounds.com/notification-sounds-pristine/download/mp3" preload="auto" />
//     </div>
//   );
// };

// export default HomePage;











// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import {
//   Snackbar,
//   Alert,
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Stack,
//   IconButton,
// } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import { Icon } from '@iconify/react';
// import Fab from '@mui/material/Fab';
// import Tooltip from '@mui/material/Tooltip';

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";
// const REGISTER_URL = "http://172.18.12.25/Socket/pool/SalesTeam/add";

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string, type: 'private' | 'broadcast' }[]>([]);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [userId] = useState("John123");

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const handleCloseAlert = () => setOpenAlert(false);

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Block scrolling on the body when messages are open
//     if (isMessagesOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//     };
//   }, [isMessagesOpen]); // Re-run on isMessagesOpen change

//   const handleVisibilityChange = () => {
//     if (!document.hidden) resetTitle();
//   };

//   const getCurrentTime = () => new Date().toLocaleTimeString();

//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body,
//         icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount(prev => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages(prev => [...prev, { text, type }]);
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setAlertMessage('New Message');
//       setAlertSeverity('success');
//       setOpenAlert(true);
//       setIsConnected(true);
//       socket.send(JSON.stringify({ type: 'user', userId, message: `Hello from ${userId}!` }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);
//         if (message.type === "user" && message.userId === userId) {
//           addMessage(message.message, "private");
//         } else if (message.type === "broadcast") {
//           addMessage(message.message, "broadcast");
//         }
//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification("New Message", message.message);
//       } catch (error) {
//         console.error("Error parsing message:", error);
//         setAlertMessage("Error parsing WebSocket message");
//         setAlertSeverity('error');
//         setOpenAlert(true);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setAlertMessage("WebSocket error occurred");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     };

//     socket.onclose = () => {
//       setAlertMessage("Disconnected. Reconnecting...");
//       setAlertSeverity('warning');
//       setOpenAlert(true);
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error("Failed to register user:", error);
//       setAlertMessage("Failed to register user");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     }
//   };

//   return (
//     <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
//       {/* Background Overlay */}
//       {isMessagesOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Header is hidden when messages are open */}
//       {/* <Box
//         sx={{
//           display: isMessagesOpen ? 'none' : 'block',
//           zIndex: 1, // Ensure the header is below the overlay when visible
//         }}
//       >
//         <Typography variant="h4">Header Content</Typography>
//       </Box> */}

//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       {/* Icon Button to open the message container */}
//       <Tooltip title="messages">
//       <Fab
//           color="primary"
//           aria-label="Messages"
//           sx={{ position: "fixed",right: "83px", bottom: "15px", }}
//           onClick={() => setIsMessagesOpen(prev => !prev)} 
//         >

//       <Icon
//         icon="tabler:message-filled"
//         width="25"
//         height="25"
//         // Toggle message container visibility
//         style={{ position: "fixed", right: "98px", bottom: "30px", zIndex: 1000 }}
//         >
//         <ExpandMoreIcon />
//       </Icon>
//           </Fab>
//         </Tooltip>

//       {/* Only show messages when 'isMessagesOpen' is true */}
//       {isMessagesOpen && (
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             width: { lg: '30%' },
//             height: 300,
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'fixed',
//             right: '100px', // Match the IconButton's position
//             bottom: '75px', // Position above the icon
//             zIndex: 1000, // Ensure the message container is above the overlay
//             transition: 'all 0.3s ease', // Smooth transition for showing/hiding
//           }}
//         >
//           {/* Header: Stays fixed at top */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="h6" gutterBottom>
//               Real-Time Messages
//             </Typography>

//             <Box display="flex" alignItems="center" mb={1}>
//               <CircleIcon fontSize="small" sx={{ color: isConnected ? 'green' : 'red', mr: 1 }} />
//               <Typography variant="body2">
//                 {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//               </Typography>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Scrollable message area */}
//           <Box sx={{ flex: 1, overflow: 'auto' }}>
//             <Scrollbar sx={{ height: '100%' }}>
//               <Stack spacing={1}>
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
//                   >
//                     <Paper
//                       elevation={3}
//                       sx={{
//                         mb: 1,
//                         p: 1.5,
//                         maxWidth: '70%',
//                         bgcolor: "primary.light",
//                       }}
//                     >
//                       <Typography>{msg.text}</Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                         textAlign="right"
//                         mt={1}
//                       >
//                         {getCurrentTime()}
//                       </Typography>
//                     </Paper>
//                   </Box>
//                 ))}
//               </Stack>
//             </Scrollbar>
//           </Box>
//         </Paper>
//       )}

//       <audio
//         ref={notificationSoundRef}
//         src="https://notificationsounds.com/notification-sounds-pristine/download/mp3"
//         preload="auto"
//       />
//     </Box>
//   );
// };

// export default HomePage;









// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import {
//   Snackbar,
//   Alert,
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Stack,
//   IconButton,
//   TextField,
//   Button,
//   Fab,
//   Tooltip,
// } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import { Icon } from '@iconify/react';
// import { IconX } from '@tabler/icons-react';

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";
// const REGISTER_URL = "http://172.18.12.25/Socket/pool/SalesTeam/add";

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string, type: 'private' | 'broadcast' }[]>([]);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [messageText, setMessageText] = useState('');
//   const [userId] = useState("John123");

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const handleCloseAlert = () => setOpenAlert(false);

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Block scrolling on the body when messages are open
//     document.body.style.overflow = isMessagesOpen ? 'hidden' : 'auto';

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//       document.body.style.overflow = 'auto';
//     };
//   }, [isMessagesOpen]);

//   const handleVisibilityChange = () => {
//     if (!document.hidden) resetTitle();
//   };

//   const getCurrentTime = () => new Date().toLocaleTimeString();

//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body,
//         icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount(prev => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages(prev => [...prev, { text, type }]);
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

//     const payload = {
//       type: 'user',
//       userId,
//       message: messageText.trim(),
//     };

//     socketRef.current.send(JSON.stringify(payload));
//     addMessage(messageText.trim(), 'private');
//     setMessageText('');
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setAlertMessage('Connected to WebSocket');
//       setAlertSeverity('success');
//       setOpenAlert(true);
//       setIsConnected(true);
//       socket.send(JSON.stringify({ type: 'user', userId, message: `Hello from ${userId}!` }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);
//         if (message.type === "user" && message.userId === userId) {
//           addMessage(message.message, "private");
//         } else if (message.type === "broadcast") {
//           addMessage(message.message, "broadcast");
//         }
//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification("New Message", message.message);
//       } catch (error) {
//         console.error("Error parsing message:", error);
//         setAlertMessage("Error parsing WebSocket message");
//         setAlertSeverity('error');
//         setOpenAlert(true);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setAlertMessage("WebSocket error occurred");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     };

//     socket.onclose = () => {
//       setAlertMessage("Disconnected. Reconnecting...");
//       setAlertSeverity('warning');
//       setOpenAlert(true);
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error("Failed to register user:", error);
//       setAlertMessage("Failed to register user");
//       setAlertSeverity('error');
//       setOpenAlert(true);
//     }
//   };

//   const handleCloseMessages = () => {
//     setIsMessagesOpen(false);
//   };

//   return (
//     <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
//       {/* Background Overlay */}
//       {isMessagesOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 999,
//           }}
//         />
//       )}

//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       {/* Toggle Button */}
//       <Tooltip title="Messages">
//         <Fab
//           color="primary"
//           aria-label="Messages"
//           sx={{ position: "fixed",  right: "25px", bottom: "74px", zIndex: 1100 }}
//           onClick={() => setIsMessagesOpen(prev => !prev)}
//         >
//           <Icon icon="tabler:message-filled" width="25" height="25" />
//         </Fab>
//       </Tooltip>

//       {/* Messages Panel */}
//       {isMessagesOpen && (
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             width: { lg: '30%' },
//             height: 400,
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'fixed',
//             right: '88px',
//             bottom: '95px',
//             zIndex: 1000,
//             bgcolor: 'background.paper',
//             transition: 'opacity 0.4s ease, transform 0.4s ease',
//             animation: 'fadeInUp 0.4s ease',
//             '@keyframes fadeInUp': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="h6" gutterBottom>
//               Real-Time Messages
//               <Box display="flex" alignItems="center" mb={1}>
//                 <CircleIcon sx={{ fontSize: "12px", color: isConnected ? 'green' : 'red', mr: 0.5 }} />
//                 <Typography variant="body2">
//                   {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//                 </Typography>
//               </Box>
//             </Typography>

//             <IconButton size="small" onClick={handleCloseMessages}>
//               <IconX size={24} />
//             </IconButton>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Scrollable Messages */}
//           <Box sx={{ flex: 1, overflow: 'auto' }}>
//             <Scrollbar sx={{ height: '100%' }}>
//               <Stack spacing={1}>
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
//                   >
//                     <Paper
//                       elevation={3}
//                       sx={{
//                         mb: 1,
//                         p: 1.5,
//                         maxWidth: '70%',
//                         bgcolor: "primary.light",
//                       }}
//                     >
//                       <Typography>{msg.text}</Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                         textAlign="right"
//                         mt={1}
//                       >
//                         {getCurrentTime()}
//                       </Typography>
//                     </Paper>
//                   </Box>
//                 ))}
//               </Stack>
//             </Scrollbar>
//           </Box>

//           {/* Input Field and Send Button */}
//           <Divider sx={{ mt: 1 }} />
//           <Box sx={{ display: 'flex', mt: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message"
//               variant="outlined"
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <Button
//               onClick={handleSendMessage}
//               variant="contained"
//               sx={{ ml: 1 }}
//               disabled={!messageText.trim()}
//             >
//               <Icon icon="iconoir:send" width="20" height="20" />
//             </Button>
//           </Box>
//         </Paper>
//       )}

//       <audio
//         ref={notificationSoundRef}
//         src="https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
//         preload="auto"
//       />
//     </Box>
//   );
// };

// export default HomePage;













// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import {
//   Snackbar,
//   Alert,
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Stack,
//   IconButton,
//   TextField,
//   Button,
//   Fab,
//   Tooltip,
// } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import { Icon } from '@iconify/react';
// import { IconX } from '@tabler/icons-react';
// import Chip from "@mui/material/Chip";

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";
// const REGISTER_URL = "http://172.18.12.25/Socket/pool/SalesTeam/add";

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string, type: 'private' | 'broadcast' }[]>([]);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [messageText, setMessageText] = useState('');
//   const [userId] = useState("John123");

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const handleCloseAlert = () => setOpenAlert(false);

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Block scrolling on the body when messages are open
//     document.body.style.overflow = isMessagesOpen ? 'hidden' : 'auto';

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//       document.body.style.overflow = 'auto';
//     };
//   }, [isMessagesOpen]);

//   const handleVisibilityChange = () => {
//     if (!document.hidden) resetTitle();
//   };

//   const getCurrentTime = () => new Date().toLocaleTimeString();

//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body,
//         icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount(prev => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages(prev => [...prev, { text, type }]);
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

//     const payload = {
//       type: 'user',
//       userId,
//       message: messageText.trim(),
//     };

//     socketRef.current.send(JSON.stringify(payload));
//     addMessage(messageText.trim(), 'private');
//     setMessageText('');
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setIsConnected(true);
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);
//         if (message.type === "user" && message.userId === userId) {
//           addMessage(message.message, "private");
//         } else if (message.type === "broadcast") {
//           addMessage(message.message, "broadcast");
//         }
//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification("New Message", message.message);
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setIsConnected(false);
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error("Failed to register user:", error);
//     }
//   };

//   const handleCloseMessages = () => {
//     setIsMessagesOpen(false);
//   };

//   return (
//     <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
//       {/* Background Overlay */}
//       {isMessagesOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 999,
//           }}
//         />
//       )}

//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       {/* Toggle Button */}
//       <Tooltip title="Messages">
//         <Fab
//           color="primary"
//           aria-label="Messages"
//           sx={{ position: "fixed", right: "25px", bottom: "78px", zIndex: 1100 }}
//           onClick={() => setIsMessagesOpen(prev => !prev)}
//         >
//           <Icon icon="tabler:message-filled" width="25" height="25" />
//         </Fab>
//       </Tooltip>
//           {/* <Chip label={`10`} color="primary" size="small" /> */}

//       {/* Messages Panel */}
//       {isMessagesOpen && (
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             width: { lg: '30%' },
//             height: 400,
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'fixed',
//             right: '88px',
//             bottom: '95px',
//             zIndex: 1000,
//             bgcolor: 'background.paper',
//             transition: 'opacity 0.4s ease, transform 0.4s ease',
//             animation: 'fadeInUp 0.4s ease',
//             '@keyframes fadeInUp': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="h6" gutterBottom>
//               Real-Time Messages
//               <Box display="flex" alignItems="center" mb={1}>
//                 <CircleIcon sx={{ fontSize: "12px", color: isConnected ? 'green' : 'red', mr: 0.5 }} />
//                 <Typography variant="body2">
//                   {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//                 </Typography>
//               </Box>
//             </Typography>

//             <IconButton size="small" onClick={handleCloseMessages}>
//               <IconX size={24} />
//             </IconButton>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Scrollable Messages */}
//           <Box sx={{ flex: 1, overflow: 'auto' }}>
//             <Scrollbar sx={{ height: '100%' }}>
//               <Stack spacing={1}>
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
//                   >
//                     <Paper
//                       elevation={3}
//                       sx={{
//                         mb: 1,
//                         p: 1.5,
//                         maxWidth: '70%',
//                         bgcolor: "primary.light",
//                       }}
//                     >
//                       <Typography>{msg.text}</Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                         textAlign="right"
//                         mt={1}
//                       >
//                         {getCurrentTime()}
//                       </Typography>
//                     </Paper>
//                   </Box>
//                 ))}
//               </Stack>
//             </Scrollbar>
//           </Box>

//           {/* Input Field and Send Button */}
//           <Divider sx={{ mt: 1 }} />
//           <Box sx={{ display: 'flex', mt: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message"
//               variant="outlined"
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <Button
//               onClick={handleSendMessage}
//               variant="contained"
//               sx={{ ml: 1 }}
//               disabled={!messageText.trim()}
//             >
//               <Icon icon="iconoir:send" width="20" height="20" />
//             </Button>
//           </Box>
//         </Paper>
//       )}

//       <audio
//         ref={notificationSoundRef}
//         src="https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
//         preload="auto"
//       />
//     </Box>
//   );
// };

// export default HomePage;






















// import { useEffect, useRef, useState } from 'react';
// import {
//   Snackbar,
//   Alert,
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Stack,
//   IconButton,
//   TextField,
//   Button,
//   Fab,
//   Tooltip,
// } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import { Icon } from '@iconify/react';
// import { IconX } from '@tabler/icons-react';
// import Chip from "@mui/material/Chip";

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";
// const REGISTER_URL = "http://172.18.12.25/Socket/pool/SalesTeam/add";

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string, type: 'private' | 'broadcast' }[]>([]);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [messageText, setMessageText] = useState('');
//   const [userId] = useState("John123");

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const handleCloseAlert = () => setOpenAlert(false);

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Do not change the overflow on the body anymore
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//     };
//   }, [isMessagesOpen]);

//   const handleVisibilityChange = () => {
//     if (!document.hidden) resetTitle();
//   };

//   // const getCurrentTime = () => new Date().toLocaleTimeString();
//   const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === "granted") {
//       const notification = new Notification(title, {
//         body,
//         icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== "granted" && Notification.permission !== "denied") {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount(prev => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages(prev => [...prev, { text, type }]);
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

//     const payload = {
//       type: 'user',
//       userId,
//       message: messageText.trim(),
//     };

//     socketRef.current.send(JSON.stringify(payload));
//     addMessage(messageText.trim(), 'private');
//     setMessageText('');
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setIsConnected(true);
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);
//         if (message.type === "user" && message.userId === userId) {
//           addMessage(message.message, "private");
//         } else if (message.type === "broadcast") {
//           addMessage(message.message, "broadcast");
//         }
//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification("New Message", message.message);
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setIsConnected(false);
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error("Failed to register user:", error);
//     }
//   };

//   const handleCloseMessages = () => {
//     setIsMessagesOpen(false);
//   };

//   return (
//     <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
//       {/* Background Overlay */}
//       {isMessagesOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 999,
//           }}
//         />
//       )}

//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       {/* Toggle Button */}
//       <Tooltip title="Messages">
//         <Fab
//           color="primary"
//           aria-label="Messages"
//           sx={{ position: "fixed", right: "25px", bottom: "78px", zIndex: 1100 }}
//           onClick={() => setIsMessagesOpen(prev => !prev)}
//         >
//           <Icon icon="tabler:message-filled" width="25" height="25" />
//         </Fab>
//       </Tooltip>

//       {/* Messages Panel */}
//       {isMessagesOpen && (
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             width: { lg: '30%' },
//             height: 400,
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'fixed',
//             right: '88px',
//             bottom: '95px',
//             zIndex: 1000,
//             bgcolor: 'background.paper',
//             transition: 'opacity 0.4s ease, transform 0.4s ease',
//             animation: 'fadeInUp 0.4s ease',
//             '@keyframes fadeInUp': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="h6" gutterBottom>
//               Real-Time Messages
//               <Box display="flex" alignItems="center" mb={1}>
//                 <CircleIcon sx={{ fontSize: "12px", color: isConnected ? 'green' : 'red', mr: 0.5 }} />
//                 <Typography variant="body2">
//                   {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//                 </Typography>
//               </Box>
//             </Typography>

//             <IconButton size="small" onClick={handleCloseMessages}>
//               <IconX size={24} />
//             </IconButton>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Scrollable Messages */}
//           <Box sx={{ flex: 1, overflow: 'auto' }}>
//             <Scrollbar sx={{ height: '100%' }}>
//               <Stack spacing={1}>
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
//                   >
//                     <Paper
//                       elevation={3}
//                       sx={{
//                         mb: 1,
//                         p: 1.5,
//                         maxWidth: '70%',
//                         bgcolor: "primary.light",
//                       }}
//                     >
//                       <Typography>{msg.text}</Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                         textAlign="right"
//                         mt={1}
//                       >
//                         {getCurrentTime()}
//                       </Typography>
//                     </Paper>
//                   </Box>
//                 ))}
//               </Stack>
//             </Scrollbar>
//           </Box>

//           {/* Input Field and Send Button */}
//           <Divider sx={{ mt: 1 }} />
//           <Box sx={{ display: 'flex', mt: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message"
//               variant="outlined"
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <Button
//               onClick={handleSendMessage}
//               variant="contained"
//               sx={{ ml: 1 }}
//               disabled={!messageText.trim()}
//             >
//               <Icon icon="iconoir:send" width="20" height="20" />
//             </Button>
//           </Box>
//         </Paper>
//       )}

//       <audio
//         ref={notificationSoundRef}
//         src="https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
//         preload="auto"
//       />
//     </Box>
//   );
// };

// export default HomePage;
















// import { useEffect, useRef, useState } from 'react';
// import {
//   Snackbar,
//   Alert,
//   Typography,
//   Box,
//   Paper,
//   Divider,
//   Stack,
//   IconButton,
//   TextField,
//   Button,
//   Fab,
//   Tooltip,
// } from '@mui/material';
// import CircleIcon from '@mui/icons-material/Circle';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import { Icon } from '@iconify/react';
// import { IconX } from '@tabler/icons-react';
// import Chip from '@mui/material/Chip';

// const WS_URL = 'ws://172.18.12.25/Socket/pool/SalesTeam/ws';
// const REGISTER_URL = 'http://172.18.12.25/Socket/pool/SalesTeam/add';

// const HomePage = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<{ text: string; type: 'private' | 'broadcast' }[]>([]);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [messageText, setMessageText] = useState('');
//   const [userId] = useState('John123');

//   const notificationSoundRef = useRef<HTMLAudioElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

//   const handleCloseAlert = () => setOpenAlert(false);

//   useEffect(() => {
//     askNotificationPermission();
//     registerUser();
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     // Clean up
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       socketRef.current?.close();
//     };
//   }, [isMessagesOpen]);

//   const handleVisibilityChange = () => {
//     if (!document.hidden) resetTitle();
//   };

//   const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const showDesktopNotification = (title: string, body: string) => {
//     if (Notification.permission === 'granted') {
//       const notification = new Notification(title, {
//         body,
//         icon: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
//       });
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   };

//   const askNotificationPermission = () => {
//     if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
//       Notification.requestPermission();
//     }
//   };

//   const playNotificationSound = () => {
//     const sound = notificationSoundRef.current;
//     if (sound) {
//       sound.currentTime = 0;
//       sound.play().catch(console.warn);
//     }
//   };

//   const updateTitleUnread = () => {
//     if (document.hidden) {
//       setUnreadCount((prev) => {
//         document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
//         return prev + 1;
//       });
//     }
//   };

//   const resetTitle = () => {
//     setUnreadCount(0);
//     document.title = originalTitle.current;
//   };

//   const addMessage = (text: string, type: 'private' | 'broadcast') => {
//     setMessages((prev) => [...prev, { text, type }]);
//   };

//   const handleSendMessage = () => {
//     if (!messageText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

//     const payload = {
//       type: 'user',
//       userId,
//       message: messageText.trim(),
//     };

//     socketRef.current.send(JSON.stringify(payload));
//     addMessage(messageText.trim(), 'private');
//     setMessageText('');
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setIsConnected(true);
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);

//         // Check for the first server message
//         if (message.type === 'server' && message.userId !== userId) {
//           // First message from server (e.g., welcome message)
//           addMessage(message.message, 'broadcast');
//         } else if (message.type === 'user' && message.userId === userId) {
//           // Regular user messages
//           addMessage(message.message, 'private');
//         } else if (message.type === 'broadcast') {
//           // Other broadcast messages
//           addMessage(message.message, 'broadcast');
//         }

//         playNotificationSound();
//         updateTitleUnread();
//         showDesktopNotification('New Message', message.message);
//       } catch (error) {
//         console.error('Error parsing message:', error);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setIsConnected(false);
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000);
//     };
//   };

//   const registerUser = async () => {
//     try {
//       await fetch(`${REGISTER_URL}/${userId}`, {
//         method: 'POST',
//         body: `Hello ${userId}!`,
//         headers: { 'Content-Type': 'text/plain' },
//       });
//       connectWebSocket();
//     } catch (error) {
//       console.error('Failed to register user:', error);
//     }
//   };

//   const handleCloseMessages = () => {
//     setIsMessagesOpen(false);
//   };

//   return (
//     <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
//       {/* Background Overlay */}
//       {isMessagesOpen && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 999,
//           }}
//         />
//       )}

//       <Snackbar
//         open={openAlert}
//         autoHideDuration={3000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>

//       {/* Toggle Button */}
//       <Tooltip title="Messages">
//         <Fab
//           color="primary"
//           aria-label="Messages"
//           sx={{ position: 'fixed', right: '25px', bottom: '78px', zIndex: 1100 }}
//           onClick={() => setIsMessagesOpen((prev) => !prev)}
//         >
//           <Icon icon="tabler:message-filled" width="25" height="25" />
//         </Fab>
//       </Tooltip>

//       {/* Messages Panel */}
//       {isMessagesOpen && (
//         <Paper
//           variant="outlined"
//           sx={{
//             p: 2,
//             width: { lg: '30%' },
//             height: 400,
//             display: 'flex',
//             flexDirection: 'column',
//             position: 'fixed',
//             right: '88px',
//             bottom: '95px',
//             zIndex: 1000,
//             bgcolor: 'background.paper',
//             transition: 'opacity 0.4s ease, transform 0.4s ease',
//             animation: 'fadeInUp 0.4s ease',
//             '@keyframes fadeInUp': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="h6" gutterBottom>
//               Real-Time Messages
//               <Box display="flex" alignItems="center" mb={1}>
//                 <CircleIcon sx={{ fontSize: '12px', color: isConnected ? 'green' : 'red', mr: 0.5 }} />
//                 <Typography variant="body2">
//                   {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//                 </Typography>
//               </Box>
//             </Typography>

//             <IconButton size="small" onClick={handleCloseMessages}>
//               <IconX size={24} />
//             </IconButton>
//           </Box>

//           <Divider sx={{ mb: 1 }} />

//           {/* Scrollable Messages */}
//           <Box sx={{ flex: 1, overflow: 'auto' }}>
//             <Scrollbar sx={{ height: '100%' }}>
//               <Stack spacing={1}>
//                 {messages.map((msg, index) => (
//                   <Box
//                     key={index}
//                     display="flex"
//                     justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
//                   >
//                     <Paper
//                       elevation={3}
//                       sx={{
//                         mb: 1,
//                         p: 1.5,
//                         maxWidth: '70%',
//                         bgcolor: 'primary.light',
//                       }}
//                     >
//                       <Typography>{msg.text}</Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         display="block"
//                         textAlign="right"
//                         mt={1}
//                       >
//                         {getCurrentTime()}
//                       </Typography>
//                     </Paper>
//                   </Box>
//                 ))}
//               </Stack>
//             </Scrollbar>
//           </Box>

//           {/* Input Field and Send Button */}
//           <Divider sx={{ mt: 1 }} />
//           <Box sx={{ display: 'flex', mt: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message"
//               variant="outlined"
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <Button
//               onClick={handleSendMessage}
//               variant="contained"
//               sx={{ ml: 1 }}
//               disabled={!messageText.trim()}
//             >
//               <Icon icon="iconoir:send" width="20" height="20" />
//             </Button>
//           </Box>
//         </Paper>
//       )}

//       <audio
//         ref={notificationSoundRef}
//         src="https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
//         preload="auto"
//       />
//     </Box>
//   );
// };

// export default HomePage;










import { useEffect, useRef, useState } from 'react';
import {
  Snackbar,
  Alert,
  Typography,
  Box,
  Paper,
  Divider,
  Stack,
  IconButton,
  TextField,
  Button,
  Fab,
  Tooltip,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
import { Icon } from '@iconify/react';
import { IconX } from '@tabler/icons-react';
import Chip from '@mui/material/Chip';
import { ProfileState } from '@/store/store';
import { useSelector } from 'react-redux';

const WS_URL = 'ws://172.18.12.25/Socket/pool/SalesTeam/ws';
const REGISTER_URL = 'http://172.18.12.25/Socket/pool/SalesTeam/add';

const Chatmessenger = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ text: string; type: 'private' | 'broadcast' }[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageText, setMessageText] = useState('');
   const profilee = useSelector((state: ProfileState) => state.profile) as { profileData: { registerationNumber: number }[] };
  // const [userId] = useState('John123');
  const [userId] = useState(profilee.profileData[0]?.registerationNumber);

  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const originalTitle = useRef<string>(typeof document !== 'undefined' ? document.title : '');

  const handleCloseAlert = () => setOpenAlert(false);

  useEffect(() => {
    askNotificationPermission();
    registerUser();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Block scrolling when messages panel is open
    if (isMessagesOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      document.body.style.overflow = ''; // Restore scroll
    }

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      socketRef.current?.close();
      document.body.style.overflow = ''; // Ensure scroll is always restored
    };
  }, [isMessagesOpen]);

  const handleVisibilityChange = () => {
    if (!document.hidden) resetTitle();
  };

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const showDesktopNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const askNotificationPermission = () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const playNotificationSound = () => {
    const sound = notificationSoundRef.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.warn);
    }
  };

  const updateTitleUnread = () => {
    if (document.hidden) {
      setUnreadCount((prev) => {
        document.title = `(${prev + 1}) New Message - ${originalTitle.current}`;
        return prev + 1;
      });
    }
  };

  const resetTitle = () => {
    setUnreadCount(0);
    document.title = originalTitle.current;
  };

  const addMessage = (text: string, type: 'private' | 'broadcast') => {
    setMessages((prev) => [...prev, { text, type }]);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: 'user',
      userId,
      message: messageText.trim(),
    };

    socketRef.current.send(JSON.stringify(payload));
    addMessage(messageText.trim(), 'private');
    setMessageText('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Check for the first server message
        if (message.type === 'server' && message.userId !== userId) {
          // First message from server (e.g., welcome message)
          addMessage(message.message, 'broadcast');
        } else if (message.type === 'user' && message.userId === userId) {
          // Regular user messages
          addMessage(message.message, 'private');
        } else if (message.type === 'broadcast') {
          // Other broadcast messages
          addMessage(message.message, 'broadcast');
        }

        playNotificationSound();
        updateTitleUnread();
        showDesktopNotification('New Message', message.message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 5000);
    };
  };

  const registerUser = async () => {
    try {
      await fetch(`${REGISTER_URL}/${userId}`, {
        method: 'POST',
        body: `Hello ${userId}!`,
        headers: { 'Content-Type': 'text/plain' },
      });
      connectWebSocket();
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  };

  const handleCloseMessages = () => {
    setIsMessagesOpen(false);
  };

  return (
    <Box sx={{ p: 4, fontFamily: 'Roboto, sans-serif' }}>
      {/* Background Overlay */}
      {isMessagesOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Toggle Button */}
      <Tooltip title="Messages">
        <Fab
          color="primary"
          aria-label="Messages"
          sx={{ position: 'fixed', right: '25px', bottom: '78px', zIndex: 1100 }}
          onClick={() => setIsMessagesOpen((prev) => !prev)}
        >
          <Icon icon="tabler:message-filled" width="25" height="25" />
        </Fab>
      </Tooltip>

      {/* Messages Panel */}
      {isMessagesOpen && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            width: { lg: '30%' },
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            right: '88px',
            bottom: '95px',
            zIndex: 1000,
            bgcolor: 'background.paper',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            animation: 'fadeInUp 0.4s ease',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              Real-Time Messages
              <Box display="flex" alignItems="center" mb={1}>
                <CircleIcon sx={{ fontSize: '12px', color: isConnected ?'success.main' : "#FF4D4D", mr: 0.5 }} />
                <Typography variant="body2">
                  {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
                </Typography>
              </Box>
            </Typography>

            <IconButton size="small" onClick={handleCloseMessages}>
              <IconX size={24} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Scrollable Messages */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Scrollbar sx={{ height: '100%' }}>
              <Stack spacing={1}>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={msg.type === 'private' ? 'flex-end' : 'flex-start'}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        maxWidth: '70%',
                        bgcolor: 'primary.light',
                      }}
                    >
                      <Typography>{msg.text}</Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        textAlign="right"
                        mt={1}
                      >
                        {getCurrentTime()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            </Scrollbar>
          </Box>

          {/* Input Field and Send Button */}
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message"
              variant="outlined"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSendMessage}
              variant="contained"
              sx={{ ml: 1 }}
              disabled={!messageText.trim()}
            >
              <Icon icon="iconoir:send" width="20" height="20" />
            </Button>
          </Box>
        </Paper>
      )}

      <audio
        ref={notificationSoundRef}
        src="https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
        preload="auto"
      />
    </Box>
  );
};

export default Chatmessenger;
