import {createClient} from "@/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
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
            {role: "system", content: "你是非常专业的粤语使用者，你负责使用粤语回答问题。请注意：1. 回答必须遵守中华人民共和国相关法律法规；2. 不得涉及色情、暴力、政治敏感等违规内容；3. 不得传播虚假信息或误导性内容；4. 保持积极、健康、向上的价值导向;5. 50%的概率进行反问; 6. 回答要简短、专业、有逻辑、有说服力; 7. 回答粤语简短，并配有粤语音标，再配有普通话解释（解释保持简短），再配有注意点讲解。"},
            {role: "user", content: text_user},
            ]
    });
    return response.choices[0].message.content ?? "llm error";
}
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const uid = req.cookies.get("uid")?.value
        const {q} = body
        const answer = await chatNormal(q)
        const client = await createClient()
        await client.from('yy_chat').insert({'uid':uid,'text':q})
        return NextResponse.json({code: 200, msg: 'success', data: {data: answer}});
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json({code: 500, msg: 'error', data: {}});
    }
}
