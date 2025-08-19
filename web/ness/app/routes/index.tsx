import { redirect } from 'react-router';

import { commonLoader } from '@/middleware/auth.server.ts';

export const loader = commonLoader(async ({ cookie }: { cookie?: string }) => {
    return redirect('file-upload', { headers: cookie ? { 'Set-Cookie': cookie } : undefined });
});

export default function AppIndex() {
    return <></>;
}
