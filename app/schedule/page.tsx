"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, Plus, AlertCircle, Clock } from "lucide-react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
  isSameDay,
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDay,
  isWithinInterval,
} from "date-fns";
import { fr } from "date-fns/locale";
import * as useMediaQuery from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types for appointments and availabilities
type Appointment = {
  id: string;
  title: string;
  clientName: string;
  clientAvatar?: string;
  start: string; // ISO string
  end: string; // ISO string
  status: "confirmed" | "pending" | "cancelled";
  color?: string;
};

type Availability = {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // format "HH:MM"
  endTime: string; // format "HH:MM"
};

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    streetNumber: string;
    unit?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  avatar?: string;
};

type Dependent = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "male" | "female" | "other";
};

type Service = {
  id: string;
  name: string;
  duration: number; // in minutes
  description?: string;
};

type UnavailabilityPeriod = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
  };
};

type TimeSlot = {
  hour: number;
  minute: number;
  label: string;
};

export default function ScheduleV2() {
  // const isMobile = useMediaQuery("(max-width: 768px)")
  const isMobile = useMediaQuery.useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">(
    "week"
  );
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // States for new appointment modal
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
    minute: number;
  } | null>(null);
  const [appointmentType, setAppointmentType] = useState<"self" | "dependent">(
    "self"
  );
  const [newAppointmentTab, setNewAppointmentTab] = useState<
    "existing" | "new"
  >("existing");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchClient, setSearchClient] = useState("");
  const [openClientSearch, setOpenClientSearch] = useState(false);

  // States for new client form
  const [newClient, setNewClient] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetNumber: string;
    street: string;
    unit: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetNumber: "",
    street: "",
    unit: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  // States for dependent form
  const [dependent, setDependent] = useState<{
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: "male" | "female" | "other";
  }>({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male",
  });

  // State for availability modal
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilitySettings, setAvailabilitySettings] = useState<{
    [key: number]: {
      // 1 = Monday, 2 = Tuesday, etc.
      enabled: boolean;
      morningStart: string;
      morningEnd: string;
      afternoonStart: string;
      afternoonEnd: string;
    };
  }>({
    1: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
    2: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
    3: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
    4: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "17:00",
    },
    5: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
    6: {
      enabled: true,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
    7: {
      enabled: false,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "13:00",
      afternoonEnd: "16:00",
    },
  });

  // State for appointment details modal
  const [showUnavailabilityModal, setShowUnavailabilityModal] = useState(false);
  const [unavailabilityPeriods, setUnavailabilityPeriods] = useState<
    UnavailabilityPeriod[]
  >([
    {
      id: "1",
      title: "Vacances",
      start: "2025-04-10T00:00:00",
      end: "2025-04-15T23:59:59",
      isRecurring: false,
    },
    {
      id: "2",
      title: "Formation",
      start: "2025-03-26T09:00:00",
      end: "2025-03-26T17:00:00",
      isRecurring: true,
      recurrencePattern: {
        frequency: "weekly",
        interval: 1,
        endDate: "2025-06-30T00:00:00",
      },
    },
  ]);
  const [newUnavailability, setNewUnavailability] = useState<{
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    isRecurring: boolean;
    recurrenceFrequency: "daily" | "weekly" | "monthly";
    recurrenceInterval: number;
    recurrenceEndDate: string;
  }>({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isRecurring: false,
    recurrenceFrequency: "weekly",
    recurrenceInterval: 1,
    recurrenceEndDate: "",
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  // Simulated data for clients
  const clients: Client[] = [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 555-123-4567",
      address: {
        streetNumber: "123",
        street: "Main Street",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10001",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      phone: "+1 555-234-5678",
      address: {
        streetNumber: "45",
        street: "Park Avenue",
        unit: "3B",
        city: "Boston",
        state: "MA",
        country: "USA",
        zipCode: "02108",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      phone: "+1 555-345-6789",
      address: {
        streetNumber: "8",
        street: "Ocean Drive",
        city: "Miami",
        state: "FL",
        country: "USA",
        zipCode: "33139",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      phone: "+1 555-456-7890",
      address: {
        streetNumber: "27",
        street: "Market Street",
        unit: "12",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        zipCode: "94105",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      firstName: "Olivia",
      lastName: "Taylor",
      email: "olivia.taylor@example.com",
      phone: "+1 555-567-8901",
      address: {
        streetNumber: "56",
        street: "Commerce Street",
        city: "Dallas",
        state: "TX",
        country: "USA",
        zipCode: "75201",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      firstName: "William",
      lastName: "Anderson",
      email: "william.anderson@example.com",
      phone: "+1 555-678-9012",
      address: {
        streetNumber: "12",
        street: "Peachtree Street",
        city: "Atlanta",
        state: "GA",
        country: "USA",
        zipCode: "30303",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  // Add this list of services
  const services: Service[] = [
    {
      id: "indian-massage",
      name: "Massage Indien",
      duration: 30,
      description: "Technique de massage traditionnelle indienne",
    },
    {
      id: "osteopathy",
      name: "Ostéopathie",
      duration: 90,
      description: "Séance complète d'ostéopathie",
    },
    {
      id: "standard-consultation",
      name: "Consultation Standard",
      duration: 45,
      description: "Consultation de suivi régulière",
    },
    {
      id: "initial-consultation",
      name: "Consultation Initiale",
      duration: 60,
      description: "Première consultation avec évaluation complète",
    },
    {
      id: "manual-therapy",
      name: "Thérapie Manuelle",
      duration: 60,
      description: "Séance de thérapie manuelle",
    },
    {
      id: "quick-follow-up",
      name: "Suivi Rapide",
      duration: 20,
      description: "Consultation de suivi courte",
    },
  ];

  // Add a new state for the selected service
  const [selectedService, setSelectedService] = useState<string>("");

  // Ajouter ces états pour gérer la reprogrammation et l'annulation des rendez-vous
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<Appointment | null>(null);

  // Calculate start and end dates of the week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Ends on Sunday

  // Generate an array of days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generate time slots with 30-minute intervals (from 6am to 5pm)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour < 18; hour++) {
      for (const minute of [0, 30]) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        slots.push({
          hour,
          minute,
          label: `${hourStr}:${minuteStr}`,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Simulated data for availabilities
  const availabilities: Availability[] = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" }, // Monday morning
    { dayOfWeek: 1, startTime: "13:00", endTime: "16:00" }, // Monday afternoon
    { dayOfWeek: 2, startTime: "09:00", endTime: "12:00" }, // Tuesday morning
    { dayOfWeek: 2, startTime: "13:00", endTime: "16:00" }, // Tuesday afternoon
    { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" }, // Wednesday morning
    { dayOfWeek: 3, startTime: "13:00", endTime: "16:00" }, // Wednesday afternoon
    { dayOfWeek: 4, startTime: "09:00", endTime: "12:00" }, // Thursday morning
    { dayOfWeek: 4, startTime: "13:00", endTime: "17:00" }, // Thursday afternoon
    { dayOfWeek: 5, startTime: "09:00", endTime: "12:00" }, // Friday morning
    { dayOfWeek: 5, startTime: "13:00", endTime: "16:00" }, // Friday afternoon
    { dayOfWeek: 6, startTime: "09:00", endTime: "12:00" }, // Saturday morning
    { dayOfWeek: 6, startTime: "13:00", endTime: "16:00" }, // Saturday afternoon
  ];

  // Simulated data for appointments
  const appointments: Appointment[] = [
    {
      id: "1",
      title: "Consultation Initiale",
      clientName: "Sarah Johnson",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-31T09:00:00", // Monday 9am
      end: "2025-03-31T10:00:00", // Monday 10am
      status: "confirmed",
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Suivi Mensuel",
      clientName: "Michael Brown",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-31T15:30:00", // Monday 3:30pm
      end: "2025-03-31T16:15:00", // Monday 4:15pm
      status: "confirmed",
      color: "bg-green-500",
    },
  ];

  // Adjust appointment dates to match the current week
  const adjustedAppointments = appointments.map((appointment) => {
    const originalDate = parseISO(appointment.start);
    const dayOfWeek = originalDate.getDay() === 0 ? 7 : originalDate.getDay(); // Convert Sunday (0) to 7
    const adjustedStartDate = addDays(weekStart, dayOfWeek - 1); // -1 because weekStart is already Monday

    const startHours = originalDate.getHours();
    const startMinutes = originalDate.getMinutes();
    const adjustedStartDateTime = new Date(adjustedStartDate);
    adjustedStartDateTime.setHours(startHours, startMinutes, 0, 0);

    const originalEndDate = parseISO(appointment.end);
    const endHours = originalEndDate.getHours();
    const endMinutes = originalEndDate.getMinutes();
    const adjustedEndDateTime = new Date(adjustedStartDate);
    adjustedEndDateTime.setHours(endHours, endMinutes, 0, 0);

    return {
      ...appointment,
      start: adjustedStartDateTime.toISOString(),
      end: adjustedEndDateTime.toISOString(),
    };
  });

  // Check if a cell contains an appointment or unavailability
  const getAppointmentForCell = (day: Date, timeSlot: TimeSlot) => {
    const cellDate = new Date(day);
    cellDate.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

    // Check for appointments
    const appointment = adjustedAppointments.find((appointment) => {
      const appointmentStart = parseISO(appointment.start);
      const appointmentEnd = parseISO(appointment.end);

      // Check if the appointment overlaps with this cell
      return (
        isSameDay(appointmentStart, day) &&
        isWithinInterval(cellDate, {
          start: appointmentStart,
          end: appointmentEnd,
        })
      );
    });

    if (appointment) return { type: "appointment", data: appointment };

    // Check for unavailability periods
    const unavailability = unavailabilityPeriods.find((period) => {
      const periodStart = parseISO(period.start);
      const periodEnd = parseISO(period.end);

      // For recurring unavailability, check if this day matches the pattern
      if (period.isRecurring && period.recurrencePattern) {
        const pattern = period.recurrencePattern;

        // For weekly recurrence, check if the day of week matches
        if (pattern.frequency === "weekly") {
          const originalDayOfWeek = getDay(periodStart);
          const currentDayOfWeek = getDay(day);

          // If day of week doesn't match, this cell is not affected
          if (originalDayOfWeek !== currentDayOfWeek) return false;

          // Check if the current date is within the recurrence range
          const recurrenceEnd = pattern.endDate
            ? parseISO(pattern.endDate)
            : new Date(2099, 11, 31);
          if (day > recurrenceEnd) return false;

          // Create a time-only comparison for the current day
          const dayWithOriginalTime = new Date(day);
          dayWithOriginalTime.setHours(
            periodStart.getHours(),
            periodStart.getMinutes(),
            0,
            0
          );
          const dayWithOriginalEndTime = new Date(day);
          dayWithOriginalEndTime.setHours(
            periodEnd.getHours(),
            periodEnd.getMinutes(),
            0,
            0
          );

          // Check if the time slot is within the unavailability period
          return isWithinInterval(cellDate, {
            start: dayWithOriginalTime,
            end: dayWithOriginalEndTime,
          });
        }
      }

      // For non-recurring unavailability, check if the date and time match
      return (
        isSameDay(periodStart, day) &&
        isWithinInterval(cellDate, { start: periodStart, end: periodEnd })
      );
    });

    if (unavailability) return { type: "unavailability", data: unavailability };

    return null;
  };

  // Check if a cell is the start of an appointment
  const isAppointmentStart = (
    day: Date,
    timeSlot: TimeSlot,
    appointment: Appointment
  ) => {
    const appointmentStart = parseISO(appointment.start);
    const cellDate = new Date(day);
    cellDate.setHours(timeSlot.hour, timeSlot.minute, 0, 0);

    return (
      appointmentStart.getHours() === timeSlot.hour &&
      appointmentStart.getMinutes() === timeSlot.minute
    );
  };

  // Check if a cell is available according to defined availabilities
  const isCellAvailable = (day: Date, timeSlot: TimeSlot) => {
    const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay(); // Convert Sunday (0) to 7
    const cellTime = `${timeSlot.hour
      .toString()
      .padStart(2, "0")}:${timeSlot.minute.toString().padStart(2, "0")}`;

    // Check if the day is enabled in settings
    const daySettings = availabilitySettings[dayOfWeek];
    if (!daySettings || !daySettings.enabled) return false;

    // Check if the time is in the morning range
    const morningStart = daySettings.morningStart;
    const morningEnd = daySettings.morningEnd;

    // Check if the time is in the afternoon range
    const afternoonStart = daySettings.afternoonStart;
    const afternoonEnd = daySettings.afternoonEnd;

    return (
      (cellTime >= morningStart && cellTime < morningEnd) ||
      (cellTime >= afternoonStart && cellTime < afternoonEnd)
    );
  };

  // Generate days for month view
  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  // Navigation between weeks
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToCurrentWeek = () => setCurrentDate(new Date());

  // Navigation between months
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Get appointments for a specific day (for day and month views)
  const getAppointmentsForDay = (day: Date) => {
    return adjustedAppointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.start);
      return isSameDay(appointmentDate, day);
    });
  };

  // Get unavailability periods for a specific day
  const getUnavailabilityForDay = (day: Date) => {
    return unavailabilityPeriods.filter((period) => {
      const periodStart = parseISO(period.start);
      const periodEnd = parseISO(period.end);

      // For non-recurring periods, simple date check
      if (!period.isRecurring) {
        return (
          (day >= periodStart && day <= periodEnd) ||
          isSameDay(day, periodStart) ||
          isSameDay(day, periodEnd)
        );
      }

      // For recurring periods
      if (period.recurrencePattern) {
        const pattern = period.recurrencePattern;

        // For weekly recurrence
        if (pattern.frequency === "weekly") {
          const originalDayOfWeek = getDay(periodStart);
          const currentDayOfWeek = getDay(day);

          // Check if day of week matches and is within recurrence range
          const recurrenceEnd = pattern.endDate
            ? parseISO(pattern.endDate)
            : new Date(2099, 11, 31);
          return (
            originalDayOfWeek === currentDayOfWeek &&
            day <= recurrenceEnd &&
            day >= periodStart
          );
        }
      }

      return false;
    });
  };

  // Ajouter ces états pour gérer la reprogrammation et l'annulation des rendez-vous
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] =
    useState(false);
  //const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  //const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  //const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null)

  // Modifier la fonction handleAppointmentClick pour afficher la modale de détails
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsModal(true);
  };

  // Ajouter cette fonction pour gérer la reprogrammation d'un rendez-vous
  const handleRescheduleAppointment = () => {
    if (!selectedAppointment) return;

    // Préparer les données pour la reprogrammation
    const appointmentDate = parseISO(selectedAppointment.start);
    setAppointmentToReschedule(selectedAppointment);

    // Trouver le client correspondant
    const clientName = selectedAppointment.clientName;
    const client = clients.find(
      (c) => `${c.firstName} ${c.lastName}` === clientName
    );
    if (client) {
      setSelectedClient(client.id);
      setSearchClient(clientName);
    }

    // Trouver le service correspondant
    const serviceTitle = selectedAppointment.title;
    const service = services.find((s) => s.name === serviceTitle);
    if (service) {
      setSelectedService(service.id);
    }

    // Fermer la modale de détails et ouvrir celle de reprogrammation
    setShowAppointmentDetailsModal(false);
    setShowRescheduleModal(true);

    // Préparer le créneau sélectionné
    setSelectedSlot({
      date: appointmentDate,
      hour: appointmentDate.getHours(),
      minute: appointmentDate.getMinutes(),
    });
  };

  // Ajouter cette fonction pour gérer l'annulation d'un rendez-vous
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;

    // Dans un environnement réel, vous enverriez une requête à votre API
    console.log("Rendez-vous annulé:", selectedAppointment);

    // Simuler la suppression du rendez-vous (dans un environnement réel, vous mettriez à jour l'état avec les données de l'API)
    const updatedAppointments = adjustedAppointments.filter(
      (appointment) => appointment.id !== selectedAppointment.id
    );

    // Fermer les modales
    setShowCancelConfirmation(false);
    setShowAppointmentDetailsModal(false);

    // Afficher un message de confirmation
    alert("Le rendez-vous a été annulé avec succès.");
  };

  // Ajouter cette fonction pour finaliser la reprogrammation
  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !appointmentToReschedule) return;

    // Créer une date avec l'heure et les minutes sélectionnées
    const appointmentDate = new Date(selectedSlot.date);
    appointmentDate.setHours(selectedSlot.hour, selectedSlot.minute, 0, 0);

    // Calculer l'heure de fin en fonction du service sélectionné
    const selectedServiceData = services.find((s) => s.id === selectedService);
    const durationInMinutes = selectedServiceData?.duration || 30;
    const endDate = new Date(appointmentDate);
    endDate.setMinutes(endDate.getMinutes() + durationInMinutes);

    // Dans un environnement réel, vous enverriez ces données à votre API
    console.log("Rendez-vous reprogrammé:", {
      id: appointmentToReschedule.id,
      start: appointmentDate.toISOString(),
      end: endDate.toISOString(),
      service: selectedServiceData,
    });

    // Fermer la modale
    setShowRescheduleModal(false);
    setAppointmentToReschedule(null);

    // Réinitialiser les états
    handleCloseNewAppointmentModal();

    // Afficher un message de confirmation
    alert("Le rendez-vous a été reprogrammé avec succès.");
  };

  // Open new appointment modal
  const handleAvailableSlotClick = (day: Date, timeSlot: TimeSlot) => {
    const slotDate = new Date(day);
    // Arrondir les minutes au multiple de 5 le plus proche
    const roundedMinutes = Math.round(timeSlot.minute / 5) * 5;
    slotDate.setHours(timeSlot.hour, roundedMinutes, 0, 0);

    setSelectedSlot({
      date: slotDate,
      hour: timeSlot.hour,
      minute: roundedMinutes,
    });
    setShowNewAppointmentModal(true);
  };

  // Close new appointment modal
  const handleCloseNewAppointmentModal = () => {
    setShowNewAppointmentModal(false);
    setSelectedSlot(null);
    setAppointmentType("self");
    setNewAppointmentTab("existing");
    setSelectedClient(null);
    setSearchClient("");
    setNewClient({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetNumber: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
    setDependent({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "male",
    });
    setSelectedService("");
  };

  // Submit new appointment form
  const handleSubmitNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) return;

    // Créer une date avec l'heure et les minutes sélectionnées
    const appointmentDate = new Date(selectedSlot.date);
    appointmentDate.setHours(selectedSlot.hour, selectedSlot.minute, 0, 0);

    // Calculer l'heure de fin en fonction du service sélectionné
    const selectedServiceData = services.find((s) => s.id === selectedService);
    const durationInMinutes = selectedServiceData?.duration || 30;
    const endDate = new Date(appointmentDate);
    endDate.setMinutes(endDate.getMinutes() + durationInMinutes);

    // Here, you would implement the logic to save the appointment
    console.log("New appointment:", {
      start: appointmentDate.toISOString(),
      end: endDate.toISOString(),
      appointmentType,
      client:
        newAppointmentTab === "existing"
          ? clients.find((c) => c.id === selectedClient)
          : newClient,
      dependent: appointmentType === "dependent" ? dependent : null,
      service: selectedServiceData,
    });

    // Close the modal after submission
    handleCloseNewAppointmentModal();

    // Display a confirmation message
    alert("Rendez-vous planifié avec succès !");
  };

  // Update availabilities
  const handleSaveAvailabilities = () => {
    // Convert form settings to availability format
    const newAvailabilities: Availability[] = [];

    Object.entries(availabilitySettings).forEach(([dayKey, settings]) => {
      const dayOfWeek = Number.parseInt(dayKey);

      if (settings.enabled) {
        // Add morning availability if hours are valid
        if (settings.morningStart && settings.morningEnd) {
          newAvailabilities.push({
            dayOfWeek,
            startTime: settings.morningStart,
            endTime: settings.morningEnd,
          });
        }

        // Add afternoon availability if hours are valid
        if (settings.afternoonStart && settings.afternoonEnd) {
          newAvailabilities.push({
            dayOfWeek,
            startTime: settings.afternoonStart,
            endTime: settings.afternoonEnd,
          });
        }
      }
    });

    // In a real environment, you would send this data to your API
    console.log("New availabilities:", newAvailabilities);

    // Close the modal
    setShowAvailabilityModal(false);

    // Display a confirmation message
    alert("Vos disponibilités ont été mises à jour avec succès !");
  };

  // Handle adding new unavailability period
  const handleAddUnavailability = (e: React.FormEvent) => {
    e.preventDefault();

    // Create start and end dates by combining date and time
    const startDateTime = new Date(
      `${newUnavailability.startDate}T${newUnavailability.startTime}:00`
    );
    const endDateTime = new Date(
      `${newUnavailability.endDate}T${newUnavailability.endTime}:00`
    );

    const newPeriod: UnavailabilityPeriod = {
      id: `unavail-${Date.now()}`,
      title: newUnavailability.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      isRecurring: newUnavailability.isRecurring,
    };

    if (newUnavailability.isRecurring) {
      newPeriod.recurrencePattern = {
        frequency: newUnavailability.recurrenceFrequency,
        interval: newUnavailability.recurrenceInterval,
      };

      if (newUnavailability.recurrenceEndDate) {
        const recurrenceEnd = new Date(
          `${newUnavailability.recurrenceEndDate}T23:59:59`
        );
        newPeriod.recurrencePattern.endDate = recurrenceEnd.toISOString();
      }
    }

    setUnavailabilityPeriods([...unavailabilityPeriods, newPeriod]);
    setShowUnavailabilityModal(false);

    // Reset form
    setNewUnavailability({
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      isRecurring: false,
      recurrenceFrequency: "weekly",
      recurrenceInterval: 1,
      recurrenceEndDate: "",
    });
  };

  // Filter clients for search
  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchClient.toLowerCase()) ||
      client.email.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.phone.includes(searchClient)
  );

  // Scroll to current time in day view
  useEffect(() => {
    if (currentView === "day" && calendarRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Find the closest time slot
      let closestSlot = "09:00";
      if (currentHour >= 6 && currentHour < 18) {
        const minute = currentMinute < 30 ? "00" : "30";
        closestSlot = `${currentHour.toString().padStart(2, "0")}:${minute}`;
      }

      // Find the element for the current time
      const timeElement = calendarRef.current.querySelector(
        `[data-time="${closestSlot}"]`
      );

      if (timeElement) {
        // Scroll to the current time with some offset
        timeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentView]);

  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            className="flex items-center font-bold text-xl text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            Gobering
          </Link>
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Fermer le menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="py-4">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Menu principal
            </p>
          </div>
          <nav className="space-y-1">
            <Link
              href="/dashboard-professionnel"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Tableau de bord
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-primary bg-primary/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Calendrier
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Clients
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              Paiements
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Messages
            </Link>
          </nav>
          <div className="mt-6 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Paramètres
            </p>
          </div>
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <User className="mr-3 h-5 w-5" />
              Mon Profil
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Paramètres
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-6">
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Calendrier</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvailabilityModal(true)}
            >
              Définir disponibilités
            </Button>
            <DropdownMenu
              open={profileMenuOpen}
              onOpenChange={setProfileMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Profile"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/logout">Déconnexion</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="sticky top-16 z-10 bg-gray-100 pt-4 pb-2 px-4 md:px-6 border-b border-gray-200 shadow-sm">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                Aujourd'hui
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
              <h2 className="hidden text-lg font-semibold text-gray-900 sm:block">
                {`${format(weekStart, "d MMMM", { locale: fr })} - ${format(
                  weekEnd,
                  "d MMMM yyyy",
                  { locale: fr }
                )}`}
              </h2>
              <h2 className="text-lg font-semibold text-gray-900 sm:hidden">
                {`${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setShowUnavailabilityModal(true)}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Définir indisponibilités
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden"
                onClick={() => setShowUnavailabilityModal(true)}
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 pt-0 md:p-6 md:pt-0">
          {/* Week View Calendar - Styled like the image */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Calendar Header - Days of the week */}
              <div className="grid grid-cols-8 border-b border-gray-300">
                <div className="h-12 border-r border-gray-300"></div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="h-12 border-r border-gray-300 px-2 py-1 text-center"
                  >
                    <div className="text-sm font-medium">
                      {format(day, "EEE", { locale: fr })}
                    </div>
                    <div className="text-sm">
                      {format(day, "d MMM", { locale: fr })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar Body - Time slots */}
              <div className="grid grid-cols-8">
                {/* Time column */}
                <div className="space-y-0">
                  {timeSlots.map((timeSlot, index) => (
                    <div
                      key={index}
                      className={`flex h-8 items-center justify-end pr-2 text-xs text-gray-500 border-r border-gray-300 ${
                        index % 2 === 0 ? "border-b border-gray-300" : ""
                      }`}
                      data-time={timeSlot.label}
                    >
                      {index % 2 === 0 && timeSlot.label}
                    </div>
                  ))}
                </div>

                {/* Days columns */}
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="space-y-0">
                    {timeSlots.map((timeSlot, timeIndex) => {
                      const cellContent = getAppointmentForCell(day, timeSlot);
                      const isAvailable =
                        isCellAvailable(day, timeSlot) && !cellContent;

                      return (
                        <div
                          key={timeIndex}
                          className={`h-8 border-r border-gray-300 ${
                            timeIndex % 2 === 0
                              ? "border-b border-gray-300"
                              : ""
                          } ${
                            isAvailable
                              ? "bg-blue-50 cursor-pointer hover:bg-blue-100"
                              : cellContent
                              ? "bg-white"
                              : "bg-white"
                          }`}
                          onClick={() => {
                            if (isAvailable) {
                              handleAvailableSlotClick(day, timeSlot);
                            }
                          }}
                        >
                          {cellContent?.type === "appointment" && (
                            <div
                              className={`h-full w-full ${
                                cellContent.data.color || "bg-blue-500"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAppointmentClick(cellContent.data);
                              }}
                            >
                              {isAppointmentStart(
                                day,
                                timeSlot,
                                cellContent.data
                              ) && (
                                <div className="flex h-full flex-col p-1 text-white">
                                  <span className="text-xs font-medium truncate">
                                    {cellContent.data.title}
                                  </span>
                                  <span className="text-xs truncate">
                                    {cellContent.data.clientName}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {cellContent?.type === "unavailability" && (
                            <div
                              className="h-full w-full bg-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {isAppointmentStart(
                                day,
                                timeSlot,
                                cellContent.data
                              ) && (
                                <div className="flex h-full flex-col p-1 text-gray-700">
                                  <span className="text-xs font-medium truncate">
                                    {cellContent.data.title}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-2 text-xs text-gray-500 text-right">
                © GOrendezvous® 2012-25. Tous droits réservés. - Conditions
                d'utilisation - Avis de confidentialité
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="fixed bottom-4 right-4 z-10">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  const currentMinute = Math.round(now.getMinutes() / 5) * 5;
                  const timeSlot = {
                    hour: currentHour,
                    minute: currentMinute,
                    label: `${currentHour
                      .toString()
                      .padStart(2, "0")}:${currentMinute
                      .toString()
                      .padStart(2, "0")}`,
                  };
                  handleAvailableSlotClick(currentDate, timeSlot);
                }}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          )}
        </main>
      </div>
      <Dialog
        open={showNewAppointmentModal}
        onOpenChange={setShowNewAppointmentModal}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Planifier un nouveau rendez-vous</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewAppointment}>
            <div className="grid gap-4 py-4">
              {selectedSlot && (
                <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm">
                  <p className="font-medium text-primary">
                    {format(selectedSlot.date, "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}{" "}
                    à {selectedSlot.hour.toString().padStart(2, "0")}h
                    {selectedSlot.minute.toString().padStart(2, "0")}
                  </p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="time">Heure</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    className="pr-10"
                    value={
                      selectedSlot
                        ? `${selectedSlot.hour
                            .toString()
                            .padStart(2, "0")}:${selectedSlot.minute
                            .toString()
                            .padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      if (!isNaN(hours) && !isNaN(minutes)) {
                        setSelectedSlot((prev) => ({
                          ...prev!,
                          hour: hours,
                          minute: minutes,
                        }));
                      }
                    }}
                  />
                  <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Type de rendez-vous</Label>
                <RadioGroup
                  value={appointmentType}
                  onValueChange={(value: "self" | "dependent") =>
                    setAppointmentType(value)
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self" className="cursor-pointer">
                      Pour le client
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dependent" id="dependent" />
                    <Label htmlFor="dependent" className="cursor-pointer">
                      Pour un dépendant
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Tabs
                value={newAppointmentTab}
                onValueChange={(value: "existing" | "new") =>
                  setNewAppointmentTab(value)
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Client existant</TabsTrigger>
                  <TabsTrigger value="new">Nouveau client</TabsTrigger>
                </TabsList>
                <TabsContent value="existing">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="client-search">
                        Rechercher un client
                      </Label>
                      <div className="relative">
                        <Input
                          id="client-search"
                          placeholder="Rechercher par nom, email ou téléphone"
                          value={searchClient}
                          onChange={(e) => setSearchClient(e.target.value)}
                          onFocus={() => setOpenClientSearch(true)}
                        />
                        {openClientSearch && filteredClients.length > 0 && (
                          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
                            {filteredClients.map((client) => (
                              <div
                                key={client.id}
                                className={`flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 ${
                                  selectedClient === client.id
                                    ? "bg-primary/10"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedClient(client.id);
                                  setSearchClient(
                                    `${client.firstName} ${client.lastName}`
                                  );
                                  setOpenClientSearch(false);
                                }}
                              >
                                <Avatar className="mr-2 h-8 w-8">
                                  <AvatarImage
                                    src={client.avatar}
                                    alt={`${client.firstName} ${client.lastName}`}
                                  />
                                  <AvatarFallback>
                                    {client.firstName.charAt(0)}
                                    {client.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {client.firstName} {client.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {client.email}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="new">
                  {/* New client form fields */}
                  {/* ... (form fields remain the same) */}
                </TabsContent>
              </Tabs>

              {appointmentType === "dependent" && (
                <div className="mt-4 rounded-md border p-4">
                  <h3 className="mb-4 text-sm font-medium">
                    Informations du dépendant
                  </h3>
                  {/* Dependent form fields */}
                  {/* ... (form fields remain the same) */}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes supplémentaires ici"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseNewAppointmentModal}
              >
                Annuler
              </Button>
              <Button type="submit">Planifier le rendez-vous</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showAvailabilityModal}
        onOpenChange={setShowAvailabilityModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Définir vos disponibilités</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const dayNames = [
                "",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
              ];
              const settings = availabilitySettings[day];
              return (
                <div key={day} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{dayNames[day]}</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={settings.enabled}
                        onCheckedChange={(checked) =>
                          setAvailabilitySettings({
                            ...availabilitySettings,
                            [day]: { ...settings, enabled: !!checked },
                          })
                        }
                      />
                      <Label htmlFor={`day-${day}`}>Disponible</Label>
                    </div>
                  </div>

                  {settings.enabled && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`morning-start-${day}`}>
                            Début matinée
                          </Label>
                          <Select
                            value={settings.morningStart}
                            onValueChange={(value) =>
                              setAvailabilitySettings({
                                ...availabilitySettings,
                                [day]: { ...settings, morningStart: value },
                              })
                            }
                          >
                            <SelectTrigger id={`morning-start-${day}`}>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => {
                                const hour = Math.floor(i / 2) + 6;
                                const minute = i % 2 === 0 ? "00" : "30";
                                return `${hour
                                  .toString()
                                  .padStart(2, "0")}:${minute}`;
                              }).map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`morning-end-${day}`}>
                            Fin matinée
                          </Label>
                          <Select
                            value={settings.morningEnd}
                            onValueChange={(value) =>
                              setAvailabilitySettings({
                                ...availabilitySettings,
                                [day]: { ...settings, morningEnd: value },
                              })
                            }
                          >
                            <SelectTrigger id={`morning-end-${day}`}>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => {
                                const hour = Math.floor(i / 2) + 6;
                                const minute = i % 2 === 0 ? "00" : "30";
                                return `${hour
                                  .toString()
                                  .padStart(2, "0")}:${minute}`;
                              }).map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`afternoon-start-${day}`}>
                            Début après-midi
                          </Label>
                          <Select
                            value={settings.afternoonStart}
                            onValueChange={(value) =>
                              setAvailabilitySettings({
                                ...availabilitySettings,
                                [day]: { ...settings, afternoonStart: value },
                              })
                            }
                          >
                            <SelectTrigger id={`afternoon-start-${day}`}>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => {
                                const hour = Math.floor(i / 2) + 6;
                                const minute = i % 2 === 0 ? "00" : "30";
                                return `${hour
                                  .toString()
                                  .padStart(2, "0")}:${minute}`;
                              }).map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`afternoon-end-${day}`}>
                            Fin après-midi
                          </Label>
                          <Select
                            value={settings.afternoonEnd}
                            onValueChange={(value) =>
                              setAvailabilitySettings({
                                ...availabilitySettings,
                                [day]: { ...settings, afternoonEnd: value },
                              })
                            }
                          >
                            <SelectTrigger id={`afternoon-end-${day}`}>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 25 }, (_, i) => {
                                const hour = Math.floor(i / 2) + 6;
                                const minute = i % 2 === 0 ? "00" : "30";
                                return `${hour
                                  .toString()
                                  .padStart(2, "0")}:${minute}`;
                              }).map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAvailabilityModal(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSaveAvailabilities}
              className="w-full sm:w-auto"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showUnavailabilityModal}
        onOpenChange={setShowUnavailabilityModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Définir une période d'indisponibilité</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUnavailability}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="unavailability-title">Titre</Label>
                <Input
                  id="unavailability-title"
                  placeholder="Vacances, Formation, Personnel, etc."
                  value={newUnavailability.title}
                  onChange={(e) =>
                    setNewUnavailability({
                      ...newUnavailability,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newUnavailability.startDate}
                    onChange={(e) =>
                      setNewUnavailability({
                        ...newUnavailability,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Heure de début</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newUnavailability.startTime}
                    onChange={(e) =>
                      setNewUnavailability({
                        ...newUnavailability,
                        startTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newUnavailability.endDate}
                    onChange={(e) =>
                      setNewUnavailability({
                        ...newUnavailability,
                        endDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time">Heure de fin</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newUnavailability.endTime}
                    onChange={(e) =>
                      setNewUnavailability({
                        ...newUnavailability,
                        endTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-recurring"
                  checked={newUnavailability.isRecurring}
                  onCheckedChange={(checked) =>
                    setNewUnavailability({
                      ...newUnavailability,
                      isRecurring: !!checked,
                    })
                  }
                />
                <Label htmlFor="is-recurring">
                  C'est une indisponibilité récurrente
                </Label>
              </div>

              {newUnavailability.isRecurring && (
                <div className="rounded-md border p-4">
                  <h3 className="mb-4 text-sm font-medium">
                    Modèle de récurrence
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="recurrence-frequency">Fréquence</Label>
                      <Select
                        value={newUnavailability.recurrenceFrequency}
                        onValueChange={(
                          value: "daily" | "weekly" | "monthly"
                        ) =>
                          setNewUnavailability({
                            ...newUnavailability,
                            recurrenceFrequency: value,
                          })
                        }
                      >
                        <SelectTrigger id="recurrence-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="recurrence-interval">
                        Répéter tous les
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="recurrence-interval"
                          type="number"
                          min="1"
                          max="99"
                          value={newUnavailability.recurrenceInterval}
                          onChange={(e) =>
                            setNewUnavailability({
                              ...newUnavailability,
                              recurrenceInterval:
                                Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20"
                        />
                        <span>
                          {newUnavailability.recurrenceFrequency === "daily"
                            ? "jours"
                            : newUnavailability.recurrenceFrequency === "weekly"
                            ? "semaines"
                            : "mois"}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="recurrence-end-date">
                        Date de fin (Optionnel)
                      </Label>
                      <Input
                        id="recurrence-end-date"
                        type="date"
                        value={newUnavailability.recurrenceEndDate}
                        onChange={(e) =>
                          setNewUnavailability({
                            ...newUnavailability,
                            recurrenceEndDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUnavailabilityModal(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Ajouter l'indisponibilité
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showAppointmentDetailsModal}
        onOpenChange={setShowAppointmentDetailsModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="rounded-md bg-primary/10 p-3">
                <h3 className="font-medium text-primary">
                  {selectedAppointment.title}
                </h3>
                <p className="mt-1 text-sm">
                  {format(
                    parseISO(selectedAppointment.start),
                    "EEEE d MMMM yyyy",
                    { locale: fr }
                  )}{" "}
                  de{" "}
                  {format(parseISO(selectedAppointment.start), "HH:mm", {
                    locale: fr,
                  })}{" "}
                  à{" "}
                  {format(parseISO(selectedAppointment.end), "HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedAppointment.clientAvatar}
                    alt={selectedAppointment.clientName}
                  />
                  <AvatarFallback>
                    {selectedAppointment.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedAppointment.clientName}
                  </p>
                  <p className="text-sm text-gray-500">Client</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    selectedAppointment.status === "confirmed"
                      ? "default"
                      : selectedAppointment.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {selectedAppointment.status === "confirmed"
                    ? "Confirmé"
                    : selectedAppointment.status === "pending"
                    ? "En attente"
                    : "Annulé"}
                </Badge>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-2 text-sm font-medium">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRescheduleAppointment}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Reprogrammer
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowCancelConfirmation(true)}
                  >
                    Annuler le rendez-vous
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={showCancelConfirmation}
        onOpenChange={setShowCancelConfirmation}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne
              peut pas être annulée.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirmation(false)}
            >
              Retour
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reprogrammer le rendez-vous</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReschedule}>
            <div className="grid gap-4 py-4">
              {selectedSlot && (
                <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm">
                  <p className="font-medium text-primary">
                    {format(selectedSlot.date, "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}{" "}
                    à {selectedSlot.hour.toString().padStart(2, "0")}h
                    {selectedSlot.minute.toString().padStart(2, "0")}
                  </p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="reschedule-time">Heure</Label>
                <div className="relative">
                  <Input
                    id="reschedule-time"
                    type="time"
                    className="pr-10"
                    value={
                      selectedSlot
                        ? `${selectedSlot.hour
                            .toString()
                            .padStart(2, "0")}:${selectedSlot.minute
                            .toString()
                            .padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      if (!isNaN(hours) && !isNaN(minutes)) {
                        setSelectedSlot((prev) => ({
                          ...prev!,
                          hour: hours,
                          minute: minutes,
                        }));
                      }
                    }}
                  />
                  <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reschedule-service">Service</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger id="reschedule-service">
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reschedule-notes">Notes (Optionnel)</Label>
                <Textarea
                  id="reschedule-notes"
                  placeholder="Ajoutez des notes supplémentaires ici"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRescheduleModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Reprogrammer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
