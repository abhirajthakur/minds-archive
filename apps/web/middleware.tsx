import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// const BASE_URL = request.nextUrl.origin;
	// const response = await fetch(`${BASE_URL}/api/auth/get-session`, {
	// 	headers: {
	// 		cookie: request.headers.get("cookie") || "",
	// 	},
	// });
	// const data = await response.json();
	// const session = data?.session;
	//
	// if (!session) {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }
	//
	// return NextResponse.next();
}

export const config = {
	matcher: ["/chat", "/documents"], // Apply middleware to specific routes
};
