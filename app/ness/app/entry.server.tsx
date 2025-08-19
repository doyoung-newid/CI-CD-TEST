import { PassThrough } from 'node:stream';

import { EntryContext, ServerRouter } from 'react-router';

import { createReadableStreamFromReadable } from '@react-router/node';
import { renderToPipeableStream } from 'react-dom/server';

const handleRequest = (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
) => {
    return new Promise((resolve, reject) => {
        const { pipe } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
            onShellReady() {
                responseHeaders.set('Content-Type', 'text/html');

                const body = new PassThrough();
                const stream = createReadableStreamFromReadable(body);

                resolve(
                    new Response(stream, {
                        headers: responseHeaders,
                        status: responseStatusCode,
                    }),
                );

                pipe(body);
            },
            onShellError(error: unknown) {
                reject(error);
            },
        });
    });
};

export default handleRequest;
