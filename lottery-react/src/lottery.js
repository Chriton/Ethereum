import web3 from './web3.js';

// address and ABI data taken from running the Lottery/deploy.js script (node ./deploy.js)
const address = '0xf1e2845ccA882D5C90014742729E1115BDc52Bc6';
const abi =
    [
       {
          "constant":true,
          "inputs":[

          ],
          "name":"manager",
          "outputs":[
             {
                "name":"",
                "type":"address"
             }
          ],
          "payable":false,
          "stateMutability":"view",
          "type":"function"
       },
       {
          "constant":false,
          "inputs":[

          ],
          "name":"pickWinner",
          "outputs":[

          ],
          "payable":false,
          "stateMutability":"nonpayable",
          "type":"function"
       },
       {
          "constant":true,
          "inputs":[

          ],
          "name":"getPlayers",
          "outputs":[
             {
                "name":"",
                "type":"address[]"
             }
          ],
          "payable":false,
          "stateMutability":"view",
          "type":"function"
       },
       {
          "constant":false,
          "inputs":[

          ],
          "name":"enter",
          "outputs":[

          ],
          "payable":true,
          "stateMutability":"payable",
          "type":"function"
       },
       {
          "constant":true,
          "inputs":[
             {
                "name":"",
                "type":"uint256"
             }
          ],
          "name":"players",
          "outputs":[
             {
                "name":"",
                "type":"address"
             }
          ],
          "payable":false,
          "stateMutability":"view",
          "type":"function"
       },
       {
          "inputs":[

          ],
          "payable":false,
          "stateMutability":"nonpayable",
          "type":"constructor"
       }
    ];

export default new web3.eth.Contract(abi, address);