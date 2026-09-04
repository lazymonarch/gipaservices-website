"use client";

import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarIcon,
  ClipboardList,
  FileText,
  Info,
  Package,
  Truck,
  Upload,
  X,
} from "lucide-react";
import Layout from "@/components/Layout";
import HeroEyebrow from "@/components/HeroEyebrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const revealEase: [number, number, number, number] = [0.25, 0.8, 0.25, 1];
const revealViewport = { once: true, amount: 0.2 } as const;

const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: revealEase,
      delay,
    },
  }),
};

const focusFieldClassName =
  "shadow-none outline-none ring-0 ring-offset-0 focus:border-gipa-yellow focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-gipa-yellow focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

const formFieldClassName = cn(
  "mt-1.5 h-11 rounded-gipa border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 md:text-sm",
  focusFieldClassName,
);

const selectTriggerClassName = cn(
  "mt-1.5 h-11 rounded-gipa border border-slate-300 bg-white px-3 py-2 text-base text-gipa-charcoal md:text-sm",
  focusFieldClassName,
);

const selectContentClassName =
  "rounded-gipa border border-slate-200 bg-gipa-cream text-gipa-charcoal shadow-[0_10px_30px_rgba(28,28,28,0.12)]";

const selectItemClassName =
  "rounded-gipa whitespace-normal py-2.5 pl-8 pr-3 text-sm leading-snug text-gipa-charcoal focus:bg-gipa-yellow/25 focus:text-gipa-charcoal data-[state=checked]:bg-gipa-yellow/20 data-[highlighted]:bg-gipa-yellow/25 data-[highlighted]:text-gipa-charcoal";

const labelClassName = "text-sm font-medium leading-normal text-[#1C1C1C]/80";

const sectionEyebrowText = "gipa-eyebrow";

const sectionHeadingClass = "gipa-heading-h2";

const bodyClass = "text-base leading-[1.75] text-[#1C1C1C]/65 md:text-lg";

const fieldsetHeadingClass =
  "text-xs font-bold uppercase tracking-[0.18em] text-[#1C1C1C]";

type AvailabilityMode = "immediate" | "within_2_weeks" | "select_date";

const phoneCountries = [
  { code: "GB", label: "UK", dialCode: "+44" },
  { code: "IE", label: "IE", dialCode: "+353" },
  { code: "NL", label: "NL", dialCode: "+31" },
];

const validCvTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatPhoneLocal(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)} ${digits.slice(10)}`;
}

function toE164(dialCode: string, localNumber: string) {
  const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  return `${dialCode}${digits}`;
}

function isValidE164(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const processSteps = [
  {
    number: "01",
    title: "Submit Your Application",
    description: "Complete the form below with your details and experience.",
  },
  {
    number: "02",
    title: "Initial Assessment",
    description:
      "Our team will review your application and be in touch if your profile matches our current requirements.",
  },
  {
    number: "03",
    title: "Onboarding",
    description: "Successful applicants will be guided through our onboarding process.",
  },
];

const operationsNotes = [
  {
    title: "Warehouse & distribution",
    description:
      "Roles sit within the warehouse and distribution work that supports GIPA’s UK logistics operations.",
    icon: Package,
  },
  {
    title: "Aligned to transport",
    description:
      "Warehouse activity is part of the same operation as timed collections, deliveries and HGV movement.",
    icon: Truck,
  },
  {
    title: "Clear application process",
    description:
      "Submit your details once. The team reviews applications against current operational requirements.",
    icon: ClipboardList,
  },
];

const FieldHint = ({ title, description }: { title: string; description: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="-m-2 inline-flex h-11 w-11 items-center justify-center text-slate-500 transition hover:text-slate-900"
          aria-label={`${title} information`}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs rounded-gipa border border-slate-200 bg-[#F8F6F1] p-4 text-sm text-[#1C1C1C] shadow-lg">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-2 leading-relaxed text-slate-700">{description}</p>
      </PopoverContent>
    </Popover>
  );
};

const WarehouseOperativeApplication = () => {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rightToWork, setRightToWork] = useState("");
  const [availabilityMode, setAvailabilityMode] = useState<AvailabilityMode>("immediate");
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined);
  const [availabilityCalendarOpen, setAvailabilityCalendarOpen] = useState(false);
  const [availabilityMonth, setAvailabilityMonth] = useState<Date>(new Date());

  const [phoneCountry, setPhoneCountry] = useState("GB");
  const [phoneLocal, setPhoneLocal] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = useMemo(
    () => phoneCountries.find((country) => country.code === phoneCountry) ?? phoneCountries[0],
    [phoneCountry],
  );

  const e164Phone = useMemo(
    () => toE164(selectedCountry.dialCode, phoneLocal),
    [selectedCountry.dialCode, phoneLocal],
  );

  const availabilityValue = useMemo(() => {
    if (availabilityMode === "immediate") return "Immediate";
    if (availabilityMode === "within_2_weeks") return "Within 2 Weeks";
    if (!availabilityDate) return "";
    return `Available from ${format(availabilityDate, "PPP")}`;
  }, [availabilityMode, availabilityDate]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneLocal(formatPhoneLocal(e.target.value));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!validCvTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file only.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!file) {
      toast({
        title: "CV Required",
        description: "Please upload your CV.",
        variant: "destructive",
      });
      return;
    }

    if (!rightToWork) {
      toast({
        title: "Right to Work Required",
        description: "Please confirm your right to work status.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidE164(e164Phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Use a valid international number format.",
        variant: "destructive",
      });
      return;
    }

    if (availabilityMode === "select_date" && !availabilityDate) {
      toast({
        title: "Availability Date Required",
        description: "Please choose your available start date.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(form);
      const response = await fetch("/api/warehouse-operative-application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message || "Request failed");
      }

      toast({
        title: "Application Submitted",
        description: "Thank you. We will review your application and be in touch.",
      });

      form.reset();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setRightToWork("");
      setAvailabilityMode("immediate");
      setAvailabilityDate(undefined);
      setPhoneCountry("GB");
      setPhoneLocal("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[color:var(--gipa-cream)]">
        <div className="mx-auto grid min-h-0 max-w-7xl lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-center px-6 py-16 sm:px-8 sm:py-20 lg:col-span-5 lg:min-h-[36rem] lg:px-8 lg:py-20 xl:pr-10">
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: "some" }}
            >
              <HeroEyebrow text="Warehouse Operatives" className="mb-6" />
              <h1 className="gipa-hero-title text-[#1C1C1C] text-[clamp(3rem,5.2vw,4.85rem)]">
                Operations
                <br />
                on the
                <br />
                <span className="gipa-hero-accent">warehouse floor</span>
              </h1>
              <p className="mt-7 max-w-[36rem] text-base leading-[1.75] text-[#1C1C1C]/65 md:mt-8 md:text-lg">
                Apply to join the warehouse and distribution team that supports GIPA Services’
                UK logistics operations.
              </p>
            </motion.div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] md:min-h-[420px] lg:col-span-7 lg:min-h-[36rem]">
            <Image
              src="/assets/warehouse-real-1.jpeg"
              alt="Warehouse operations supporting GIPA Services logistics"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <span
              className="absolute bottom-0 left-0 h-1 w-20 bg-[#F5C518] lg:h-full lg:w-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="bg-white gipa-section-y">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mb-12 max-w-3xl lg:mb-14"
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="gipa-rule" aria-hidden="true" />
              <p className={sectionEyebrowText}>Application steps</p>
            </div>
            <h2 className={cn(sectionHeadingClass, "text-gipa-charcoal")}>
              How warehouse applications are reviewed
            </h2>
          </motion.div>

          <motion.ol
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.12,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
          >
            {processSteps.map((step) => (
              <motion.li
                key={step.number}
                className="gipa-card flex h-full flex-col border-t-[3px] border-t-gipa-yellow bg-[color:var(--gipa-cream)] p-7 shadow-[0_12px_40px_rgba(28,28,28,0.06)] lg:p-8"
                variants={{
                  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: prefersReducedMotion ? 0.01 : 0.45,
                      ease: revealEase,
                    },
                  },
                }}
              >
                <span className="font-display text-[2.75rem] font-bold leading-none tracking-[-0.04em] text-[#1C1C1C]/12">
                  {step.number}
                </span>
                <h3 className="gipa-heading-h3 mt-7 text-gipa-charcoal">{step.title}</h3>
                <p className="gipa-text-body mt-3 text-gipa-charcoal/65">{step.description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="bg-[color:var(--gipa-charcoal)] gipa-section-y">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mb-12 max-w-3xl lg:mb-14"
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="gipa-rule" aria-hidden="true" />
              <p className={sectionEyebrowText}>The role in context</p>
            </div>
            <h2 className={cn(sectionHeadingClass, "text-white")}>
              Supporting UK logistics from the warehouse
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              GIPA Services Limited provides professional HGV logistics and transport across
              the United Kingdom. Warehouse operatives work as part of the wider operation
              that moves goods through collection, storage and delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {operationsNotes.map((note) => {
              const Icon = note.icon;
              return (
                <article
                  key={note.title}
                  className="gipa-card-dark h-full border-t-[3px] border-t-gipa-yellow bg-[#242424] p-7 lg:p-8"
                >
                  <Icon className="mb-6 h-7 w-7 text-[#F5C518]" strokeWidth={1.8} aria-hidden="true" />
                  <h3 className="gipa-heading-h3 mb-3 text-white">{note.title}</h3>
                  <p className="gipa-text-body text-white/70">{note.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="warehouse-operative-application-form" className="bg-[color:var(--gipa-cream)] gipa-section-y">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:pt-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="gipa-rule" aria-hidden="true" />
              <p className={sectionEyebrowText}>Application</p>
            </div>
            <h2 className={cn(sectionHeadingClass, "text-gipa-charcoal")}>
              Warehouse Operative Application
            </h2>
            <p className={cn("mt-6 max-w-md", bodyClass)}>
              Please complete all sections accurately. All fields marked{" "}
              <span className="text-red-500">*</span> are required.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              className="gipa-card bg-white p-7 shadow-[0_12px_40px_rgba(28,28,28,0.10)] sm:p-8 lg:p-10"
            >
              <fieldset className="mb-10 border-l-[3px] border-[#F5C518] pl-5 sm:pl-6">
                <h3 className={fieldsetHeadingClass}>
                  Personal Information
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                  <div className="min-w-0">
                    <Label htmlFor="fullName" className={labelClassName}>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      placeholder="e.g. James Thompson"
                      className={formFieldClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <Label htmlFor="email" className={labelClassName}>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="james@example.com"
                      className={formFieldClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <Label htmlFor="phoneLocal" className={labelClassName}>
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1.5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-[minmax(6.75rem,8.125rem)_minmax(0,1fr)]">
                      <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                        <SelectTrigger className={cn(selectTriggerClassName, "mt-0")}>
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent
                          className={selectContentClassName}
                          position="popper"
                          align="start"
                          side="bottom"
                          sideOffset={4}
                          collisionPadding={16}
                        >
                          {phoneCountries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.code}
                              className={selectItemClassName}
                            >
                              {country.label} ({country.dialCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        id="phoneLocal"
                        type="tel"
                        value={phoneLocal}
                        onChange={handlePhoneChange}
                        required
                        autoComplete="off"
                        placeholder="7700 900000"
                        className={cn(formFieldClassName, "mt-0")}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="warehouseExperienceYears" className={labelClassName}>
                        Years of Warehouse Experience <span className="text-red-500">*</span>
                      </Label>
                      <FieldHint
                        title="Warehouse Experience"
                        description="Enter total years of professional warehouse or distribution centre experience."
                      />
                    </div>
                    <Input
                      id="warehouseExperienceYears"
                      name="warehouseExperienceYears"
                      type="number"
                      min="0"
                      required
                      autoComplete="off"
                      placeholder="e.g. 3"
                      className={formFieldClassName}
                    />
                  </div>

                  <div className="min-w-0 md:col-span-2">
                    <Label htmlFor="address" className={labelClassName}>
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder="123 High Street, London, E1 6AN"
                      className={formFieldClassName}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="mb-10 border-l-[3px] border-[#F5C518] pl-5 sm:pl-6">
                <div className="flex items-center gap-1.5">
                  <h3 className={fieldsetHeadingClass}>
                    Eligibility
                  </h3>
                  <FieldHint
                    title="Right to Work"
                    description="Applicants must have legal permission to work in the United Kingdom."
                  />
                </div>

                <div className="mt-6">
                  <Label htmlFor="rightToWork" className={labelClassName}>
                    Right to Work in the UK? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={rightToWork} onValueChange={setRightToWork}>
                    <SelectTrigger id="rightToWork" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent
                      className={selectContentClassName}
                      position="popper"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      collisionPadding={16}
                    >
                      <SelectItem value="yes" className={selectItemClassName}>
                        Yes
                      </SelectItem>
                      <SelectItem value="no" className={selectItemClassName}>
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </fieldset>

              <fieldset className="mb-10 border-l-[3px] border-[#F5C518] pl-5 sm:pl-6">
                <div className="flex items-center gap-1.5">
                  <h3 className={fieldsetHeadingClass}>
                    Availability
                  </h3>
                  <FieldHint
                    title="Availability"
                    description="Select your expected start timeline. Choose a specific date for a planned start."
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {(
                    [
                      ["immediate", "Immediately"],
                      ["within_2_weeks", "Within 2 weeks"],
                      ["select_date", "Specific date"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAvailabilityMode(value)}
                      className={cn(
                        "inline-flex min-h-11 w-full items-center gap-2 rounded-gipa border px-4 py-2.5 text-sm transition sm:w-auto",
                        availabilityMode === value
                          ? "border-[#F5C518] bg-[#F5C518]/10 text-slate-900"
                          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full border-2",
                          availabilityMode === value ? "border-[#F5C518]" : "border-slate-400",
                        )}
                      >
                        {availabilityMode === value && (
                          <span className="h-2 w-2 rounded-full bg-[#F5C518]" />
                        )}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>

                {availabilityMode === "select_date" && (
                  <div className="mt-3 w-full max-w-sm">
                    <Popover
                      open={availabilityCalendarOpen}
                      onOpenChange={(open) => {
                        setAvailabilityCalendarOpen(open);
                        if (open) {
                          setAvailabilityMonth(
                            (currentMonth) => availabilityDate ?? currentMonth,
                          );
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex min-h-11 w-full items-center justify-between rounded-gipa border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                            focusFieldClassName,
                          )}
                        >
                          <span className="truncate">
                            {availabilityDate
                              ? format(availabilityDate, "PPP")
                              : "Select start date"}
                          </span>
                          <CalendarIcon className="ml-2 h-4 w-4 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[min(288px,calc(100vw-2.5rem))] rounded-gipa border-slate-200 bg-[#F8F6F1] p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={availabilityDate}
                          onSelect={(date) => {
                            setAvailabilityDate(date);
                            if (date) setAvailabilityMonth(date);
                          }}
                          month={availabilityMonth}
                          onMonthChange={setAvailabilityMonth}
                          showOutsideDays={false}
                          fixedWeeks
                          className="w-full max-w-[288px]"
                          classNames={{
                            cell: "h-9 w-9 p-0 text-center text-sm",
                            day: "h-9 w-9 rounded-gipa p-0 text-sm font-normal text-slate-900 hover:bg-[#F5C518]/20",
                            day_today: "bg-[#F5C518]/20 text-slate-900",
                            day_selected:
                              "bg-[#F5C518] text-slate-900 hover:bg-[#F5C518]/90 hover:text-slate-900 focus:bg-[#F5C518]/90 focus:text-slate-900",
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </fieldset>

              <fieldset className="mb-10 border-l-[3px] border-[#F5C518] pl-5 sm:pl-6">
                <div className="flex items-center gap-1.5">
                  <h3 className={fieldsetHeadingClass}>
                    CV Upload
                  </h3>
                  <FieldHint
                    title="CV Upload"
                    description="Upload your latest CV in PDF, DOC, or DOCX format (max 5MB)."
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="cvFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mt-6">
                  {file ? (
                    <div className="flex flex-col gap-3 rounded-gipa border border-slate-300 bg-[#F8F6F1] p-4 sm:flex-row sm:items-center">
                      <FileText className="h-8 w-8 shrink-0 text-[#1C1C1C]" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="break-all text-sm font-semibold text-[#1C1C1C]">{file.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(file.size)} · Selected
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex min-h-11 items-center justify-center rounded-gipa border border-[#1C1C1C]/15 bg-white px-4 text-sm font-semibold text-[#1C1C1C] transition hover:border-[#F5C518]"
                        >
                          Change file
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-gipa px-3 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
                          aria-label="Remove uploaded CV"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-gipa border-2 border-dashed border-slate-300 bg-[#F8F6F1] px-4 py-8 text-center transition hover:border-[#F5C518]/70"
                    >
                      <Upload className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        Click to upload your CV
                      </p>
                      <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX — Max 5MB</p>
                    </button>
                  )}
                </div>
              </fieldset>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#1C1C1C]/70 sm:text-base">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    name="gdprConsent"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5C518] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C518]"
                  />
                  <span>
                    I consent to GIPA Services Limited storing and processing my data in accordance
                    with UK GDPR.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="gipa-btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none sm:w-auto"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="gipa-btn-icon" strokeWidth={2.5} aria-hidden="true" />
                  </>
                )}
              </button>

              <input type="hidden" name="phone" value={e164Phone} />
              <input type="hidden" name="rightToWork" value={rightToWork} />
              <input type="hidden" name="availability" value={availabilityValue} />
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WarehouseOperativeApplication;
