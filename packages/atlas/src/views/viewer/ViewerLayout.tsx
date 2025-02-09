import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { FC } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ViewErrorBoundary } from '@/components/ViewErrorFallback'
import { BottomNav } from '@/components/_navigation/BottomNav'
import { PrivateRoute } from '@/components/_navigation/PrivateRoute'
import { SidenavViewer } from '@/components/_navigation/SidenavViewer'
import { TopbarViewer } from '@/components/_navigation/TopbarViewer'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { RoutingState } from '@/types/routing'
import { NotificationsView } from '@/views/notifications'

import { CategoryView } from './CategoryView'
import { ChannelView } from './ChannelView'
import { ChannelsView } from './ChannelsView'
import { DiscoverView } from './DiscoverView'
import { EditMembershipView } from './EditMembershipView'
import { HomeView } from './HomeView'
import { MemberView } from './MemberView'
import { NewView } from './NewView'
import { NftsView } from './NftsView'
import { NotFoundView } from './NotFoundView'
import { PopularView } from './PopularView'
import { SearchView } from './SearchView'
import { VideoView } from './VideoView'

const viewerRoutes = [
  { path: relativeRoutes.viewer.search(), element: <SearchView /> },
  { path: relativeRoutes.viewer.index(), element: <HomeView /> },
  { path: relativeRoutes.viewer.popular(), element: <PopularView /> },
  { path: relativeRoutes.viewer.new(), element: <NewView /> },
  { path: relativeRoutes.viewer.discover(), element: <DiscoverView /> },
  { path: relativeRoutes.viewer.video(), element: <VideoView /> },
  { path: relativeRoutes.viewer.channels(), element: <ChannelsView /> },
  { path: relativeRoutes.viewer.channel(), element: <ChannelView /> },
  { path: relativeRoutes.viewer.category(), element: <CategoryView /> },
  { path: relativeRoutes.viewer.member(), element: <MemberView /> },
  { path: relativeRoutes.viewer.nfts(), element: <NftsView /> },
]

const ENTRY_POINT_ROUTE = absoluteRoutes.viewer.index()

export const ViewerLayout: FC = () => {
  const location = useLocation()
  const locationState = location.state as RoutingState
  const { isLoggedIn } = useUser()

  const navigate = useNavigate()
  const mdMatch = useMediaMatch('md')
  const searchOpen = useSearchStore((state) => state.searchOpen)
  const displayedLocation = locationState?.overlaidLocation || location

  return (
    <>
      <TopbarViewer />
      <SidenavViewer />
      <MainContainer>
        <ErrorBoundary
          fallback={ViewErrorBoundary}
          onReset={() => {
            navigate(absoluteRoutes.viewer.index())
          }}
        >
          <SwitchTransition>
            <CSSTransition
              timeout={parseInt(transitions.timings.routing)}
              classNames={transitions.names.fadeAndSlide}
              key={displayedLocation.pathname}
            >
              <Routes location={displayedLocation}>
                {viewerRoutes.map((route) => (
                  <Route key={route.path} {...route} />
                ))}
                <Route
                  path={relativeRoutes.viewer.editMembership()}
                  element={
                    <PrivateRoute isAuth={isLoggedIn} element={<EditMembershipView />} redirectTo={ENTRY_POINT_ROUTE} />
                  }
                />
                <Route
                  path={absoluteRoutes.viewer.notifications()}
                  element={
                    <PrivateRoute isAuth={isLoggedIn} element={<NotificationsView />} redirectTo={ENTRY_POINT_ROUTE} />
                  }
                />
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </CSSTransition>
          </SwitchTransition>
        </ErrorBoundary>
      </MainContainer>
      {!mdMatch && !searchOpen && <BottomNav />}
    </>
  )
}

const MainContainer = styled.main`
  position: relative;
  padding: var(--size-topbar-height) var(--size-global-horizontal-padding) 0;
  margin-left: var(--size-sidenav-width-collapsed);
  height: 100%;
`
