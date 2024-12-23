import { NextResponse } from "next/server";

function decodeCookieValue(encodedValue) {
  try {
    // First, decode the Base64 string
    const decodedString = decodeURIComponent(atob(encodedValue));

    // Then, parse it as JSON
    const parsedValue = JSON.parse(decodedString);

    // Check if it's a boolean and return
    return typeof parsedValue === "boolean" ? parsedValue : null;
  } catch (error) {
    console.error("Error decoding cookie:", error);
    return null;
  }
}

export function middleware(request) {
  const jwt = request.cookies.get("jwt")?.value;
  const authenticated = request.cookies.get("authenticated")?.value;
  const registerSteps = request.cookies.get("registerSteps")?.value;
  const { pathname } = request.nextUrl;
  console.log(authenticated, "authenticated");

  const isVerified = request.cookies.get("isVerified")?.value;

  if (registerSteps === "false") {
    console.log(" the registerSteps === false");
  } else if (registerSteps === "true") {
    console.log(" the registerSteps === true");
  } else {
    console.log(" the registerSteps === undefinde ");
  }
  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/verify"];

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    console.log("Accessing public route");
    // If user is authenticated and tries to access a public route
    if (jwt) {
      console.log("User is authenticated");

      // Special handling for /verify route
      if (!isVerified && pathname === "/verify") {
        console.log("Accessing /verify route");

        return NextResponse.next();
      }

      // Redirect to admin for other public routes if authenticated
      else return NextResponse.redirect(new URL("/admin", request.url));
    }
  } else {
    // If user is not authenticated and tries to access a protected route, redirect to login
    if (!jwt) {
      console.log("User is not authenticated");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user is authenticated but doesn't have a registerSteps, redirect to signup/startup
    if (jwt && registerSteps === "false") {
      if (pathname !== "/signup/startup") {
        console.log(registerSteps, " is authenticated but doesn't h");
        console.log("User needs to complete registration steps");
        return NextResponse.redirect(new URL("/signup/startup", request.url));
      }
    }

    if (jwt && registerSteps == "true") {
      // If they're on the startup page, redirect them to admin (or another appropriate page)
      if (pathname === "/signup/startup") {
        console.log("Registration steps completed, redirecting to admin");
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      // Otherwise, allow them to proceed to their intended destination

      return NextResponse.next();
    }
  }

  // Allow the request to continue
  console.log("Allowing request to continue");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/verify",
    "/login",
    "/signup",
    "/signup/startup",
    "/admin",
    "/profile",
    "/admin/:path*",
  ],
};
