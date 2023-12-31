
# Instacamp Blog App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
This app, partially inspired by [Dev.to](https://dev.to/) is a small app platform as part of my personal challenge to help me improve my coding knowledge.

InstaCamp is made with the Next.js React web framework.

## Table of contents

- [Instacamp Blog App](#instacamp-blog-app)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
  - [Learn more](#learn-more)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
    - [TO-DO list](#to-do-list)
    - [Useful resources](#useful-resources)
  - [Setting up the Database](#setting-up-the-database)
  - [Run in dev mode](#run-in-dev-mode)
  - [Run in prod mode](#run-in-prod-mode)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the web app depending on their device's screen size
- Create blog posts with rich content, comment on other posts, like the posts/comments
- Users can tag/bookmark the posts they are interested in
- View a list of their own posts on their account or visit the list of saved posts list(bookmarked)
- Copy the post link to their clipboard with one click

### Screenshot

- Desktop view

![image]()

- Mobile view

![image]()

### Links

- Live Site URL: ...

## My process

### Built with

- Semantic HTML5 markup
- [Next.js web framework](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS framework](https://tailwindcss.com/)

## Learn more

- Official website: https://nextjs.org/
- Docs: https://nextjs.org/docs
- Source: https://github.com/vercel/next.js

### What I learned

Comming soon ...

### Continued development

### TO-DO list

Implement next features:

- Finish welcome/home page
- Complete page for searching posts by topic/tag(or incorporate it with the home page due the similar logic)
- User can make comment on other comment(maybe something like @mention or comment reply)
- Cover more code with tests
- Register/Login and customize their account
- Implement Follow/Unfollow users feature
- Receive activity messages when:
  - other users comment or like their posts/comments
  - other users start to follow them


### Useful resources

- Install dependencies with `npm run i/install` or `yarn install`

## Setting up the Database

First supply a valid DATABASE_URL to your .env.local:

```bash
mysql://username:password@127.0.0.1:3306/my_database
```

Put your own configuration for username, password and database name.

Make sure that you update your db provider in the schema.prisma file to match your database provider:

```bash
datasource db {
  provider = "mysql" or "postgresql" <- your db provider name
  url      = env("DATABASE_URL")
}
```

Seed your db with command:

```bash
npm run seed
# or
yarn seed
# or
pnpm seed
```

## Run in dev mode

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Run in prod mode

Run the development server:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

```bash
npm run start
# or
yarn start
# or
pnpm start
```


Now you can visit [`localhost:3000`](http://localhost:3000) from your browser.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Author

- Website - [Daniel Molnar](https://github.com/Daniel4lm)
- Facebook - [@danijel.molnar.90](https://www.facebook.com/danijel.molnar.90/)
