import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { UserRole } from '../users/user.entity';

export class AddUserRole1678886400000 implements MigrationInterface {
    name = 'AddUserRole1678886400000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'role',
                type: 'varchar',
                default: `'${UserRole.USER}'`,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'role');
    }
}
