import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";
import {generateCode, generateToken} from "@/utils/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {phone} = body
        if (phone.length != 11) {
            return NextResponse.json({code: 405, msg: 'error phone', data: {}});
        }
        const code = generateCode()
        const client = await createClient()
        await client.from('yy_code').update({'status': 0}).eq('phone', phone)
        await client.from('yy_code').insert({'phone': phone, 'code': code})
        //发送短信api

        return NextResponse.json({code: 200, msg: 'success', data: {"code":code}});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
