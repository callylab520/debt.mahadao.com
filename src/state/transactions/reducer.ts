import { createReducer } from '@reduxjs/toolkit';

import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
} from './actions';
import { INITIAL_TRANSACTION_STATE } from '../../utils/constants';

const now = () => new Date().getTime();

export default createReducer(INITIAL_TRANSACTION_STATE, (builder) =>
  builder
    .addCase(
      addTransaction,
      (transactions, { payload: { chainId, from, hash, approval, summary } }) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.');
        }
        const txs = transactions[chainId] ?? {};
        txs[hash] = { hash, approval, summary, from, addedTime: now() };
        transactions[chainId] = txs;
      },
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return;
      transactions[chainId] = {};
    })
    .addCase(
      checkedTransaction,
      (transactions, { payload: { chainId, hash, blockNumber } }) => {
        const tx = transactions[chainId]?.[hash];
        if (!tx) {
          return;
        }
        if (!tx.lastCheckedBlockNumber) {
          tx.lastCheckedBlockNumber = blockNumber;
        } else {
          tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber);
        }
      },
    )
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash];
      if (!tx) {
        return;
      }
      tx.receipt = receipt;
      tx.confirmedTime = now();
    }),
);
