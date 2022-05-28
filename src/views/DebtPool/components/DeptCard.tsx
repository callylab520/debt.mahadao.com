import React, { useMemo } from 'react';
import styled from 'styled-components';
import Loader from "react-spinners/PulseLoader";

import { getDisplayBalance } from '../../../utils/formatBalance';
import useClaimReward from '../../../hooks/callbacks/useClaimReward';
import useGetDebtPoolSupply from '../../../hooks/state/useGetDebtPoolSupply';
import useGetBalanceOfDebtPool from '../../../hooks/state/useGetBalanceOfDebtPool';

import Button from "../../../components/Button";
import InfoTip from "../../../components/InfoTip";
import IconLoader from "../../../components/IconLoader";
import useGetDebtPoolTokenRewards from "../../../hooks/state/useGetDebtPoolTokenRewards";
// import DataField from "../../../components/DataField";
// import theme from "../../../theme";

interface DeptCardProps {
  price: number;
  symbol: string;
}

const HomeCard: React.FC<DeptCardProps> = ({ price, symbol }) => {
  const arthTotalSupply = useGetDebtPoolSupply(symbol);
  const arthBalanceOf = useGetBalanceOfDebtPool(symbol);

  const arthEarned = useGetDebtPoolTokenRewards(symbol, 'ARTH');
  const mahaEarned = useGetDebtPoolTokenRewards(symbol, 'MAHA');
  const usdcEarned = useGetDebtPoolTokenRewards(symbol, 'USDC');

  const claimCallback = useClaimReward(symbol);

  const depositShare = useMemo(() =>
    (Number(getDisplayBalance(arthBalanceOf.value, 18, 3)) / Number(getDisplayBalance(arthTotalSupply.value, 18, 3))) * 100,
    [arthBalanceOf, arthTotalSupply]
  );

  const hasClaimableAmount = useMemo(() => {
    if (arthEarned.isLoading || mahaEarned.isLoading || usdcEarned.isLoading) {
      return false
    } else if (arthEarned.value.gt(0) || mahaEarned.value.gt(0) || usdcEarned.value.gt(0)) {
      return true
    }
  }, [arthEarned.isLoading, arthEarned.value, mahaEarned.isLoading, mahaEarned.value, usdcEarned.isLoading, usdcEarned.value])

  return (
    <Wrapper>
      <Card className={'material-primary'}>
        <CardHeader>
          <IconLoader iconName={symbol} iconType="tokenSymbol" width={44} className="m-r-4" />
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', textAlign: 'left' }}
          >
            <span>{`${symbol} into Debt`}</span>
          </div>
        </CardHeader>
        <CardContent>
          <CardSection>
            <TextWithIcon>Total Deposited</TextWithIcon>
            <StyledValue>
              {Number(getDisplayBalance(arthTotalSupply.value, 18, 3)).toLocaleString() || 0} {symbol}
            </StyledValue>
          </CardSection>
          <CardSection>
            <TextWithIcon>Your Allocation</TextWithIcon>
            <StyledValue>
              {Number(getDisplayBalance(arthBalanceOf.value, 18, 3)).toLocaleString() || 0} {symbol}
            </StyledValue>
          </CardSection>
          <CardSection>
            <TextWithIcon>Your Deposit Share</TextWithIcon>
            <StyledValue>
              {depositShare.toFixed(2)}%
            </StyledValue>
          </CardSection>
          <CardSection>
            <TextWithIcon>Your Rewards</TextWithIcon>
            <StyledValue>
              {
                arthEarned.isLoading
                  ? <Loader color={'#ffffff'} loading={true} size={4} margin={2} />
                  : Number(getDisplayBalance(arthEarned.value, 18, 5)).toLocaleString('en-US',
                    { minimumFractionDigits: 5, maximumFractionDigits: 8 })
              } ARTH
            </StyledValue>
          </CardSection>
          <CardSection className="m-t-4 m-b-4">
            <TextWithIcon></TextWithIcon>
            <StyledValue>
              {
                mahaEarned.isLoading
                  ? <Loader color={'#ffffff'} loading={true} size={4} margin={2} />
                  : Number(getDisplayBalance(mahaEarned.value, 18, 5)).toLocaleString('en-US',
                    { minimumFractionDigits: 5, maximumFractionDigits: 8 })
              } MAHA
            </StyledValue>
          </CardSection>
          <CardSection className="m-t-4 m-b-4">
            <TextWithIcon></TextWithIcon>
            <StyledValue>
              {
                usdcEarned.isLoading
                  ? <Loader color={'#ffffff'} loading={true} size={4} margin={2} />
                  : Number(getDisplayBalance(usdcEarned.value, 6, 5)).toLocaleString('en-US',
                    { minimumFractionDigits: 5, maximumFractionDigits: 8 })
              } USDC
            </StyledValue>
          </CardSection>
          <div className={"m-b-8 m-t-40"}>
            <InfoTip
              type={'Info'}
              msg={`This debt pool allows users to convert their ${symbol} token into debt to the protocol.
              The protocol promises to pay all holders of this pool their ${symbol} (polygon)
              tokens at a price of ${price}$.`}
            />
          </div>
          <div className={"m-b-16 m-t-8"}>
            <InfoTip
              type={'Warning'}
              msg={<div>
                If you can't find your allocation in this debt pool, you can raise a ticket
                to <LinkA target="_blank" href="https://support.mahadao.com/support/tickets/new">support.mahadao.com</LinkA>
              </div>}
            />
          </div>
          <ButtonToBottom>
            <Button
              loading={arthEarned.isLoading || mahaEarned.isLoading || usdcEarned.isLoading}
              disabled={!hasClaimableAmount}
              text="Claim"
              onClick={claimCallback}
            />
          </ButtonToBottom>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-width: 200px;
  width: 100%;
  border-radius: 6px;
  height: 100%;
  border: 1px solid;
  border-image-source: linear-gradient(180deg,
  rgba(255, 116, 38, 0.1) 0%,
  rgba(255, 255, 255, 0) 100%);
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 8px;
  }
`;

const CardContent = styled.div`
  display: flex;
  padding: 0 32px 32px 32px;
  align-items: self-start;
  flex-direction: column;
  margin-top: 24px;
  @media (max-width: 600px) {
    padding: 0 16px 16px 16px;
  }
`;

const LinkA = styled.a`
  color: #fff;
  text-decoration: none;
  border-bottom: 1px dotted #fff;
`;

const CardHeader = styled.h2`
  color: #fff;
  display: flex;
  font-weight: 600;
  font-size: 18px;
  justify-content: start;
  align-items: center;
  text-align: center;
  padding: 32px;
  border-bottom: 1px solid #FFFFFF20;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const StyledValue = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.88);
  text-align: right;
`;

const CardSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
  &.right {
    text-align: right;
  }
`;

const Card = styled.div`
  padding: 5px 0;
  color: #eee;
  position: relative;
  background-clip: padding-box;
  border: 1px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 116, 38, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 6px;
  @media (max-width: 768px) {
    min-height: auto;
  }
  min-height: 400px;
`;

const TextWithIcon = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  margin: 5px 0;
`;

const ButtonToBottom = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  margin-top: 12px;
  width: 100%
`;

export default HomeCard;
