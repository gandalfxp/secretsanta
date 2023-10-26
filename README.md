# Secret Santa

In my family, we celebrate Christmas with Secret Santa. Everyone has to draw a
ticket containing another person's name and his wishes. After that, we have
around one month to get a gift for that person. During that period, you can't
tell anyone who you drew. On Christmas Eve, everybody gets to unpack their
presents and has to guess from which person their gift originated.

Some of my family members live very far away, so it is hard to get their tickets
to them without reading what's on them. I tried to simplify this process by
developing a web application. Someone can create an event, share the link to it,
and others can join. After the join-deadline, or however you want to call it,
runs out, you get an email with your ticket. The email also contains other
important information, like how expensive a gift should be. You can definitely
tell that the intended use of the application is for Christmastime, but it can
also be useful for other events.

## Screenshots

Creating an event | Joining an event
--- | ---
![](https://i.postimg.cc/cLfgpCkF/secretsanta-create.png) | ![](https://i.postimg.cc/SKq2k4wk/secretsanta-join.png)

## Run on local system

You need to have `node, npm` and a running instance of `Mongo DB` installed.

**1. Clone the repository and navigate into it:**

`git clone https://github.com/theohoppe3/secretsanta.git && cd ./secretsanta`

**2. Install dependencies:**

`npm i`

**3. Compile TypeScript:**

`npx tsc`

**4. Run the web server:**

`node app`

You can see a detailed list of all dependencies inside of `package.json`. If you
need a little bit of customization, take a look at `.env`. Note that in order to
be able to send emails, you have to modify `mailParticipants()` inside of `controllers/create.ts`.
Currently, I am using a test account, supplied by `nodemailer`.