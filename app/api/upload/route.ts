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
          async function main(request: Request) {
            try {
              const bucketName = 'yylearning';
              const objectName = `photo-${Date.now()}.jpg`; // 使用时间戳生成唯一文件名
              
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
              
              return {
                success: true,
                message: '图片上传成功',
                filename: objectName
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
            { error: '处理请求失败' },
            { status: 500 }
        );
    }
}