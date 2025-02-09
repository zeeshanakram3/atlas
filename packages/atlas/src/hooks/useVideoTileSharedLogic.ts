import { BasicVideoFieldsFragment, FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets/assets.hooks'

export const useVideoTileSharedLogic = (video?: BasicVideoFieldsFragment | FullVideoFieldsFragment | null) => {
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video?.thumbnailPhoto)
  const { url: avatarPhotoUrl, isLoadingAsset: isLoadingAvatar } = useAsset(video?.channel?.avatarPhoto)

  const videoHref = video ? absoluteRoutes.viewer.video(video.id) : undefined

  return {
    isLoadingThumbnail: isLoadingThumbnail || !video,
    isLoadingAvatar: isLoadingAvatar || !video,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
