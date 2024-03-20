// Import
import { ApiPromise, WsProvider } from '@polkadot/api';

export async function getApi() {
    const api = await ApiPromise.create({
        provider: new WsProvider('ws://127.0.0.1:9944'),
        rpc: {
            xyChain: {
                account_data: {
                    description: 'For getting Account Data of a user.',
                    params: [
                        {
                            name: 'who',
                            type: 'AccountId'
                        },
                    ],
                    type: 'RpcAccountData',
                },
                interest_pa: {
                    description: 'Estimates interest yearned per year for a user.',
                    params: [
                        {
                            name: 'who',
                            type: 'AccountId'
                        },
                    ],
                    type: 'String',
                }
            }
        },
        types: {
            RpcAccountData: {
                free: 'String',
                reserved: 'String',
                locked: 'Vec<RpcLockedFund>',
            },
            RpcLockedFund: {
                id: 'LockId',
                amount: 'String',
                reason: 'LockReason',
                unlock_at: 'BlockNumber',
            },
            LockId: 'u64',
            LockReason: {
                _enum: ['Stake', 'Redeem','Auditor',],
            },
        }
    });
    // Wait until we are ready and connected
    await api.isReady;
    return api;
}

export function toDollar(input) {
    return input * 1.0 / 1000000000000
}

export function fromDollar(input) {
    return input * 1000000000000
}

export function toDay(input) {
    return input * 1.0 / (10 * 60 * 24)
}

export async function sleep(ms) {  
    return new Promise(resolve => setTimeout(resolve, ms));  
 } 