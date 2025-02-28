import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";
import { NextResponse } from "next/server";

export interface DepartamentoService{
    getAll(): Promise<DepartamentoResponseDTO[]>;
}
