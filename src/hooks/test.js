import * as util from './util.js';
import {Keyring} from '@polkadot/keyring';

export async function testAll() {
    console.log("Starting Polkadot JS Test.");
    let api = await util.getApi();

    testChainConstants(api);
    await testRpc(api);
    await testRpcInterestPa(api);
    await testExtrinsicDeposit(api);
    await testExtrinsicStake(api);
    await testExtrinsicRedeem(api);
    await testExtrinsicLockFundsAuditor(api);
    await testExtrinsicUnlockFundsAuditor(api);
    await testStorageQuery(api);
    await rotateTreasury(api);
    await forceTransfer(api);

    await api.disconnect();
}

function testChainConstants(api) {
    console.log("Testing Pallet constants.");
    console.log(`Bank Existential Deposit: $${util.toDollar(api.consts.bank.existentialDeposit.toNumber())}`);
    console.log(`Bank Minimum Amount: $${util.toDollar(api.consts.bank.minimumAmount.toNumber())}`);
    console.log(`Bank Interest Payout Period: ${util.toDay(api.consts.bank.interestPayoutPeriod.toNumber())} day`);
    console.log(`Bank Stake Period: ${util.toDay(api.consts.bank.stakePeriod.toNumber())} days`);
    console.log(`Bank Redeem Period: ${util.toDay(api.consts.bank.redeemPeriod.toNumber())} days`);
    console.log(`Governance threshold: ${api.consts.governance.majorityThreshold}%`);
    console.log(`Lottery Prize pool account: ${api.consts.lottery.prizePoolAccount}`);
    console.log(`Lottery Tax Rate: ${api.consts.lottery.taxRate}%`);
}

async function testRpc(api) {
    console.log("Testing RPC account_data call.");
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies RPC Account Data: ${accountData}`);
}

async function testRpcInterestPa(api) {
    console.log("Testing RPC interest_pa call.");
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');
    let manager = keyring.addFromUri('//Alice');

    // Set interest rate = 10%
    await api.tx.bank.setInterestRate(1000).signAndSend(manager);

    // Sleep until the next block.
    await util.sleep(6000);

    let interestPa = await api.rpc.xyChain.interest_pa(charlie.publicKey);
    console.log(`Charlies RPC Interest per year: ${interestPa}`);
}

async function testExtrinsicDeposit(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let manager = keyring.addFromUri('//Alice');
    let dave = keyring.addFromUri('//Dave');

    console.log(`Dave's balance: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);

    await api.tx.bank.deposit(dave.publicKey, util.fromDollar(333)).signAndSend(manager);

    // Sleep until the next block.
    await util.sleep(6000);

    console.log(`Dave's new balance: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);
}

async function testExtrinsicStake(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');

    console.log(`Charlie's free balance: $${(await api.query.bank.accounts(charlie.publicKey)).free.toString()}`);

    await api.tx.bank.stakeFunds(util.fromDollar(100)).signAndSend(charlie);

    // Sleep until the next block.
    await util.sleep(6000);

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies Staked $100 Account Data: ${accountData}`);
}

async function testExtrinsicRedeem(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');

    console.log(`Charlie's reserved balance: $${(await api.query.bank.accounts(charlie.publicKey)).reserved.toString()}`);

    await api.tx.bank.redeemFunds(util.fromDollar(200)).signAndSend(charlie);

    // Sleep until the next block.
    await util.sleep(6000);

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies Redeemed $200 Account Data: ${accountData}`);
}

async function testExtrinsicLockFundsAuditor(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');
    let auditor = keyring.addFromUri('//Bob');

    console.log(`Charlie's free balance: $${(await api.query.bank.accounts(charlie.publicKey)).free.toString()}`);

    await api.tx.bank.lockFundsAuditor(charlie.publicKey, util.fromDollar(300), 100).signAndSend(auditor);

    // Sleep until the next block.
    await util.sleep(6000);

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies is locked $300 Account Data: ${accountData}`);
}

async function testExtrinsicUnlockFundsAuditor(api) {
    let keyring = new Keyring({ type: 'sr25519' });
    let charlie = keyring.addFromUri('//Charlie');
    let auditor = keyring.addFromUri('//Bob');

    console.log(`Charlie's free balance: $${(await api.query.bank.accounts(charlie.publicKey)).free.toString()}`);

    await api.tx.bank.unlockFundsAuditor(charlie.publicKey, 4).signAndSend(auditor);

    // Sleep until the next block.
    await util.sleep(6000);

    let accountData = await api.rpc.xyChain.account_data(charlie.publicKey);
    console.log(`Charlies is unlocked $300 Account Data: ${accountData}`);
}

async function testStorageQuery(api) {
    console.log("Testing storage query");
    let keyring = new Keyring({ type: 'sr25519' });
    let dave = keyring.addFromUri('//Dave');
    console.log(`Dave's storage account data: ${await api.query.bank.accounts(dave.publicKey)}`);
    console.log(`Current authorities: ${await api.query.governance.currentAuthorities()}`);
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

async function forceTransfer(api) {
    console.log("Force transfer.")
    let keyring = new Keyring({ type: 'sr25519' });
    let root = keyring.addFromUri('//Alice');
    let charlie = keyring.addFromUri('//Charlie');
    let dave = keyring.addFromUri('//Dave');

    console.log(`Charlie's free balance: $${(await api.query.bank.accounts(charlie.publicKey)).free.toString()}`);
    console.log(`Dave's free balance: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);

    await api.tx.governance.initiateProposal(api.tx.bank.forceTransfer(dave.publicKey, charlie.publicKey, util.fromDollar(222))).signAndSend(root);
    
     // Sleep until the next block.
    await util.sleep(6000);

    console.log(`Charlie's new free balance +$222: $${(await api.query.bank.accounts(charlie.publicKey)).free.toString()}`);
    console.log(`Dave's new free balance -$222: $${(await api.query.bank.accounts(dave.publicKey)).free.toString()}`);
}