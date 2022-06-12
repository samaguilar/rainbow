import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useAccountProfile from './useAccountProfile';
import useAccountSettings from './useAccountSettings';
import { useWallets, useWebData } from './index';
import { walletsSetSelected, walletsUpdate } from '@rainbow-me/redux/wallets';
import { useTheme } from '@rainbow-me/theme';
import { getNextEmojiWithColor } from '@rainbow-me/utils/profileUtils';

export default function useUpdateEmoji() {
  const { accountName } = useAccountProfile();
  const { wallets, selectedWallet } = useWallets();
  const { updateWebProfile, getWebProfile } = useWebData();
  const { accountAddress } = useAccountSettings();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const saveInfo = useCallback(
    async (color, emoji) => {
      const walletId = selectedWallet.id;
      const newWallets = {
        ...wallets,
        [walletId]: {
          ...wallets[walletId],
          addresses: wallets[walletId].addresses.map(
            (singleAddress: { address: string }) =>
              singleAddress.address.toLowerCase() ===
              accountAddress.toLowerCase()
                ? {
                    ...singleAddress,
                    ...(color !== undefined && { color }),
                    ...(emoji !== undefined && { emoji }),
                  }
                : singleAddress
          ),
        },
      };
      console.log(newWallets);

      await dispatch(walletsSetSelected(newWallets[walletId]));
      await dispatch(walletsUpdate(newWallets));
      updateWebProfile(
        accountAddress,
        emoji,
        color !== undefined && colors.avatarBackgrounds[color]
      );
    },
    [
      accountAddress,
      colors.avatarBackgrounds,
      dispatch,
      selectedWallet.id,
      updateWebProfile,
      wallets,
    ]
  );

  const setNextEmoji = useCallback(() => {
    const walletId = selectedWallet.id;
    const { label } =
      wallets[walletId].addresses.find(
        ({ address }: { address: string }) =>
          address.toLowerCase() === accountAddress.toLowerCase()
      ) || {};
    const maybeEmoji = label?.split(' ')[0] ?? '';
    const { emoji, colorIndex } = getNextEmojiWithColor(maybeEmoji);
    const name = `${emoji} ${accountName}`;
    saveInfo(name, colorIndex);
  }, [accountAddress, accountName, saveInfo, selectedWallet.id, wallets]);

  return {
    getWebProfile,
    saveInfo,
    setNextEmoji,
  };
}
