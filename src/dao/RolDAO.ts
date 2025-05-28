import { RolDTO } from '@/dto/RolDTO';

export interface RolDAO {
    getAll(): Promise<RolDTO[]>;
}
