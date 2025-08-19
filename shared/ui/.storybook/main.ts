import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding', // storybook 온보딩 가이드
        '@chromatic-com/storybook', // chromatic을 연동한 테스트 및 리뷰
        '@storybook/addon-interactions', // 상호작용 테스트
    ],
    // 사용할 프레임워크 및 빌더 설정
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};
export default config;
