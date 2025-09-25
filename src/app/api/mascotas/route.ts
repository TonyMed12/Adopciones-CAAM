import {NextResponse} from "next/server";
import {createMascota, getMascotas} from "@/mascotas/service/mascota.service";
import {CreateMascotaSchema} from "@/mascotas/dto/create-mascota.dto";

export async function GET() {
    try {
        const mascotas = await getMascotas();
        return NextResponse.json(mascotas);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
        return NextResponse.json({message}, {status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = CreateMascotaSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {message: "Datos inválidos", errors: validation.error.flatten().fieldErrors},
                {status: 400}
            );
        }

        const nuevaMascota = await createMascota(validation.data);

        return NextResponse.json(nuevaMascota, {status: 201});
    } catch (error) {
        const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
        return NextResponse.json({message}, {status: 500});
    }
}
