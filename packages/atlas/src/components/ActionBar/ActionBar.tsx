import BN from 'bn.js'
import { MouseEvent, forwardRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Fee } from '@/components/Fee'
import { Text } from '@/components/Text'
import { TooltipProps } from '@/components/Tooltip'
import { ButtonProps } from '@/components/_buttons/Button'
import { useHasEnoughBalance } from '@/hooks/useHasEnoughBalance'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  ActionBarContainer,
  ActionButtonPrimary,
  DraftsBadgeContainer,
  FeeContainer,
  SecondaryButton,
  StyledInformation,
} from './ActionBar.styles'

export type ActionDialogButtonProps = {
  text?: string
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void
} & Omit<ButtonProps, 'children'>

type ActionDialogInfoBadge = {
  text: string
  tooltip?: TooltipProps
}

export type ActionBarProps = {
  fee?: BN
  feeLoading?: boolean
  infoBadge?: ActionDialogInfoBadge
  primaryButton: ActionDialogButtonProps
  secondaryButton?: ActionDialogButtonProps
  isActive?: boolean
  skipFeeCheck?: boolean
  className?: string
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ fee, feeLoading, isActive = true, className, primaryButton, secondaryButton, infoBadge, skipFeeCheck }, ref) => {
    const smMatch = useMediaMatch('sm')
    const { signTransactionHandler, loadingState } = useHasEnoughBalance(
      !!feeLoading,
      fee,
      primaryButton.onClick,
      skipFeeCheck
    )

    return (
      <ActionBarContainer ref={ref} className={className} isActive={isActive}>
        <FeeContainer>
          <Fee variant={smMatch ? 'h400' : 'h200'} withToken amount={fee || new BN(0)} loading={feeLoading} />
        </FeeContainer>
        {infoBadge ? (
          <DraftsBadgeContainer>
            <Text as="span" align="right" variant={smMatch ? 't200' : 't100'} color="colorText">
              {infoBadge?.text}
            </Text>
            <StyledInformation multiline placement="top-end" {...infoBadge.tooltip} />
          </DraftsBadgeContainer>
        ) : null}
        <CSSTransition
          in={!!secondaryButton}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
        >
          <SecondaryButton {...secondaryButton} variant="secondary" size={smMatch ? 'large' : 'medium'}>
            {secondaryButton?.text}
          </SecondaryButton>
        </CSSTransition>
        <ActionButtonPrimary
          {...primaryButton}
          disabled={primaryButton.disabled || loadingState}
          onClick={signTransactionHandler}
          secondaryButtonExists={!!secondaryButton}
          size={smMatch ? 'large' : 'medium'}
          type="submit"
        >
          {loadingState ? 'Please wait...' : primaryButton.text}
        </ActionButtonPrimary>
      </ActionBarContainer>
    )
  }
)

ActionBar.displayName = 'ActionBar'
