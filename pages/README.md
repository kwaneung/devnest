# Why this folder exists

This empty `pages` folder is required to prevent Next.js from treating `src/pages` as the Pages Router.

With the App Router, Next.js will try to use `src/pages` as the Pages Router if this folder doesn't exist in the project root, which would conflict with our FSD architecture where `src/pages` is the FSD Pages Layer.

**Do not delete this folder.**

For more information, see: https://feature-sliced.design/docs/guides/tech/with-nextjs
