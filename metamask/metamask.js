const Web3 = require('web3');
const sm_contract_bnb = require('../smart_contract/vote_contract_bnb');

const MultiTokenPurchase_ABI = sm_contract_bnb.VOTE.ABI;
const MultiTokenPurchase_ADDRESS = sm_contract_bnb.VOTE.Address;

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
} else {
    // bsc test net RPC URL
    var web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
    //var web3 = new Web3(new Web3.providers.HttpProvider('https://localhost:8545'))
}
exports.getBlockNumber = async () => {
    const lastnum = await web3.eth.getBlockNumber();
    return lastnum;
}

exports.createAccount = async () => {
    const lastnum = web3.eth.accounts.create();
    console.log(lastnum);
    return lastnum;
}

exports.signAndSend = async(account, gasPrice, transaction, value = 0) =>{
 
    while (true) {
        try {
            const options = {
                to      : transaction._parent._address,
                data    : transaction.encodeABI(),
                gas     : await transaction.estimateGas({from: account.address, value: value}),
                gasPrice: gasPrice,
                value   : value,
            };
            const signed  = await web3.eth.accounts.signTransaction(options, account.privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        }
        catch (error) {
            console.log(error.message);
        }
    }
}

exports.vote_item = async(item_id) =>{
    const account = web3.eth.accounts.privateKeyToAccount(process.env.ACCOUNT2_privateKey);
    const gasPrice = 20e9;
    const contract = this.getContractMM();
    const receipt = await this.signAndSend(account, gasPrice, contract.methods.vote_item(item_id));
    return receipt;
}

exports.getContractMM = () => {
    //var web3 = new Web3(window.ethereum);
    var ContractMM = new web3.eth.Contract(MultiTokenPurchase_ABI, MultiTokenPurchase_ADDRESS);
    return ContractMM;
},

    exports.get_vote_log = async (item_ids) => {

        //https://github.com/bnb-chain/bsc/issues/113
        const chunkLimit = 2000;
        const fromBlockNumber = 22739312;
        const toBlockNumber = await this.getBlockNumber();
        const totalBlocks = toBlockNumber - fromBlockNumber
        const chunks = []

        if (chunkLimit > 0 && totalBlocks > chunkLimit) {
            const count = Math.ceil(totalBlocks / chunkLimit)
            let startingBlock = fromBlockNumber

            for (let index = 0; index < count; index++) {
                const fromRangeBlock = startingBlock;
                const toRangeBlock =
                    index === count - 1 ? toBlockNumber : startingBlock + chunkLimit;
                startingBlock = toRangeBlock + 1;

                chunks.push({ fromBlock: fromRangeBlock, toBlock: toRangeBlock })
            }
        } else {
            chunks.push({ fromBlock: fromBlockNumber, toBlock: toBlockNumber })
        }

        const votes = [];
        for (const chunk of chunks) {
            //console.log(`from: ${chunk.fromBlock}  -- to: ${chunk.toBlock}`);
            //await this.getContractMM().events.vote_log(
            await this.getContractMM().getPastEvents('vote_log', {
                filter: { item_id: item_ids },
                fromBlock: chunk.fromBlock,
                toBlock: chunk.toBlock
                // fromBlock: `${22743743}`, //"22743743"//"22739584"//,//"20903300"
                // toBlock: `${toBlockNum}`
                //toBlock: "latest"
            },
                async (error, chunkEvents) => {

                    //console.log(error);
                    if (chunkEvents?.length > 0) {
                        chunkEvents.forEach(element => {
                            // console.log(element.returnValues.item_id);
                            votes.push(
                                {
                                    item_id: element.returnValues.item_id,
                                    vote_by: element.returnValues.sender
                                }
                            )
                        });
                    }
                });
        }

        return votes;

    }

