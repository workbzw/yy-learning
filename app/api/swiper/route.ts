import {NextResponse} from 'next/server';
import {TosClient, TosClientError, TosServerError} from '@volcengine/tos-sdk';
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey)

// Create a single supabase client for interacting with your database
export async function GET(request: Request) {
    try {
        const {data, error} = await supabase
            .from('yy_recommend')
            .select()
            .order('id', {ascending: false})
            .limit(5)
        console.log(data)
        return NextResponse.json({code: 200, msg: 'success', data: data});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json(
            {error: '处理请求失败'},
            {status: 500}
        );
    }
}
