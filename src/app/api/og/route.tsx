import { ImageResponse } from 'next/server';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge';

export async function GET(request: Request) {

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const user = searchParams.get("user")

  return new ImageResponse(
    (
      <div tw="flex p-2 flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-wrap items-center justify-center">
          {user ? (
            <div tw="flex font-extrabold text-4xl tracking-tight">
              <span>Tanyakan
                <span tw='text-blue-500 ml-2 mr-2'>apa aja</span>
                ke {decodeURIComponent(user)} dengan </span>
              <span tw='text-blue-500 ml-2'>anonim</span>
            </div>
          ) : (
            <div tw="flex font-extrabold text-4xl tracking-tight">
              <span>Tanyakan
                <span tw='text-blue-500 ml-2 mr-2'>apa aja</span>
                ke saya dengan </span>
              <span tw='text-blue-500 ml-2'>anonim</span>
            </div>
          )}
        </div>
        <div tw="flex mb-2 items-center justify-center mt-10">
          <svg width="100" height="80" viewBox="0 0 500 419" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.524 0H61.4764C27.5274 0 0 25.5531 0 57.0674V314.823C0 346.342 27.5221 371.896 61.4764 371.896H109.681L109.708 419L173.157 371.896H438.524C472.478 371.896 500 346.342 500 314.823V57.0674C500 25.5531 472.478 0 438.524 0ZM270.095 308.042H217.156V258.895H270.095V308.042ZM306.71 184.99C284.79 192.763 270.735 207.759 270.735 230.135H216.511C216.511 173.098 255.718 155.936 280.691 150.338C296.004 146.906 310.736 142.423 311.566 123.086C312.238 107.496 302.405 88.2821 260.743 89.053C214.575 89.9123 211.486 121.309 211.338 131.723L157.114 132.347C157.045 128.929 157.135 98.2402 182.821 73.9097C201.848 55.884 228.82 46.746 262.986 46.746C342.643 46.746 362.479 93.8111 363.696 118.662C365.727 160.213 330.519 176.55 306.71 184.99Z" fill="#8ABCD7" />
          </svg>
          <h1 tw="font-extrabold text-6xl tracking-tight ml-2">TanyaAja</h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}