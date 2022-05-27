import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IS_TESTING } from 'react-native-dotenv';
import { BaseButton } from 'react-native-gesture-handler';
import RadialGradient from 'react-native-radial-gradient';
import useAccountSettings from '../../../../hooks/useAccountSettings';
import { ButtonPressAnimation } from '../../../animations';
import { CoinRowHeight } from '../../../coin-row';
import FastCoinIcon from './FastCoinIcon';
import { useTheme } from '@rainbow-me/context';
import { Text } from '@rainbow-me/design-system';
import { useAccountAsset } from '@rainbow-me/hooks';
import styled from '@rainbow-me/styled-components';
import { borders, colors, padding } from '@rainbow-me/styles';

const Circle = styled(
  IS_TESTING === 'true' ? RadialGradient : RadialGradient
).attrs(({ isFavorited, theme: { colors, isDarkMode } }) => ({
  center: [0, 15],
  colors: isFavorited
    ? [
        colors.alpha('#FFB200', isDarkMode ? 0.15 : 0),
        colors.alpha('#FFB200', isDarkMode ? 0.05 : 0.2),
      ]
    : colors.gradients.lightestGrey,
}))({
  borderRadius: 15,
  height: 30,
  overflow: 'hidden',
  width: 30,
});

export default React.memo(function FastCurrencySelectionRow({
  item: { uniqueId, showBalance, showFavoriteButton, onPress, theme, nativeCurrency, nativeCurrencySymbol, favorite, toggleFavorite },
}: {
  item: any;
}) {
  // TODO
  const { isDarkMode } = theme;


  const item = useAccountAsset(uniqueId, nativeCurrency);


  if (!item) {
    return null
  }

  console.log({ favorite })
  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      <ButtonPressAnimation
        onPress={onPress}
        wrapperStyle={{
          flex: 1,
        }}
      >
        <View style={[cx.rootContainer, { flex: 1, width: '100%' }]}>
          <FastCoinIcon
            address={item.mainnet_address || item.address}
            symbol={item.symbol}
            theme={theme}
          />
          <View style={[cx.innerContainer, { backgroundColor: 'blue' }]}>
            <View style={[cx.column, cx.center]}>
              <Text align="left" numberOfLines={1} size="16px" weight="medium">
                {item.name}
              </Text>
              <Text
                align="left"
                color={{ custom: theme.colors.blueGreyDark50 }}
                numberOfLines={1}
                size="12px"
                weight="medium"
              >
                {item.symbol}
              </Text>
            </View>
            {showBalance && (
              <View style={[cx.column]}>
                <Text align="right" size="12px" weight="medium">
                  {item?.native?.balance?.display ??
                    `${nativeCurrencySymbol}0.00`}
                </Text>
                <Text
                  color={{ custom: theme.colors.blueGreyDark50 }}
                  size="14px"
                >
                  {item?.balance?.display ?? ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ButtonPressAnimation>
      {showFavoriteButton && (
        <View style={[cx.fav]}>
          <ButtonPressAnimation
            onPress={toggleFavorite}
          >
            <RadialGradient
              center={[0, 15]}
              colors={[
                colors.alpha('#FFB200', isDarkMode ? 0.15 : 0),
                colors.alpha('#FFB200', isDarkMode ? 0.05 : 0.2),
              ]}
              style={{
                alignItems: 'center',
                borderRadius: 15,
                height: 30,
                justifyContent: 'center',
                overflow: 'hidden',
                paddingBottom: 5,
                width: 30,
              }}
            >
              {favorite && <Text color={{ custom: colors.yellowFavorite }}>􀋃</Text>}
            </RadialGradient>
          </ButtonPressAnimation>
          <ButtonPressAnimation>
            <RadialGradient
              center={[0, 15]}
              colors={colors.gradients.lightestGrey}
              style={{
                alignItems: 'center',
                borderRadius: 15,
                height: 30,
                justifyContent: 'center',
                overflow: 'hidden',
                paddingBottom: 3,
                width: 30,
              }}
            >
              <Text>􀅼</Text>
            </RadialGradient>
          </ButtonPressAnimation>
        </View>
      )}
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
    paddingRight: 20,
    width: 80,
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
    paddingHorizontal: 19,
  },
  rootContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: CoinRowHeight,
    paddingHorizontal: 19,
  },
});
