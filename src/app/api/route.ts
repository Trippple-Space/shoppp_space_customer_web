import AWS from 'aws-sdk';
import { NextResponse, NextRequest } from 'next/server';

const lambda = new AWS.Lambda({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function handler(req: NextRequest) {

    if (!process.env.LAMBDA_FUNCTION_NAME) {
        return NextResponse.json({ error: 'LAMBDA_FUNCTION_NAME environment variable is not set' }, { status: 500 });
    }

    const url = new URL(req.url);
    const route = url.searchParams.get('route');
    const headers = Object.fromEntries(req.headers.entries());

    let body;
    try {
        body = await req.json()
    } catch (error) {
        body = null
    }

    const queryStringEntries = url.searchParams.entries();
    const filteredQueryStringEntries = Array.from(queryStringEntries).filter(([key]) => key !== 'route');
    const queryStringParameters = Object.fromEntries(filteredQueryStringEntries);

    delete headers['content-length'];

    const params: AWS.Lambda.InvocationRequest = {
        FunctionName: process.env.LAMBDA_FUNCTION_NAME,
        InvocationType: 'RequestResponse', // Can be 'Event' for async invocation
        Payload: JSON.stringify({
            httpMethod: req.method,
            headers,
            path: route,
            queryStringParameters,
            body,
        }),
    };

    try {
        const data = await lambda.invoke(params).promise();
        const responsePayload = JSON.parse(data.Payload as string);

        return NextResponse.json(responsePayload.body ? JSON.parse(responsePayload.body) : {}, {
            status: responsePayload.statusCode
        });
    } catch (error) {
        console.error('Error invoking Lambda function:', error);
        return NextResponse.json({ error: 'Failed to invoke Lambda function' }, { status: 500 });
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
