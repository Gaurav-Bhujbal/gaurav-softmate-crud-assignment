# How to Start the App

You need two terminals. One for the backend, one for the frontend.
Keep both open while you use the app.

## Before you start

- Node.js 18 or newer
- MySQL or MariaDB (XAMPP is fine)

## 1. Start MySQL

Open XAMPP and click **Start** next to MySQL.

## 2. Make the database

Run the file `backend/database/schema.sql` once.
You can use phpMyAdmin, MySQL Workbench, or this command:

```bash
"C:/xampp/mysql/bin/mysql.exe" -u root < backend/database/schema.sql
```

This makes the `crud_app` database with two tables: `users` and `products`.

## 3. Set the password

```bash
cd backend
cp .env.example .env
```

Open `.env` and put your MySQL password in `DB_PASSWORD`:

```ini
DB_PASSWORD=
```

Leave it empty if you use XAMPP with no password.

The file already says `your_password`. You must change it.
If you don't, the server starts fine but every page gives an error later.

## 4. Start the backend

```bash
cd backend
npm install
npm start
```

You should see:

```
Server running on port 5000
```

Leave this terminal open.

## 5. Start the frontend

In a **new** terminal:

```bash
cd frontend
npm install
npm run dev
```

You should see:

```
➜  Local:   http://localhost:5173/
```

## 6. Open the app

Go to **http://localhost:5173**

There are no users yet. Click **Register**, make an account, then log in.
Now you can add products.

## Ports

| What | Address |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000/api |
| Images | http://localhost:5000/uploads/ |

If you change `PORT` in `.env`, also change the two addresses in
`frontend/src/api/axios.js`. They are written by hand there.

## Problems

**Red error screen about `tailwindcss`**

Vite found a `postcss.config.js` file in a folder above the project.
`frontend/vite.config.js` already blocks this with:

```js
css: { postcss: { plugins: [] } },
```

Check that line is there, then restart the frontend.

**Access denied for user 'root'**

Wrong password in `backend/.env`. XAMPP usually has no password, so
`DB_PASSWORD=` with nothing after it is correct.

**Unknown database 'crud_app'**

Step 2 did not run. Run `schema.sql` again.

**Table already exists**

`schema.sql` can only run once. To start fresh:

```sql
DROP DATABASE crud_app;
```

Then run the file again. This deletes all your data.

**Port 5000 already in use**

Something else is using it. Find and stop it:

```bash
netstat -ano | findstr :5000
powershell "Stop-Process -Id <PID> -Force"
```

**It logs me out again and again**

Your token is old. Log in again.

**Images do not show**

Images go to `backend/uploads/`. This folder is made on the first upload.
Only image files under 2MB are allowed.

## Stop the app

Press `Ctrl+C` in both terminals.
