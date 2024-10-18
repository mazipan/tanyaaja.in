# ❓ TanyaAja

An anonymous question bank platform

## Live

[tanyaaja.in](https://tanyaaja.in/)

## Screenshots

| Homepage                                 | Publik                               | Pertanyaan                                   |
| ---------------------------------------- | ------------------------------------ | -------------------------------------------- |
| ![Homepage](screenshots/01-homepage.png) | ![Publik](screenshots/04-publik.png) | ![Pertanyaan](screenshots/05-pertanyaan.png) |

| Daftar Pertanyaan                                          | Setelan Akun                                     |
| ---------------------------------------------------------- | ------------------------------------------------ |
| ![Daftar Pertanyaan](screenshots/02-daftar-pertanyaan.png) | ![Setelan Akun](screenshots/03-setelan-akun.png) |

## Stacks

- [Next.js](https://nextjs.org/) using App Router
- [Shadcn UI](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/) for Authentication
- [Notion](https://www.notion.so/) for CMS and Database

## Setup in Local

### Preprequisites

- `node`, minimum version `18.16.0`
- `pnpm`, [see installation instruction](https://pnpm.io/installation)
- Firebase project, go to [console.firebase.google.com](https://console.firebase.google.com)
  - Activate the authentication for the web
- Notion Account
  - [Create a notion integration](https://developers.notion.com/docs/create-a-notion-integration)
  - Duplicate the template from: [TanyaAja DB Template](https://general-lady-e21.notion.site/TanyaAja-Template-d6454b3d41934057badb0e389ada5e73)
  - Add the integration to the page

### Development

- Install all dependencies, by running `pnpm install`
- Create new `.env.local` file, copy from the `.env.example` and fill it with your value from Firebase and Notion
- Run in local, using command `pnpm run dev`

## Contributing

We welcome contributions from the community as they help make our project better. Before you get started, please take a moment to read our contribution guidelines to ensure a smooth and collaborative experience.

See our contribution guidelines in these languages:

- [English](CONTRIBUTING.md)

## Support Me

- 👉 🇮🇩 [Trakteer](https://trakteer.id/mazipan/tip?utm_source=github-mazipan)
- 👉 🌍 [BuyMeACoffe](https://www.buymeacoffee.com/mazipan?utm_source=github-mazipan)
- 👉 🌍 [Paypal](https://www.paypal.me/mazipan?utm_source=github-mazipan)
- 👉 🌍 [Ko-Fi](https://ko-fi.com/mazipan?utm_source=github-mazipan)

---

Copyright © 2023 by Irfan Maulana
