import { FC } from 'react'
import { useNavigate } from 'react-router'

import { StorageDataObjectFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets/assets.hooks'

import { ActivityItem, ActivityItemProps } from './ActivityItem'
import { ActivitiesRecord, useActivities } from './MemberActivity.hooks'
import {
  GridRowWrapper,
  OverviewContainer,
  OverviewItem,
  OverviewTextContainer,
  StyledIconWrapper,
  StyledLink,
} from './MemberActivity.styles'

const getDescription = (activity: ActivitiesRecord) => {
  switch (activity.type) {
    case 'Bid':
      return (
        <>
          {activity.from.handle} placed a bid for{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.bidAmount} withToken />
        </>
      )
    case 'Sale':
      return (
        <>
          {activity.from?.handle} sold NFT to{' '}
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)} onClick={(e) => e.stopPropagation()}>
            {activity.to?.handle}
          </StyledLink>{' '}
          NFT for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
        </>
      )
    case 'Purchase':
      return (
        <>
          {activity.from?.handle} purchased NFT for{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken /> from{' '}
          <StyledLink to={absoluteRoutes.viewer.member(activity.to?.handle)} onClick={(e) => e.stopPropagation()}>
            {activity.to?.handle}{' '}
          </StyledLink>
        </>
      )
    case 'Listing':
      return (
        <>
          {activity.from?.handle} listed NFT{' '}
          {activity.typeName === 'NftSellOrderMadeEvent' && activity.price && (
            <>
              for <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
            </>
          )}
        </>
      )
    case 'Removal':
      return <>{activity.from?.handle} removed NFT from sale</>
    case 'Mint':
      return <>{activity.from?.handle} minted new NFT</>
    case 'Withdrawal':
      return <>{activity.from.handle} withdrew a bid</>
    case 'Price change':
      return (
        <>
          {activity.from?.handle} changed price to{' '}
          <NumberFormat as="span" color="inherit" format="short" value={activity.price} withToken />
        </>
      )
  }
}

type MemberActivityProps = {
  memberId?: string
  sort?: 'createdAt_ASC' | 'createdAt_DESC'
}

const PLACEHOLDERS_COUNT = 8

export const MemberActivity: FC<MemberActivityProps> = ({ memberId, sort = 'createdAt_DESC' }) => {
  const { activities, loading, activitiesTotalCounts } = useActivities(memberId, sort)
  const navigate = useNavigate()
  const placeholderItems = Array.from({ length: PLACEHOLDERS_COUNT }, () => ({ id: undefined }))
  const items = activities && !loading ? activities : (placeholderItems as ActivitiesRecord[])
  return (
    <section>
      {activities?.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="Go out there and explore!" variant="small" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <LayoutGrid>
              {items?.map((activity, i) => (
                <GridItem key={i} colSpan={{ base: 12 }}>
                  <ActivityItemWithResolvedAsset
                    loading={!activities || loading}
                    onItemClick={() => navigate(absoluteRoutes.viewer.video(activity.video?.id))}
                    date={activity?.date}
                    type={activity?.type}
                    title={activity?.video?.title}
                    description={getDescription(activity)}
                    thumbnailPhoto={activity.video?.thumbnailPhoto}
                  />
                </GridItem>
              ))}
            </LayoutGrid>
          </GridItem>
          {!loading && activitiesTotalCounts && (
            <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
              <Text as="span" variant="h500">
                Overview
              </Text>
              <OverviewContainer>
                <OverviewItem>
                  <StyledIconWrapper icon={<SvgActionBuyNow />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs bought
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsBoughts}
                    </Text>
                  </OverviewTextContainer>
                </OverviewItem>
                <OverviewItem>
                  <StyledIconWrapper icon={<SvgActionSell />} size="large" />
                  <OverviewTextContainer>
                    <Text as="span" variant="t100" color="colorText">
                      NFTs sold
                    </Text>
                    <Text as="span" variant="t300">
                      {activitiesTotalCounts.nftsSold}
                    </Text>
                  </OverviewTextContainer>
                </OverviewItem>
                <GridRowWrapper>
                  <OverviewItem>
                    <StyledIconWrapper icon={<SvgActionMint />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        NFTs created
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsIssued}
                      </Text>
                    </OverviewTextContainer>
                  </OverviewItem>
                  <OverviewItem>
                    <StyledIconWrapper icon={<SvgActionBid />} size="large" />
                    <OverviewTextContainer>
                      <Text as="span" variant="t100" color="colorText">
                        Bid placed
                      </Text>
                      <Text as="span" variant="t300">
                        {activitiesTotalCounts.nftsBidded}
                      </Text>
                    </OverviewTextContainer>
                  </OverviewItem>
                </GridRowWrapper>
              </OverviewContainer>
            </GridItem>
          )}
        </LayoutGrid>
      )}
    </section>
  )
}

type ActivityItemWithResolvedAssetProps = {
  thumbnailPhoto?: StorageDataObjectFieldsFragment | null
} & Omit<ActivityItemProps, 'thumnailUri'>

export const ActivityItemWithResolvedAsset: FC<ActivityItemWithResolvedAssetProps> = ({
  thumbnailPhoto,
  ...restProps
}) => {
  const { url } = useAsset(thumbnailPhoto)
  return <ActivityItem {...restProps} thumnailUri={url || ''} />
}
