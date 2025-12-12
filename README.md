# 🗣️ TalkNest

A modern, feature-rich discussion and debate platform built with Next.js 15. Create communities, engage in discussions, or participate in structured debates with side-based voting.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Features

### 🏘️ Community Management
- Create and join communities
- Real-time member counts
- Community-specific post feeds
- Optimistic UI for instant join/leave feedback

### 📝 Post Types
- **Discussions**: Standard forum-style posts
- **Debates**: Structured debates with Side A vs Side B
- Rich content with voting and comments

### ⚔️ Debate Arena
- Split-view layout for Side A and Side B
- Custom side labels (e.g., "Pro-Vim" vs "Pro-VSCode")
- **Side voting lock**: Users can only vote on one side
- Spectator mode for neutral participation

### 🗳️ Voting System
- Upvote/downvote on posts and comments
- Real-time score updates with optimistic UI
- Vote toggling and switching
- Debate-specific: One side per user enforcement

### 👤 User Features
- User authentication (register/login)
- Profile pages with post history
- Bio and settings management
- Custom user menus

### 🎨 Modern UI/UX
- Professional dark theme with blue accents
- Fully responsive design (mobile-ready)
- Smooth animations and transitions
- Clean, corporate aesthetic

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: Custom JWT-based sessions
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: JavaScript (JSX)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishthakkar1218/TalkNest.git
   cd TalkNest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_64_character_secret_key
   ```

   To generate a JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
TalkNest/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── c/[slug]/          # Dynamic community pages
│   ├── post/[id]/         # Post detail pages
│   ├── profile/           # User profile
│   ├── settings/          # User settings
│   ├── create/            # Create post page
│   ├── create-community/  # Create community page
│   ├── actions.js         # Server actions
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions
│   ├── auth.js           # Authentication logic
│   ├── db.js             # Database connection
│   └── utils.js          # Helper functions
├── models/                # Mongoose models
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Community.js
│   └── Vote.js
└── public/                # Static assets
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/krishthakkar1218/TalkNest)

### Other Platforms
- **Railway**: Connect GitHub repo and add environment variables
- **Render**: Use Web Service with Node environment

## 📖 Usage

### Creating a Community
1. Click "Create Community" in the user menu
2. Enter a unique community name and description
3. Automatically join as creator

### Creating a Post
1. Navigate to "Create Post"
2. Choose between **Discussion** or **Debate**
3. For debates, define Side A and Side B labels
4. Select a community and submit

### Participating in Debates
- Vote on comments from **one side only** (locked after first vote)
- Comment as Side A, Side B, or Spectator (neutral)
- View split-view layout with clear side separation

## 🎯 Key Features Explained

### Optimistic UI
Instant visual feedback for:
- Joining/leaving communities
- Voting on posts and comments
- Real-time score updates

### Debate Side Lock
Once you vote on any comment from Side A or Side B, you cannot vote on the opposite side. This ensures fair participation and prevents vote manipulation.

### Spectator Mode
Users can participate in debates without choosing a side by commenting as a "Spectator." These neutral comments appear in a separate section.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Krish Thakkar**
- GitHub: [@krishthakkar1218](https://github.com/krishthakkar1218)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Discussing! 🎉**
