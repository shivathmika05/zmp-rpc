import { RetoolRPC } from "retoolrpc";
import axios from "axios";

const rpc = new RetoolRPC({
  apiToken: 'retool_01jzhnfh7hje53pfr01saqkyb1', 
  host: 'https://zetaglobalcustomerengineeringintern.retool.com',
  resourceId: '321be69d-9836-459c-906c-288d1302468f', 
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1',
  logLevel: 'info',
});

rpc.register({
  name: 'getCombinedSegments',
  arguments: {
    accountId: {
      type: 'string',
      required: true,
      description: 'Zeta Account ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      description: 'Dynamic API key for second auth',
    },
  },
  implementation: async (args, context) => {
    const { accountId, apiKey } = args;

    const url = `https://phoenix.api.zetaglobal.net/v1/site_configs?account_id=${accountId}`;

    const fixedAuth = Buffer.from(`api:5bc21b0483dc2722f99f3abdf3aa8bdd `).toString("base64");
    const dynamicAuth = Buffer.from(`api:${apiKey}`).toString("base64");

    try {
      const [res1, res2] = await Promise.all([
        axios.get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${fixedAuth}`,
          },
        }),
        axios.get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${dynamicAuth}`,
          },
        }),
      ]);

      return {
        success: true,
        accountId,
        combined: [
          {
            source: "getSegments",
            data: res1.data,
          },
          {
            source: "getSegmentsWithApiKey",
            data: res2.data,
          },
        ],        
        raw1: res1.data,
        raw2: res2.data,
      };

    } catch (error) {
      console.error("API call failed:", error);
      return {
        success: false,
        message: error.message,
        status: error.response?.status || 500,
        error: error.response?.data || {},
      };
    }
  },
});

rpc.listen();
