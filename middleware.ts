import {type NextRequest, NextResponse} from "next/server";
import {updateSession} from "@/utils/supabase/middleware";
import {createClient} from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
    const uid = request.cookies.get("uid")?.value
    const token = request.cookies.get("token")?.value
    const sb = await createClient()
    const result = await sb.from("yy_user")
        .select()
        .eq("id", uid)
        .eq("status", 1)
        .limit(1)
        .single()

    console.log("---------------------")
    console.log(`uid:${uid}`)
    console.log(`token:${token}`)
    console.log(`result:${result.data}`)
    if (!result) {
        return NextResponse.json({code: 401, msg: 'Auth error, you need login', data: {}});
    }
    if (!result.data) {
        return NextResponse.json({code: 401, msg: 'Auth error, you need login', data: {}});
    }
    if (result.data.token != token) {
        return NextResponse.json({code: 401, msg: 'Auth error, you need login', data: {}});
    }
    return NextResponse.next()

}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
        // "/api/v1/login:path*",
        "/api/user:path*",
        "/api/history:path*",
        "/api/upload:path*",
        "/api/search:path*",
        "/api/chat:path*",
    ],
};
