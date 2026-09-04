"use client";

import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarIcon,
  FileText,
  Info,
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
  "shadow-none outline-none ring-0 ring-offset-0 focus:border-[#F5C518] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-[#F5C518] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

const formFieldClassName = cn(
  "mt-1.5 h-11 rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 md:text-sm",
  focusFieldClassName,
);

const selectTriggerClassName = cn(
  "mt-1.5 h-11 rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-base text-[#1C1C1C] md:text-sm",
  focusFieldClassName,
);

const selectContentClassName =
  "rounded-[4px] border border-slate-200 bg-[#F8F6F1] text-[#1C1C1C] shadow-[0_10px_30px_rgba(28,28,28,0.12)]";

const selectItemClassName =
  "rounded-[4px] whitespace-normal py-2.5 pl-8 pr-3 text-sm leading-snug text-[#1C1C1C] focus:bg-[#F5C518]/25 focus:text-[#1C1C1C] data-[state=checked]:bg-[#F5C518]/20 data-[highlighted]:bg-[#F5C518]/25 data-[highlighted]:text-[#1C1C1C]";

const labelClassName = "text-sm font-medium text-slate-700";

type AvailabilityMode = "immediate" | "within_2_weeks" | "select_date";

const phoneCountries = [
  { code: "GB", label: "UK", dialCode: "+44" },
  { code: "IE", label: "IE", dialCode: "+353" },
  { code: "NL", label: "NL", dialCode: "+31" },
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
    number: 1,
    title: "Submit Your Application",
    description: "Complete the form below with your details and experience.",
  },
  {
    number: 2,
    title: "Initial Assessment",
    description: "Our team will review your application and contact you if you are shortlisted.",
  },
  {
    number: 3,
    title: "Onboarding",
    description: "Successful applicants will be guided through our onboarding process.",
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
      <PopoverContent className="max-w-xs rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 text-sm text-[#1C1C1C] shadow-lg">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-2 leading-relaxed text-slate-700">{description}</p>
      </PopoverContent>
    </Popover>
  );
};

const DriverApplication = () => {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [licenceType, setLicenceType] = useState("");
  const [hgvCategory, setHgvCategory] = useState("");
  const [cpcStatus, setCpcStatus] = useState("");
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

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file only.",
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

    if (!licenceType) {
      toast({
        title: "Licence Type Required",
        description: "Please select your driving licence type.",
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
      const response = await fetch("/api/driver-application", {
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
      setLicenceType("");
      setHgvCategory("");
      setCpcStatus("");
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
      {/* Hero Section */}
      <section
        className="relative flex min-h-[420px] items-center overflow-hidden sm:min-h-[480px] md:min-h-[560px] lg:min-h-[580px]"
        style={{
          backgroundImage: "url('/assets/hero-truck.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/30" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 md:px-12 md:py-0 lg:px-16">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <HeroEyebrow text="Driver Application" />
            <h1 className="max-w-[720px] font-display text-[2.55rem] font-bold leading-[0.96] tracking-[-0.03em] text-white sm:text-[3.25rem] md:text-[clamp(3.5rem,5.5vw,4.5rem)] md:leading-[0.94]">
              Drive With
              <br />
              <span className="font-display italic text-[#F5C518]">
                GIPA Services
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-200 sm:mt-6 sm:text-base lg:text-lg">
              Join our team of professional HGV drivers operating across the UK.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How to Apply / Process Steps Section */}
      <section className="bg-[#F5F3F0] py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <motion.div
            className="mb-8 text-center sm:mb-10 md:mb-12"
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F5C518] sm:text-xs">
              The Process
            </p>
            <h2 className="font-display text-[1.85rem] font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              How to Apply
            </h2>
          </motion.div>

          <div className="relative mx-auto max-w-xl md:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-[27px] hidden md:block"
            >
              <div className="mx-7 border-t-2 border-dashed border-slate-300" />
            </div>

            <motion.ol
              className="grid grid-cols-1 md:grid-cols-3"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.5,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: "some" }}
            >
              {processSteps.map((step, index) => (
                <motion.li
                  key={step.number}
                  className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:items-center md:px-5 md:pb-0 md:text-center lg:px-8"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: prefersReducedMotion ? 0 : 18,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: prefersReducedMotion ? 0.01 : 0.55,
                        ease: revealEase,
                      },
                    },
                  }}
                >
                  {index < processSteps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[27px] top-14 w-0 border-l-2 border-dashed border-slate-300 md:hidden"
                    />
                  )}
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F5C518] shadow-sm">
                    <span className="text-xl font-bold text-[#1C1C1C]">{step.number}</span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1 md:pt-4">
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 md:mx-auto md:mt-2 md:max-w-[220px]">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* Driver Application Form Section */}
      <section id="driver-application-form" className="bg-white py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-6">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="font-display text-[1.85rem] font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              Driver Application Form
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Please complete all sections accurately. All fields marked <span className="text-red-500">*</span> are required.
            </p>
          </motion.div>

          <form
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            {/* Personal Information */}
            <fieldset className="mb-5 rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 sm:mb-6 sm:p-5 md:mb-8 md:p-6">
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#1C1C1C] text-[11px] font-bold tracking-wider text-[#F5C518]">
                    01
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1C]">
                    Personal Information
                  </h3>
                </div>
                <div className="mt-3 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div className="min-w-0">
                  <Label htmlFor="fullName" className={labelClassName}>Full Name <span className="text-red-500">*</span></Label>
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
                  <Label htmlFor="email" className={labelClassName}>Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="your@email.com"
                    className={formFieldClassName}
                  />
                </div>

                <div className="min-w-0">
                  <Label htmlFor="phoneLocal" className={labelClassName}>Phone Number <span className="text-red-500">*</span></Label>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 min-[400px]:grid-cols-[minmax(6.75rem,7.5rem)_minmax(0,1fr)]">
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
                          <SelectItem key={country.code} value={country.code} className={selectItemClassName}>
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
                      placeholder="+44 ..."
                      className={cn(formFieldClassName, "mt-0")}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="experienceYears" className={labelClassName}>Years of Driving Experience <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Driving Experience"
                      description="Enter total years of professional HGV driving experience."
                    />
                  </div>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    required
                    autoComplete="off"
                    placeholder="e.g. 5"
                    className={formFieldClassName}
                  />
                </div>
              </div>
            </fieldset>

            {/* Driving Qualifications */}
            <fieldset className="mb-5 rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 sm:mb-6 sm:p-5 md:mb-8 md:p-6">
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#1C1C1C] text-[11px] font-bold tracking-wider text-[#F5C518]">
                    02
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1C]">
                    Driving Qualifications
                  </h3>
                </div>
                <div className="mt-3 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="licenceType" className={labelClassName}>Driving Licence Type <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Driving Licence Type"
                      description="Select your current DVLA licence category from your valid UK licence."
                    />
                  </div>
                  <Select value={licenceType} onValueChange={setLicenceType}>
                    <SelectTrigger id="licenceType" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent
                        className={selectContentClassName}
                        position="popper"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        collisionPadding={16}
                      >
                      <SelectItem value="Category B" className={selectItemClassName}>Category B</SelectItem>
                      <SelectItem value="Category C1" className={selectItemClassName}>Category C1</SelectItem>
                      <SelectItem value="Category C1+E" className={selectItemClassName}>Category C1+E</SelectItem>
                      <SelectItem value="Category C" className={selectItemClassName}>Category C</SelectItem>
                      <SelectItem value="Category C+E" className={selectItemClassName}>Category C+E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="hgvCategory" className={labelClassName}>HGV Licence Category</Label>
                    <FieldHint
                      title="HGV Licence Category"
                      description="Choose the HGV class you are qualified to operate."
                    />
                  </div>
                  <Select value={hgvCategory} onValueChange={setHgvCategory}>
                    <SelectTrigger id="hgvCategory" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent
                        className={selectContentClassName}
                        position="popper"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        collisionPadding={16}
                      >
                      <SelectItem value="Class 2 (Category C)" className={selectItemClassName}>Class 2 (Category C)</SelectItem>
                      <SelectItem value="Class 1 (Category C+E)" className={selectItemClassName}>Class 1 (Category C+E)</SelectItem>
                      <SelectItem value="Both Class 1 & 2" className={selectItemClassName}>Both Class 1 & 2</SelectItem>
                      <SelectItem value="Currently Training" className={selectItemClassName}>Currently Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="cpcStatus" className={labelClassName}>Driver CPC Status</Label>
                    <FieldHint
                      title="Driver CPC Status"
                      description="A valid CPC is required for professional HGV driving in the UK."
                    />
                  </div>
                  <Select value={cpcStatus} onValueChange={setCpcStatus}>
                    <SelectTrigger id="cpcStatus" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent
                        className={selectContentClassName}
                        position="popper"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        collisionPadding={16}
                      >
                      <SelectItem value="Valid - Expires within 1 year" className={selectItemClassName}>Valid - Expires within 1 year</SelectItem>
                      <SelectItem value="Valid - Expires within 2 years" className={selectItemClassName}>Valid - Expires within 2 years</SelectItem>
                      <SelectItem value="Valid - Expires 3+ years" className={selectItemClassName}>Valid - Expires 3+ years</SelectItem>
                      <SelectItem value="Expired - Renewal Required" className={selectItemClassName}>Expired - Renewal Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="rightToWork" className={labelClassName}>Right to Work in UK <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Right to Work"
                      description="Applicants must have legal permission to work in the United Kingdom."
                    />
                  </div>
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
                      <SelectItem value="yes" className={selectItemClassName}>Yes</SelectItem>
                      <SelectItem value="no" className={selectItemClassName}>No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-0 md:col-span-2">
                  <Label htmlFor="address" className={labelClassName}>Full Address <span className="text-red-500">*</span></Label>
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

            {/* Availability */}
            <fieldset className="mb-5 rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 sm:mb-6 sm:p-5 md:mb-8 md:p-6">
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#1C1C1C] text-[11px] font-bold tracking-wider text-[#F5C518]">
                    03
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1C]">
                    Availability
                  </h3>
                  <FieldHint
                    title="Availability"
                    description="Select your expected start timeline. Choose date for planned start."
                  />
                </div>
                <div className="mt-3 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {(
                  [
                    ["immediate", "Immediate"],
                    ["within_2_weeks", "Within 2 Weeks"],
                    ["select_date", "Select Date"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAvailabilityMode(value)}
                    className={cn(
                      "inline-flex min-h-11 w-full items-center gap-2 rounded-[4px] border px-4 py-2.5 text-sm transition sm:w-auto",
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
                      {availabilityMode === value && <span className="h-2 w-2 rounded-full bg-[#F5C518]" />}
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
                        setAvailabilityMonth((currentMonth) => availabilityDate ?? currentMonth);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex min-h-11 w-full items-center justify-between rounded-[4px] border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                          focusFieldClassName,
                        )}
                      >
                        <span className="truncate">{availabilityDate ? format(availabilityDate, "PPP") : "Select start date"}</span>
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[min(288px,calc(100vw-2.5rem))] rounded-[4px] border-slate-200 bg-[#F8F6F1] p-0" align="start">
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
                          day: "h-9 w-9 rounded-[4px] p-0 text-sm font-normal text-slate-900 hover:bg-[#F5C518]/20",
                          day_today: "bg-[#F5C518]/20 text-slate-900",
                          day_selected:
                            "bg-[#F5C518] text-slate-900 hover:bg-[#F5C518]/90 hover:text-slate-900 focus:bg-[#F5C518]/90 focus:text-slate-900",
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </fieldset>

            {/* CV Upload */}
            <fieldset className="mb-5 rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 sm:mb-6 sm:p-5 md:mb-8 md:p-6">
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#1C1C1C] text-[11px] font-bold tracking-wider text-[#F5C518]">
                    04
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1C]">
                    CV Upload
                  </h3>
                  <FieldHint
                    title="CV Upload"
                    description="Upload your latest CV in PDF, DOC, or DOCX format (max 5MB)."
                  />
                </div>
                <div className="mt-3 h-[2px] bg-[#F5C518]" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col gap-3 rounded-[4px] border border-slate-300 bg-white p-4 sm:flex-row sm:items-center">
                  <FileText className="h-8 w-8 shrink-0 text-[#1C1C1C]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-semibold text-[#1C1C1C]">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatFileSize(file.size)} · Selected</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[#1C1C1C]/15 bg-[#F8F6F1] px-4 text-sm font-semibold text-[#1C1C1C] transition hover:border-[#F5C518] hover:bg-[#F5C518]/15"
                    >
                      Change file
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-[4px] px-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Remove selected CV"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-[4px] border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:border-[#F5C518]/70 hover:bg-white"
                >
                  <Upload className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium text-slate-900">Click to upload your CV</p>
                  <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX — Max 5MB</p>
                </button>
              )}
            </fieldset>

            {/* Consent & Submit */}
            <div className="mb-5 rounded-[4px] border border-slate-200 bg-[#F8F6F1] p-4 sm:mb-6 sm:p-5 md:mb-8 md:p-6">
              <div className="mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#1C1C1C] text-[11px] font-bold tracking-wider text-[#F5C518]">
                    05
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1C1C1C]">
                    Consent
                  </h3>
                </div>
                <div className="mt-3 h-[2px] bg-[#F5C518]" />
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    name="gdprConsent"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5C518] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C518]"
                  />
                  <span>
                    I confirm that all information provided is accurate and complete.
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5C518] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C518]"
                  />
                  <span>
                    I consent to GIPA Services processing my personal data for recruitment purposes in accordance with the{" "}
                    <a href="/privacy-policy" className="text-slate-900 underline transition-colors hover:text-[#F5C518]">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="gipa-btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none"
            >
              {submitting ? "Submitting..." : (
                <>
                  Submit Application
                  <ArrowRight className="gipa-btn-icon" strokeWidth={2.5} aria-hidden="true" />
                </>
              )}
            </button>

            <input type="hidden" name="phone" value={e164Phone} />
            <input type="hidden" name="licenceType" value={licenceType} />
            <input type="hidden" name="hgvCategory" value={hgvCategory} />
            <input type="hidden" name="cpcStatus" value={cpcStatus} />
            <input type="hidden" name="rightToWork" value={rightToWork} />
            <input type="hidden" name="availability" value={availabilityValue} />
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default DriverApplication;
