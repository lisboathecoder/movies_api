import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.movie.createMany({
        data: [
        { title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', duration: 142, genre: 'Drama', rating: 9.23 },
        { title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', duration: 175, genre: 'Crime', rating: 9.20 },
        { title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', duration: 152, genre: 'Action', rating: 9.20 },
        { title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', duration: 154, genre: 'Crime', rating: 8.92 },
        { title: 'Forrest Gump', description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.', duration: 142, genre: 'Drama', rating: 8.28 },
        { title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', duration: 148, genre: 'Sci-Fi', rating: 8.98 },
        { title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', duration: 136, genre: 'Sci-Fi', rating: 8.87 },
        { title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', duration: 169, genre: 'Sci-Fi', rating: 8.66 },
        { title: 'The Lion King', description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.', duration: 88, genre: 'Animation', rating: 8.75 },
        { title: 'Gladiator', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', duration: 155, genre: 'Action', rating: 8.85 }
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });