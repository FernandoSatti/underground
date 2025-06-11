"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Info, Send } from "lucide-react"
import Image from "next/image"

// Tipos para el formulario
type ClassType = "individual" | "group"
type TimePreference = "morning" | "afternoon" | "evening"
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday"
type Instrument = "piano" | "guitar" | "bass" | "singing" | "harmonica" | "drums"

// Interfaz para los datos de estudiante
interface StudentData {
  name: string
  age: string
  instruments: Instrument[]
  timePreferences: TimePreference[]
  weekdays: Weekday[]
}

// Componente principal
export default function FormWizard() {
  // Estados para el flujo del formulario
  const [step, setStep] = useState(0)
  const [classType, setClassType] = useState<ClassType | null>(null)
  const [mainName, setMainName] = useState("")
  // En el estado, cambiar includesMe por isForSelf para ser más claro
  const [isForSelf, setIsForSelf] = useState<boolean | null>(null)
  const [studentCount, setStudentCount] = useState(1)
  const [currentStudent, setCurrentStudent] = useState(0)
  const [students, setStudents] = useState<StudentData[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [ageError, setAgeError] = useState(false)

  // Función para resetear el formulario
  const resetForm = () => {
    setStep(0)
    setCurrentStudent(0)
    setStudents([])
    setClassType(null)
    setMainName("")
    // En resetForm(), cambiar includesMe por isForSelf:
    setIsForSelf(null)
    setStudentCount(1)
    setShowInfo(false)
    setNameError(false)
    setAgeError(false)
  }

  // Función para inicializar datos de estudiantes
  const initializeStudents = (count: number) => {
    const newStudents = Array(count)
      .fill(null)
      .map(() => ({
        name: "",
        age: "",
        instruments: [],
        timePreferences: [],
        weekdays: [],
      }))
    setStudents(newStudents)
  }

  // Función para actualizar datos del estudiante actual
  const updateCurrentStudent = (data: Partial<StudentData>) => {
    const updatedStudents = [...students]
    updatedStudents[currentStudent] = {
      ...updatedStudents[currentStudent],
      ...data,
    }
    setStudents(updatedStudents)

    // Resetear errores cuando se ingresan datos
    if (data.name) setNameError(false)
    if (data.age) setAgeError(false)
  }

  // Función para manejar selección de instrumentos
  const toggleInstrument = (instrument: Instrument) => {
    const currentInstruments = students[currentStudent].instruments
    if (currentInstruments.includes(instrument)) {
      updateCurrentStudent({
        instruments: currentInstruments.filter((i) => i !== instrument),
      })
    } else {
      updateCurrentStudent({
        instruments: [...currentInstruments, instrument],
      })
    }
  }

  // Función para manejar selección de horarios
  const toggleTimePreference = (time: TimePreference) => {
    const currentTimes = students[currentStudent].timePreferences
    if (currentTimes.includes(time)) {
      updateCurrentStudent({
        timePreferences: currentTimes.filter((t) => t !== time),
      })
    } else {
      updateCurrentStudent({
        timePreferences: [...currentTimes, time],
      })
    }
  }

  // Función para manejar selección de días
  const toggleWeekday = (day: Weekday) => {
    const currentDays = students[currentStudent].weekdays
    if (currentDays.includes(day)) {
      updateCurrentStudent({
        weekdays: currentDays.filter((d) => d !== day),
      })
    } else {
      updateCurrentStudent({
        weekdays: [...currentDays, day],
      })
    }
  }

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    if (step === 0 && !classType) return

    if (step === 1) {
      if (!mainName.trim()) {
        setNameError(true)
        return
      }
    }

    // En nextStep(), simplificar la lógica del step 2:
    if (step === 2) {
      if (classType === "individual") {
        // Para individual, siempre es 1 persona
        initializeStudents(1)
        if (isForSelf) {
          // Si es para sí mismo, usar el nombre principal
          const studentWithMainName = {
            name: mainName,
            age: "",
            instruments: [],
            timePreferences: [],
            weekdays: [],
          }
          setStudents([studentWithMainName])
        } else {
          // Si es para otra persona, inicializar vacío
          initializeStudents(1)
        }
      } else {
        // Para grupal
        if (isForSelf) {
          // Si me incluye, inicializar con mi nombre en la primera posición
          initializeStudents(studentCount)
          const newStudents = Array(studentCount)
            .fill(null)
            .map((_, index) => ({
              name: index === 0 ? mainName : "",
              age: "",
              instruments: [],
              timePreferences: [],
              weekdays: [],
            }))
          setStudents(newStudents)
        } else {
          // Si no me incluye, inicializar vacío
          initializeStudents(studentCount)
        }
      }
    }

    // En la validación del nextStep para step 3:
    if (step === 3) {
      // Validar nombre solo si no es la primera persona cuando isForSelf es true
      const needsName = !(isForSelf && currentStudent === 0)
      if (needsName && !students[currentStudent]?.name?.trim()) {
        setNameError(true)
        return
      }
      if (!students[currentStudent]?.age) {
        setAgeError(true)
        return
      }
    }

    setStep(step + 1)
  }

  // Función para retroceder al paso anterior
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Función para avanzar al siguiente estudiante
  const nextStudent = () => {
    if (currentStudent < studentCount - 1) {
      setCurrentStudent(currentStudent + 1)
      setStep(3) // Volver al paso de nombre/edad para el siguiente estudiante
      setNameError(false)
      setAgeError(false)
    } else {
      setStep(7) // Ir al resumen final
    }
  }

  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `¡Hola! Mi nombre es ${mainName} y estoy interesado/a en clases de música en Underground.\n\n`

    if (classType) {
      message += `Tipo de clase: ${classType === "individual" ? "Individual" : "Grupal"}\n\n`
    }

    if (classType === "individual" && students.length > 0) {
      const student = students[0]
      message += `Datos del estudiante:\n`
      message += `- Nombre: ${student.name}\n`
      message += `- Edad: ${student.age} años\n`
      message += `- Instrumentos: ${student.instruments.map(getInstrumentName).join(", ")}\n`
      message += `- Horarios preferidos: ${student.timePreferences.map(getTimeName).join(", ")}\n`
      message += `- Días disponibles: ${student.weekdays.map(getDayName).join(", ")}\n`
    } else if (students.length > 0) {
      message += `Datos de los ${studentCount} estudiantes:\n\n`
      students.forEach((student, index) => {
        message += `Estudiante ${index + 1}:\n`
        message += `- Nombre: ${student.name}\n`
        message += `- Edad: ${student.age} años\n`
        message += `- Instrumentos: ${student.instruments.map(getInstrumentName).join(", ")}\n`
        message += `- Horarios preferidos: ${student.timePreferences.map(getTimeName).join(", ")}\n`
        message += `- Días disponibles: ${student.weekdays.map(getDayName).join(", ")}\n\n`
      })
    }

    return encodeURIComponent(message)
  }

  // Funciones auxiliares para obtener nombres legibles
  const getInstrumentName = (instrument: Instrument) => {
    const names: Record<Instrument, string> = {
      piano: "Piano",
      guitar: "Guitarra o Ukelele",
      bass: "Bajo",
      singing: "Canto",
      harmonica: "Armónica",
      drums: "Batería",
    }
    return names[instrument]
  }

  const getTimeName = (time: TimePreference) => {
    const names: Record<TimePreference, string> = {
      morning: "Mañana (10 a 13hs)",
      afternoon: "Siesta (15 a 16hs)",
      evening: "Tarde (17 a 21hs)",
    }
    return names[time]
  }

  const getDayName = (day: Weekday) => {
    const names: Record<Weekday, string> = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
    }
    return names[day]
  }

  // Renderizado condicional según el paso actual
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/underground-logo.png"
                alt="Underground Music School"
                width={200}
                height={80}
                className="h-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-center">¡Bienvenido/a! 🎵</h2>
            <p className="text-center text-gray-600">Selecciona el tipo de clase que te interesa</p>

            <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1 mb-4 px-2">
              <p>Dirección: General Paz 274</p>
              <p>Trabajamos de Lunes a viernes</p>
              <p>Horario de Secretaría 👩🏻‍💻 de 18 a 21hs</p>
              <p>Teléfono: +54 9 2657 71-8014</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={classType === "individual" ? "default" : "outline"}
                className={`h-24 ${classType === "individual" ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => setClassType("individual")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">👤</span>
                  <span>Individual</span>
                </div>
              </Button>
              <Button
                variant={classType === "group" ? "default" : "outline"}
                className={`h-24 ${classType === "group" ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => setClassType("group")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">👥</span>
                  <span>Grupal</span>
                </div>
              </Button>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">¿Cómo te llamas? 😊</h2>
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                Tu nombre: <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Escribe tu nombre aquí"
                value={mainName}
                onChange={(e) => {
                  setMainName(e.target.value)
                  if (e.target.value) setNameError(false)
                }}
                className={nameError ? "border-red-500 focus:border-red-500" : ""}
              />
              {nameError && <p className="text-red-500 text-sm">Por favor, ingresa tu nombre</p>}
            </div>
          </div>
        )

      // En el case 2, simplificar completamente:
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">¡Hola {mainName}! 👋</h2>
            <p className="text-center text-gray-600">¿Las clases son para ti o para otra persona?</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={isForSelf === true ? "default" : "outline"}
                className={`h-24 ${isForSelf === true ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => setIsForSelf(true)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">🙋‍♂️</span>
                  <span>Para mí</span>
                </div>
              </Button>
              <Button
                variant={isForSelf === false ? "default" : "outline"}
                className={`h-24 ${isForSelf === false ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => setIsForSelf(false)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">👤</span>
                  <span>Para otra persona</span>
                </div>
              </Button>
            </div>

            {isForSelf === false && classType === "group" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="studentCount">¿Cuántas personas van a tomar la clase? (máximo 3)</Label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((num) => (
                    <Button
                      key={num}
                      variant={studentCount === num ? "default" : "outline"}
                      className={`w-12 h-12 ${studentCount === num ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                      onClick={() => setStudentCount(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isForSelf === true && classType === "group" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="studentCount">¿Cuántas personas en total van a tomar la clase? (máximo 3)</Label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((num) => (
                    <Button
                      key={num}
                      variant={studentCount === num ? "default" : "outline"}
                      className={`w-12 h-12 ${studentCount === num ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                      onClick={() => setStudentCount(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Te incluye a ti ({mainName}) + {studentCount - 1} persona{studentCount > 2 ? "s" : ""} más
                </p>
              </div>
            )}
          </div>
        )

      // En el step 3, ajustar la lógica:
      case 3:
        return (
          <div className="space-y-6">
            {studentCount > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / studentCount) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  {classType === "individual" ? "Estudiante" : "Persona"} {currentStudent + 1} de {studentCount}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">
              {isForSelf && currentStudent === 0
                ? "¿Cuál es tu edad?"
                : `Datos ${classType === "individual" ? "del estudiante" : `de la persona ${currentStudent + 1}`}`}
            </h2>

            <div className="space-y-4">
              {!(isForSelf && currentStudent === 0) && (
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="flex items-center">
                    Nombre: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    placeholder={classType === "individual" ? "Nombre del estudiante" : "Nombre de la persona"}
                    value={students[currentStudent]?.name || ""}
                    onChange={(e) => updateCurrentStudent({ name: e.target.value })}
                    className={nameError ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {nameError && <p className="text-red-500 text-sm">Por favor, ingresa el nombre</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="studentAge" className="flex items-center">
                  Edad: <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="studentAge"
                  placeholder="Edad"
                  type="number"
                  value={students[currentStudent]?.age || ""}
                  onChange={(e) => updateCurrentStudent({ age: e.target.value })}
                  className={ageError ? "border-red-500 focus:border-red-500" : ""}
                />
                {ageError && <p className="text-red-500 text-sm">Por favor, ingresa la edad</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {studentCount > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / studentCount) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {studentCount}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿Qué instrumento quiere aprender? 🎸</h2>
            <p className="text-center text-gray-600">Puede seleccionar varios</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "piano", label: "Piano", icon: "🎹", value: "piano" as Instrument },
                { id: "guitar", label: "Guitarra o Ukelele", icon: "🎸", value: "guitar" as Instrument },
                { id: "bass", label: "Bajo", icon: "🎸", value: "bass" as Instrument },
                { id: "singing", label: "Canto", icon: "🎤", value: "singing" as Instrument },
                { id: "harmonica", label: "Armónica", icon: "🎺", value: "harmonica" as Instrument },
                { id: "drums", label: "Batería", icon: "🥁", value: "drums" as Instrument },
              ].map((instrument) => (
                <div
                  key={instrument.id}
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                    students[currentStudent]?.instruments.includes(instrument.value)
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleInstrument(instrument.value)}
                >
                  <span className="text-3xl mb-2">{instrument.icon}</span>
                  <span>{instrument.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {studentCount > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / studentCount) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {studentCount}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿En qué horario prefiere? ⏰</h2>
            <p className="text-center text-gray-600">Puede seleccionar varios</p>

            <div className="space-y-3">
              {[
                { id: "morning", label: "Mañana (10 a 13hs)", icon: "🌞", value: "morning" as TimePreference },
                { id: "afternoon", label: "Siesta (15 a 16hs)", icon: "🌤️", value: "afternoon" as TimePreference },
                { id: "evening", label: "Tarde (17 a 21hs)", icon: "🌆", value: "evening" as TimePreference },
              ].map((time) => (
                <div
                  key={time.id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                    students[currentStudent]?.timePreferences.includes(time.value)
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleTimePreference(time.value)}
                >
                  <span className="text-2xl mr-3">{time.icon}</span>
                  <span>{time.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            {studentCount > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / studentCount) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {studentCount}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿Qué días le convienen? 📅</h2>
            <p className="text-center text-gray-600">Puede seleccionar varios</p>

            <div className="space-y-3">
              {[
                { id: "monday", label: "Lunes", value: "monday" as Weekday },
                { id: "tuesday", label: "Martes", value: "tuesday" as Weekday },
                { id: "wednesday", label: "Miércoles", value: "wednesday" as Weekday },
                { id: "thursday", label: "Jueves", value: "thursday" as Weekday },
                { id: "friday", label: "Viernes", value: "friday" as Weekday },
              ].map((day) => (
                <div
                  key={day.id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                    students[currentStudent]?.weekdays.includes(day.value)
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleWeekday(day.value)}
                >
                  <Checkbox checked={students[currentStudent]?.weekdays.includes(day.value)} className="mr-3" />
                  <span>{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">¡Perfecto! 🎉</h2>
            <p className="text-center text-gray-600">Resumen de tu consulta:</p>

            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <p>
                <strong>Nombre:</strong> {mainName}
              </p>
              <p>
                <strong>Tipo de clase:</strong> {classType === "individual" ? "Individual" : "Grupal"}
              </p>

              {students.map((student, idx) => (
                <div key={idx} className="border-t pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
                  {studentCount > 1 && <p className="font-semibold">Persona {idx + 1}:</p>}
                  <p>
                    <strong>Nombre:</strong> {student.name}
                  </p>
                  <p>
                    <strong>Edad:</strong> {student.age} años
                  </p>
                  <p>
                    <strong>Instrumentos:</strong>{" "}
                    {student.instruments.map(getInstrumentName).join(", ") || "No seleccionado"}
                  </p>
                  <p>
                    <strong>Horarios:</strong>{" "}
                    {student.timePreferences.map(getTimeName).join(", ") || "No seleccionado"}
                  </p>
                  <p>
                    <strong>Días:</strong> {student.weekdays.map(getDayName).join(", ") || "No seleccionado"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <a
                href={`https://wa.me/5492657718014?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#01b302] px-6 py-3 text-lg font-medium text-white hover:bg-[#01ef4a] hover:text-black transition-colors"
              >
                <Send className="mr-2 h-5 w-5" /> Enviar por WhatsApp
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Renderizado de la información de Underground
  const renderInfo = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/underground-logo.png"
            alt="Underground Music School"
            width={200}
            height={80}
            className="h-auto"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">BIENVENIDO A UNDERGROUND 🎵</h2>
        <p className="text-center font-medium">Escuela de Música y Salas de Ensayo</p>
        <p className="text-center">Dirección: General Paz 274</p>

        <div className="border-t border-b py-4">
          <p className="text-center italic">
            15 años compartiendo el maravilloso arte de la música con alumnos y colegas de la ciudad.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-center">NUESTRAS CLASES SIEMPRE SON PERSONALIZADAS 🎯</p>
          <p className="text-center">Adaptadas a las edades y gustos musicales de cada alumno.</p>

          <p className="font-medium text-center mt-4">
            LAS CLASES se desarrollan de lunes a viernes por la mañana o tarde
          </p>
          <p className="text-center">Horario de Secretaría 👩🏻‍💻 de 18 a 21hs</p>

          <p className="font-medium text-center mt-4">Modalidades:</p>
          <p className="text-center">Todas pueden ser individuales o grupales (hasta 3 personas)</p>

          <p className="text-center mt-4">
            En las clases individuales tienes la chance de recuperar la clase en caso de no poder asistir.
          </p>

          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className="font-bold">Precios:</p>
            <p>Clases individuales: $50000</p>
            <p>Clases grupales: $35000</p>
          </div>
        </div>
      </div>
    )
  }

  // Renderizado de los botones de navegación
  const renderNavButtons = () => {
    if (showInfo) {
      return (
        <Button onClick={() => setShowInfo(false)} className="w-full bg-[#01b302] hover:bg-[#01ef4a] hover:text-black">
          Volver al formulario
        </Button>
      )
    }

    return (
      <div className="flex justify-between items-center">
        <div className="flex justify-start">
          {step > 0 && (
            <Button variant="outline" onClick={prevStep} className="h-10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center gap-4 flex-1 ml-4">
          {step === 0 && (
            <Button
              variant="outline"
              onClick={() => setShowInfo(true)}
              className="text-[#01b302] border-[#01b302] hover:bg-[#01ef4a]/10 text-sm px-3 h-10"
            >
              <Info className="mr-2 h-4 w-4" /> Info
            </Button>
          )}

          {step < 7 && (
            <Button
              onClick={() => {
                if (
                  (step === 3 || step === 4 || step === 5 || step === 6) &&
                  studentCount > 1 &&
                  currentStudent < studentCount - 1
                ) {
                  if (step === 6) {
                    nextStudent()
                  } else {
                    setStep(step + 1)
                  }
                } else if (step === 6 && (studentCount === 1 || currentStudent === studentCount - 1)) {
                  setStep(7)
                } else {
                  nextStep()
                }
              }}
              className="bg-[#01b302] hover:bg-[#01ef4a] hover:text-black h-10 ml-auto"
              disabled={
                (step === 0 && !classType) ||
                (step === 1 && !mainName) ||
                // En la validación de los botones disabled:
                (step === 2 && isForSelf === null) ||
                (step === 2 && classType === "group" && studentCount < 1) ||
                (step === 3 &&
                  ((!(isForSelf && currentStudent === 0) && !students[currentStudent]?.name) ||
                    !students[currentStudent]?.age)) ||
                (step === 4 && students[currentStudent]?.instruments.length === 0) ||
                (step === 5 && students[currentStudent]?.timePreferences.length === 0) ||
                (step === 6 && students[currentStudent]?.weekdays.length === 0)
              }
            >
              {(step === 3 || step === 4 || step === 5) && studentCount > 1 && currentStudent < studentCount - 1
                ? "Siguiente"
                : step === 6 && studentCount > 1 && currentStudent < studentCount - 1
                  ? "Siguiente persona"
                  : step === 6
                    ? "Finalizar"
                    : "Siguiente"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="relative flex flex-row items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          {step > 0 && (
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={resetForm} className="h-8 w-8">
                🏠
              </Button>
              <span className="text-xs text-gray-500">inicio</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {(step > 0 || showInfo) && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">info</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className="h-8 w-8 rounded-full border"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{showInfo ? renderInfo() : renderStep()}</CardContent>
      <CardFooter className="flex flex-col">{renderNavButtons()}</CardFooter>
    </Card>
  )
}
