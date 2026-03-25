import { prisma } from "../db/prisma";

async function seed() {
    // Create new bookTypes, if none found
    if (await prisma.bookType.count() <= 0) {
        const bookTypes = ["leesboek", "stripboek", "encyclopedie"]
        for (const bookType of bookTypes) {
            await prisma.bookType.create({
                data: {
                    name: bookType,
                },
            });
            console.log("> Created BookType:", bookType);
        }
    }

    // Fetch all books to display count
    const booksCount = await prisma.book.count();
    console.log("> Books: ", booksCount);
}

seed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

export { seed };