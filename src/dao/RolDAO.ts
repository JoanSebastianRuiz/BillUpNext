import { Rol } from '@/models/Rol';
import { RolDTO } from '@/dto/RolDTO';

export interface RolDAO {
    getAll(): Promise<RolDTO[]>;
}
