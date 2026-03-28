import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class RemoveSteamIdFromInventory1774659271194 implements MigrationInterface {
    name = 'RemoveSteamIdFromInventory1774659271194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем таблицу inventory, если ее нет, или пересоздаем, если нужно изменить схему
        const inventoryTableExists = await queryRunner.getTable("inventory");
        if (!inventoryTableExists) {
            await queryRunner.createTable(new Table({
                name: "inventory",
                columns: [
                    { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "itemIds", type: "text", isNullable: false }, // itemIds теперь обязательный
                ]
            }), true);
        } else {
            // Если таблица inventory существует, но steamId все еще есть, удаляем его
            const steamIdColumn = inventoryTableExists.columns.find(column => column.name === "steamId");
            if (steamIdColumn) {
                await queryRunner.dropColumn("inventory", "steamId");
            }
            // Убеждаемся, что itemIds - это text
            const itemIdsColumn = inventoryTableExists.columns.find(column => column.name === "itemIds");
            if (itemIdsColumn && itemIdsColumn.type !== "text") {
                // В SQLite изменение типа столбца напрямую не поддерживается, пересоздаем таблицу
                await queryRunner.query("PRAGMA foreign_keys = OFF;");
                await queryRunner.query(`CREATE TABLE "temporary_inventory" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "itemIds" text NOT NULL)`);
                await queryRunner.query(`INSERT INTO "temporary_inventory"("id", "itemIds") SELECT "id", "itemIds" FROM "inventory"`);
                await queryRunner.query(`DROP TABLE "inventory"`);
                await queryRunner.query(`ALTER TABLE "temporary_inventory" RENAME TO "inventory"`);
                await queryRunner.query("PRAGMA foreign_keys = ON;");
            }
        }

        // Добавляем столбец inventoryId в таблицу user как nullable
        const userTable = await queryRunner.getTable("user");
        const inventoryIdColumn = userTable?.columns.find(column => column.name === "inventoryId");
        if (!inventoryIdColumn) {
            await queryRunner.addColumn("user", new TableColumn({
                name: "inventoryId",
                type: "integer",
                isNullable: true,
            }));
        }

        // Создаем инвентарь для пользователей без него и связываем их
        const usersWithoutInventory = await queryRunner.query(`SELECT id FROM user WHERE inventoryId IS NULL`);
        for (const user of usersWithoutInventory) {
            await queryRunner.query(`INSERT INTO inventory (itemIds) VALUES ('[]')`);
            const lastIdResult = await queryRunner.query(`SELECT last_insert_rowid() as id`);
            const newInventoryId = lastIdResult[0].id;
            await queryRunner.query(`UPDATE user SET inventoryId = ${newInventoryId} WHERE id = ${user.id}`);
        }

        // Делаем столбец inventoryId в таблице user NOT NULL (пересоздаем таблицу)
        await queryRunner.query("PRAGMA foreign_keys = OFF;");
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nickname" varchar NOT NULL, "steamId" integer, "passwordHash" varchar, "role" varchar NOT NULL DEFAULT ('user'), "inventoryId" integer NOT NULL, CONSTRAINT "UQ_cba7dec7f9ff9da7ad27eaae9ff" UNIQUE ("inventoryId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "nickname", "steamId", "passwordHash", "role", "inventoryId") SELECT "id", "nickname", "steamId", "passwordHash", "role", "inventoryId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query("PRAGMA foreign_keys = ON;");

        // Добавляем внешний ключ
        await queryRunner.createForeignKey("user", new TableForeignKey({
            columnNames: ["inventoryId"],
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            referencedTableName: "inventory",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем внешний ключ
        const userTable = await queryRunner.getTable("user");
        const foreignKey = userTable?.foreignKeys.find(fk => fk.columnNames.indexOf("inventoryId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("user", foreignKey);
        }

        // Делаем inventoryId nullable перед удалением, если нужно
        await queryRunner.query("PRAGMA foreign_keys = OFF;");
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nickname" varchar NOT NULL, "steamId" integer, "passwordHash" varchar, "role" varchar NOT NULL DEFAULT ('user'), "inventoryId" integer NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "nickname", "steamId", "passwordHash", "role", "inventoryId") SELECT "id", "nickname", "steamId", "passwordHash", "role", "inventoryId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query("PRAGMA foreign_keys = ON;");

        // Удаляем столбец inventoryId из таблицы user
        await queryRunner.dropColumn("user", "inventoryId");
    }
}
