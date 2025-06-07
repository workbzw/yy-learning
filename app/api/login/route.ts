import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";
import {generateToken} from "@/utils/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {phone, code} = body
        console.log("========login========")
        console.log(`phone:${phone}`)
        console.log(`code:${code}`)
        const client = await createClient()
        const dataCode = await client.from('yy_code')
            .select()
            .eq('status', 1)
            .eq('phone', phone)
            .limit(1)
            .single()
        if (!dataCode || !dataCode.data) {
            return NextResponse.json({code: 402, msg: 'login error', data: {}});
        }
        if (dataCode.data.code != code) {
            return NextResponse.json({code: 403, msg: 'login error code', data: {}});
        }
        let dataUser = await client.from('yy_user')
            .select()
            .eq('status', 1)
            .eq('phone', phone)
            .limit(1)
            .single()
        const newToken = generateToken()
        if (!dataUser || !dataUser.data) {
            await client.from('yy_user').insert({'phone': phone, 'token': newToken})
        } else {
            await client.from('yy_user').update({'token': newToken}).eq('id', dataUser.data.id)
        }
        dataUser = await client.from('yy_user')
            .select()
            .eq('status', 1)
            .eq('phone', phone)
            .limit(1)
            .single()
        return NextResponse.json({code: 200, msg: 'success', data: {data:dataUser}});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
