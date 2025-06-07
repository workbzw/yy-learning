import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function GET(request: Request,) {
    try {
        const client = await createClient()
        const data = await client.from('yy_user').select().eq('status', 1)
        return NextResponse.json({code: 200, msg: 'success', data: {data: data.data}});
    } catch (error) {
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
