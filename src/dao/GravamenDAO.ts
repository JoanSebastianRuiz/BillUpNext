import { GravamenDTO } from "@/dto/GravamenDTO";

export interface GravamenDAO{
    getAll(): Promise<Array<GravamenDTO>>;
    getById(idGravamen: number): Promise<GravamenDTO | null>;
    create(gravamen: GravamenDTO): Promise<boolean>;
    update(gravamen: GravamenDTO): Promise<boolean>;
    existGravamenNombre(nombreGravamen: string): Promise<boolean>;
}