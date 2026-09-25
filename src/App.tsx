import { Background, Cursor } from 'animal-island-ui'
import { SceneProvider } from './store/sceneStore'
import { Hero } from './ui/Hero'
import { PageFooter, TopBar } from './ui/Layout'
import { SceneSection } from './ui/SceneSection'
import { SenseSection } from './ui/SenseSection'
import { TimelineSection } from './ui/TimelineSection'

export default function App() {
  return (
    <SceneProvider>
      <Cursor type="default" forceAll={false}>
        <Background type="dots-brown">
          <TopBar />
          <main>
            <Hero />
            <SceneSection />
            <TimelineSection />
            <SenseSection />
          </main>
          <PageFooter />
        </Background>
      </Cursor>
    </SceneProvider>
  )
}
