import {DataSource} from "typeorm";
import {Vet, Specialty, VetSpecialty} from "./entities";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    database: "postgres",
    entities: [Vet, Specialty, VetSpecialty],
    synchronize: false,
    logging: true
});

async function test() {
    await dataSource.initialize();

    const vetRepository = dataSource.getRepository(Vet);
    const specialtyRepository = dataSource.getRepository(Specialty);

    const dogs = new Specialty();
    dogs.name = "dogs";
    const cats = new Specialty();
    cats.name = "cats";

    await specialtyRepository.save([dogs, cats]);

    const carlosSalazar = new Vet();
    carlosSalazar.name = "Carlos Salazar";
    carlosSalazar.specialties = [dogs, cats];

    await vetRepository.save(carlosSalazar);

    const vetQuery = await vetRepository.findOne({
        where: { id: carlosSalazar.id },
        relations: { specialties: true }
    });

    console.log("Vet specialties count:", vetQuery?.specialties?.length || 0);
    console.log("Expected: 2, Actual:", vetQuery?.specialties?.length || 0);

    await dataSource.destroy();
}

test().catch(console.error);
