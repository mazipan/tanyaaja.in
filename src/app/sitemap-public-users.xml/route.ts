import { BASEURL, getAllPublicUsersForSiteMap } from '@/lib/api'
import type { UserProfile } from '@/lib/types'

function generateSitemap(data: UserProfile[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    ${data
      .map((user) => {
        return `
           <url>
              <loc>${`${BASEURL}/p/${user.slug}`}</loc>
               <lastmod>${new Date()}</lastmod>
           </url>
         `
      })
      .join('\n')}
   </urlset>`
}

export async function GET() {
  const allPublicUsers = await getAllPublicUsersForSiteMap()
  const sitemap = generateSitemap(allPublicUsers.data || [])

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml',
    },
  })
}
