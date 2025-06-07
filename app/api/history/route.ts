import {NextRequest, NextResponse} from 'next/server';
import { TosClient, TosClientError, TosServerError } from '@volcengine/tos-sdk';
import {createClient} from "@/utils/supabase/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const client = await createClient()
// Create a single supabase client for interacting with your database
export async function GET(request: NextRequest) {
  try {
    const uid = request.cookies.get("uid")?.value
    if (!uid){
      return NextResponse.json(
          { error: '处理请求失败，缺少uid' },
          { status: 500 }
      );
    }
    const { data, error } = await client
      .from('yy_photo')
      .select()
      .eq('status', 1)
      .eq('uid', uid)
    console.log(data)
    return NextResponse.json({ code: 200, msg: 'success', data: data });
  } catch (error) {
    console.error('处理上传请求时出错:', error);
    return NextResponse.json(
      { error: '处理请求失败' },
      { status: 500 }
    );
  }
}
