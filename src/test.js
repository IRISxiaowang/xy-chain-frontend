import * as util from './util.js';
import {Keyring} from '@polkadot/keyring';

export async function testAll() {
    console.log("Starting Polkadot JS Test.");
    let api = await util.getApi();
    testChainConstants(api);

    await testRpc(api);
    await testStorageQuery(api);
    await testExtrinsic(api);
    await rotateTreasury(api);

    await api.disconnect();
}

async function testRpc(api) {
    console.log("Testing RPC calls.");
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies RPC Account Data: ${accountData}`);
}

function testChainConstants(api) {
    console.log("Testing Pallet constants.");
    console.log(`Bank Existential Deposit: $${util.toDollar(api.consts.bank.existentialDeposit.toNumber())}`);
    console.log(`Governance threshold: ${api.consts.governance.majorityThreshold}%`);
    console.log(`Lottery Prize pool account: ${api.consts.lottery.prizePoolAccount}`);
}

async function testExtrinsic(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let manager = keyring.addFromUri('//Alice');
    let dave = keyring.addFromUri('//Dave');

    console.log(`Dave's balance: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);

    await api.tx.bank.deposit(dave.publicKey, util.fromDollar(333)).signAndSend(manager);

    // Sleep until the next block.
    await util.sleep(6000);

    console.log(`Dave's new balance: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);
}

async function testStorageQuery(api) {
    console.log("Testing storage query");
    let keyring = new Keyring({ type: 'sr25519' });
    let dave = keyring.addFromUri('//Dave');
    console.log(`Dave's storage account data: ${await api.query.bank.accounts(dave.publicKey)}`);
}

async function rotateTreasury(api) {
    console.log("Rotating treasury.")
    let keyring = new Keyring({ type: 'sr25519' });
    let root = keyring.addFromUri('//Alice');
    let treasury = keyring.addFromUri('//Treasury');
    await api.tx.governance.initiateProposal(api.tx.bank.rotateTreasury(treasury.publicKey)).signAndSend(root);
    
     // Sleep until the next block.
    await util.sleep(6000);

    let actual_treasury = await api.query.bank.treasuryAccount();
    console.log(`Expected Treasury: ${treasury.address}, Actual:${actual_treasury}`);
}