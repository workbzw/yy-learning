import {createClient} from "@/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
import {generateToken} from "@/utils/utils";
import OpenAI from "openai";

const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: process.env.QWEN_APIKEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function chatNormal(text_user: string): Promise<string> {
    const response = await openai.chat.completions.create({
        // model: "qwen-vl-max", // 此处以qwen-vl-max为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        model: "qwen-max", // 此处以qwen-vl-max为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [
            {role: "system", content: "你是非常专业的高考报考老师，你姓张，大家叫你张老师，请不要回到与报考无关的问题。"},
            {role: "user", content: text_user},
            // {role: "user", content: [
            //         {type: "text", text: text_user},
            //         // { type: "image_url", image_url: { "url": imgUrl } }
            //     ]
            // }
            ]
    });
    return response.choices[0].message.content ?? "llm error";
    console.log(JSON.stringify(response));
}
// 辅助函数：解析 cookie 字符串
const parseCookies = (cookieHeader: string | null): Record<string, string> => {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name) cookies[name] = value || '';
    });

    return cookies;
};
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        // const cookieHeader = req.headers.get('cookie');
        // const cookies = parseCookies(cookieHeader);
        const uid = req.cookies.get("uid")?.value
        // const uid = cookies['uid']
        const {text} = body

        const answer = await chatNormal(text)

        const client = await createClient()
        await client.from('yy_chat').insert({'uid':uid,'text':text})


        return NextResponse.json({code: 200, msg: 'success', data: {data: answer}});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
