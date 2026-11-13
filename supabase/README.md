# Admin dashboard setup (Supabase)

The admin dashboard lives at **`/admin`** (e.g. `http://localhost:5173/admin`).
It lets a signed-in admin upload cake photos to four sections:
Products, New Creations, Customized Cakes and the Cake Gallery.
The site keeps its built-in cakes and shows the uploaded ones with them.

## One-time setup

1. **Create a project** at <https://supabase.com> (the free plan is enough).

2. **Create the table and photo storage.** In the Supabase dashboard, open
   **SQL Editor → New query**, paste everything from [`schema.sql`](./schema.sql)
   and click **Run**.

3. **Turn off public sign-ups.** Otherwise anyone could create an account and
   edit the cakes. Go to **Authentication → Sign In / Providers**, turn off
   **Allow new users to sign up**, and save.

4. **Create the admin login.** Go to **Authentication → Users → Add user →
   Create new user**. Enter the admin email and password, and tick
   **Auto Confirm User**.

5. **Connect the website.** Go to **Project Settings → API** and copy the
   **Project URL** and the **anon public** key. Put them in a new file named
   `.env.local` in the project root. `.env.example` shows the format:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

   Restart `npm run dev` after creating the file.

6. **Vercel:** add the same two variables under **Project → Settings →
   Environment Variables**, then redeploy.

7. **Make the built-in cakes editable (one time).** Sign in at `/admin` and click
   **Import built-in cakes**. This copies every cake bundled with the website
   (photos and details) into Supabase. After that the website shows only the
   cakes in the database, so every cake can be edited or removed. If the import
   stops halfway (for example the connection drops), click it again - cakes
   already copied are skipped.

   Already set up before this step existed? Run [`schema.sql`](./schema.sql)
   again first - it is safe to re-run and adds what the import needs.

## How each section behaves

| Section          | Fields                                    | On the website                         |
| ---------------- | ----------------------------------------- | -------------------------------------- |
| Products         | photo, name, description, price, category | Card in "Your Indulgence", Buy button  |
| New Creations    | photo, name                               | Slide in the New Creations strip       |
| Customized Cakes | photo, occasion                           | One photo per occasion tile            |
| Cake Gallery     | photo, name, occasion, tile shape         | Newest first under its occasion filter |

- **Edit** changes the details and, optionally, the photo. The old photo file
  is removed from storage.
- **Remove** deletes the cake from the website and its photo from storage.
  A Customized Cakes tile with no photo is hidden on the website.
- Changes go live straight away. Open pages pick them up when the visitor
  returns to the tab; no redeploy is needed.
- Before the import, the bundled cakes are shown with a **Built-in** badge and
  can't be edited. If Supabase can't be reached, the website falls back to the
  bundled cakes.
