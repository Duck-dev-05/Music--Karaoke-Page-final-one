# Music Karaoke Website

A modern web application that allows users to listen to music, sing karaoke songs, and create custom playlists.

## Features

- User authentication (sign up, login, logout)
- Browse and search songs
- Karaoke mode with synchronized lyrics
- Create and manage playlists
- Responsive design for all devices

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- NextAuth.js
- Howler.js (Audio playback)

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd music-karaoke-page
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the database URL and other variables in `.env`

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── playlists/         # Playlist pages
│   └── songs/             # Song pages
├── components/            # Reusable components
├── providers/             # Context providers
└── prisma/               # Database schema
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
