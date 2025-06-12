import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";
import {generateCode} from "@/utils/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {keyword} = body
        if (!keyword) {
            return NextResponse.json({code: 405, msg: 'error keyword', data: {}});
        }
        async function fetchDetails(entity: string): Promise<any> {
            // const res = await fetch(`https://bodhi-data.deno.dev/text_search_v2?keyword=${entity}&table_name=cantonese_corpus_all&column=data&limit=1`, {
            const res = await fetch(`https://dim-sum-prod.deno.dev/text_search_v2?keyword=${entity}&table_name=cantonese_corpus_all&column=data&limit=1`, {
                method: 'GET',
            })
            return await res.json()
        }
        const details = await fetchDetails(keyword);
        return NextResponse.json({code: 200, msg: 'success', data: {"data":details}});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
