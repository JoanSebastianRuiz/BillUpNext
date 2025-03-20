import { CajaService } from "@/services/CajaService";
import { CajaDAOImpl } from "@/dao/impl/CajaDAOImpl";
import { NextResponse } from "next/server";
import { CajaDTO } from "@/dto/CajaDTO";

 export class CajaServiceImpl implements CajaService {
   
    private static instancia: CajaServiceImpl;
    private cajaDAOImpl: CajaDAOImpl = CajaDAOImpl.getInstance();
    private constructor() { }

   public static getInstance(): CajaServiceImpl {
      if (!CajaServiceImpl.instancia) {
         CajaServiceImpl.instancia = new CajaServiceImpl();
      }
      return CajaServiceImpl.instancia;
   }


   public create = async (caja: CajaDTO): Promise<NextResponse> => {
      try {
         const { idEmpresa,
            nombreCaja,
            estadoCaja = true
         } = caja;

         if(!idEmpresa || !nombreCaja || estadoCaja === undefined ){
            return NextResponse.json({message: 'Faltan comapos por llenar'}, {status: 400});
         }

         if (await this.cajaDAOImpl.existCajaNombre(nombreCaja, idEmpresa)) {
            return NextResponse.json({"message": "El nombre la caja ya se encuentra registrado"}, {status: 400});
         }

         const respuesta = await this.cajaDAOImpl.create({...caja, estadoCaja});

         if(respuesta){
            return NextResponse.json({message: 'Caja creada correctamente'}, {status:200});
         } else {
            return NextResponse.json({message: 'Error al crear la CAJA'}, {status: 500});
         }

      } catch (error) {
         throw new Error(`Error en CajaService.create: ${error}`)
      }
   }

   public update = async (caja: CajaDTO): Promise<NextResponse> =>{
      try {
         const{
            idCaja,
            idEmpresa,
            nombreCaja,
            estadoCaja
         } = caja;

         if(!idCaja || !idEmpresa || !nombreCaja || estadoCaja === undefined){
            return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
         }

         if(await this.cajaDAOImpl.existCajaNombre(nombreCaja, idEmpresa)){
            return NextResponse.json({message: 'El nombre ya se encuentra registrado'}, {status: 400});
         }

         const respuesta = await this.cajaDAOImpl.update(caja);

         if(respuesta){
            return NextResponse.json({message: 'Caja actualizada correctamente'}, {status: 200});
         } else {
            return NextResponse.json({message: 'Error al actualizar La CAJA'}, {status: 500});
         }

      } catch (error) {
         throw new Error(`Error en CajaService.update: ${error}`);
      }
   }

   public getAll = async (idEmpresa: number): Promise<Array<CajaDTO>> => {
      try {
         const respuesta: CajaDTO[] = await this.cajaDAOImpl.getAll(idEmpresa);
         return respuesta;
      } catch (error) {
         throw new Error(`Error en CajaService.getAll: ${error}`);
      }
   }

   public getById = async(idCaja: number ): Promise<CajaDTO | null> => {
      try {
         const respuesta = await this.cajaDAOImpl.getById(idCaja);

         if(!respuesta){
            return null;
        }
        return respuesta;
      } catch (error) {
         throw new Error(`Error en CajaService.getAll: ${error}`);
      }
   }


 }