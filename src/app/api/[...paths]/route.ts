import AWS from 'aws-sdk';
import { NextResponse, NextRequest } from 'next/server';

const lambda = new AWS.Lambda({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cache = new Map<string, { data: any, expiry: number }>();

// Define cacheable routes and their cache durations in seconds
const cacheableRoutes: { [key: string]: number } = {
    '/products': 60, // Cache for 60 seconds
    '/product/categories': 60 * 60 // cache for one hour - update to cache for several days once we have relative stability with our categories
    // Add other routes here
};

const getFullUrl = (req: NextRequest) => {
    const url = new URL(req.url);
    const queryStringEntries = url.searchParams.entries();
    const filteredQueryStringEntries = Array.from(queryStringEntries).filter(([key]) => key !== 'route');
    const queryStringParameters = Object.fromEntries(filteredQueryStringEntries);

    const params = new URLSearchParams();
    Object.keys(queryStringParameters).forEach(key => {
        buildQueryString(key, queryStringParameters[key], params.append.bind(params));
    });

    url.search = params.toString();
    return url.toString();
};

const buildQueryString = (prefix: string, obj: any, add: (key: string, value: any) => void) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.keys(obj).forEach(key => {
            buildQueryString(`${prefix}[${key}]`, obj[key], add);
        });
    } else {
        add(prefix, obj);
    }
};

const handler = async (req: NextRequest) => {    
    if (!process.env.LAMBDA_FUNCTION_NAME) {
        return NextResponse.json({ error: 'LAMBDA_FUNCTION_NAME environment variable is not set' }, { status: 500 });
    }

    const url = new URL(req.url);
    const cacheBust = url.searchParams.get('cacheBust');

    if (cacheBust) {
        cache.clear()
    }

    const route = url.pathname.replace('/api', '');
    const cacheDuration = cacheableRoutes[route];
    let fullUrl;

    if (req.method === 'GET' && cacheDuration) {
        fullUrl = getFullUrl(req);
        const cachedResponse = cache.get(fullUrl);
        if (cachedResponse && cachedResponse.expiry > Date.now()) {
            return NextResponse.json(cachedResponse.data);
        }
    }

    const headers = Object.fromEntries(req.headers.entries());

    let body;
    try {
        body = await req.json();
    } catch (error) {
        body = null;
    }

    delete headers['content-length'];

    const queryStringEntries = url.searchParams.entries();
    const filteredQueryStringEntries = Array.from(queryStringEntries).filter(([key]) => key !== 'route');
    const queryStringParameters = Object.fromEntries(filteredQueryStringEntries);

    const params: AWS.Lambda.InvocationRequest = {
        FunctionName: process.env.LAMBDA_FUNCTION_NAME,
        InvocationType: 'RequestResponse',
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

        const response = responsePayload.body ? JSON.parse(responsePayload.body) : {};

        if (!fullUrl) {
           fullUrl = getFullUrl(req);
        }

        if (req.method === 'GET' && cacheDuration) {
            cache.set(fullUrl, { data: response, expiry: Date.now() + cacheDuration * 1000 });
        }

        return NextResponse.json(response, { status: responsePayload.statusCode });
    } catch (error) {
        //console.error('Error invoking Lambda function:', error);
        return NextResponse.json({ error: 'Failed to invoke Lambda function' }, { status: 500 });
    }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
