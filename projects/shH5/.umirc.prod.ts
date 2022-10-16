import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.UMI_ENV': 'prod',
    'process.env.BASE_URL': 'https://jsypay.test.jinshuy.com/pay-client',
  },
});
