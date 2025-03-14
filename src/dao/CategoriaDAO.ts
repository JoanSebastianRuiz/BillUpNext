import {CategoriaDTO} from '@/dto/CategoriaDTO';

export interface CategoriaDAO{ 
    getAll(idEmpresa: number): Promise<Array<CategoriaDTO>>;
    getById(idCategoria: number): Promise<CategoriaDTO | null>; 
    create(categoria: CategoriaDTO): Promise<boolean>; 
    update(categoria: CategoriaDTO): Promise<boolean>;
    existCategoriaNombre(nombreCategoria: string, idEmpresa: number, idCategoria?: number): Promise<boolean>; 
} 
