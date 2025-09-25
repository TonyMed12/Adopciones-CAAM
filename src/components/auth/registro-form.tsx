"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  IdCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  registroAdoptanteSchema,
  registroAdoptantePaso1Schema,
  registroAdoptantePaso2Schema,
  registroAdoptantePaso3Schema,
  type RegistroAdoptanteData,
} from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface FormErrors {
  [key: string]: string[];
}

export default function RegistroForm() {
  const router = useRouter();
  const supabase = createClient();

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistroAdoptanteData>>({
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 3;

  // Manejar cambios en inputs
  const handleInputChange = (
    field: keyof RegistroAdoptanteData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar errores del campo cuando se modifica
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  // Obtener datos del paso actual
  const getStepData = (step: number) => {
    switch (step) {
      case 1:
        return {
          nombres: formData.nombres,
          apellido_paterno: formData.apellido_paterno,
          apellido_materno: formData.apellido_materno,
          email: formData.email,
          telefono: formData.telefono,
        };
      case 2:
        return {
          fecha_nacimiento: formData.fecha_nacimiento,
          curp: formData.curp,
          ocupacion: formData.ocupacion,
        };
      case 3:
        return {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms,
          acceptPrivacy: formData.acceptPrivacy,
        };
      default:
        return {};
    }
  };

  // Obtener schema del paso actual
  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return registroAdoptantePaso1Schema;
      case 2:
        return registroAdoptantePaso2Schema;
      case 3:
        return registroAdoptantePaso3Schema;
      default:
        return registroAdoptanteSchema;
    }
  };

  // Validar paso actual
  const validateCurrentStep = () => {
    const stepData = getStepData(currentStep);
    const result = getStepSchema(currentStep).safeParse(stepData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!newErrors[field]) newErrors[field] = [];
        newErrors[field].push(issue.message);
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Ir al siguiente paso
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  // Ir al paso anterior
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Enviar formulario
  const handleSubmit = async () => {
    // Validar todo el formulario
    const result = registroAdoptanteSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!newErrors[field]) newErrors[field] = [];
        newErrors[field].push(issue.message);
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email!,
        password: formData.password!,
        options: {
          data: {
            nombres: formData.nombres,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            rol: "adoptante",
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario");
      }

      // 2. Actualizar perfil con datos adicionales
      if (authData.user) {
        const { error: updateError } = await supabase
          .from("perfiles")
          .update({
            telefono: formData.telefono,
            fecha_nacimiento: formData.fecha_nacimiento,
            curp: formData.curp,
            ocupacion: formData.ocupacion,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.error("Error actualizando perfil:", updateError);
        }
      }

      // Redirigir a página de confirmación
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error en registro:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante el registro";
      setErrors({
        general: [errorMessage],
      });
    }
  };

  // Renderizar paso 1: Datos personales
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Datos Personales</h2>
        <p className="text-sm text-gray-600">
          Información básica y de contacto
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombres">
          Nombres <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="nombres"
            value={formData.nombres || ""}
            onChange={(e) => handleInputChange("nombres", e.target.value)}
            className={cn(
              "pl-10",
              errors.nombres?.length > 0 && "border-red-500"
            )}
            placeholder="Ej: Juan Carlos"
            disabled={isLoading}
          />
        </div>
        {errors.nombres?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_paterno">
          Apellido Paterno <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="apellido_paterno"
            value={formData.apellido_paterno || ""}
            onChange={(e) =>
              handleInputChange("apellido_paterno", e.target.value)
            }
            className={cn(
              "pl-10",
              errors.apellido_paterno?.length > 0 && "border-red-500"
            )}
            placeholder="Ej: García"
            disabled={isLoading}
          />
        </div>
        {errors.apellido_paterno?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_materno">Apellido Materno</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="apellido_materno"
            value={formData.apellido_materno || ""}
            onChange={(e) =>
              handleInputChange("apellido_materno", e.target.value)
            }
            className="pl-10"
            placeholder="Ej: López"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Correo Electrónico <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={cn(
              "pl-10",
              errors.email?.length > 0 && "border-red-500"
            )}
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
          />
        </div>
        {errors.email?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono || ""}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            className={cn(
              "pl-10",
              errors.telefono?.length > 0 && "border-red-500"
            )}
            placeholder="555 123 4567"
            disabled={isLoading}
          />
        </div>
        {errors.telefono?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  // Renderizar paso 2: Información adicional
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Información Adicional</h2>
        <p className="text-sm text-gray-600">
          Datos complementarios (opcionales)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento || ""}
            onChange={(e) =>
              handleInputChange("fecha_nacimiento", e.target.value)
            }
            className={cn(
              "pl-10",
              errors.fecha_nacimiento?.length > 0 && "border-red-500"
            )}
            disabled={isLoading}
          />
        </div>
        {errors.fecha_nacimiento?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="curp">CURP</Label>
        <div className="relative">
          <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="curp"
            value={formData.curp || ""}
            onChange={(e) =>
              handleInputChange("curp", e.target.value.toUpperCase())
            }
            className={cn("pl-10", errors.curp?.length > 0 && "border-red-500")}
            placeholder="GABC800101HDFRRR01"
            disabled={isLoading}
          />
        </div>
        {errors.curp?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ocupacion">Ocupación</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="ocupacion"
            value={formData.ocupacion || ""}
            onChange={(e) => handleInputChange("ocupacion", e.target.value)}
            className={cn(
              "pl-10",
              errors.ocupacion?.length > 0 && "border-red-500"
            )}
            placeholder="Ej: Ingeniero"
            disabled={isLoading}
          />
        </div>
        {errors.ocupacion?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  // Renderizar paso 3: Contraseña y términos
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Seguridad y Términos</h2>
        <p className="text-sm text-gray-600">
          Configura tu contraseña y acepta los términos
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Contraseña <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={cn(errors.password?.length > 0 && "border-red-500")}
            placeholder="Mínimo 8 caracteres"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirmar Contraseña <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ""}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className={cn(
              errors.confirmPassword?.length > 0 && "border-red-500"
            )}
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword?.map((error, index) => (
          <p key={index} className="text-sm text-red-600">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms || false}
            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
            className="mt-1"
          />
          <div className="text-sm">
            <Label htmlFor="acceptTerms" className="cursor-pointer">
              Acepto los{" "}
              <a
                href="/terminos"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                términos y condiciones
              </a>
              <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>
        </div>
        {errors.acceptTerms?.map((error, index) => (
          <p key={index} className="text-sm text-red-600 ml-7">
            {error}
          </p>
        ))}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptPrivacy"
            checked={formData.acceptPrivacy || false}
            onChange={(e) =>
              handleInputChange("acceptPrivacy", e.target.checked)
            }
            className="mt-1"
          />
          <div className="text-sm">
            <Label htmlFor="acceptPrivacy" className="cursor-pointer">
              Acepto la{" "}
              <a
                href="/privacidad"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                política de privacidad
              </a>
              <span className="text-red-500 ml-1">*</span>
            </Label>
          </div>
        </div>
        {errors.acceptPrivacy?.map((error, index) => (
          <p key={index} className="text-sm text-red-600 ml-7">
            {error}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registro de Adoptante</CardTitle>
        <CardDescription>
          Paso {currentStep} de {totalSteps}
        </CardDescription>

        {/* Indicador de progreso */}
        <div className="flex space-x-2 pt-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "flex-1 h-2 rounded-full",
                step <= currentStep ? "bg-blue-600" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Errores generales */}
          {errors.general?.map((error, index) => (
            <div
              key={index}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ))}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6">
            <Button
              variant="ghost"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
