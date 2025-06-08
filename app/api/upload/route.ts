import {NextRequest, NextResponse} from 'next/server';
import {TosClient, TosClientError, TosServerError} from '@volcengine/tos-sdk';
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey)

// Create a single supabase client for interacting with your database
export async function POST(request: NextRequest) {
    try {
        const uid = request.cookies.get("uid")?.value
        if (!uid) {
            return NextResponse.json(
                {error: 'loss uid'},
                {status: 500}
            );
        }
        const client = new TosClient({
            accessKeyId: process.env['TOS_ACCESS_KEY']!,
            accessKeySecret: process.env['TOS_SECRET_KEY']!,
            region: "cn-guangzhou", // 填写 Bucket 所在地域。以华北2（北京)为例，"Provide your region" 填写为 cn-beijing。
            endpoint: "tos-cn-guangzhou.volces.com", // 填写域名地址
        });

        function handleError(error: any) {
            if (error instanceof TosClientError) {
                console.log('Client Err Msg:', error.message);
                console.log('Client Err Stack:', error.stack);
            } else if (error instanceof TosServerError) {
                console.log('Request ID:', error.requestId);
                console.log('Response Status Code:', error.statusCode);
                console.log('Response Header:', error.headers);
                console.log('Response Err Code:', error.code);
                console.log('Response Err Msg:', error.message);
            } else {
                console.log('unexpected exception, message: ', error);
            }
        }

        async function fetchDetails(entity: string): Promise<any> {
            const res = await fetch(`https://bodhi-data.deno.dev/text_search_v2?keyword=${entity}&table_name=cantonese_corpus_all&column=data&limit=1`, {
                method: 'GET',
            })
            return await res.json()
        }

        async function main(request: Request) {
            try {
                const bucketName = 'yylearning';
                const objectName = `photo-${Date.now()}.jpg`; // 使用时间戳生成唯一文件名
                const url_prx = "https://yylearning.tos-cn-guangzhou.volces.com/";
                const url = url_prx + objectName
                // 获取FormData
                const formData = await request.formData();
                const imageFile = formData.get('image') as File;

                if (!imageFile) {
                    throw new Error('未接收到图片文件');
                }

                // 上传对象
                await client.putObject({
                    bucket: bucketName,
                    key: objectName,
                    body: Buffer.from(await imageFile.arrayBuffer()),
                    contentType: 'image/jpeg'
                });
                let result = await getImgInfo(url);
                if (result.indexOf("船") !== -1) {
                    result = "帆船";
                }

                const details = await fetchDetails(result);

                const DBResult = await supabase.from('yy_photo').insert({
                    url: url,
                    uid: uid,
                    title: result,
                    details: details,
                }).select();

                return {
                    code: 200,
                    msg: 'success',
                    data: {data: DBResult.data}
                };
            } catch (error) {
                handleError(error);
                throw error;
            }
        }

        const result = await main(request);
        return NextResponse.json(result);
    } catch (error) {
        console.error('处理上传请求时出错:', error);
        return NextResponse.json(
            {error: '处理请求失败'},
            {status: 500}
        );
    }
}

import OpenAI from "openai";

const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: process.env.QWEN_APIKEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function getImgInfo(imgUrl: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: "qwen-vl-max", // 此处以qwen-vl-max为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [{
            role: "user", content: [
                {type: "text", text: "这是什么？请直接回答我名词，并且字数保持在10字以内"},
                {type: "image_url", image_url: {"url": imgUrl}}
            ]
        }]
    });
    return response.choices[0].message.content ?? "llm error";
    console.log(JSON.stringify(response));
}