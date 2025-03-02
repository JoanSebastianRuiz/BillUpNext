import {CategoriaDTO} from '@/dto/CategoriaDTO';

export interface CategoriaDAO{ 
    getAll(): Promise<Array<CategoriaDTO>>;
    getById(idCategoria: number): Promise<CategoriaDTO | null>; 
    create(categoria: CategoriaDTO): Promise<boolean>; 
    update(categoria: CategoriaDTO): Promise<boolean>;
    existCategoriaNombre(nombreCategoria: string, idCategoria?: number): Promise<boolean>; 
} 
