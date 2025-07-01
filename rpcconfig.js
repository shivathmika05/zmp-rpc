import { RetoolRPC } from "retoolrpc";
import axios from "axios";
 
const rpc = new RetoolRPC({
  apiToken: 'retool_01jy6dbncapken7g3xz7e9ydh8',
  host: 'https://zetaglobalcustomerengineeringintern.retool.com',
  resourceId: '1fca398b-09e3-46d5-b1ed-e7f6020a1a28',
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1', 
  logLevel: 'info', 
})
 
rpc.register({
    name: 'getSegments',
    arguments: {
        pageIndex: {
            type: 'number',
            description: 'The page number to fetch (starting from 0)',
            required: true,
          },
          pageSize: {
            type: 'number',
            description: 'The number of records per page',
            required: true,
          },
    },
    implementation: async (args, context) => {
      const { pageIndex, pageSize } = args;
  
      const url = `https://api.zetaglobal.net/v1/segments?page=${pageIndex}&per_page=${pageSize}`;
  
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
        },
        auth: {
          username: 'api',
          password: '9b6a5c2c2e43f815589819de6888ddf4',
        },
      });
  
      console.log(response.data);
      return response.data;
    },
  });
  
  rpc.listen();