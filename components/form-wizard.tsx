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
type ClassType = "individual" | "group" | "kids"
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

// Interfaz para datos de tutor (solo para kids)
interface TutorData {
  name: string
  studentName: string
  studentAge: string
}

// Componente principal
export default function FormWizard() {
  // Estados para el flujo del formulario
  const [step, setStep] = useState(0)
  const [classType, setClassType] = useState<ClassType | null>(null)
  const [mainName, setMainName] = useState("")
  const [isForSelf, setIsForSelf] = useState<boolean | null>(null)
  const [currentStudent, setCurrentStudent] = useState(0)
  const [students, setStudents] = useState<StudentData[]>([])
  const [tutorData, setTutorData] = useState<TutorData>({ name: "", studentName: "", studentAge: "" }) // Para kids
  const [showInfo, setShowInfo] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [ageError, setAgeError] = useState(false)
  const [studentNameError, setStudentNameError] = useState(false)
  const [studentAgeError, setStudentAgeError] = useState(false)
  const [showAddPerson, setShowAddPerson] = useState(false) // Para mostrar opciones de agregar persona
  const [groupMode, setGroupMode] = useState<"same" | "different" | null>(null) // Para recordar la modalidad elegida

  // Función para resetear el formulario
  const resetForm = () => {
    setStep(0)
    setCurrentStudent(0)
    setStudents([])
    setClassType(null)
    setMainName("")
    setIsForSelf(null)
    setTutorData({ name: "", studentName: "", studentAge: "" })
    setShowInfo(false)
    setNameError(false)
    setAgeError(false)
    setStudentNameError(false)
    setStudentAgeError(false)
    setShowAddPerson(false)
    setGroupMode(null)
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

  // Función para manejar selección de tipo de clase con auto-avance
  const handleClassTypeSelect = (type: ClassType) => {
    setClassType(type)
    // Auto-avance después de un pequeño delay
    setTimeout(() => {
      if (type === "group") {
        initializeStudents(1)
        setStudents([{ name: mainName, age: "", instruments: [], timePreferences: [], weekdays: [] }])
        setStep(3)
      } else {
        setStep(1)
      }
    }, 300)
  }

  // Función para manejar "para mí" / "para otra persona" con auto-avance condicional
  const handleForSelfSelect = (forSelf: boolean) => {
    setIsForSelf(forSelf)

    setTimeout(() => {
      // Inicializar estudiantes
      initializeStudents(1)
      if (forSelf) {
        const studentWithMainName = {
          name: mainName,
          age: "",
          instruments: [],
          timePreferences: [],
          weekdays: [],
        }
        setStudents([studentWithMainName])
      }
      setStep(3)
    }, 300)
  }

  // Función para actualizar datos del estudiante actual
  const updateCurrentStudent = (data: Partial<StudentData>) => {
    const updatedStudents = [...students]
    if (updatedStudents[currentStudent]) {
      updatedStudents[currentStudent] = {
        ...updatedStudents[currentStudent],
        ...data,
      }
      setStudents(updatedStudents)
    }

    // Resetear errores cuando se ingresan datos
    if (data.name) setNameError(false)
    if (data.age) setAgeError(false)
  }

  // Función para manejar selección de instrumentos
  const toggleInstrument = (instrument: Instrument) => {
    if (classType === "kids") {
      const currentInstruments = students[0]?.instruments || []
      if (currentInstruments.includes(instrument)) {
        const newStudent = {
          ...students[0],
          instruments: currentInstruments.filter((i) => i !== instrument),
        }
        setStudents([newStudent])
      } else {
        const newStudent = {
          ...students[0],
          instruments: [...currentInstruments, instrument],
        }
        setStudents([newStudent])
      }
    } else {
      const currentInstruments = students[currentStudent]?.instruments || []
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
  }

  // Función para manejar selección de horarios
  const toggleTimePreference = (time: TimePreference) => {
    if (classType === "kids") {
      const currentTimes = students[0]?.timePreferences || []
      if (currentTimes.includes(time)) {
        const newStudent = {
          ...students[0],
          timePreferences: currentTimes.filter((t) => t !== time),
        }
        setStudents([newStudent])
      } else {
        const newStudent = {
          ...students[0],
          timePreferences: [...currentTimes, time],
        }
        setStudents([newStudent])
      }
    } else {
      const currentTimes = students[currentStudent]?.timePreferences || []
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
  }

  // Función para manejar selección de días
  const toggleWeekday = (day: Weekday) => {
    if (classType === "kids") {
      const currentDays = students[0]?.weekdays || []
      if (currentDays.includes(day)) {
        const newStudent = {
          ...students[0],
          weekdays: currentDays.filter((d) => d !== day),
        }
        setStudents([newStudent])
      } else {
        const newStudent = {
          ...students[0],
          weekdays: [...currentDays, day],
        }
        setStudents([newStudent])
      }
    } else {
      const currentDays = students[currentStudent]?.weekdays || []
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
  }

  // Función para agregar persona al mismo grupo
  const addPersonSameGroup = () => {
    if (students.length >= 3) return // Máximo 3 personas

    const newPerson = {
      name: "",
      age: "",
      instruments: students[0]?.instruments || [], // Mismos instrumentos
      timePreferences: students[0]?.timePreferences || [], // Mismos horarios
      weekdays: students[0]?.weekdays || [], // Mismos días
    }
    setStudents([...students, newPerson])
    setCurrentStudent(students.length)
    setShowAddPerson(false)
    setGroupMode("same") // Recordar que eligió mismo grupo
    setStep(8) // Paso para nombre y edad solamente
  }

  // Función para agregar persona a otro grupo
  const addPersonNewGroup = () => {
    if (students.length >= 3) return // Máximo 3 personas

    const newPerson = {
      name: "",
      age: "",
      instruments: [],
      timePreferences: [],
      weekdays: [],
    }
    setStudents([...students, newPerson])
    setCurrentStudent(students.length)
    setShowAddPerson(false)
    setGroupMode("different") // Recordar que eligió otro grupo
    setStep(3) // Volver al flujo completo
  }

  const nextStep = () => {
    if (step === 1) {
      if (classType === "kids") {
        // Para kids, validar tutor y datos del alumno
        if (!tutorData.name.trim()) {
          setNameError(true)
          return
        }
        if (!tutorData.studentName.trim()) {
          setStudentNameError(true)
          return
        }
        if (!tutorData.studentAge.trim()) {
          setStudentAgeError(true)
          return
        }
        // Crear estudiante para kids
        const studentForKids = {
          name: tutorData.studentName,
          age: tutorData.studentAge,
          instruments: [],
          timePreferences: [],
          weekdays: [],
        }
        setStudents([studentForKids])
        setStep(4) // Ir directo a instrumentos
        return
      } else {
        // Para individual y grupal, validar nombre principal
        if (!mainName.trim()) {
          setNameError(true)
          return
        }
      }
    }

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

    if (step === 8) {
      // Validar solo nombre y edad para persona del mismo grupo
      if (!students[currentStudent]?.name?.trim()) {
        setNameError(true)
        return
      }
      if (!students[currentStudent]?.age) {
        setAgeError(true)
        return
      }
      // Ir DIRECTO a la etapa final (paso 7) sin mostrar opciones
      setStep(7)
      setShowAddPerson(false) // No mostrar opciones, ir directo al resumen
      return
    }

    if (step === 6) {
      // Después de completar días
      if (classType === "group") {
        // Si es la primera persona del grupo, mostrar opciones de agregar
        if (currentStudent === 0 && !groupMode) {
          setShowAddPerson(true)
          setStep(7)
        } else {
          // Si es una persona adicional (mismo o diferente grupo), ir directo al resumen
          setStep(7)
          setShowAddPerson(false)
        }
      } else {
        setStep(7)
      }
      return
    }

    setStep(step + 1)
  }

  // Función para retroceder al paso anterior
  const prevStep = () => {
    if (step > 0) {
      // Si estamos en el paso 8 (agregar persona mismo grupo), volver al resumen
      if (step === 8) {
        setStep(7)
        setShowAddPerson(true)
        return
      }
      setStep(step - 1)
    }
  }

  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `¡Hola! Mi nombre es ${classType === "kids" ? tutorData.name : mainName} y estoy interesado/a en clases de música en Underground.\n\n`

    if (classType) {
      const classNames = {
        individual: "Individual (1 hora)",
        kids: "Individual para niños (30 min)",
        group: "Grupal",
      }
      message += `Tipo de clase: ${classNames[classType]}\n\n`
    }

    if (classType === "individual" || classType === "kids") {
      const student = students[0]
      if (student) {
        message += `Datos del estudiante:\n`
        message += `- Nombre: ${student.name}\n`
        message += `- Edad: ${student.age} años\n`
        if (classType === "kids") {
          message += `- Tutor/Responsable: ${tutorData.name}\n`
        }
        message += `- Instrumentos: ${student.instruments.map(getInstrumentName).join(", ")}\n`
        message += `- Horarios preferidos: ${student.timePreferences.map(getTimeName).join(", ")}\n`
        message += `- Días disponibles: ${student.weekdays.map(getDayName).join(", ")}\n`
      }
    } else if (students.length > 0) {
      message += `Datos de los ${students.length} estudiantes:\n\n`
      students.forEach((student, index) => {
        if (student) {
          message += `Estudiante ${index + 1}:\n`
          message += `- Nombre: ${student.name}\n`
          message += `- Edad: ${student.age} años\n`
          message += `- Instrumentos: ${student.instruments.map(getInstrumentName).join(", ")}\n`
          message += `- Horarios preferidos: ${student.timePreferences.map(getTimeName).join(", ")}\n`
          message += `- Días disponibles: ${student.weekdays.map(getDayName).join(", ")}\n\n`
        }
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

  // Función para detectar si debe mostrar info de menores
  const shouldShowKidsInfo = () => {
    const currentAge = Number.parseInt(students[currentStudent]?.age || "0")
    return currentAge > 0 && currentAge <= 8
  }

  // Renderizado condicional según el paso actual
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/underground-logo.png"
                alt="Underground Music School"
                width={180}
                height={60}
                className="h-auto"
              />
            </div>

            <div className="text-center space-y-2 mb-6">
              <p className="text-sm text-gray-600">General Paz 274 • Lunes a Viernes</p>
              <p className="text-sm text-gray-600">Secretaría: 18 a 21hs • +54 2657 65-9078</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm font-medium text-yellow-800">Inscripción anual: $15.000</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-6">Elegí tu modalidad de clase:</h2>

            <div className="space-y-4">
              <Button
                variant={classType === "group" ? "default" : "outline"}
                className={`w-full h-auto p-4 ${classType === "group" ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => handleClassTypeSelect("group")}
              >
                <div className="flex flex-col items-center text-center">
                  <div>
                    <p className="font-bold">Clase Grupal (hasta 3 personas)</p>
                    <p className="text-sm opacity-90">1 hora • 1 vez por semana</p>
                    <p className="text-lg font-bold mt-1">$30.000/mes</p>
                  </div>
                </div>
              </Button>

              <Button
                variant={classType === "kids" ? "default" : "outline"}
                className={`w-full h-auto p-4 ${classType === "kids" ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => handleClassTypeSelect("kids")}
              >
                <div className="flex flex-col items-center text-center">
                  <div>
                    <p className="font-bold">Individual Niños (4 a 8 años)</p>
                    <p className="text-sm opacity-90">30 minutos • 1 vez por semana</p>
                    <p className="text-lg font-bold mt-1">$36.000/mes</p>
                  </div>
                </div>
              </Button>

              <Button
                variant={classType === "individual" ? "default" : "outline"}
                className={`w-full h-auto p-4 ${classType === "individual" ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => handleClassTypeSelect("individual")}
              >
                <div className="flex flex-col items-center text-center">
                  <div>
                    <p className="font-bold">Individual</p>
                    <p className="text-sm opacity-90">1 hora • 1 vez por semana</p>
                    <p className="text-lg font-bold mt-1">$50.000/mes</p>
                  </div>
                </div>
              </Button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
                  CLASES PERSONALIZADAS
                </h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  Adaptadas a las edades y gustos musicales de cada alumno
                </p>
              </div>
            </div>
          </div>
        )

      case 1:
        if (classType === "kids") {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Datos para la inscripción 📝</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tutorName" className="flex items-center">
                    Nombre del tutor/responsable: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="tutorName"
                    placeholder="Tu nombre (padre/madre/tutor)"
                    value={tutorData.name}
                    onChange={(e) => {
                      setTutorData({ ...tutorData, name: e.target.value })
                      if (e.target.value) setNameError(false)
                    }}
                    className={nameError ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {nameError && <p className="text-red-500 text-sm">Por favor, ingresá tu nombre</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentName" className="flex items-center">
                    Nombre del alumno: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="Nombre del niño/a"
                    value={tutorData.studentName}
                    onChange={(e) => {
                      setTutorData({ ...tutorData, studentName: e.target.value })
                      if (e.target.value) setStudentNameError(false)
                    }}
                    className={studentNameError ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {studentNameError && <p className="text-red-500 text-sm">Por favor, ingresá el nombre del alumno</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentAge" className="flex items-center">
                    Edad del alumno: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="studentAge"
                    placeholder="Edad (4 a 8 años)"
                    type="number"
                    min="4"
                    max="8"
                    value={tutorData.studentAge}
                    onChange={(e) => {
                      setTutorData({ ...tutorData, studentAge: e.target.value })
                      if (e.target.value) setStudentAgeError(false)
                    }}
                    className={studentAgeError ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {studentAgeError && <p className="text-red-500 text-sm">Por favor, ingresá la edad del alumno</p>}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">¿Cómo te llamás? 😊</h2>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  Tu nombre: <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Escribí tu nombre acá"
                  value={mainName}
                  onChange={(e) => {
                    setMainName(e.target.value)
                    if (e.target.value) setNameError(false)
                  }}
                  className={nameError ? "border-red-500 focus:border-red-500" : ""}
                />
                {nameError && <p className="text-red-500 text-sm">Por favor, ingresá tu nombre</p>}
              </div>
            </div>
          )
        }

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">¡Hola {mainName}! 👋</h2>
            <p className="text-center text-gray-600">¿Las clases son para vos o para otra persona?</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={isForSelf === true ? "default" : "outline"}
                className={`h-24 ${isForSelf === true ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => handleForSelfSelect(true)}
              >
                <div className="flex flex-col items-center">
                  <span>🙋‍♂️ Para mí</span>
                </div>
              </Button>
              <Button
                variant={isForSelf === false ? "default" : "outline"}
                className={`h-24 ${isForSelf === false ? "bg-[#01b302] hover:bg-[#01ef4a]" : ""}`}
                onClick={() => handleForSelfSelect(false)}
              >
                <div className="flex flex-col items-center">
                  <span>👤 Para otra persona</span>
                </div>
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            {students.length > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / students.length) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {students.length}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">
              {isForSelf && currentStudent === 0
                ? "¿Cuál es tu edad?"
                : students.length > 1
                  ? `Datos de la persona ${currentStudent + 1}`
                  : "Datos del estudiante"}
            </h2>

            {shouldShowKidsInfo() && classType === "individual" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Para menores de 8 años (inclusive), recomendamos la modalidad "Individual Niños" de 30 minutos por
                  $36.000/mes
                </p>
              </div>
            )}

            {classType === "group" && shouldShowKidsInfo() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Para menores de 8 años (inclusive), recomendamos la modalidad "Individual Niños" de 30 minutos por
                  $36.000/mes en lugar de grupal
                </p>
              </div>
            )}

            <div className="space-y-4">
              {!(isForSelf && currentStudent === 0) && (
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="flex items-center">
                    Nombre: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="Nombre de la persona"
                    value={students[currentStudent]?.name || ""}
                    onChange={(e) => updateCurrentStudent({ name: e.target.value })}
                    className={nameError ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {nameError && <p className="text-red-500 text-sm">Por favor, ingresá el nombre</p>}
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
                {ageError && <p className="text-red-500 text-sm">Por favor, ingresá la edad</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {students.length > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / students.length) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {students.length}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿Qué instrumento querés aprender? 🎸</h2>
            <p className="text-center text-gray-600">Podés seleccionar varios</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "piano", label: "🎹 Piano", value: "piano" as Instrument },
                { id: "guitar", label: "🎸 Guitarra", value: "guitar" as Instrument },
                { id: "bass", label: "🎸 Bajo", value: "bass" as Instrument },
                { id: "singing", label: "🎤 Canto", value: "singing" as Instrument },
                { id: "harmonica", label: "🎵 Armónica", value: "harmonica" as Instrument },
                { id: "drums", label: "🥁 Batería", value: "drums" as Instrument },
              ].map((instrument) => (
                <div
                  key={instrument.id}
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                    (classType === "kids" ? students[0]?.instruments : students[currentStudent]?.instruments)?.includes(
                      instrument.value,
                    )
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleInstrument(instrument.value)}
                >
                  <span>{instrument.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {students.length > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / students.length) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {students.length}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿En qué horario preferís? ⏰</h2>
            <p className="text-center text-gray-600">Podés seleccionar varios</p>

            <div className="space-y-3">
              {[
                { id: "morning", label: "🌞 Mañana (10 a 13hs)", value: "morning" as TimePreference },
                { id: "afternoon", label: "🌤️ Siesta (15 a 16hs)", value: "afternoon" as TimePreference },
                { id: "evening", label: "🌆 Tarde (17 a 21hs)", value: "evening" as TimePreference },
              ].map((time) => (
                <div
                  key={time.id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                    (classType === "kids"
                      ? students[0]?.timePreferences
                      : students[currentStudent]?.timePreferences
                    )?.includes(time.value)
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleTimePreference(time.value)}
                >
                  <span>{time.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            {students.length > 1 && (
              <div className="mb-4">
                <Progress value={((currentStudent + 1) / students.length) * 100} className="h-2 bg-gray-200" />
                <p className="text-center text-sm mt-1">
                  Persona {currentStudent + 1} de {students.length}
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-center">¿Qué días te convienen? 📅</h2>
            <p className="text-center text-gray-600">Podés seleccionar varios</p>

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
                    (classType === "kids" ? students[0]?.weekdays : students[currentStudent]?.weekdays)?.includes(
                      day.value,
                    )
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleWeekday(day.value)}
                >
                  <Checkbox
                    checked={(classType === "kids"
                      ? students[0]?.weekdays
                      : students[currentStudent]?.weekdays
                    )?.includes(day.value)}
                    className="mr-3"
                  />
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

            {/* Mensaje mejorado de horario de secretaría */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold text-blue-800">Tiempo de respuesta ⏰</h3>
                </div>
                <p className="text-blue-700 font-medium">Te contestaremos en el horario de secretaría</p>
                <p className="text-blue-600 text-sm">📞 Lunes a Viernes de 18 a 21hs</p>
              </div>
            </div>

            {/* Solo mostrar opciones la primera vez (cuando groupMode es null Y currentStudent es 0) */}
            {classType === "group" && showAddPerson && !groupMode && currentStudent === 0 && students.length < 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center">¿Querés agregar otra persona?</h3>
                <div className="space-y-3">
                  <Button
                    onClick={addPersonSameGroup}
                    className="w-full bg-[#01b302] hover:bg-[#01ef4a] hover:text-black"
                  >
                    Agregar otra persona al mismo grupo
                  </Button>
                  <Button onClick={addPersonNewGroup} variant="outline" className="w-full bg-transparent">
                    Agregar otra persona a otro grupo
                  </Button>
                  <Button onClick={() => setShowAddPerson(false)} variant="outline" className="w-full">
                    No, continuar
                  </Button>
                </div>
              </div>
            )}

            {/* SIEMPRE mostrar resumen y botón WhatsApp cuando NO está en modo agregar O cuando ya completó una persona adicional */}
            {(!showAddPerson || (classType === "group" && currentStudent > 0)) && (
              <>
                <p className="text-center text-gray-600">Resumen de tu consulta:</p>

                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <p>
                    <strong>Nombre:</strong> {classType === "kids" ? tutorData.name : mainName}
                  </p>
                  <p>
                    <strong>Tipo de clase:</strong>{" "}
                    {classType === "individual"
                      ? "Individual (1 hora)"
                      : classType === "kids"
                        ? "Individual Niños (30 min)"
                        : `Grupal (${students.length} persona${students.length > 1 ? "s" : ""})`}
                  </p>

                  {students.map((student, idx) => (
                    <div key={idx} className="border-t pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
                      {students.length > 1 && <p className="font-semibold">Persona {idx + 1}:</p>}
                      <p>
                        <strong>Nombre:</strong> {student?.name || ""}
                      </p>
                      <p>
                        <strong>Edad:</strong> {student?.age || ""} años
                      </p>
                      {classType === "kids" && (
                        <p>
                          <strong>Tutor/Responsable:</strong> {tutorData.name}
                        </p>
                      )}
                      <p>
                        <strong>Instrumentos:</strong>{" "}
                        {student?.instruments?.map(getInstrumentName).join(", ") || "No seleccionado"}
                      </p>
                      <p>
                        <strong>Horarios:</strong>{" "}
                        {student?.timePreferences?.map(getTimeName).join(", ") || "No seleccionado"}
                      </p>
                      <p>
                        <strong>Días:</strong> {student?.weekdays?.map(getDayName).join(", ") || "No seleccionado"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Botón para agregar otra persona (solo si no está en el límite) */}
                {classType === "group" && students.length < 3 && (
                  <Button
                    onClick={() => {
                      if (groupMode === "same") {
                        addPersonSameGroup()
                      } else if (groupMode === "different") {
                        addPersonNewGroup()
                      } else {
                        setShowAddPerson(true)
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Agregar otra persona
                  </Button>
                )}

                <div className="flex justify-center">
                  <a
                    href={`https://wa.me/5492657659078?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-[#01b302] px-6 py-3 text-lg font-medium text-white hover:bg-[#01ef4a] hover:text-black transition-colors"
                  >
                    <Send className="mr-2 h-5 w-5" /> Enviar por WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Datos de la nueva persona</h2>
            <p className="text-center text-gray-600">Mismos instrumentos, horarios y días que el grupo</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPersonName" className="flex items-center">
                  Nombre: <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="newPersonName"
                  placeholder="Nombre de la persona"
                  value={students[currentStudent]?.name || ""}
                  onChange={(e) => updateCurrentStudent({ name: e.target.value })}
                  className={nameError ? "border-red-500 focus:border-red-500" : ""}
                />
                {nameError && <p className="text-red-500 text-sm">Por favor, ingresá el nombre</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPersonAge" className="flex items-center">
                  Edad: <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="newPersonAge"
                  placeholder="Edad"
                  type="number"
                  value={students[currentStudent]?.age || ""}
                  onChange={(e) => updateCurrentStudent({ age: e.target.value })}
                  className={ageError ? "border-red-500 focus:border-red-500" : ""}
                />
                {ageError && <p className="text-red-500 text-sm">Por favor, ingresá la edad</p>}
              </div>
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

        <h2 className="text-2xl font-bold text-center">UNDERGROUND 🎵</h2>
        <p className="text-center font-medium">Escuela de Música y Salas de Ensayo</p>

        <div className="space-y-3">
          <div className="text-center space-y-1">
            <p>
              <strong>📍 Dirección:</strong> General Paz 274
            </p>
            <p>
              <strong>📞 Teléfono:</strong> +54 2657 65-9078
            </p>
            <p>
              <strong>🕐 Horarios:</strong> Lunes a Viernes
            </p>
            <p>
              <strong>👩🏻‍💻 Secretaría:</strong> 18 a 21hs
            </p>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-center italic">
              15 años compartiendo el maravilloso arte de la música con alumnos y colegas de la ciudad.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-center">🎯 CLASES PERSONALIZADAS</p>
            <p className="text-center text-sm">Adaptadas a las edades y gustos musicales de cada alumno.</p>
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
          {step > 0 && !showAddPerson && (
            <Button variant="outline" onClick={prevStep} className="h-10 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center gap-4 flex-1 ml-4">
          {/* CORREGIR: Incluir explícitamente el paso 8 */}
          {(step === 1 ||
            (step === 2 && (classType === "individual" || classType === "group")) ||
            step === 3 ||
            step === 4 ||
            step === 5 ||
            step === 6 ||
            step === 8) && (
            <Button
              onClick={() => {
                if (step === 6) {
                  if (classType === "group") {
                    setShowAddPerson(true)
                    setStep(7)
                  } else {
                    setStep(7)
                  }
                } else {
                  nextStep()
                }
              }}
              className="bg-[#01b302] hover:bg-[#01ef4a] hover:text-black h-10 ml-auto"
              disabled={
                (step === 1 &&
                  classType === "kids" &&
                  (!tutorData.name || !tutorData.studentName || !tutorData.studentAge)) ||
                (step === 1 && classType !== "kids" && !mainName) ||
                (step === 3 &&
                  ((!(isForSelf && currentStudent === 0) && !students[currentStudent]?.name) ||
                    !students[currentStudent]?.age)) ||
                (step === 8 && (!students[currentStudent]?.name || !students[currentStudent]?.age)) ||
                (step === 4 &&
                  (classType === "kids"
                    ? (students[0]?.instruments?.length || 0) === 0
                    : (students[currentStudent]?.instruments?.length || 0) === 0)) ||
                (step === 5 &&
                  (classType === "kids"
                    ? (students[0]?.timePreferences?.length || 0) === 0
                    : (students[currentStudent]?.timePreferences?.length || 0) === 0)) ||
                (step === 6 &&
                  (classType === "kids"
                    ? (students[0]?.weekdays?.length || 0) === 0
                    : (students[currentStudent]?.weekdays?.length || 0) === 0))
              }
            >
              {step === 6 ? "Finalizar" : step === 8 ? "Aceptar" : "Siguiente"}
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
        </div>
      </CardHeader>
      <CardContent>{showInfo ? renderInfo() : renderStep()}</CardContent>
      <CardFooter className="flex flex-col">{renderNavButtons()}</CardFooter>
    </Card>
  )
}
