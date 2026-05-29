interface CustomUser extends User {
  username: string;
  email: string;
  token: string; // Add the token or other properties if needed
}
import { NextAuthOptions, User, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import routeApiConfig from "./routeConfig.json";

import https from "https";
import urls from "@/app/url";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const pathname = req?.body?.callbackUrl
          ? new URL(req.body.callbackUrl).pathname
          : "";

        // pick matching route config
        let routeConfig = routeApiConfig.find((cfg) =>
          pathname.startsWith(cfg.prefix),
        );

        if (!routeConfig) {
          throw new Error(`No API configured for route: ${pathname}`);
        }

        let payload: any = {};
        switch (routeConfig.payloadType) {
          case "deca":
            payload = {
              userName: credentials.username,
              password: credentials.password,
              otp: credentials.otp,
            };
            break;

          case "common":
            payload = {
              userName: credentials.username,
              menuName: "test",
            };
            break;

          default:
            throw new Error(
              `Unsupported payload type: ${routeConfig.payloadType}`,
            );
        }

        console.log("POST URL:", routeConfig.api);
        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("Payload is", payload);
        const agent = new https.Agent({
          rejectUnauthorized: false, // ⛔ ignores SSL validation
        });
        try {
          console.log("tst" + routeConfig.api);

          const res = await axios.post(routeConfig.api, payload, {
            httpsAgent: agent,
            headers: { "Content-Type": "application/json" },
          });

          console.log("Response is", res.data);
          const data = res.data;
          console.log("Payload type is", routeConfig.payloadType);
          if (routeConfig.payloadType == "deca") {
            return {
              id: res.data.userId || credentials.username,
              name: res.data.userName || credentials.username,
              token: res.data.token || null,
            };
          }
          //   if (res.data) {
          //     return {
          //       id: res.data.userId || credentials.username,
          //       name: res.data.userName || credentials.username,
          //       token: res.data.token || null
          //     };
          //   }

          //   return null;
          // } catch (err) {
          //   console.error("Auth API error:", err);
          //   return null;
          // }
          if (routeConfig.payloadType == "common") {
            if (data) {
              const user: CustomUser = {
                id: credentials.username, // Use username as the user ID
                username: "User Logged in",
                email: data.email, // Adjust if necessary
                token: data.token, // Include the token if necessary
              };
              console.log("user is", user);
              return user;
            } else {
              return null;
            }
          }
          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Optional: custom sign-in page
  },
  callbacks: {
    async redirect({ url }) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://172.19.2.214:4003"; // Fallback for local
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`; // Redirect to /dashboard
    },

    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true;
      }

      return false;
    },

    async jwt({ token, user, trigger }) {
      // When user logs in for the first time
      if (user) {
        token._id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
        token.email = user.email;
        token.token = user.token;

        // ✅ Add this line to mark initial expiry
        token.tokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins from now
        token.lastActivity = Date.now();
      }

      // Handle manual trigger updates
      if (trigger === "update") {
        token.lastActivity = Date.now();
      }
      token.tokenExpires = Number(Date.now()) + 15 * 60 * 1000;
      // ✅ Refresh token logic
      if (Date.now() > Number(token.tokenExpires ?? 0) - 1 * 60 * 1000) {
        try {
          if (!token.token) throw new Error("No token available for refresh");

          const refreshResponse = await fetch(
            `${urls.baseurl}/security/refreshtoken`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.token}`,
              },
            },
          );

          if (!refreshResponse.ok) throw new Error("Refresh failed");

          const refreshData = await refreshResponse.json();

          if (refreshData?.status === true) {
            token.token = refreshData.token;
            token.tokenExpires = Date.now() + 15 * 60 * 1000; // extend expiry
            token.lastActivity = Date.now();
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id; // Type assertion
        session.user.isVerified = token.isVerified;

        session.user.token = token.token;
        session.user.name = "User Logged in";
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      },
    },
  },
  session: {
    strategy: "jwt", // Make sure this is set to 'jwt'
    maxAge: 15 * 60, // Max session duration: 15 minutes (in seconds)
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure the secret is configured
};
function auth( // <-- use this function to access the jwt from React components
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export { authOptions, auth };
