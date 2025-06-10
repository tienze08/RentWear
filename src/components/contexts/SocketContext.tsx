// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import type { Socket as ClientSocket } from "socket.io-client";
// import { useAuth } from "./AuthContext";

// interface SocketContextType {
//   socket: ClientSocket | null;
//   isConnected: boolean;
// }

// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [socket, setSocket] = useState<ClientSocket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       // Initialize socket connection
//       const socketInstance = io("http://localhost:5000", {
//         auth: {
//           token: user.id, // You might want to use a proper token here
//         },
//       });

//       socketInstance.on("connect", () => {
//         console.log("Socket connected");
//         setIsConnected(true);
//       });

//       socketInstance.on("disconnect", () => {
//         console.log("Socket disconnected");
//         setIsConnected(false);
//       });

//       setSocket(socketInstance);

//       // Cleanup on unmount
//       return () => {
//         socketInstance.disconnect();
//       };
//     }
//   }, [user]);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (context === undefined) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };
