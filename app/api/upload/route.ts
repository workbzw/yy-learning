import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = request.body;
        const data = await request.json();
        const messages = data.messages;
        console.log("--------------------------------");
        console.log(body);
        console.log(data);
        console.log(messages);

        // 这里连接您的AI服务
        // 例如OpenAI API或其他AI服务
        // const aiResponse = await callAIService(messages);

        // 模拟AI响应
        const aiResponse = {
            message: `body:${body},data:${data},messages:${messages}`,
        };

        return NextResponse.json(aiResponse);
    } catch (error) {
        console.error('处理聊天请求时出错:', error);
        return NextResponse.json(
            { error: '处理请求失败' },
            { status: 500 }
        );
    }
}