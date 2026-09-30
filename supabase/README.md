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

## How each section behaves

| Section          | Upload fields                          | On the website                                  |
| ---------------- | -------------------------------------- | ----------------------------------------------- |
| Products         | photo, name, description, price, category | Card after the built-in cakes, with a Buy button |
| New Creations    | photo, name                            | Extra slide in the slider                       |
| Customized Cakes | photo, occasion                        | Replaces that occasion's tile photo             |
| Cake Gallery     | photo, name, occasion, tile shape      | Shown first under its occasion filter           |

Deleting a photo in the dashboard removes it from the website and from storage.
If you delete a Customized Cakes upload, that tile goes back to its built-in photo.
