import { NextResponse } from "next/server";
import { GravamenDTO } from "@/dto/GravamenDTO";

export interface GravamenService{
    getAll(): Promise<Array<GravamenDTO>>;
    create(gravamen: GravamenDTO): Promise<NextResponse>;
    update(gravamen: GravamenDTO): Promise<NextResponse>;
    getById(idGravamen: number): Promise<GravamenDTO | null>;
}