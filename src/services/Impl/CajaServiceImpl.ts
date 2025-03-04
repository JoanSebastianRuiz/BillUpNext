import { CajaService } from "@/services/CajaService";
import { CajaDAOImpl } from "@/dao/impl/CajaDAOImpl";
import { EmpresaDAOImpl } from "@/dao/impl/EmpresaDAOImpl";
import { NextResponse } from "next/server";
import { CajaDTO } from "@/dto/CajaDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
 //import{ ifValiNombreCaja, ifValiEstadoCaja } from "@/util/validators/validators";
 // poner la validcion del nombre de la caja y el estado de la caja

 export class CajaServiceImpl implements CajaService {
   
    private static instancia: CajaServiceImpl;
    private cajaDAOImpl: CajaDAOImpl = CajaDAOImpl.getInstance();
    private constructor() { }
    create(caja: CajaDTO): Promise<NextResponse> {
       throw new Error("Method not implemented.");
    }


   public static getInstance(): CajaServiceImpl {
      if (!CajaServiceImpl.instancia) {
         CajaServiceImpl.instancia = new CajaServiceImpl();
      }
      return CajaServiceImpl.instancia;
   }


   public cretate = async (caja: CajaDTO): Promise<NextResponse> => {
      try {
         const { idEmpresa,
            nombreCaja,
            estadoCaja
         } = caja;

         if(!idEmpresa || nombreCaja || estadoCaja){
            return NextResponse.json({message: 'Faltan comapos por llenar'}, {status: 400});
         }

         if (await this.cajaDAOImpl.existCajaNombre(nombreCaja)){
            return NextResponse.json({"message": "El nombre la caja ya se encuentra registrado"}, {status: 400});
         }

         const respuesta = await this.cajaDAOImpl.create(caja);

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

         if(!idCaja || idEmpresa || nombreCaja || estadoCaja){
            return NextResponse.json({message: 'Faltan campos por llenar'}, {status: 400});
         }

         if(await this.cajaDAOImpl.existCajaNombre(nombreCaja)){
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

   public getAll = async (): Promise<Array<CajaDTO>> => {
      try {
         const respuesta: CajaDTO[] = await this.cajaDAOImpl.getAll();
         return respuesta;
      } catch (error) {
         throw new Error(`Error en CajaService.getAll: ${error}`);
      }
   }

   public getEmpresas = async( idCaja: number): Promise<EmpresaResponseDTO []> =>{
      try {
         const empresas = await this.cajaDAOImpl.getEmpresas(idCaja);
         if (empresas === undefined || empresas === null) {
            return Promise.resolve([]);
         }

      // revisar esto!!!!!

         return empresas;
      } catch (error) {
         console.error("Error al obtener las empresas:", error);
         throw new Error(`Error al obtener las empresas: ${error}`);
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