import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity("specialty")
export class Specialty {
    @PrimaryColumn({ type: "varchar", length: 80 })
    name: string;

    @ManyToMany(() => Vet, (vet) => vet.specialties)
    vets: Vet[];
}

@Entity("vet")
export class Vet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    name: string;

    @ManyToMany(() => Specialty, (specialty) => specialty.vets, { cascade: true })
    @JoinTable({
        name: "vet_specialty",
        joinColumn: { name: "vet_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "specialty_name", referencedColumnName: "name" }
    })
    specialties: Specialty[];
}

@Entity("vet_specialty")
export class VetSpecialty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "vet_id", nullable: true })
    vetId: number;

    @Column({ name: "specialty_name", length: 80, nullable: true })
    specialtyName: string;
}
