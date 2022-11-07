import { createAction } from '@reduxjs/toolkit';

import { SerializableTransactionReceipt } from '../../utils/interface';

export const addTransaction = createAction<{
  chainId: number;
  hash: string;
  from: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
}>('transactions/addTransaction');

export const clearAllTransactions = createAction<{ chainId: number }>(
  'transactions/clearAllTransactions',
);

export const finalizeTransaction = createAction<{
  chainId: number;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');

export const checkedTransaction = createAction<{
  chainId: number;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');
