import { NextResponse } from 'next/server';
import { TosClient, TosClientError, TosServerError } from '@volcengine/tos-sdk';
export async function POST(request: Request) {
    try {
        const client = new TosClient({
            accessKeyId: process.env['TOS_ACCESS_KEY']!, 
            accessKeySecret: process.env['TOS_SECRET_KEY']!, 
            region: "cn-guangzhou", // 填写 Bucket 所在地域。以华北2（北京)为例，"Provide your region" 填写为 cn-beijing。
            endpoint: "tos-cn-guangzhou.volces.com", // 填写域名地址
          });
          function handleError(error:any) {
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
          async function main() {
            try {
              const bucketName = 'node-sdk-test-bucket';
              const objectName = 'example_dir/example.txt';
              
              // 从请求中获取数据
              const requestData = await request.json();
              const imageData = requestData.image; // 假设前端发送的是{image: base64String}

              // 上传对象
              await client.putObject({
                bucket: bucketName,
                key: objectName,
                body: Buffer.from(imageData), // 使用从请求中获取的数据
              });
              // object size: 11
            } catch (error) {
              handleError(error);
            }
          }
          main();
        // 这里连接您的AI服务
        // 例如OpenAI API或其他AI服务
        // const aiResponse = await callAIService(messages);

        // 模拟AI响应
        const aiResponse = {
            message: `body:test`,
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