import { getPublicStatistics } from '@/lib/api'
import { FeatureSection } from '@/modules/HomePage/FeaturesSection'
import { HeroSection } from '@/modules/HomePage/HeroSection'
import { OpenSourceSection } from '@/modules/HomePage/OpenSourceSection'
import { StatistikSection } from '@/modules/HomePage/StatisticSection'
import { TweetSection } from '@/modules/HomePage/TweetSection'

export default async function Home() {
  const statsPromise = getPublicStatistics()

  const [stats] = await Promise.all([statsPromise])

  return (
    <main className="homepage">
      <HeroSection />
      <FeatureSection />
      <StatistikSection data={stats?.data} />
      <TweetSection />
      <OpenSourceSection />
    </main>
  )
}
