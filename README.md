# TypeORM 0.3.26 Many-to-Many Regression Reproduction

## Setup

1. Install dependencies: `npm install`
2. Create PostgreSQL database and run migration: `psql -d postgres -f migration.sql`
3. Update database connection in `test.ts` if needed

## Run Test

```bash
npm test
```

## Expected Behavior (<=0.3.25)

- Junction table populated
- Vet query returns 2 specialties

```bash
> npm install typeorm@0.3.25 --no-save && npm test

changed 1 package, and audited 140 packages in 1s

found 0 vulnerabilities

> type-orm-repro@1.0.0 test
> ts-node test.ts

query: SELECT version()
query: SELECT * FROM current_schema()
query: SELECT "Specialty"."name" AS "Specialty_name" FROM "specialty" "Specialty" WHERE "Specialty"."name" IN ($1, $2) -- PARAMETERS: ["dogs","cats"]
query: START TRANSACTION
query: INSERT INTO "specialty"("name") VALUES ($1), ($2) -- PARAMETERS: ["dogs","cats"]
query: COMMIT
query: SELECT "Specialty"."name" AS "Specialty_name" FROM "specialty" "Specialty" WHERE "Specialty"."name" IN ($1, $2) -- PARAMETERS: ["dogs","cats"]
query: START TRANSACTION
query: INSERT INTO "vet"("name") VALUES ($1) RETURNING "id" -- PARAMETERS: ["Carlos Salazar"]
query: INSERT INTO "vet_specialty"("vet_id", "specialty_name") VALUES ($1, $2), ($3, $4) -- PARAMETERS: [1,"dogs",1,"cats"]
query: COMMIT
query: SELECT DISTINCT "distinctAlias"."Vet_id" AS "ids_Vet_id" FROM (SELECT "Vet"."id" AS "Vet_id", "Vet"."name" AS "Vet_name", "Vet__Vet_specialties"."name" AS "Vet__Vet_specialties_name" FROM "vet" "Vet" LEFT JOIN "vet_specialty" "Vet_Vet__Vet_specialties" ON "Vet_Vet__Vet_specialties"."vet_id"="Vet"."id" LEFT JOIN "specialty" "Vet__Vet_specialties" ON "Vet__Vet_specialties"."name"="Vet_Vet__Vet_specialties"."specialty_name" WHERE (("Vet"."id" = $1))) "distinctAlias" ORDER BY "Vet_id" ASC LIMIT 1 -- PARAMETERS: [1]
query: SELECT "Vet"."id" AS "Vet_id", "Vet"."name" AS "Vet_name", "Vet__Vet_specialties"."name" AS "Vet__Vet_specialties_name" FROM "vet" "Vet" LEFT JOIN "vet_specialty" "Vet_Vet__Vet_specialties" ON "Vet_Vet__Vet_specialties"."vet_id"="Vet"."id" LEFT JOIN "specialty" "Vet__Vet_specialties" ON "Vet__Vet_specialties"."name"="Vet_Vet__Vet_specialties"."specialty_name" WHERE ( (("Vet"."id" = $1)) ) AND ( "Vet"."id" IN (1) ) -- PARAMETERS: [1]
Vet specialties count: 2
Expected: 2, Actual: 2

> psql -d postgres -c "SELECT * FROM vet_specialty"
 id | vet_id | specialty_name
----+--------+----------------
  1 |      1 | dogs
  2 |      1 | cats
(2 rows)
```

## Actual Behavior (>=0.3.26)

- Junction table rows contain empty values
- Vet query returns 0 specialties

```bash
> npm install typeorm@0.3.26 --no-save && npm test

changed 1 package, and audited 140 packages in 933ms

found 0 vulnerabilities

> type-orm-repro@1.0.0 test
> ts-node test.ts

query: SELECT version()
query: SELECT * FROM current_schema()
query: SELECT "Specialty"."name" AS "Specialty_name" FROM "specialty" "Specialty" WHERE "Specialty"."name" IN ($1, $2) -- PARAMETERS: ["dogs","cats"]
query: START TRANSACTION
query: INSERT INTO "specialty"("name") VALUES ($1), ($2) -- PARAMETERS: ["dogs","cats"]
query: COMMIT
query: SELECT "Specialty"."name" AS "Specialty_name" FROM "specialty" "Specialty" WHERE "Specialty"."name" IN ($1, $2) -- PARAMETERS: ["dogs","cats"]
query: START TRANSACTION
query: INSERT INTO "vet"("name") VALUES ($1) RETURNING "id" -- PARAMETERS: ["Carlos Salazar"]
query: INSERT INTO "vet_specialty"("vet_id", "specialty_name") VALUES (DEFAULT, DEFAULT), (DEFAULT, DEFAULT) RETURNING "id"
query: COMMIT
query: SELECT DISTINCT "distinctAlias"."Vet_id" AS "ids_Vet_id" FROM (SELECT "Vet"."id" AS "Vet_id", "Vet"."name" AS "Vet_name", "Vet__Vet_specialties"."name" AS "Vet__Vet_specialties_name" FROM "vet" "Vet" LEFT JOIN "vet_specialty" "Vet_Vet__Vet_specialties" ON "Vet_Vet__Vet_specialties"."vet_id"="Vet"."id" LEFT JOIN "specialty" "Vet__Vet_specialties" ON "Vet__Vet_specialties"."name"="Vet_Vet__Vet_specialties"."specialty_name" WHERE (("Vet"."id" = $1))) "distinctAlias" ORDER BY "Vet_id" ASC LIMIT 1 -- PARAMETERS: [1]
query: SELECT "Vet"."id" AS "Vet_id", "Vet"."name" AS "Vet_name", "Vet__Vet_specialties"."name" AS "Vet__Vet_specialties_name" FROM "vet" "Vet" LEFT JOIN "vet_specialty" "Vet_Vet__Vet_specialties" ON "Vet_Vet__Vet_specialties"."vet_id"="Vet"."id" LEFT JOIN "specialty" "Vet__Vet_specialties" ON "Vet__Vet_specialties"."name"="Vet_Vet__Vet_specialties"."specialty_name" WHERE ( (("Vet"."id" = $1)) ) AND ( "Vet"."id" IN (1) ) -- PARAMETERS: [1]
Vet specialties count: 0
Expected: 2, Actual: 0

> psql -d postgres -c "SELECT * FROM vet_specialty"
 id | vet_id | specialty_name
----+--------+----------------
  1 |        |
  2 |        |
(2 rows)
```

## Other Notes

Seems related to [PR #11114](https://github.com/typeorm/typeorm/pull/11114)