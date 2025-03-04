import { GravamenService } from "@/services/GravamenService";
import { GravamenDAOImpl } from "@/dao/impl/GravamenDAOImpl";
import { NextResponse } from "next/server";
import { GravamenDTO } from "@/dto/GravamenDTO";

export class GravamenServiceImpl implements GravamenService {
  private static instancia: GravamenServiceImpl;
  private gravamenDAOImpl: GravamenDAOImpl = GravamenDAOImpl.getInstance();
  private constructor() { }

  public static getInstance(): GravamenServiceImpl {
    if (!GravamenServiceImpl.instancia) {
      GravamenServiceImpl.instancia = new GravamenServiceImpl();
    }
    return GravamenServiceImpl.instancia;
  }

  public create = async (gravamen: GravamenDTO): Promise<NextResponse> => {
    try {
      const {
        nombreGravamen,
        estadoGravamen,
        negativoGravamen,
        porcentajeGravamen,
      } = gravamen;

      if (
        !nombreGravamen ||
        !estadoGravamen ||
        !negativoGravamen ||
        !porcentajeGravamen
      ) {
        return NextResponse.json(
            { message: "Faltan campos por llenar" },
            { status: 400 }
        );
      }

      if (await this.gravamenDAOImpl.existGravamenNombre(nombreGravamen)) {
        return NextResponse.json(
            { message: "El nombre del gravamen ya existe" },
            { status: 400 }
        );
      }

      const respuesta = await this.gravamenDAOImpl.create(gravamen);
      if (respuesta) {
        return NextResponse.json(
            { message: "Gravamen creado correctamente" },
            { status: 200 }
        );
      } else {
        return NextResponse.json(
            { message: "Error al crear el gravamen" },
            {status: 500 }
        )
      }
    } catch (error) {
        throw new Error(`Error en GravamenService.create: ${error}`);
    }
  };

  public update = async (gravamen: GravamenDTO): Promise<NextResponse> => {
    try {
        const { idGravamen, nombreGravamen, estadoGravamen, negativoGravamen, porcentajeGravamen } = gravamen;

        if (!idGravamen || !nombreGravamen || !estadoGravamen || !negativoGravamen || !porcentajeGravamen) {
            return NextResponse.json(
                { message: "Faltan campos por llenar" },
                { status: 400 }
            );
        } 

        if (await this.gravamenDAOImpl.existGravamenNombre(nombreGravamen, idGravamen)) {
            return NextResponse.json(
                { message: "El nombre del gravamen ya existe "},
                { status: 400 }
            );
        }

        const respuesta = await this.gravamenDAOImpl.update(gravamen);
        if (respuesta) {
            return NextResponse.json(
                { message: "Gravamen actualizado correctamente"},
                {status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Error al actualizar el gravamen"},
                { status: 500 }
            );
        }
    } catch (error) {
        throw new Error(`Error en GravamenService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<GravamenDTO>> => {
    try {
        const respuesta: GravamenDTO[] = await this.gravamenDAOImpl.getAll();
        return respuesta;
    } catch (error) {
        throw new Error(`Error en GravamenService.getAll: ${error}`);
    }
  };

  public getById = async (
    idGravamen: number
  ): Promise<GravamenDTO | null> => {
    try {
        const respuesta = await this.gravamenDAOImpl.getById(idGravamen);

        if (!respuesta) {
            return null;
        }
        return respuesta;
    } catch (error) {
        throw new Error(`Error en GravamenService.getById: ${error}`);
    }
  };
}
