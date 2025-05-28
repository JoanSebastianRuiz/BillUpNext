import { RolDTO } from "@/dto/RolDTO";
import { NextResponse } from "next/server";

export interface RolService{
    getAll(): Promise<RolDTO[]>;
}