## Final year project - Audit Trail

### Title 
Next Generation Univeristy ERP System (Property Administration System)
<br>
### Prepared By
- Abdulhamid Mussa  ATR/3656/10
- Bemnet Teklu      ATR/3381/10
- Lensa Billion     ATR/0852/10
- Mahlet Dereje     ATR/1931/10
- Nebyu Tsegaye     ATR/2127/10

### Advisor
Mr. Wondimagen Desta

### Summary
Auditing a system is an important part of an application that deals with transactions. The project aimed to provide a sense of confidence on the validity and integrity of the transactions that are happening within the system using the blockchain technology. The Audit Trail implementation is one of the core features this project wanted to demonstrate.

### Tools and Technologies used to develop the system
- Ethereum blockchain technology
- Hardhat compiler
- Rinkeby testnet
- Alchemy blockchain node provider
- Ether.js library as Ethereum blockchain client

### Installation / Setup and running steps

Deploy the contract by running the following command on your terminal: 
<pre>> npx hardhat
> npx hardhat compile
> npx hardhat run scripts/deploy.js --network rinkeby </pre>

### References 
1. rkalis on Audit Trail, https://github.com/rkalis/blockchain-audit-trail/blob/master/truffle/contracts/AuditTrail.sol, June 2018.
2. CryptoZombies tutorial, https://cryptozombies.io/
3. Etherum Stack Exchange, https://ethereum.stackexchange.com/
4. Hardhat docs, https://hardhat.org/
5. Ethers.js docs, https://docs.ethers.io/v5/
