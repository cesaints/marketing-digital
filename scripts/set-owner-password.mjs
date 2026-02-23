import prismaPkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

const OWNER_EMAIL = "cesaints.engineer@gmail.com";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error(
    'Passe uma senha com pelo menos 8 caracteres. Ex: npm run set:pw -- "minhasenha123"'
  );
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { email: OWNER_EMAIL },
  update: { passwordHash },
  create: { email: OWNER_EMAIL, passwordHash, name: "Carlos" }
});

console.log("Senha definida para:", user.email);

await prisma.$disconnect();
