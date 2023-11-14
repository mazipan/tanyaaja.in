import { Tweet } from 'react-tweet'

import styles from './tweet.module.css'

const TWEETS = [
  '1712849661550329929', // @lynxluna
  '1712776713963450491', // @Maz_Ipan
  '1713003572634485039', // @pveyes
  '1711577215169933817', // @qepo_s
  '1711254574244520075', // @mgilangjanuar
  '1712441248190185880', // @th_clarence
]

export const TweetSection = () => {
  return (
    <section className="container max-w-[58rem] mt-24 mb-16 flex flex-col justify-center items-center gap-4">
      <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
        Jawab di publik
      </h2>
      <p className="text-center text-md md:text-lg lg:text-xl text-muted-foreground">
        Bagikan pertanyaan dan jawaban yang kamu di publik
      </p>
      <div className="md:columns-2 lg:columns-3 gap-x-4 mt-8">
        {TWEETS.map((value) => {
          return (
            <div key={value} className={styles.tweet}>
              {/*
              // @ts-ignore */}
              <Tweet id={value} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
