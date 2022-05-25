import React from 'react';
import { StyleSheet, View } from 'react-native';
import useAccountSettings from '../../../../hooks/useAccountSettings';
import { CoinRowHeight } from '../../../coin-row';
import FastCoinIcon from './FastCoinIcon';
import { useTheme } from '@rainbow-me/context';
import { Text } from '@rainbow-me/design-system';
import { useAccountAsset } from '@rainbow-me/hooks';
import { borders, colors, padding } from '@rainbow-me/styles';

export default React.memo(function FastCurrencySelectionRow({
  item: { uniqueId },
}: {
  item: any;
}) {
  // TODO
  const theme = useTheme();
  const { nativeCurrency, nativeCurrencySymbol } = useAccountSettings();

  const item = useAccountAsset(uniqueId, nativeCurrency);

  return (
    <View style={[cx.rootContainer, cx.nonEditMode]}>
      <FastCoinIcon
        address={item.mainnet_address || item.address}
        symbol={item.symbol}
        theme={theme}
      />
      <View style={[cx.innerContainer]}>
        <View style={[cx.column, cx.center]}>
          <Text align="right" numberOfLines={1} size="16px" weight="medium">
            {item.name}
          </Text>
        </View>
        <View style={[cx.column]}>
          <Text align="right" size="12px" weight="medium">
            {item?.native?.balance?.display ?? `${nativeCurrencySymbol}0.00`}
          </Text>
          <Text color={{ custom: theme.colors.blueGreyDark50 }} size="14px">
            {item?.balance?.display ?? ''}
          </Text>
        </View>
      </View>
      <View style={[cx.fav]}>
        <Text>􀋃</Text>
        <Text>􀅼</Text>
      </View>
    </View>
  );
});

const cx = StyleSheet.create({
  bottom: {
    marginTop: 12,
  },
  center: {
    justifyContent: 'center',
  },
  checkboxContainer: {
    width: 51,
  },
  checkboxInnerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    width: 51,
  },
  checkmarkBackground: {
    ...borders.buildCircleAsObject(22),
    ...padding.object(4.5),
    backgroundColor: colors.appleBlue,
    left: 19,
    position: 'absolute',
  },
  circleOutline: {
    ...borders.buildCircleAsObject(22),
    borderWidth: 1.5,
    left: 19,
    position: 'absolute',
  },
  coinIconFallback: {
    backgroundColor: '#25292E',
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  coinIconIndicator: {
    left: 19,
    position: 'absolute',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    marginLeft: 2,
    marginRight: 19,
    marginVertical: 9.5,
  },
  fav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  flex: {
    flex: 1,
  },
  hiddenRow: {
    opacity: 0.4,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  nonEditMode: {
    paddingLeft: 19,
  },
  rootContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: CoinRowHeight,
  },
});
