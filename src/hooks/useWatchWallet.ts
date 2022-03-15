import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  useAccountProfile,
  useDeleteWallet,
  useImportingWallet,
  useInitializeWallet,
  useWallets,
} from '@rainbow-me/hooks';
import {
  addressSetSelected,
  walletsSetSelected,
} from '@rainbow-me/redux/wallets';
import { doesWalletsContainAddress, logger } from '@rainbow-me/utils';

export default function useWatchWallet({
  address: primaryAddress,
  ensName,
}: {
  address?: string;
  ensName?: string;
}) {
  const dispatch = useDispatch();

  const { wallets } = useWallets();

  const watchingWallet = useMemo(() => {
    return Object.values(wallets || {}).find((wallet: any) =>
      wallet.addresses.some(({ address }: any) => address === primaryAddress)
    );
  }, [primaryAddress, wallets]);
  const isWatching = useMemo(() => Boolean(watchingWallet), [watchingWallet]);

  const deleteWallet = useDeleteWallet({ address: primaryAddress });

  const initializeWallet = useInitializeWallet();
  const changeAccount = useCallback(
    async (walletId, address) => {
      const wallet = wallets[walletId];
      try {
        const p1 = dispatch(walletsSetSelected(wallet));
        const p2 = dispatch(addressSetSelected(address));
        await Promise.all([p1, p2]);

        initializeWallet(null, null, null, false, false, null, true);
      } catch (e) {
        logger.log('error while switching account', e);
      }
    },
    [dispatch, initializeWallet, wallets]
  );

  const { accountAddress } = useAccountProfile();
  const { handleSetSeedPhrase, handlePressImportButton } = useImportingWallet();
  const watchWallet = useCallback(async () => {
    if (!isWatching) {
      handleSetSeedPhrase(ensName);
      handlePressImportButton(null, ensName);
    } else {
      deleteWallet();
      // If we're deleting the selected wallet
      // we need to switch to another one
      if (primaryAddress && primaryAddress === accountAddress) {
        const { wallet: foundWallet, key } =
          doesWalletsContainAddress({
            address: primaryAddress,
            wallets,
          }) || {};
        if (foundWallet) {
          await changeAccount(key, foundWallet.address);
        }
      }
    }
  }, [
    isWatching,
    handleSetSeedPhrase,
    ensName,
    handlePressImportButton,
    deleteWallet,
    primaryAddress,
    accountAddress,
    wallets,
    changeAccount,
  ]);

  return { isWatching, watchWallet };
}