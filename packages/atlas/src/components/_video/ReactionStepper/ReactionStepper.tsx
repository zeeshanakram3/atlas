import BN from 'bn.js'
import { FC, useRef, useState } from 'react'

import { VideoReaction } from '@/joystream-lib/types'

import { ReactionButton, ReactionSteppperState } from './ReactionButton'
import { ReactionBar, ReactionBarProgress, ReactionStepperWrapper, StyledTooltip } from './ReactionStepper.styles'

export type ReactionStepperProps = {
  likes?: number
  dislikes?: number
  fee?: BN
  state: ReactionSteppperState
  className?: string
  reactionPopoverDismissed?: boolean
  onReact: (reaction: VideoReaction) => Promise<boolean>
  onCalculateFee?: (reaction: VideoReaction) => Promise<void>
}

export const ReactionStepper: FC<ReactionStepperProps> = ({
  likes = 0,
  dislikes = 0,
  fee,
  state,
  className,
  reactionPopoverDismissed,
  onCalculateFee,
  onReact,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const total = likes + dislikes
  const likesPercent = total ? Number((likes / total).toFixed(4)) : 0
  const reactionStepperWrapperRef = useRef<HTMLDivElement>(null)
  const reactions: VideoReaction[] = ['like', 'dislike']
  return (
    <>
      {state === 'processing' && (
        <StyledTooltip
          text="Your reaction is being processed"
          placement="top"
          reference={reactionStepperWrapperRef.current}
        />
      )}
      <ReactionStepperWrapper className={className} ref={reactionStepperWrapperRef}>
        {reactions.map((reaction) => (
          <ReactionButton
            fee={fee}
            key={reaction}
            state={state}
            reactionPopoverDismissed={reactionPopoverDismissed}
            onReact={onReact}
            type={reaction}
            reactionsNumber={reaction === 'like' ? likes : dislikes}
            onPopoverShow={async () => {
              setIsPopoverOpen(true)
              await onCalculateFee?.(reaction)
            }}
            onPopoverHide={() => setIsPopoverOpen(false)}
            isPopoverOpen={isPopoverOpen}
          />
        ))}
        <ReactionBar loaded={state !== 'loading'}>
          <ReactionBarProgress likesPercent={likesPercent} isProcessing={state === 'processing' || isPopoverOpen} />
        </ReactionBar>
      </ReactionStepperWrapper>
    </>
  )
}
