1: Discrminiated Union exercise. Within this app, a task can be in different states. This will make data present only when it makes sense. (senior dev move)
2: Defining a discriminated union. Created the file types/task.tsx to define multiple states. Now we define the BlockedTask while combining the task types. We want the developer to provide a reason and reference the blocked state when it occurs.
3:Type Guards.
4:Connecting to a database(Prisma). database schema needs to match the logic to execute this code.
5: Organizing the structure. folder structure matters for scalability. Seperate the domain logic (what) from UI components (how).
6: Server-side fetching pattern. using Next.JS, we want to fetch data on the serve whenever possible. this will reduce amount of javaSript sent to the browser and imporves SEO and Speed.
7: Loading Skeleton. instead of a blank white screen, we using a loading.tsx file to show a skeleton of the UI since the page may take some time to fetch data from the database. this improves UX.
8: Singleton Pattern. this is a bridge in our code to talk to the database. With Next.js, the server can hot reload frequently during development. this will prevent dozens of active connections with a badly written function and prevents crashing the database. this ensures when the server reloads we keep using the same single connection.
9: frontend - interfaces are the rules, components are the actos and the app is the stage. Backend - prisma is the translator and supabase is the vault.
Prisma, type safety, its the bridge between the typescript code and supabase vault. without it, you would have to write raw SQL strings that are prone to typos and errors.
Supabase, database, when you "Save" a task, it's written into a physical table on the server in ther cloud. It also handles storage, security, and infrastructure so you don't have to manage an actual server.
How it all works together
- UI Lever: a user clicks "complete" on a task card
- Logic Level: a server action (a special next.js function) is triggered.
- ORM Level (prisma): inside the actio, you call the function ({ where: { id: '1'}, data: { status: 'COMPLETED' } }).
- Database Level (Supabase): Prisma sends this to supabase. supabase updates the row in the task table and sends back a "Success" message.
-Revalidation: Next.js sees the data changed, refreshes the server component, and the UI updates to show the task in the "Completed" column.
