"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [tutorData, setTutorData] = useState<TutorData>({ name: "", studentName: "", studentAge: "" })
  const [showInfo, setShowInfo] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [ageError, setAgeError] = useState(false)
  const [studentNameError, setStudentNameError] = useState(false)
  const [studentAgeError, setStudentAgeError] = useState(false)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [addingPersonMode, setAddingPersonMode] = useState<"same" | "different" | null>(null)
  const [tempPerson, setTempPerson] = useState<StudentData | null>(null)
  const [lastChosenMode, setLastChosenMode] = useState<"same" | "different" | null>(null)

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
    setAddingPersonMode(null)
    setTempPerson(null)
    setLastChosenMode(null) // Resetear la elección previa
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

  // Función para obtener el estudiante actual (puede ser tempPerson o del array students)
  const getCurrentStudent = (): StudentData => {
    if (tempPerson) {
      return tempPerson
    }
    return students[currentStudent] || { name: "", age: "", instruments: [], timePreferences: [], weekdays: [] }
  }

  // Función para actualizar el estudiante actual
  const updateCurrentStudent = (data: Partial<StudentData>) => {
    if (tempPerson) {
      setTempPerson({ ...tempPerson, ...data })
    } else {
      const updatedStudents = [...students]
      if (updatedStudents[currentStudent]) {
        updatedStudents[currentStudent] = { ...updatedStudents[currentStudent], ...data }
        setStudents(updatedStudents)
      }
    }

    // Resetear errores
    if (data.name) setNameError(false)
    if (data.age) setAgeError(false)
  }

  // Función para manejar selección de instrumentos
  const toggleInstrument = (instrument: Instrument) => {
    if (classType === "kids") {
      const currentInstruments = students[0]?.instruments || []
      if (currentInstruments.includes(instrument)) {
        const newStudent = { ...students[0], instruments: currentInstruments.filter((i) => i !== instrument) }
        setStudents([newStudent])
      } else {
        const newStudent = { ...students[0], instruments: [...currentInstruments, instrument] }
        setStudents([newStudent])
      }
    } else {
      const currentStudent = getCurrentStudent()
      const currentInstruments = currentStudent.instruments || []
      if (currentInstruments.includes(instrument)) {
        updateCurrentStudent({ instruments: currentInstruments.filter((i) => i !== instrument) })
      } else {
        updateCurrentStudent({ instruments: [...currentInstruments, instrument] })
      }
    }
  }

  // Función para manejar selección de horarios
  const toggleTimePreference = (time: TimePreference) => {
    if (classType === "kids") {
      const currentTimes = students[0]?.timePreferences || []
      if (currentTimes.includes(time)) {
        const newStudent = { ...students[0], timePreferences: currentTimes.filter((t) => t !== time) }
        setStudents([newStudent])
      } else {
        const newStudent = { ...students[0], timePreferences: [...currentTimes, time] }
        setStudents([newStudent])
      }
    } else {
      const currentStudent = getCurrentStudent()
      const currentTimes = currentStudent.timePreferences || []
      if (currentTimes.includes(time)) {
        updateCurrentStudent({ timePreferences: currentTimes.filter((t) => t !== time) })
      } else {
        updateCurrentStudent({ timePreferences: [...currentTimes, time] })
      }
    }
  }

  // Función para manejar selección de días
  const toggleWeekday = (day: Weekday) => {
    if (classType === "kids") {
      const currentDays = students[0]?.weekdays || []
      if (currentDays.includes(day)) {
        const newStudent = { ...students[0], weekdays: currentDays.filter((d) => d !== day) }
        setStudents([newStudent])
      } else {
        const newStudent = { ...students[0], weekdays: [...currentDays, day] }
        setStudents([newStudent])
      }
    } else {
      const currentStudent = getCurrentStudent()
      const currentDays = currentStudent.weekdays || []
      if (currentDays.includes(day)) {
        updateCurrentStudent({ weekdays: currentDays.filter((d) => d !== day) })
      } else {
        updateCurrentStudent({ weekdays: [...currentDays, day] })
      }
    }
  }

  // Función para agregar persona al mismo grupo
  const addPersonSameGroup = () => {
    if (students.length >= 3) return

    const newPerson = {
      name: "",
      age: "",
      instruments: students[0]?.instruments || [],
      timePreferences: students[0]?.timePreferences || [],
      weekdays: students[0]?.weekdays || [],
    }
    setTempPerson(newPerson)
    setAddingPersonMode("same")
    setLastChosenMode("same") // Recordar la elección
    setShowAddPerson(false)
    setStep(8) // Ir al paso de solo nombre y edad
  }

  // Función para agregar persona a otro grupo
  const addPersonNewGroup = () => {
    if (students.length >= 3) return

    const newPerson = {
      name: "",
      age: "",
      instruments: [],
      timePreferences: [],
      weekdays: [],
    }
    setTempPerson(newPerson)
    setAddingPersonMode("different")
    setLastChosenMode("different") // Recordar la elección
    setShowAddPerson(false)
    setStep(3) // Ir al flujo completo
  }

  // Función para confirmar y agregar la persona temporal al array final
  const confirmAddPerson = () => {
    if (tempPerson) {
      const newStudents = [...students, tempPerson]
      setStudents(newStudents)
      setTempPerson(null)
      setAddingPersonMode(null)
      setStep(7) // Volver al resumen
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (classType === "kids") {
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
        const studentForKids = {
          name: tutorData.studentName,
          age: tutorData.studentAge,
          instruments: [],
          timePreferences: [],
          weekdays: [],
        }
        setStudents([studentForKids])
        setStep(4)
        return
      } else {
        if (!mainName.trim()) {
          setNameError(true)
          return
        }
      }
    }

    if (step === 3) {
      const currentStudent = getCurrentStudent()
      const needsName = !(isForSelf && !tempPerson && students.length === 1)

      if (needsName && !currentStudent.name?.trim()) {
        setNameError(true)
        return
      }
      if (!currentStudent.age) {
        setAgeError(true)
        return
      }
    }

    if (step === 8) {
      // Validar datos para persona del mismo grupo
      if (!tempPerson?.name?.trim()) {
        setNameError(true)
        return
      }
      if (!tempPerson?.age) {
        setAgeError(true)
        return
      }
      // Confirmar y agregar la persona
      confirmAddPerson()
      return
    }

    if (step === 6) {
      // Si estamos agregando una persona a otro grupo, confirmarla
      if (addingPersonMode === "different" && tempPerson) {
        confirmAddPerson()
        return
      }

      // Si es clase grupal y es la primera persona, mostrar opciones
      if (classType === "group" && !addingPersonMode && students.length === 1) {
        setShowAddPerson(true)
        setStep(7)
        return
      }

      // En otros casos, ir al resumen
      setStep(7)
      return
    }

    setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 0) {
      if (step === 8) {
        // Si estamos agregando persona del mismo grupo, volver al resumen
        setTempPerson(null)
        setAddingPersonMode(null)
        setStep(7)
        setShowAddPerson(true)
        return
      }

      // Si estamos agregando una persona a otro grupo (paso 3-6 con addingPersonMode "different")
      if (addingPersonMode === "different") {
        if (step === 3) {
          // Si estamos en el paso 3 agregando persona a otro grupo, volver al resumen
          setTempPerson(null)
          setAddingPersonMode(null)
          setStep(7)
          setShowAddPerson(true)
          return
        } else {
          // Para otros pasos del flujo "different", retroceder normalmente
          setStep(step - 1)
          return
        }
      }

      // Para el flujo normal, retroceder un paso
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
    const currentStudent = getCurrentStudent()
    const currentAge = Number.parseInt(currentStudent.age || "0")
    return currentAge > 0 && currentAge <= 8
  }

  // Función para agregar persona basada en la elección previa
  const addPersonBasedOnPreviousChoice = () => {
    if (lastChosenMode === "same") {
      addPersonSameGroup()
    } else if (lastChosenMode === "different") {
      addPersonNewGroup()
    }
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
                width={350}
                height={120}
                className="h-auto w-full max-w-sm"
              />
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
                    <p className="text-lg font-bold mt-1">$32.000/mes</p>
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
                    <p className="text-lg font-bold mt-1">$55.000/mes</p>
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
                    <p className="text-lg font-bold mt-1">$39.000/mes</p>
                  </div>
                </div>
              </Button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-green-800">CLASES PERSONALIZADAS</h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  Guitarra / Canto / Batería / Piano / Armónica / Bajo / Ukelele
                </p>
                <p className="text-xs text-green-600">( adaptado a edades y gustos musicales )</p>
                <p className="text-lg">🎸🥁🎹🪘🪕🎤🎶</p>
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
        const currentStudent = getCurrentStudent()
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {isForSelf && !tempPerson && students.length === 1
                ? "¿Cuál es tu edad?"
                : addingPersonMode
                  ? `Datos de la nueva persona`
                  : "Datos del estudiante"}
            </h2>

            {shouldShowKidsInfo() && classType === "individual" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Para menores de 8 años (inclusive), recomendamos la modalidad "Individual Niños" de 30 minutos por
                  $39.000/mes
                </p>
              </div>
            )}

            {classType === "group" && shouldShowKidsInfo() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Para menores de 8 años (inclusive), recomendamos la modalidad "Individual Niños" de 30 minutos por
                  $39.000/mes en lugar de grupal
                </p>
              </div>
            )}

            <div className="space-y-4">
              {!(isForSelf && !tempPerson && students.length === 1) && (
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="flex items-center">
                    Nombre: <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    placeholder="Nombre de la persona"
                    value={currentStudent.name || ""}
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
                  value={currentStudent.age || ""}
                  onChange={(e) => updateCurrentStudent({ age: e.target.value })}
                  className={ageError ? "border-red-500 focus:border-red-500" : ""}
                />
                {ageError && <p className="text-red-500 text-sm">Por favor, ingresá la edad</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        const currentStudentInstruments = getCurrentStudent()
        return (
          <div className="space-y-6">
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
                    (classType === "kids" ? students[0]?.instruments : currentStudentInstruments.instruments)?.includes(
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
        const currentStudentTimes = getCurrentStudent()
        return (
          <div className="space-y-6">
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
                      : currentStudentTimes.timePreferences
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
        const currentStudentDays = getCurrentStudent()
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">¿Qué días tenés libres? 📅</h2>
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
                    (classType === "kids" ? students[0]?.weekdays : currentStudentDays.weekdays)?.includes(day.value)
                      ? "border-[#01b302] bg-[#01ef4a]/10"
                      : "border-gray-200 hover:border-[#01ef4a]"
                  }`}
                  onClick={() => toggleWeekday(day.value)}
                >
                  <Checkbox
                    checked={(classType === "kids" ? students[0]?.weekdays : currentStudentDays.weekdays)?.includes(
                      day.value,
                    )}
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
            

            {/* Mostrar opciones de agregar persona solo si es clase grupal, no hay modo activo y hay menos de 3 personas */}
            {classType === "group" && showAddPerson && !addingPersonMode && students.length < 3 && (
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

            {/* Mostrar resumen cuando no está en modo agregar */}
            {!showAddPerson && (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-blue-800">¡PERFECTO! 🎉</h3>
                    <p className="text-blue-700 font-medium">
                      Te responderemos personalmente para informarte de cupos disponibles en el horario de secretaría:
                    </p>
                    <p className="text-blue-600 text-sm font-semibold">📞 Lunes a Viernes de 18 a 21hs</p>
                  </div>
                </div>

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

                {/* Botones para agregar más personas si es clase grupal y hay menos de 3 */}
                {classType === "group" && students.length < 3 && (
                  <div className="space-y-2">
                    {/* Si ya eligió una modalidad antes, mostrar solo un botón */}
                    {lastChosenMode ? (
                      <Button
                        onClick={addPersonBasedOnPreviousChoice}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Agregar otra persona
                      </Button>
                    ) : (
                      /* Si nunca eligió, mostrar ambos botones */
                      <>
                        <Button onClick={addPersonSameGroup} variant="outline" className="w-full bg-transparent">
                          Agregar otra persona al mismo grupo
                        </Button>
                        <Button onClick={addPersonNewGroup} variant="outline" className="w-full bg-transparent">
                          Agregar otra persona a otro grupo
                        </Button>
                      </>
                    )}
                  </div>
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
                  value={tempPerson?.name || ""}
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
                  value={tempPerson?.age || ""}
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
            <p className="font-bold text-center">👨‍🎓 CLASES INDIVIDUALES</p>
            <p className="text-center text-sm">Se pueden recuperar si se avisa con anticipación</p>
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
          {(step === 1 ||
            (step === 2 && (classType === "individual" || classType === "group")) ||
            step === 3 ||
            step === 4 ||
            step === 5 ||
            step === 6 ||
            step === 8) && (
            <Button
              onClick={nextStep}
              className="bg-[#01b302] hover:bg-[#01ef4a] hover:text-black h-10 ml-auto"
              disabled={
                (step === 1 &&
                  classType === "kids" &&
                  (!tutorData.name || !tutorData.studentName || !tutorData.studentAge)) ||
                (step === 1 && classType !== "kids" && !mainName) ||
                (step === 3 &&
                  ((!(isForSelf && !tempPerson && students.length === 1) && !getCurrentStudent().name?.trim()) ||
                    !getCurrentStudent().age)) ||
                (step === 8 && (!tempPerson?.name || !tempPerson?.age)) ||
                (step === 4 &&
                  (classType === "kids"
                    ? (students[0]?.instruments?.length || 0) === 0
                    : (getCurrentStudent().instruments?.length || 0) === 0)) ||
                (step === 5 &&
                  (classType === "kids"
                    ? (students[0]?.timePreferences?.length || 0) === 0
                    : (getCurrentStudent().timePreferences?.length || 0) === 0)) ||
                (step === 6 &&
                  (classType === "kids"
                    ? (students[0]?.weekdays?.length || 0) === 0
                    : (getCurrentStudent().weekdays?.length || 0) === 0))
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
